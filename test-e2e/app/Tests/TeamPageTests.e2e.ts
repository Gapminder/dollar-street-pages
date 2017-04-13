'use strict';

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
let using = require ('jasmine-data-provider');
import { browser } from 'protractor';

describe('Team Page test', () => {
  beforeAll(() => {
    browser.get('team');
    browser.sleep(2000);
  });
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
  using(DataProvider.ambassadorsPageText, (data:any, description:string) => {
    it('Check ' + description + ' on Team Page', () => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
  using(DataProvider.ambassadorsPageBoolean, (data:any, description:string) => {
    it('Check ' + description + ' on Team Page', () => {
      expect(data.element().isDisplayed()).toBeTruthy();
    });
  });
});
