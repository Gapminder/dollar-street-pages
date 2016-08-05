'use strict';

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
let using = require ('jasmine-data-provider');
import { browser } from 'protractor/globals';

describe('Ambassadors Page test', () => {
  beforeAll(() => {
    browser.get('/ambassadors');
  });
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
  using(DataProvider.ambassadorsPageText, (data:any, description:string) => {
    it('Check ' + description + ' on Ambassadors Page', () => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
  using(DataProvider.ambassadorsPageBoolean, (data:any, description:string) => {
    it('Check ' + description + ' on Ambassadors Page', () => {
      expect(data.element().isDisplayed()).toBeTruthy();
    });
  });
});
