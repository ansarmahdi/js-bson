const { scenariosPlugin } = require('./tools/scenarios-plugin');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const nodeGlobals = require('rollup-plugin-node-globals');
const nodePolyfills = require('rollup-plugin-node-polyfills');
const jsonPlugin = require('@rollup/plugin-json');

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [{ pattern: 'test/node/!(bson_node_only_tests).js', watched: false }],

    // list of files / patterns to exclude
    exclude: ['src/**/*.ts'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/node/!(bson_node_only_tests).js': ['rollup']
    },

    rollupPreprocessor: {
      plugins: [
        scenariosPlugin(),
        nodeResolve({
          preferBuiltins: false
        }),
        commonjs(),
        nodePolyfills(),
        nodeGlobals(),
        jsonPlugin()
      ],
      output: {
        format: 'iife',
        name: 'BSONtest',
        sourcemap: 'inline',
        exports: 'named'
      },
      onwarn(warning) {
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        console.warn(warning.toString());
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1,

    // Console log print outs will be prefaced with `LOG:` for grep
    client: { captureConsole: true }
  });
};
