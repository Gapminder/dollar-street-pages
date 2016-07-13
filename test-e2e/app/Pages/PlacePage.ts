'use strict';

const data = require('../Data/DataProvider.ts');
const using = require('jasmine-data-provider');
const AbstractPage = require('../Pages/AbstractPage.ts');
let leftArrow = $('.glyphicon.glyphicon-chevron-left.slider-arrow');
let rightArrow = $('.glyphicon.glyphicon-chevron-right.slider-arrow');
let linkBackToFilter = $('.go-to-back>span');

let PlacePage = function() {
  this.getLeftArrow = () => { return leftArrow; };
  this.getRightArrow = () => { return rightArrow; };
  this.getLinkBackToFilter = () => { return linkBackToFilter; };
};

PlacePage.prototype = Object.create(AbstractPage.prototype);
module.exports = PlacePage;
