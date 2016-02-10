'use strict';
const webpackConfig = require('./webpack-karma.config');

module.exports = function (config) {
  var customLaunchers = {
    'BS_CHROME': {
      base: 'BrowserStack',
      browser: 'chrome',
      os: 'OS X',
      os_version: 'Yosemite'
    },
    'BS_FIREFOX': {
      base: 'BrowserStack',
      browser: 'firefox',
      os: 'Windows',
      os_version: '10'
    },
    'BS_SAFARI7': {
      base: 'BrowserStack',
      browser: 'safari',
      os: 'OS X',
      os_version: 'Mavericks'
    },
    'BS_SAFARI8': {
      base: 'BrowserStack',
      browser: 'safari',
      os: 'OS X',
      os_version: 'Yosemite'
    },
    'BS_SAFARI9': {
      base: 'BrowserStack',
      browser: 'safari',
      os: 'OS X',
      os_version: 'El Capitan'
    },
    'BS_IOS7': {
      base: 'BrowserStack',
      device: 'iPhone 5S',
      os: 'ios',
      os_version: '7.0'
    },
    'BS_IOS8': {
      base: 'BrowserStack',
      device: 'iPhone 6',
      os: 'ios',
      os_version: '8.3'
    },
    'BS_IOS9': {
      base: 'BrowserStack',
      device: 'iPhone 6S',
      os: 'ios',
      os_version: '9.0'
    },
    'BS_IE9': {
      base: 'BrowserStack',
      browser: 'ie',
      browser_version: '9.0',
      os: 'Windows',
      os_version: '7'
    },
    'BS_IE10': {
      base: 'BrowserStack',
      browser: 'ie',
      browser_version: '10.0',
      os: 'Windows',
      os_version: '8'
    },
    'BS_IE11': {
      base: 'BrowserStack',
      browser: 'ie',
      browser_version: '11.0',
      os: 'Windows',
      os_version: '10'
    },
    'BS_EDGE': {
      base: 'BrowserStack',
      browser: 'edge',
      os: 'Windows',
      os_version: '10'
    },
    'BS_WINDOWSPHONE': {
      base: 'BrowserStack',
      device: 'Nokia Lumia 930',
      os: 'winphone',
      os_version: '8.1'
    },
    'BS_ANDROID5': {
      base: 'BrowserStack',
      device: 'Google Nexus 5',
      os: 'android',
      os_version: '5.0'
    },
    'BS_ANDROID4.4': {
      base: 'BrowserStack',
      device: 'HTC One M8',
      os: 'android',
      os_version: '4.4'
    },
    'BS_ANDROID4.3': {
      base: 'BrowserStack',
      device: 'Samsung Galaxy S4',
      os: 'android',
      os_version: '4.3'
    }
    // doesn't work for some reason
    /*,
    'BS_ANDROID4.2': {
      base: 'BrowserStack',
      device: 'Google Nexus 4',
      os: 'android',
      os_version: '4.2'
    },
    'BS_ANDROID4.1': {
      base: 'BrowserStack',
      device: 'Google Nexus 7',
      os: 'android',
      os_version: '4.1'
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
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    browserStack: {
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ['spec'],
    singleRun: true
  });
};
