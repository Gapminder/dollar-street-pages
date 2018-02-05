import { browser } from 'protractor';

import using = require('jasmine-data-provider');

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
import { AbstractPage } from '../Pages/AbstractPage';

describe('Welcome wizard', () => {
  beforeAll(() => {
    browser.get('./');
    browser.executeScript('window.localStorage.clear()'); // clear localStorage to reveal WelcomeWizard
    browser.get('./');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 40000);
  });
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });

  using(DataProvider.welcomeWizardText, (data: any, description: string) => {
    it('Check ' + description + ' on Welcome wizard', () => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
});
