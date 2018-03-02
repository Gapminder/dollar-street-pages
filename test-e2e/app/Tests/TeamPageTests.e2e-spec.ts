import { browser } from 'protractor';

import { DataProvider } from '../Data/DataProvider';
import { Footer } from '../Pages/Components';
import { AbstractPage } from '../Pages';

describe('Team Page test', () => {
  beforeAll(async () => {
    await browser.get(`${AbstractPage.url}/team`);
  });
  afterAll(async () => {
    await Footer.checkFooterText();
    await Footer.checkFooterImages();
  });

  it('Check basic text on Team Page', async () => {
    for (const [name, { element, actualResult }] of Object.entries(DataProvider.ambassadorsPageText)) {
      expect(await element().getText()).toEqual(actualResult);
    }
  });

  it('Check basic elements on Team Page', async () => {
    for (const [name, { element }] of Object.entries(DataProvider.ambassadorsPageBoolean)) {
      expect(await element().isDisplayed()).toBeTruthy();
    }
  });

  
});
