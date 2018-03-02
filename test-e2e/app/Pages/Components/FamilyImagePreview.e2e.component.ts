import { ElementFinder, $, ElementArrayFinder, $$ } from 'protractor';

import { MatrixPage } from '../../Pages';
import { isInViewport } from '../../Helpers';
import { scrollIntoView } from '../../Helpers/commonHelper';

export class FamilyImagePreview {
  pattern = /^.*(\/)/; // grab everything to last slash
  rootSelector: ElementFinder = $('family-media-view-block');

  thingName: ElementFinder = this.rootSelector.$('.header-container');
  thingDescription: ElementFinder = this.rootSelector.$$('.house-info-content p').first(); // todo add test attribute
  thingInCountryFilter: ElementFinder = this.rootSelector.$$('.thing-button-container a').first(); // todo add test attribute
  thingInRegionFilter: ElementFinder = this.rootSelector.$$('.thing-button-container a').get(1); // todo add test attribute
  thingInWorldFilter: ElementFinder = this.rootSelector.$$('.thing-button-container a').get(2); // todo add test attribute

  image: ElementFinder = this.rootSelector.$('.view-image-content > img');

  photographerName: ElementFinder = this.rootSelector.$$('.photographer-container a').first(); // TODO add test attribute
  fullSizeBtn: ElementFinder = this.rootSelector.$$('.zoom-download-container a').last(); // TODO add test attribute
  fullSizeImage: ElementFinder = this.rootSelector.$$('.fancyBox-image').last(); // TODO add test attribute
  closeBtn: ElementFinder = this.rootSelector.$('.close-block');

  isDisplayed() {
    return Promise.all([
      expect(this.thingName.isDisplayed()).toBeTruthy(),
      expect(this.thingDescription.isDisplayed()).toBeTruthy(),
      expect(this.thingInCountryFilter.isDisplayed()).toBeTruthy(),
      expect(this.thingInRegionFilter.isDisplayed()).toBeTruthy(),
      expect(this.thingInWorldFilter.isDisplayed()).toBeTruthy(),
      expect(this.image.isDisplayed()).toBeTruthy(),
      expect(this.photographerName.isDisplayed()).toBeTruthy(),
      expect(this.fullSizeBtn.isDisplayed()).toBeTruthy(),
      expect(this.closeBtn.isDisplayed()).toBeTruthy()
    ]);
  }

  async isInViewport() {
    return await isInViewport(this.image);
  }

  isPresent() {
    return this.rootSelector.isPresent();
  }

  async getImageSrc(): Promise<string> {
    return (await this.image.getAttribute('src')).match(this.pattern)[0];
  }

  async close(): Promise<void> {
    // fixme: remove after fix https://github.com/Gapminder/dollar-street-pages/issues/1284
    await scrollIntoView(this.closeBtn);
    await this.closeBtn.click();
  }

  async openFullSizePreview(): Promise<void> {
    await this.image.click();
    await MatrixPage.waitForSpinner();
  }

  async getFullSizeImageSrc(): Promise<string> {
    const backgroundImg = await this.fullSizeImage.getCssValue('background-image');

    return backgroundImg.replace('url("', '').match(this.pattern)[0];
  }

  async getThingNamePlural(): Promise<string> {
    const textFromBtn = await this.thingInCountryFilter.getText();

    return textFromBtn.replace(/\sin.*/, '').trim();
  }
}
