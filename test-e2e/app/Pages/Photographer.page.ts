import { browser, ElementFinder, $, ElementArrayFinder, $$ } from 'protractor';

import { AbstractPage } from './Abstract.page';

export class PhotographerPage {
  static url = `${AbstractPage.url}/photographer`;

  static rootSelector: ElementFinder = $('photographer');

  static headerTitle: ElementFinder = $('.header-title'); // this is part of the header
  static familyBlocks: ElementArrayFinder = PhotographerPage.rootSelector.$$('.place');
  static familyName: ElementFinder = PhotographerPage.rootSelector.$('.family');
  static familyImage: ElementFinder = PhotographerPage.rootSelector.$('.place .image');
  static visitHomeBtn: ElementArrayFinder = PhotographerPage.rootSelector.$$('.custom-button');

  static async getFamilyImage(index = 0): Promise<ElementFinder> {
    return this.familyBlocks.get(index).$('.image');
  }

  static async getPhotographerName(): Promise<string> {
    const nameInHeader = await this.headerTitle.getText();

    return nameInHeader.replace(/photographer:\s/i, '');
  }

  static async getFamilyName(index = 0): Promise<string> {
    return (await this.familyName.getText()).replace(/family/g, '').trim();
  }
}
