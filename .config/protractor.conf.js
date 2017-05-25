'use strict';

exports.config = {

  baseUrl: 'http://localhost:4200/dollar-street/',

  specs: [
    '../test-e2e/app/Tests/**/*.e2e.js'
  ],
   exclude: ['../test-e2e/**/MatrixPageTestsForPerformance.e2e.js', '../test-e2e/app/CMS/**/*.e2e.js', '../test-e2e/**/BlogPageTests.e2e.js'],

  framework: 'jasmine',

  allScriptsTimeout: 11000,

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
      maxInstances: 1,
      count: 1
    }
    /*{
      browserName: 'firefox',
     'marionette': 'true' //TODO need to test it
      shardTestFiles: true,
      maxInstances: 1
    }*/
  ],

  useAllAngular2AppRoots: true,

onPrepare: function() {
   browser.driver.manage().window().maximize();
  }
  };
