'use strict';

const data = require('../Data/DataProvider.ts');
const using = require('jasmine-data-provider');
let loader = element.all(by.css('.loader img'));

let AbstractPage = function() {
    this.setElementErrorMessage = (name) => { return name + ' link on Sitemap is not loaded'; };
};

AbstractPage.prototype = Object.create({}, {
    getEC: { get: () => { return protractor.ExpectedConditions; }},
    getTimeout: { get: () => 10000},
    getLoader: { get: () => loader.first()}
});

module.exports = AbstractPage;
