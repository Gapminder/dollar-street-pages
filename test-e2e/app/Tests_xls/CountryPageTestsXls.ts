'use strict';

import { XLS } from '../Tests_xls/XLS';
import { CountryPage } from '../Pages/CountryPage';
import { DataProvider } from '../Data/DataProvider';
let using = require('jasmine-data-provider');
let columnEnglish: string = 'A';
let columnRussian: string = 'E';

describe('Checking counrty names on Country Page in language: ', () => {
  using (DataProvider.countryPageId, (data:any, description:any) => {
    it('English, country: ' + description, ()=> {
      browser.get('country/' + data.countryId);
      expect(CountryPage.countryName.getText()).toEqual(description);
      expect(CountryPage.countryName.getText()).toEqual(XLS.getDataFromXLS(columnEnglish + data.numberOfCell));
    });
  });
  using (DataProvider.countryPageId, (data:any, description:any) => {
    it('Russian, country: ' + description, ()=> {
      browser.get('country/' + data.countryId);
      expect(CountryPage.countryName.getText()).toEqual(description);
      expect(CountryPage.countryName.getText()).toEqual(XLS.getDataFromXLS(columnRussian + data.numberOfCell));
    });
  });
});
