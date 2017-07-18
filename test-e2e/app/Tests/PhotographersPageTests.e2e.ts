'use strict';

import { DataProvider } from '../Data/DataProvider';
import { AbstractPage } from '../Pages/AbstractPage';
import { FooterPage } from '../Pages/FooterPage';
import { browser } from 'protractor';
import { PhotographersPage } from '../Pages/PhotographersPage';
let using = require('jasmine-data-provider');

describe('Photographers Page test', () => {
  beforeAll(() => {
    browser.get('photographers');
    browser.wait(AbstractPage.getEC().visibilityOf(PhotographersPage.getLastPhotographer()), AbstractPage.getTimeout, PhotographersPage.setErrorMessage());
  });
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
  using(DataProvider.photographersPageSearch, (data:any, description:string) => {
    it('Check ' + description + ' on Photographers page', () => {
      PhotographersPage.searchButton.sendKeys(data.countryQuery);
      expect(PhotographersPage.isDisplayedPhotographerName()).toBeTruthy();
      expect(PhotographersPage.isDisplayedPhotographerPortrait()).toBeTruthy();
      expect(PhotographersPage.isDisplayedHomesIcon()).toBeTruthy();
      expect(PhotographersPage.isDisplayedCamerasIcon()).toBeTruthy();
      PhotographersPage.searchButton.clear();
    });
  });
});
