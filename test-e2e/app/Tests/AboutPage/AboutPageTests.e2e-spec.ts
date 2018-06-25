import { browser } from 'protractor';

import { AboutPage, MatrixPage, } from '../../Pages';
import { waitForVisible } from '../../Helpers';
import { isElementClickable, scrollIntoView } from '../../Helpers/commonHelper';
import { DataProvider } from '../../Data/DataProvider';

let using = require('jasmine-data-provider');

describe('Map Page Tests', () => {
  let link;
  beforeAll(async () => {
    await browser.get(MatrixPage.url);
    await AboutPage.open();
  });

  it('Check \'Visit Dollar Street\' leads to matrix page', async () => {
    await waitForVisible(AboutPage.visitDollarStreetLink);
    await AboutPage.visitDollarStreetLink.click();
    await waitForVisible(MatrixPage.imagesContainer);
    await expect(browser.getCurrentUrl()).toEqual(MatrixPage.url);
    await AboutPage.open();
  });

  it('Check about page title', async () => {
    await expect(AboutPage.title.getText()).toEqual('About');
  });

  it('Check about page content title', async () => {
    await expect(AboutPage.pageContentTitle.getText()).toEqual('About Dollar Street');
  });

  it('Check About Page contains TED video', async () => {
    await waitForVisible(AboutPage.tedVideo);
    await expect(await AboutPage.tedVideo.isDisplayed()).toBeTruthy();
  });

  it('Check About Page contains Youtube video', async () => {
    await scrollIntoView(AboutPage.youtubeVideo);
    await expect(await AboutPage.youtubeVideo.isDisplayed()).toBeTruthy();
  });

  using(DataProvider.aboutPageLinksURLs, (data: any, description: any) => {
    it('Check contents links', async () => {
      link = await AboutPage.pageContent.$(data.selector);
      await scrollIntoView(link);
      await expect(await isElementClickable(link)).toBeTruthy();
    });
  });
});
