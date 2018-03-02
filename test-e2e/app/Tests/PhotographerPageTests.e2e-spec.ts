import { browser, $, ExpectedConditions as EC } from 'protractor';

import { DataProvider } from '../Data/DataProvider';
import { PhotographersPage, AbstractPage, FamilyPage } from '../Pages';
import { Footer } from '../Pages/Components';
import { PhotographerPage } from '../Pages/Photographer.page';

describe('Photographer Page test', () => {
  it('click on family image leads to FamilyPage', async () => {
    await browser.get(`${AbstractPage.url}/photographers`);
    await PhotographersPage.photographerPortrait.first().click();

    const familyName = await PhotographerPage.getFamilyName();
    await PhotographerPage.familyImage.click();

    expect(await browser.getCurrentUrl()).toContain('family');
    expect(await FamilyPage.familyName.getText()).toEqual(familyName);
  });

  it('click on visitHome btn leads to FamilyPage', async () => {
    await browser.get(`${AbstractPage.url}/photographers`);
    await PhotographersPage.photographerPortrait.first().click();

    const familyName = await PhotographerPage.getFamilyName();
    await PhotographerPage.visitHomeBtn.first().click();

    expect(await browser.getCurrentUrl()).toContain('family');
    expect(await FamilyPage.familyName.getText()).toEqual(familyName);
  });
});

describe('Photographer Page: test direct opening', () => {
  for (const [name, { photographerLink }] of Object.entries(DataProvider.photographerLinks)) {
    it(`Check basic elements presence for ${name} photographer`, async () => {
      await browser.get(photographerLink);
      for (const [index, { photographerDataCSS }] of Object.entries(DataProvider.photographerPageBoolean)) {
        expect(await $(photographerDataCSS).isPresent()).toBeTruthy();
      }
    });
  }
});
