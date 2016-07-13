'use strict';
const path=require('path')
const cwd = process.cwd();
exports.config = {

   baseUrl: 'http://consumer.dollarstreet.org/',

  specs: [
    path.resolve(cwd)+'/test-e2e/**/*.e2e.ts'
  ],
  exclude: [],

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

  seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar',

  useAllAngular2AppRoots: true
  };
