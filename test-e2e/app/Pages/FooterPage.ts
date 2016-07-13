'use strict';

const dataProvider = require('../Data/DataProvider.ts');
const using = require('jasmine-data-provider');

let FooterTests = function () {
  this.checkFooterText = () => {
    using(dataProvider.footerTextInfo, (data) => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  };
  this.checkFooterImages = () => {
    using(dataProvider.footerBooleanInfo, (data) => {
      expect($(data.logoCSS).isDisplayed()).toBeTruthy();
    });
  };
};
module.exports = FooterTests;
