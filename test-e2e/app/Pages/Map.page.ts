import { browser, element, by, $, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitForLoader } from '../Helpers/commonHelper';
import { AbstractPage } from './Abstract.page';

export class MapPage {
  static url = `${AbstractPage.url}/map`;
  
  static mapImage: ElementFinder = $('.map-color');
  static countryLinks: ElementArrayFinder = element.all(by.css('.country-name'));
  static markers: ElementArrayFinder = element.all(by.css('.marker'));

  static async open(): Promise<void> {
    await browser.get(this.url);
    await waitForLoader();
  }

  static getCountry(i: number): ElementFinder {
    return this.countryLinks.get(i);
  }
}
