'use strict';

const data = require('../Data/DataProvider.ts');
const using = require('jasmine-data-provider');
let mapImage = $('.map-color');
let AngularSitemapPage = function() {
    this.setMapErrorMessage = (name) => { return name + ' on Map Page is not loaded'; };
    this.getMapImage = () => {return mapImage; }; };

AngularSitemapPage.prototype = Object.create({}, {
    getEC: { get: () => { return protractor.ExpectedConditions; }},
    getTimeout: { get: () => 10000},
});

module.exports = AngularSitemapPage;
