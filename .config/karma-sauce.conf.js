'use strict';
const pkg = require('../package.json');
const webpackConfig = require('./webpack-karma.config');

module.exports = function (config) {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
    process.exit(1);
  }
  // Browsers to run on Sauce Labs
  // Check out https://saucelabs.com/platforms for all browser/OS combos
  var customLaunchers = {
    'SL_CHROME': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '45',
      platform: 'OS X 10.10'
    }
    /*,
    'SL_CHROMEBETA': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'beta'
    },
    'SL_CHROMEDEV': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'dev'
    },
    'SL_FIREFOX': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '42'
    },
    'SL_FIREFOXBETA': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'beta'
    },
    'SL_FIREFOXDEV': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'dev'
    },
    'SL_SAFARI7': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7'
    },
    'SL_SAFARI8': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.10',
      version: '8'
    },
    'SL_SAFARI9': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: '9.0'
    },
    'SL_IOS7': {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '7.1'
    },
    'SL_IOS8': {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '8.4'
    },
    'SL_IOS9': {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '9.1'
    },
    'SL_IE9': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2008',
      version: '9'
    },
    'SL_IE10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2012',
      version: '10'
    },
    'SL_IE11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    },
    'SL_EDGE': {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      platform: 'Windows 10',
      version: '20.10240'
    },
    'SL_ANDROID4.1': {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '4.1'
    },
    'SL_ANDROID4.2': {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '4.2'
    },
    'SL_ANDROID4.3': {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '4.3'
    },
    'SL_ANDROID4.4': {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '4.4'
    },
    'SL_ANDROID5': {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '5.1'
    }*/
  };
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      {pattern: 'test.bundle.js', watched: false}
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test.bundle.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackServer: {noInfo: true},

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,
/*    sauceLabs: {
      testName: 'Karma and Sauce Labs demo',
      recordScreenshots: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    },*/
    sauceLabs: {
      testName: pkg.name,
      ////startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options: {
        'selenium-version': '2.48.2',
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400
      },
      build: 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER || Date.now()
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ['progress', 'saucelabs'],
    singleRun: true
  });
};
