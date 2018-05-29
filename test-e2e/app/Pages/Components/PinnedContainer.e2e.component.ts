import { $, $$, ElementArrayFinder, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';
import { waitForPresence } from '../../Helpers/commonHelper';

export class PinnedContainer {
  rootSelector: ElementFinder = $('.pin-container');


  titlePinnedContainer: ElementFinder = this.rootSelector.$('.title-project');
  iconGroupSocialNetworks: ElementFinder = this.rootSelector.$('.share-buttons-container');
  buttonCopyLink: ElementFinder = this.rootSelector.$('.share-link-button');
  buttonDownload: ElementFinder = this.rootSelector.$('.download-icon');
  spinerPinnedContainer: ElementFinder = $('.la-ball-spin');
  commonSpinerPinnedContainer: ElementFinder = $('.loader-content');
  closeIcon: ElementFinder = $('.pin-mode-close');
  deselectImageIcon: ElementArrayFinder = this.rootSelector.$$('.heart-container .heart-circle');
  streetChart: ElementFinder = this.rootSelector.$('#chart');
  familiesList: ElementFinder = $('.pin-header');
  pinnedImages: ElementArrayFinder = $$('.pin-place');
  cancelBtn: ElementFinder = this.rootSelector.$('.share-close-buttons');
  shareLink: ElementFinder = this.rootSelector.$('.share-link-input');
  housesOnStreet: ElementArrayFinder = this.streetChart.$$('.point');
  shareBtn: ElementFinder = $('.pin-done-share');

  getImageIncome(index: number): promise.Promise<number> {
    return this.pinnedImages.get(index).$('.place-image-box-income').getText()
      .then(textIncome => Number(textIncome.replace(/\D/, '')));
  }

  getImageCountry(index: number): promise.Promise<string> {
    return this.pinnedImages.get(index).$('.place-image-box-country').getText();
  }

  getImageSource(index: number): promise.Promise<string> {
    return this.pinnedImages.get(index).$('img').getAttribute('src');
  }

  getShareLink(): promise.Promise<string> {
    return this.shareLink.getAttribute('value');
  }

  deselectImage(index: number): promise.Promise<void> {
    return this.deselectImageIcon.get(index).click();
  }

  getSelectedImage(index: number): ElementFinder {
    return this.pinnedImages.get(index);
  }

  getfamiliesList(): promise.Promise<string> {
    return this.familiesList.getText();
  }

  getSocialNetworkIconArray(): ElementArrayFinder {
    waitForPresence(this.iconGroupSocialNetworks, 10000);
    return this.iconGroupSocialNetworks.$$('svg');
  }

  close() {
    this.closeIcon.click();
  }


}
