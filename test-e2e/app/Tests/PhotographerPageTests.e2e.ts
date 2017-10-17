import { browser, $ } from 'protractor';

import using = require('jasmine-data-provider');

import { DataProvider } from '../Data/DataProvider';
import { AbstractPage } from '../Pages/AbstractPage';
import { FooterPage } from '../Pages/FooterPage';
import { PhotographersPage } from '../Pages/PhotographersPage';

describe('Photographer Page test', () => {
  beforeEach(() => {
    browser.get('photographers');
    browser.wait(AbstractPage.getEC().visibilityOf(PhotographersPage.lastPhotographer.last()), AbstractPage.getTimeout, PhotographersPage.setErrorMessage());
  });

  afterEach(() => {
    using(DataProvider.photographerPageBoolean, (data: any) => {
      expect($(data.photographerDataCSS).isPresent()).toBeTruthy();
    });
  });

  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });

  using(DataProvider.photographersPageField, (data: any, description: string) => {
    it('Check ' + description + ' on Photographer Page', () => {
      PhotographersPage.searchButton.sendKeys(data.photographerQuery + '\n');
      PhotographersPage.foundPhotographer.click();
      browser.wait(AbstractPage.getEC().visibilityOf(PhotographersPage.familiesIcon), AbstractPage.getTimeout, PhotographersPage.setFamilyErrorMessage(description));
    });
  });
});


describe('Photographer Page: test direct opening', () => {
  using(DataProvider.photographerLinks, (data: any, description: string) => {
    it('Check direct opening profile' + description + 'photographer: images, texts', () => {
      browser.get(data.photographerLink);
      using(DataProvider.photographerPageBoolean, (data: any) => {
        expect($(data.photographerDataCSS).isPresent()).toBeTruthy();
      });
    });
  });
});
