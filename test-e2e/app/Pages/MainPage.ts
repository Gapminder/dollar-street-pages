'use strict';

const data = require('../Data/DataProvider.ts');
const using = require('jasmine-data-provider');
let mainPage = function() {
    browser.get('/main'); };

mainPage.prototype = Object.create(AbstractPage.prototype);
module.exports = mainPage;
