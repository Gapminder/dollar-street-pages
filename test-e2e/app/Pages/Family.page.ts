import { element, by, $, ElementFinder, ElementArrayFinder, browser, $$ } from 'protractor';

import { FamilyImage } from './Components';
import { ApiHelper } from '../Helpers/apiHelper';
import { AbstractPage } from './Abstract.page';

export class FamilyPage {
  static url = `${AbstractPage.url}/family`;

  static familyName: ElementFinder = $$('p[class="title desktop"]').get(1);
  static familyCountry: ElementFinder = $('.home-country-container .title');
  static familyIncome: ElementFinder = $$('p[class="title"]').get(1);
  static familyImages: ElementArrayFinder = $$('.family-image');
  static familyPhoto: ElementFinder = $('.home-description-container [class="image-container"] img');

  static thingNameOnImg: ElementArrayFinder = $$('.image-description>span');
  static thingNameInBIS: ElementFinder = $('.header-container>span');
  static closeInBIS: ElementFinder = $('.close-block>img');
  static relatedSearchesInBIS: ElementFinder = $('.thing-button-container>p');
  static relatedLinksInBIS: ElementArrayFinder = $$('.thing-button-container>a');

  static miniMap: ElementFinder = $('.map.map_gray');
  static allFamiliesBtn: ElementFinder = $('.go-to-matrix');
  static littleStreet: ElementFinder = $('#chart');
  static homeOnLittleStreet: ElementFinder = $('[class="hover"]');

  static getFamilyImage(index = 0): FamilyImage {
    return new FamilyImage(this.familyImages.first().locator().value, index);
  }

  static async getFamyliId(): Promise<string> {
    const url = await browser.getCurrentUrl();
    let placeId: string;

    try {
      placeId = url.match(/place=(\w+|\d+)/)[1];
    } catch (error) {
      throw new Error(`Check regexp in getFamyliId(): ${error}`);
    }

    return placeId;
  }

  static async getFamilyRegion(): Promise<string> {
    const familyId = await this.getFamyliId();
    const request = await ApiHelper.doGet(`${browser.params.apiUrl}/home-header?placeId=${familyId}`);

    return request.data.country.region;
  }
}
