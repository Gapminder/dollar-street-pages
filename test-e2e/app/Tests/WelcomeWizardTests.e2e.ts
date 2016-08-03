'use strict';

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
let using = require('jasmine-data-provider');
import { browser } from 'protractor/globals';

browser.driver.manage().window().maximize();

describe('Matrix Page test', () => {
  beforeAll(() => {
    browser.get('/matrix?thing=Home&countries=World&regions=World&zoom=4&row=1&lowIncome=1&highIncome=15000');
  });
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
  using(DataProvider.welcomeWizardText, (data:any, description:string) => {
    it('Check ' + description + ' on Welcome wizard', () => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
});
