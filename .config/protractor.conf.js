'use strict';

exports.config = {
  baseUrl: 'http://localhost:4200/dollar-street/',

  specs: [
    '../test-e2e/app/Tests/*.e2e.ts'
  ],
  exclude: [
    // '../test-e2e/**/MatrixPageTestsForPerformance.e2e.js',
    // '../test-e2e/app/CMS/**/*.e2e.js',
    // '../test-e2e/**/BlogPageTests.e2e.js','../test-e2e/**/ClickEachLink.e2e.js'
    // '../test-e2e/app/Tests/ClickEachLink.e2e.ts',
    '../test-e2e/app/Tests/CountryPageTests.e2e.ts',
    '../test-e2e/app/Tests/HomePageTests.e2e.ts',
    '../test-e2e/app/Tests/MapPageTests.e2e.ts',
    '../test-e2e/app/Tests/MatrixPageTests.e2e.ts',
    '../test-e2e/app/Tests/MatrixPageTestsForPerformance.e2e.ts',
    '../test-e2e/app/Tests/PhotographerPageTests.e2e.ts',
    '../test-e2e/app/Tests/PhotographersPageTests.e2e.ts',
    '../test-e2e/app/Tests/ShareButtonsTests.e2e.ts',
    '../test-e2e/app/Tests/StickyFooterTests.e2e.ts',
    '../test-e2e/app/Tests/TeamPageTests.e2e.ts',
    '../test-e2e/app/Tests/WelcomeWizardTests.e2e.ts',
  ],

  framework: 'jasmine',

  allScriptsTimeout: 1100000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 5000000
  },
  directConnect: true,

  multiCapabilities: [
    {
      browserName: 'chrome',
      chromeOptions: {
        args: [ "--headless"]
      }

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

    browser.driver.manage().window().maximize();
  }
};
