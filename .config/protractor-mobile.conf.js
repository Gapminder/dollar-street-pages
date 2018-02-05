'use strict';

exports.config = {
  seleniumAddress: 'http://localhost:4723/wd/hub',

  baseUrl: 'http://www.gapminder.org/dollar-street/',

  specs: [
    '../test-e2e/**/BlogPageTests.e2e.js',
    '../test-e2e/**/CountryPageTests.e2e.js',
    '../test-e2e/**/MapPageTests.e2e.js',
    '../test-e2e/**/PhotographerPageTests.e2e.js',
    '../test-e2e/**/PhotographersPageTests.e2e.js',
    '../test-e2e/**/TeamPageTests.e2e.js',
    '../test-e2e/**/WelcomeWizardTests.e2e.js'
  ],
  exclude: ['../test-e2e/**/MatrixPageTestsForPerformance.e2e.js'],

  framework: 'jasmine',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 500000
  },
  capabilities:
   /* {
      //browserName: 'chrome',
      browserName: 'browser',
      'appium-version': '1.5.3',
      platformName: 'Android',
      platformVersion: '5.1.1',
      deviceName: 'Nexus_10_API_22_Android_5_1_Lollipop',
    },*/
{
  //browserName: 'chrome',
  browserName: 'browser',
    'appium-version': '1.5.3',
  platformName: 'Android',
  platformVersion: '6.0',
  deviceName: 'Galaxy_Nexus_API_23',
},

  useAllAngular2AppRoots: true,

  onPrepare: function () {
    var wd = require('wd'),
      protractor = require('protractor'),
      wdBridge = require('wd-bridge')(protractor, wd);
    wdBridge.initFromProtractor(exports.config);
  }
};
