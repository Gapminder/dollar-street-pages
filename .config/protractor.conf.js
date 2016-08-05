'use strict';

exports.config = {

   baseUrl: 'https://ds-dev-consumer.firebaseapp.com/',

  specs: [
    '../test-e2e/**/*.e2e.js'
  ],
  exclude: ['../test-e2e/**/BlogPageTests.e2e.js'],

  framework: 'jasmine',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 500000
  },
  directConnect: true,

  multiCapabilities: [
    {
      browserName: 'chrome',
      shardTestFiles: true,
      maxInstances: 1
    }
    /*{
      browserName: 'firefox',
      shardTestFiles: true,
      maxInstances: 4
    }*/
  ],

 // seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar',

  useAllAngular2AppRoots: true
  };
