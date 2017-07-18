'use strict';

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
import { MapPage } from '../Pages/MapPage';
import { CountryPage } from '../Pages/CountryPage';
import { browser } from 'protractor';
let using = require('jasmine-data-provider');

describe('Country Page test', ()=> {
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
  for (let i = 0; i < 40; i++) {
    it('Check country ' + i + ' on Country Page: name, numbers, map, markers, texts', () => {
      browser.get('map');
      let country = MapPage.getCountry(i);
      let countryName = MapPage.getCountry(i).getText();
      countryName.then((name:string) => {
        console.log(name);
      });
      country.click();
      expect(CountryPage.getCountryName()).toEqual(countryName);
      expect(CountryPage.getNumberOfFamilies()).toEqual(CountryPage.countNumberOfFamilies());
      expect(browser.isElementPresent(CountryPage.bigMap)).toBeTruthy();
      expect(browser.isElementPresent(CountryPage.markerOnMap)).toBeTruthy();
      using(DataProvider.countryPageText, (data:any) => {
        expect(data.element().isPresent()).toBeTruthy();
      });
    });
  }
});
