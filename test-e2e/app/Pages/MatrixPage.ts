'use strict';

const data = require('../Data/DataProvider.ts');
const using = require('jasmine-data-provider');
const AbstractPage = require('../Pages/AbstractPage.ts');
let filterByThing = $('.things-filter-button-content');
let thingLinkInSearch = element.all(by.css('.thing-name'));
let searchInFilterByThing = $('input[type*="search"]');
let thingNameOnFilter = element.all(by.css('.things-filter-button-content>span')).first();
let familyLink = element.all(by.css('div[class*="image-content"]'));
let placePagelink = $('div[class*="mini-matrix-link"]');
let thingInFilter = $('.thing-name');
let bigImageFromBigSection = $('.view-image-container>img');
let homeLink = $('.col-md-4.text-right>a');

let MatrixPage = function () {
  this.getFilterByThing = () => { return filterByThing; };
  this.getThingLinkInSearch = (thingNumber) => { return thingLinkInSearch.get(thingNumber); };
  this.getSearchInFilterByThing = () => { return searchInFilterByThing; };
  this.getThingNameOnFilter = () => { return thingNameOnFilter; };
  this.getFamilyLink = () => { return familyLink; };
  this.getPlacePageLink = () => {return placePagelink; };
  this.getLastThing = () => {return familyLink.last(); };
  this.getFilter = (type) => {return element(by.id(type + '-filter'))};
  this.getThingInFilter = () => {return thingInFilter; };
  this.getBigImageFromBigSection = () => {return bigImageFromBigSection;};
  this.getHomeLink = () => {return homeLink;};
};
MatrixPage.prototype = Object.create(AbstractPage.prototype);
module.exports = MatrixPage;
