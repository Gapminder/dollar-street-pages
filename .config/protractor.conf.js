'use strict';

const pkg = require('../package.json');
let config = {
  baseUrl: 'http://localhost:3000/',

  specs: [
    '../app/**/*.e2e.ts'
  ],
  exclude: [],

  framework: 'jasmine',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000,
    print: function () {
    }
  },
  //directConnect: true,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['show-fps-counter=true']
    }
  },

  onPrepare: function () {
    browser.ignoreSynchronization = true;
    var SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  },

  //seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.48.2.jar',
  reporter: ['spec'],
  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
   * `rootEl`
   *
   */
  useAllAngular2AppRoots: true
};

if (process.env.TRAVIS) {
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.multiCapabilities = [
    {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '46',
      name: pkg.name,
      build: process.env.TRAVIS_BUILD_NUMBER,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
    }
  ];
}

exports.config = config;

/*{
 base: 'SauceLabs',
 browserName: 'firefox',
 version: '42',
 name: pkg.name,
 build: process.env.TRAVIS_BUILD_NUMBER,
 'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
 }, */
