'use strict';

exports.config = {

  baseUrl: 'http://www.gapminder.org/dollar-street/about',

  specs: [
   // '../../test-e2e/app/Tests_Api/MatrixTestsApi.js',
    //'../../test-e2e/app/Tests_Api/MapTestsApi.js',
    //'../../test-e2e/app/Tests_Api/PhotographersTestsApi.js',
    //'../../test-e2e/app/Tests_Api/PhotographerTestsApi.js',
    '../test-e2e/app/Tests_Api/CountryTestsApi.js'
  ],

  allScriptsTimeout: 1100000,
  directConnect: true,

  multiCapabilities: [
    {
      browserName: 'chrome',
      shardTestFiles: true,
      maxInstances: 1,
      count: 1
    }
    ]
  };
