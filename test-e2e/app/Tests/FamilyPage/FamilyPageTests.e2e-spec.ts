import { browser, ElementFinder } from 'protractor';

import { DataProvider } from '../../Data/DataProvider';
import { CountryPage, MatrixPage, FamilyPage, AbstractPage } from '../../Pages';
import { Footer, WelcomeWizard, FamilyImage, MatrixImagePreview } from '../../Pages/Components';
import { waitForVisible } from '../../Helpers';

describe('Famyli Page test (go to Family after Matrix)', () => {
  beforeAll(async () => {
    await browser.get(MatrixPage.url);
    await WelcomeWizard.disableWizard();
    await MatrixPage.waitForSpinner();
  });

  it('Check basic elements presence on FamilyPage', async () => {
    await MatrixPage.familyLink.first().click();
    await new MatrixImagePreview().visitThisHomeBtn.click();

    for (const [name, { element }] of Object.entries(DataProvider.homePageBoolean)) {
      expect(await element().isPresent()).toBeTruthy(`${element().locator().value}`);
    }

    for (const [name, { element, actualResult }] of Object.entries(DataProvider.homePageText)) {
      expect(await element().getText()).toEqual(actualResult);
    }
  });

  afterEach(async () => {
    await Footer.checkFooterText();
    await Footer.checkFooterImages();
  });
});

describe('Family Page (direct opening): ', () => {
  for (const [name, { element, actualFamilyName, actualCountry, actualIncome }] of Object.entries(
    DataProvider.homePageLinks
  )) {
    it('Open ' + name + ' and check little street, all BIS: images, content', async () => {
      /**
       * open 'place' page and check text
       */
      await browser.get(`${AbstractPage.url}/family?place=${element}`);
      await MatrixPage.waitForSpinner();

      const familyName = await FamilyPage.familyName.getText();

      const pattern = new RegExp(`^${actualFamilyName}(\\sfamily)?$`);
      expect(await FamilyPage.familyName.getText()).toMatch(pattern);
      expect(await FamilyPage.familyCountry.getText()).toEqual(actualCountry);
      expect(await FamilyPage.familyIncome.getText()).toEqual(`$${actualIncome}`);
      expect(await FamilyPage.littleStreet.isDisplayed()).toBeTruthy();
      expect(await FamilyPage.homeOnLittleStreet.isDisplayed()).toBeTruthy();

      for (let i = 0; i < 5; i++) {
        await FamilyPage.familyImages.get(i).click();

        await MatrixPage.waitForImageSpinner();
        expect(await FamilyPage.thingNameOnImg.get(i).getText()).toEqual(await FamilyPage.thingNameInBIS.getText());
        expect(await FamilyPage.closeInBIS.isDisplayed()).toBeTruthy();
        expect(await FamilyPage.relatedSearchesInBIS.getText()).toEqual('Related searches');

        await FamilyPage.thingNameOnImg.get(i).getText();
        expect(await FamilyPage.relatedLinksInBIS.get(0).getText()).toContain(` in ${actualCountry}`);
      }

      for (const [name, { element }] of Object.entries(DataProvider.homePageBoolean)) {
        expect(await element().isPresent()).toBeTruthy();
      }

      for (const [name, { element, actualResult }] of Object.entries(DataProvider.homePageText)) {
        expect(await element().getText()).toEqual(actualResult);
      }
    });
  }
});

describe('Family Page tests', () => {
  beforeAll(async () => {
    await browser.get(MatrixPage.url);
    await WelcomeWizard.disableWizard();
  });

  beforeEach(async () => {
    await browser.get(MatrixPage.url);
    await MatrixPage.waitForSpinner();
    await MatrixPage.familyLink.first().click();
    await new MatrixImagePreview().visitThisHomeBtn.click();
  });

  it('click on miniMap leads to Country page', async () => {
    const familyName = (await FamilyPage.familyName.getText()).replace('family', '').trim();

    await FamilyPage.miniMap.click();

    const rawFamiliesOnCountryPage = await CountryPage.familyDescriptions.asElementFinders_();
    const familiesOnCountryPage = (await Promise.all(
      rawFamiliesOnCountryPage.map(async familyDescription => await familyDescription.getText())
    )).join(',');

    expect(await browser.getCurrentUrl()).toContain('country');
    expect(familiesOnCountryPage).toContain(familyName);
  });

  it('"All families in ..." btn leads to Matrix page with activated filter by country', async () => {
    const countryName = await FamilyPage.familyCountry.getText();
    await FamilyPage.allFamiliesBtn.click();

    // fixme issue with angular syncronization investigate is needed
    await browser.refresh();

    expect(await MatrixPage.filterByCountry.getText()).toEqual(countryName);
  });
});
