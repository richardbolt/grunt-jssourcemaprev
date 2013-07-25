'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.jssourcemaprev = {
  setUp: function(done) {
    // Setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(5);

    // 1: Renames source map file
    var created = grunt.file.isFile('tmp/default/testing.ace321a8.map.json');
    test.ok(created, 'Can rename the sourcemap file.');

    // 2: updates link to sourcemap file in js file.
    var match = grunt.file.read('tmp/default/testing.ace321a8.js')
                .match(/^\/\/[@|#]\ssourceMappingURL\=([\/a-zA-Z0-9_\-\.]+)$/m);
    var actual = match[1];
    var expected = 'testing.ace321a8.map.json';
    test.equal(actual, expected, 'Can update the source js file to point to the new location.');

    // 3: Updates sourceRoot in source map file.
    var map = grunt.file.readJSON('tmp/default/testing.ace321a8.map.json');
    test.equal(map.sourceRoot, 'testing.ace321a8/');
    
    // 4 & 5: Should copy the sourceRoot files and leave existing ones alone.
    created = grunt.file.isFile('tmp/default/testing.ace321a8/app.js');
    test.ok(created, 'Should copy the source files.');
    test.ok(grunt.file.isFile('tmp/default/src/app.js'), 'Should leave sourceRoot files alone.');

    test.done();
  },
  custom_options: function(test) {
    test.expect(2);

    // Should move the sourceRoot files and remove existing ones.
    var created = grunt.file.isFile('tmp/custom/testing.ace321a8/app.js');
    test.ok(created, 'Should move the source files.');
    test.ok(!grunt.file.isFile('tmp/custom/src/app.js'),
           'Should remove existing src files.');

    test.done();
  },
};
