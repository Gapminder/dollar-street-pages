import { browser } from 'protractor';

import { FamilyPage, MapPage } from '../Pages';
import { waitForVisible } from '../Helpers';
import { Header } from '../Pages/Components';

describe('Map Page Tests', () => {
  beforeAll(async () => {
    await browser.get(MapPage.url);
  });

  it('Click on hover, check pop-up with family info', async () => {
    await MapPage.hoverFirstMarker();
    expect(MapPage.familyPopup.isDisplayed()).toBeTruthy();
    expect(MapPage.familyPopupStack.isDisplayed).toBeTruthy();
  });

  it('Popup link opens side menu for same country in title', async () => {
    await MapPage.hoverFirstMarker();
    const countryOnPopup = await MapPage.familyPopupCountyText.getText();

    await MapPage.openSideMenu();

    expect(await MapPage.sideFamilyTitleLink.getText()).toContain(countryOnPopup);
    await MapPage.closeSideFamiliesContainer();
  });

  it('Family from side menu has same country and income as on popup', async () => {
    await MapPage.hoverFirstMarker();

    const countryOnPopup = await MapPage.familyPopupCountyText.getText();
    const incomeOnPopup = await MapPage.familyPopupIncome.getText();

    await MapPage.openSideMenu();

    expect(await MapPage.sideFamilyCountry.first().getText()).toEqual(countryOnPopup);
    expect(await MapPage.sideFamilyIncome.last().getText()).toEqual(incomeOnPopup);
    await MapPage.closeSideFamiliesContainer();
  });

  it('Number families in popup, the same as in left menu', async () => {
    await MapPage.hoverFirstMarker();

    await waitForVisible(MapPage.familyPopupLink);
    await MapPage.openSideMenu();

    expect(MapPage.getSideFamilies().count()).toBe(4);
    await MapPage.closeSideFamiliesContainer();
  });

  it('Click on the title on left side menu leads to matrix page for selected country ', async () => {
    await MapPage.hoverFirstMarker();
    const countryOnPopup = await MapPage.familyPopupCountyText.getText();

    await MapPage.familyPopupLink.click();
    await waitForVisible(MapPage.sideFamilyTitleLink, 8000);

    await MapPage.sideFamilyTitleLink.click();
    await waitForVisible(Header.countryFilter);
    await expect(Header.countryFilter.getText()).toEqual(countryOnPopup);

  });

  it('Click on family leads to family page with same Name, Country and Income', async () => {
    await MapPage.open();
    await MapPage.hoverFirstMarker();

    await MapPage.openSideMenu();

    const firstFamilyName = await MapPage.sideFamilyName.first().getText();
    const firstFamilyIncome = await MapPage.sideFamilyIncome.first().getText();
    const firstFamilyCountry = await MapPage.sideFamilyCountry.first().getText();

    await MapPage.sideFamilyName.first().click();
    await waitForVisible(FamilyPage.familyName);

    expect(await FamilyPage.familyName.getText()).toContain(firstFamilyName);
    expect(await FamilyPage.familyIncome.getText()).toContain(firstFamilyIncome);
    expect(await FamilyPage.familyCountry.getText()).toContain(firstFamilyCountry);
  });
});


// TODO:Add checks for country list and filters
