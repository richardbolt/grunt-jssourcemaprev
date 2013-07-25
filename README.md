# grunt-jssourcemaprev

> Change a sourcemap to match the name of a revved js file, and move the source locations to a revved folder so forever caching can be used.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jssourcemaprev --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jssourcemaprev');
```

## The "jssourcemaprev" task

### Overview
Revision a sourcemap and source files so they match an already revisioned and minified js file(s). You can revision the js assets with a plugin such as [grunt-filerev](https://github.com/yeoman/grunt-filerev). This is useful if you want to be able to debug on a live system where static files are cached such as with a CDN.

In your project's Gruntfile, add a section named `jssourcemaprev` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  jssourcemaprev: {
    options: {
      moveSrc: false // If true we move the src files, else we copy them. Copy is the default.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
      // Note that dest and ext will be ignored.
      // we are specifying js file locations which will be updated in place.
    },
  },
})
```

### Options

#### options.moveSrc
Type: `Boolean`
Default value: `false`

If `true` we move the src files, else we copy them. Copy is the default (`false`).


### Usage Examples

#### Default Options
In this example, the default options are used to do take a peek inside files matching `public/js/testing.*.js`. It will:

* Search for a sourceMappingURL in the file
* Check if it can find the source map file
* Change the source map name to match the js file name (sans the extension)
* Update the js file to point to the renamed source map
* Copy the files in the `sourceRoot` attribute of the source map to a directory matching
  the name of the js file (sans the extension).
* Update the source map `sourceRoot` attribute to point to the new location.

```js
grunt.initConfig({
  jssourcemaprev: {
    options: {},
    files: {
      src: ['public/js/testing.*.js'],
    },
  },
})
```

#### Custom Options
In this example, the same happens as in the default example except the files in the `sourceRoot` attribute of the source map are moved, not copied, to the location described in default options.

```js
grunt.initConfig({
  jssourcemaprev: {
    options: {
      moveSrc: true,
    },
    files: {
      src: ['public/js/testing.*.js'],
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
