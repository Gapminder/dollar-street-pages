import { browser, $ } from 'protractor';

import { DataProvider } from '../Data/DataProvider';
import { AbstractPage, PhotographersPage, PhotographerPage } from '../Pages';
import { Footer } from '../Pages/Components';

describe('Photographers Page test', () => {
  beforeEach(async () => {
    await browser.get(`${AbstractPage.url}/photographers`);
  });

  afterAll(async () => {
    await Footer.checkFooterText();
    await Footer.checkFooterImages();
  });

  it('check search', async () => {
    for (const [name, { photographerQuery }] of Object.entries(DataProvider.photographersPageField)) {
      await PhotographersPage.searchButton.clear();
      await PhotographersPage.searchButton.sendKeys(`${photographerQuery}\n`);
      const firstPhogrName = await PhotographersPage.foundPhotographer.getText();

      expect(firstPhogrName).toContain(photographerQuery);
    }
  });

  it(`click on photographer name leads to Photographer Page`, async () => {
    const photogrName = await PhotographersPage.photographerName.first().getText();
    await PhotographersPage.photographerName.first().click();

    expect(await browser.getCurrentUrl()).toContain('photographer');
    expect(await PhotographerPage.getPhotographerName()).toEqual(photogrName);
  });

  it(`click on photographer image leads to Photographer Page`, async () => {
    const photogrName = await PhotographersPage.photographerName.first().getText();    
    await PhotographersPage.photographerPortrait.first().click();

    expect(await browser.getCurrentUrl()).toContain('photographer');
    expect(await PhotographerPage.getPhotographerName()).toEqual(photogrName);    
  });

  it(`click on photographer name from left sidepanel leads to Photographer Page`, async () => {
    const photographerInList = await PhotographersPage.photographerNamesInLeftSidepanel.first();
    const photogrName = await photographerInList.getText();
    await photographerInList.click();

    expect(await browser.getCurrentUrl()).toContain('photographer');
    expect(await PhotographerPage.getPhotographerName()).toEqual(photogrName);    
  });

  it(`check basic elements presence`, async () => {
    for (const [name, { countryQuery }] of Object.entries(DataProvider.photographersPageSearch)) {
      await PhotographersPage.searchButton.sendKeys(countryQuery);
      expect(await PhotographersPage.photographerName.isDisplayed()).toBeTruthy();
      expect(await PhotographersPage.photographerPortrait.isDisplayed()).toBeTruthy();
      expect(await PhotographersPage.homesIcon.isDisplayed()).toBeTruthy();
      expect(await PhotographersPage.camerasIcon.isDisplayed()).toBeTruthy();
      await PhotographersPage.searchButton.clear();
    }
  });
});
