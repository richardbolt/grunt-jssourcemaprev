/*
 * grunt-jssourcemaprev
 * https://github.com/richardbolt/grunt-jssourcemaprev
 *
 * Copyright (c) 2013 Richard Bolt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    copy: {
      tests: {
        files: [
          {
            expand: true,
            cwd: 'test/fixtures/',
            src: ['*.json', 'src/*'],
            dest: 'tmp/default/'
          },
          {
            expand: true,
            cwd: 'test/fixtures/',
            src: ['*.js'],
            dest: 'tmp/default/',
            ext: '.ace321a8.js'
          },
          {
            expand: true,
            cwd: 'test/fixtures/',
            src: ['*.json', 'src/*'],
            dest: 'tmp/custom/'
          },
          {
            expand: true,
            cwd: 'test/fixtures/',
            src: ['*.js'],
            dest: 'tmp/custom/',
            ext: '.ace321a8.js'
          }
        ]
      }
    },

    // Configuration to be run (and then tested).
    jssourcemaprev: {
      default_options: {
        files: {
          src: ['tmp/default/testing.*.js'],
        },
      },
      custom_options: {
        options: {
          moveSrc: true
        },
        files: {
          src: ['tmp/custom/testing.*.js'],
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'jssourcemaprev', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
