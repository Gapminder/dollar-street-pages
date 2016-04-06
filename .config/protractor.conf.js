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
  //
  // allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['show-fps-counter=true']
    }
  },

  onPrepare: function() {
    browser.ignoreSynchronization = true;
  },

  seleniumServerJar: "node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar",
  
  useAllAngular2AppRoots: true
};
