import { element, by, $, ElementFinder, ElementArrayFinder, $$ } from 'protractor';

export class CountryPage {
  static rootSelector: ElementFinder = $('country');

  static countryName: ElementFinder = $('h2[class*="heading"]'); // this belongs to header
  static numberOfFamilies: ElementFinder = CountryPage.rootSelector.$('.main .home .total-count');
  static numberOfPhotos: ElementFinder = CountryPage.rootSelector.$('.main .photo .total-count');
  static numberOfFamiliesEach: ElementArrayFinder = CountryPage.rootSelector.$$('.custom-button');
  static numberOfPhotosEachFamily: ElementArrayFinder = CountryPage.rootSelector.$$('.place-country>p>span');
  static miniMap: ElementFinder = CountryPage.rootSelector.$('.item-profile-header img[class*="map"]');
  static markerOnMap: ElementFinder = CountryPage.rootSelector.$('.item-profile-header img[class*="marker"]');
  static familyImages: ElementArrayFinder = CountryPage.rootSelector.$$('div[class="image"]');
  static familyImage: ElementFinder = CountryPage.rootSelector.$$('div[class="image"] img').first();
  static visitFamilyBtns: ElementArrayFinder = CountryPage.rootSelector.$$('.place .link a');
  static allFamiliesBtn: ElementFinder = CountryPage.rootSelector.$('country-info .item-profile-header a');
  static familyDescriptions: ElementArrayFinder = CountryPage.rootSelector.$$('[class="family"]');

  static async getFamilyId(i = 0): Promise<string> {
    const familyImageHref = await this.familyImages
      .get(i)
      .$('a')
      .getAttribute('href');

    return familyImageHref.replace(/.*place=/, '');
  }

  static async getFamilyName(i = 0): Promise<string> {
    const rawDescription = await this.familyDescriptions.get(i).getText();

    return rawDescription.replace(/family/g, '').trim();
  }

  static getCountryName() {
    return this.countryName.getText();
  }

  static getNumberOfFamilies() {
    return this.numberOfFamilies.getText();
  }

  static countNumberOfFamilies() {
    return this.numberOfFamiliesEach.count().then((count: number): string => {
      return count.toString();
    });
  }

  static count() {
    return this.numberOfPhotosEachFamily.count();
  }
}
