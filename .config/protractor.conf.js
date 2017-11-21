'use strict';

exports.config = {
  baseUrl: 'http://localhost:4200/dollar-street/',

  specs: [
    '../test-e2e/app/Tests/**/*.e2e.ts'
  ],
  exclude: [
    '../test-e2e/app/Tests/**/MatrixPageTestsForPerformance.e2e.ts',
    '../test-e2e/app/CMS/**/*.e2e.ts',
    '../test-e2e/app/Tests/BlogPageTests.e2e.ts',
    '../test-e2e/app/Tests/ClickEachLink.e2e.ts'
  ],

  framework: 'jasmine',

  allScriptsTimeout: 1100000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 5000000,
    print: function () {}
  },
  directConnect: true,

  multiCapabilities: [
    {
      browserName: 'chrome',
      chromeOptions: {
        args: ['no-sandbox', 'disable-infobars', 'headless']
      },
      // shardTestFiles: true,
      // maxInstances: 2,
      // count: 2
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
    require('ts-node').register({ project: 'test-e2e' }); //according to issue: https://github.com/angular/angular-cli/issues/975

    browser.driver.manage().window().setSize(1920, 1080);
    let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  }
};
