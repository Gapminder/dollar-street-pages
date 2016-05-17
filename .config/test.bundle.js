require('node_modules/phantomjs-polyfill');
require('babel-polyfill');
require('node_modules/es6-promise');
require('node_modules/es6-shim');
require('node_modules/es7-reflect-metadata/dist/browser');
require('zone.js/dist/zone');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

// RxJS
require('rxjs/Rx');

var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

testing.setBaseTestProviders(
  browser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
  browser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
);

Object.assign(global, testing);



var testContext = require.context('../test', true, /\.spec\.ts/);
testContext.keys().forEach(testContext);
