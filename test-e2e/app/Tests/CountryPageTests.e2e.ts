'use strict';

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
let using = require('jasmine-data-provider');
import { MapPage } from '../Pages/MapPage';
import { CountryPage } from '../Pages/CountryPage';
import { browser } from 'protractor/globals';

browser.driver.manage().window().maximize();

describe('Country Page test', ()=> {
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
  for (let i = 0; i < 45; i++) {
    it('Check country ' + i + ' on Country Page: name, numbers, map, markers, texts', () => {
      browser.get('/map');
      let country = MapPage.getCountry(i);
      let countryName = MapPage.getCountry(i).getText();
      countryName.then((name:string) => {
        console.log(name);
      });
      country.click();
      expect(CountryPage.getCountryName()).toEqual(countryName);
      expect(CountryPage.getNumberOfFamilies()).toEqual(CountryPage.countNumberOfFamilies());
      expect(browser.isElementPresent(CountryPage.getBigMap())).toBeTruthy();
      expect(browser.isElementPresent(CountryPage.getMarkerOnMap())).toBeTruthy();
      using(DataProvider.countryPageText, (data:any) => {
        expect(data.element().isPresent()).toBeTruthy();
      });
    });
  }
});
