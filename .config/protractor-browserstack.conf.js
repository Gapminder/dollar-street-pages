'use strict';

const path = require('path');
const cwd = process.cwd();
const bsConfig = require(cwd+'/bs-config.json');

let config = {
  baseUrl: 'http://www.gapminder.org/dollar-street/',

  specs: [path.resolve(cwd)+'/test-e2e/*.js',
          path.resolve(cwd)+'/test-e2e/app/Tests/*.e2e.js'],
  exclude: [path.resolve(cwd)+'/test-e2e/app/Tests/MatrixPageTestsForPerformance.e2e.js',
            path.resolve(cwd)+'/test-e2e/app/Tests/BlogPageTests.e2e.js'],

  framework: 'jasmine',

   allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 50000,
    print: function () {
    }
  },

  onPrepare: function () {
    var SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  },
  reporter: ['spec'],
  useAllAngular2AppRoots: true
};

if (process.env.TRAVIS) {
  config.multiCapabilities = [
    /*{
      'browserName': 'chrome',
      'version': '50',
      'browserstack.user': process.env.BROWSER_STACK_USERNAME,
      'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'browserstack.debug': 'true',
      'tunnel-identifier': process.env.TRAVIS_BUILD_NUMBER,
      'browserstack.local': 'true',
     // shardTestFiles: true,
      //maxInstances: 1,
      //count: 1
    }*/
    {
      'browserName': 'firefox',
      'version': '42.0',
      'browserstack.user': process.env.BROWSER_STACK_USERNAME,
      'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'browserstack.debug': 'true',
      'tunnel-identifier': process.env.TRAVIS_BUILD_NUMBER,
      'browserstack.local': 'true'
      //shardTestFiles: true,
      //maxInstances: 1
    },
  ];
  config.seleniumAddress = 'http://hub.browserstack.com/wd/hub';
}

exports.config = config;
