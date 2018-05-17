import { browser } from 'protractor';

import { DataProvider } from '../Data/DataProvider';
import { Footer, WelcomeWizard, HamburgerMenu } from '../Pages/Components';
import { AbstractPage, MapPage, MatrixPage } from '../Pages';

describe('Welcome wizard', () => {
  beforeEach(async () => {
    await browser.get(AbstractPage.url);
    await browser.executeScript('window.localStorage.clear()'); // clear localStorage to reveal WelcomeWizard
    await browser.refresh();
    await MatrixPage.waitForSpinner();
  });

  it('Check text on Welcome wizard', async () => {
    for (const [name, { element, actualResult }] of Object.entries(DataProvider.welcomeWizardText)) {
      expect(await element().getText()).toEqual(actualResult);
    }
  });

  it('Close Welcome wizard', async () => {
    await WelcomeWizard.closeIcon.click();

    expect(await WelcomeWizard.quckGuideContainer.isPresent()).toBeFalsy('Welcome Wizard should be closed');
    expect(await browser.executeScript('return window.localStorage.getItem("quick-guide")')).toEqual('true');
  });

  it('Open Welcome wizard', async () => {
    await WelcomeWizard.disableWizard();

    await HamburgerMenu.openQuickGuide();

    expect(await WelcomeWizard.quckGuideContainer.isDisplayed()).toBeTruthy('Welcome Wizard should be opened');
  });

  it('Open Welcome wizard from another page(not default)', async () => {
    await browser.get(MapPage.url);

    await HamburgerMenu.openQuickGuide();

    expect(await browser.getCurrentUrl()).toContain('matrix');
    expect(await WelcomeWizard.quckGuideContainer.isDisplayed()).toBeTruthy('Welcome Wizard should be opened');
  });
});
