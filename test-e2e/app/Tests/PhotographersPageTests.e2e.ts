'use strict';

import { DataProvider } from '../Data/DataProvider';
import { AbstractPage } from '../Pages/AbstractPage';
import { FooterPage } from '../Pages/FooterPage';
let using = require('jasmine-data-provider');
import { browser } from 'protractor/globals';
import { PhotographersPage } from '../Pages/PhotographersPage';

describe('Photographers Page test', () => {
  beforeAll(() => {
    browser.get('/photographers');
    browser.wait(AbstractPage.getEC().visibilityOf(PhotographersPage.getLastPhotographer()), AbstractPage.getTimeout(), PhotographersPage.setErrorMessage());
  });
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
  using(DataProvider.photographersPageSearch, (data:any, description:string) => {
    it('Check ' + description + ' on Photographers page', () => {
      PhotographersPage.getSearchButton().sendKeys(data.countryQuery);
      expect(PhotographersPage.isDisplayedPhotographerName()).toBeTruthy();
      expect(PhotographersPage.isDisplayedPhotographerPortrait()).toBeTruthy();
      expect(PhotographersPage.isDisplayedHomesIcon()).toBeTruthy();
      expect(PhotographersPage.isDisplayedCamerasIcon()).toBeTruthy();
      PhotographersPage.getSearchButton().clear();
    });
  });
});
