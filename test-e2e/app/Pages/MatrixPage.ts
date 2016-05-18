'use strict';

const data = require('../Data/DataProvider.ts');
const using = require('jasmine-data-provider');
let glassIcon = $('.matrix-search-button>img');
let thingLink = element.all(by.css('.search-item-name'));

let MatrixPage = function () {
    this.getGlass = () => { return glassIcon; };
    this.getThing = (thingNumber) => { return thingLink.get(thingNumber); };
};
module.exports = MatrixPage;
