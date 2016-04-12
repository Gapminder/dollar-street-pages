Error.stackTraceLimit = Infinity;

require('node_modules/phantomjs-polyfill');
require('node_modules/es6-promise');
require('node_modules/es6-shim');
require('node_modules/es7-reflect-metadata/dist/browser');
require('node_modules/zone.js/dist/zone.js');
// require('node_modules/zone.js/dist/long-stack-trace-zone.js');
//require('node_modules/zone.js/dist/jasmine-patch.js');
// require('node_modules/zone.js/dist/async-test.js');


var testing = require('angular2/testing');
var browser = require('angular2/platform/testing/browser');

testing.setBaseTestProviders(
  browser.TEST_BROWSER_PLATFORM_PROVIDERS,
  browser.TEST_BROWSER_APPLICATION_PROVIDERS);

Object.assign(global, testing);

var testContext = require.context('../test', true, /\.spec\.ts/);
testContext.keys().forEach(testContext);
