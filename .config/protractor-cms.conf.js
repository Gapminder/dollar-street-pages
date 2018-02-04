'use strict';

exports.config = {

   baseUrl: '', // todo need to add url to CMS

  specs: [
    '../test-e2e/app/CMS/**/*.e2e.js'
  ],

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
      maxInstances:2,
      count: 1
    }
   /* {
      browserName: 'firefox',
      shardTestFiles: true,
      marionette: 'true',
      maxInstances: 1
    }*/
  ],
  chromeDriver: '/home/vs/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.25',
  seleniumServerJar: '/home/vs/node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar',


  onPrepare: function() {
   browser.driver.manage().window().maximize();
  }
  };
