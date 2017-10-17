'use strict';

import { AbstractPage } from './AbstractPage';
import { element, by, $ } from 'protractor';
import { ElementFinder, ElementArrayFinder } from 'protractor/built/index';

export class MapPage extends AbstractPage {
  public static mapImage: ElementFinder = $('.map-color');
  public static countryLinks: ElementArrayFinder = element.all(by.css('.country-name'));
  public static markers: ElementArrayFinder = element.all(by.css('.marker'));

  public static setMapErrorMessage(name: string): string {
    return name + ' on Map Page is not loaded';
  };

  public static getCountryLink(id: number): ElementFinder {
    return $('span[href*="' + id + '"]');
  };

  public static getCountry(i: number): ElementFinder {
    return this.countryLinks.get(i);
  };
}
