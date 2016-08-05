'use strict';

import { DataProvider } from '../Data/DataProvider';
import { AbstractPage } from '../Pages/AbstractPage';
import { FooterPage } from '../Pages/FooterPage';
let using = require('jasmine-data-provider');
import { browser, $ } from 'protractor/globals';
import { PhotographersPage } from '../Pages/PhotographersPage';

browser.driver.manage().window().maximize();

describe('Photographer Page test', () => {
  beforeEach(() => {
    browser.get('/photographers');
    browser.wait(AbstractPage.getEC().visibilityOf(PhotographersPage.getLastPhotographer()), AbstractPage.getTimeout(), PhotographersPage.setErrorMessage());
  });
  afterEach(() => {
    using(DataProvider.photographerPageBoolean, (data:any) => {
      expect($(data.photographerDataCSS).isDisplayed()).toBeTruthy();
    });
  });
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
  using(DataProvider.photographersPageField, (data:any, description:string) => {
    it('Check ' + description + ' on Photographer Page', () => {
      PhotographersPage.getSearchButton().sendKeys(data.photographerQuery + '\n');
      PhotographersPage.getFoundPhotographer().click();
      browser.wait(AbstractPage.getEC().visibilityOf(PhotographersPage.getFamiliesIcon()), AbstractPage.getTimeout(), PhotographersPage.setFamilyErrorMessage(description));
    });
  });
});
