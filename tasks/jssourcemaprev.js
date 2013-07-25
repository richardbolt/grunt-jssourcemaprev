/*
 * grunt-jssourcemaprev
 * https://github.com/richardbolt/grunt-jssourcemaprev
 *
 * Copyright (c) 2013 Richard Bolt
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path');

module.exports = function(grunt) {
  // Does not take a dest argument, modifies src files in place.
  // A revved js file points to a source map and we want to change the
  // source map and, optionally, the source files so that all are unique.
  // We change four things:
  // 1. The sourcemap name
  // 2. The sourceMappingURL line in the src javascript file to point ot the new map
  // 3. The location of the source files - rename their directory to match the source map (revving them)
  // 4. The sourceRoot attribute in the sourcemap itself to point to the moved source files.
  grunt.registerMultiTask('jssourcemaprev', 'Rename a js sourcemap and all related source files.', function() {
      var self = this,
          options = self.options({
            moveSrc: true
          });

    self.filesSrc.forEach(function (file) {
      var js = grunt.file.read(file);
      var re = /^\/\/[@|#]\ssourceMappingURL\=([\/a-zA-Z0-9_\-\.]+)$/gm;
      var match = js.match(re);
      if (!match) {
          return;
      }

      // Find the sourceMappingUrl based on match.
      var mapUrl = match[0].split('=')[1];
      var mapFile = path.join(path.dirname(file), mapUrl);
      var newMapName = path.basename(file, path.extname(file)) + '.map.json';
      var newMapFile = path.join(path.dirname(mapFile), newMapName);
      
      // 1. Rename the source map file.
      if (mapFile !== newMapFile) {
        grunt.file.copy(mapFile, newMapFile);
        grunt.file.delete(mapFile);
        grunt.log.writeln('✔ '.green + mapFile + (' changed to ').grey + newMapFile);
      }

      // 2. Update sourceMappingUrl in the js file.
      var newMapRelativeUrl = path.join(path.relative(path.dirname(file), path.dirname(newMapFile)), path.basename(newMapFile));
      var newJs = js.replace(re, '//@ sourceMappingURL=' + newMapRelativeUrl);
      if (newJs !== js) {
        grunt.file.write(file, newJs);
        grunt.log.writeln('✔ '.green + file + (' sourceMappingURL changed to point to ').grey + newMapFile);
      }

      var sourceMap = grunt.file.readJSON(newMapFile);
      if (sourceMap.sourceRoot) {
        // 3. Move the source files location based on sourceRoot
        var srcPath = path.join(path.dirname(newMapFile), sourceMap.sourceRoot),
            newSrcPath = path.join(path.dirname(file), path.basename(file, path.extname(file))),
            moved = 0,
            srcFiles = grunt.file.expandMapping(
              '**/*.*', // src
              path.join(path.dirname(file), path.basename(file, path.extname(file))), // dest
              { cwd: srcPath }
            );
        srcFiles.forEach(function(f){
          grunt.file.copy(f.src, f.dest);
          moved += 1;
        });
        // Remove srcFiles (since we moved it already) according to options.
        if (moved) {
          grunt.log.writeln('✔ '.green + srcPath + (' moved to ').grey + newSrcPath);
          var safeToDeleteSrcPath = (
            options.moveSrc && 
            grunt.file.isDir(srcPath) && 
            !grunt.file.isPathCwd(srcPath)
          );
          if (safeToDeleteSrcPath) {
            grunt.file.delete(srcPath);
          }
        }

        // 4. Update the sourceRoot attribute in the source map file.
        sourceMap.sourceRoot = path.relative(path.dirname(newMapFile), newSrcPath) + '/';
        grunt.file.write(newMapFile, JSON.stringify(sourceMap));
        grunt.log.writeln('✔ '.green + newMapFile + (' sourceRoot changed to point to ').grey + newSrcPath);
      }
    });
  });
};
