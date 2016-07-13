'use strict';

const data = require('../Data/DataProvider.ts');
const using = require('jasmine-data-provider');
const AbstractPage = require('../Pages/AbstractPage.ts');
let mapImage = $('.map-color');
let countryLinks = element.all(by.css('.country-name'));

let MapPage = function() {
  this.setMapErrorMessage = (name) => { return name + ' on Map Page is not loaded'; };
  this.getMapImage = () => {return mapImage; };
  this.getCountryLink = (id) =>{return $('span[href*="' + id + '"]'); };
  this.getCountry = () => {return countryLinks;};
};
MapPage.prototype = Object.create(AbstractPage.prototype);
module.exports = MapPage;
