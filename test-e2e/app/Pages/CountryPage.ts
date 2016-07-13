'use strict';

const data = require('../Data/DataProvider.ts');
const using = require('jasmine-data-provider');
const AbstractPage = require('../Pages/AbstractPage.ts');
let countryName = $('h2[class*="heading"]');
let numberOfFamilies = $('p[class="home"] span[class="pull-right"]');
let numberOfPhotos = $('p[class="photo"] span[class="pull-right"]');
let numberOfFamiliesEach = element.all(by.css('.custom-button'));
let numberOfPhotosEachFamily = element.all(by.css('.place-country>p>span'));
let bigMap = $('div[class*="header"] img[class*="map map_gray"]');
let markerOnMap = $('div[class*="header"] img[class*="marker"]');
let familyImage = element.all(by.css('div[class="image"] img')).first();
let linkVisitFamily = element.all(by.css('div[class*="link"] a[class*="custom-button"]')).first();

let CountryPage = function () {
  this.getCountryName = () => { return countryName.getText(); };
  this.getNumberOfFamilies = () => { return numberOfFamilies.getText(); };
  this.countNumberOfFamilies = () => { return numberOfFamiliesEach.count().then((count) => {return count.toString(); }); };
  this.count = () => { return numberOfPhotosEachFamily.count();};
  this.getBigMap = () => {return bigMap;};
  this.getMarkerOnMap = () => { return markerOnMap;};
  this.getFamilyImage = () => { return familyImage;};
  this.getLinkVisitFamily = () => {return linkVisitFamily;};

};

CountryPage.prototype = Object.create(AbstractPage.prototype);
module.exports = CountryPage;
