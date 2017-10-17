import { browser } from 'protractor';

import using = require('jasmine-data-provider');

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
import { MapPage } from '../Pages/MapPage';
import { CountryPage } from '../Pages/CountryPage';

describe('Country Page test', () => {
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });

  for (let i = 0; i < 3; i++) {
    it(`Check country ${i} on Country Page: name, numbers, map, markers, texts`, () => {
      browser.get('map');
      const country = MapPage.getCountry(i);
      const countryName = MapPage.getCountry(i).getText();
      country.click();

      expect(CountryPage.getCountryName()).toEqual(countryName);
      expect(CountryPage.getNumberOfFamilies()).toEqual(CountryPage.countNumberOfFamilies());
      expect(browser.isElementPresent(CountryPage.bigMap)).toBeTruthy();
      expect(browser.isElementPresent(CountryPage.markerOnMap)).toBeTruthy();
      using(DataProvider.countryPageText, (data: any) => {
        expect(data.element().isPresent()).toBeTruthy();
      });
    });
  }
});
