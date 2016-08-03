'use strict';

import { AbstractPage } from './AbstractPage';
import { element, by, $ } from 'protractor/globals';
import { ElementFinder, ElementArrayFinder } from 'protractor/built/index';

export class MapPage {
  public static mapImage:ElementFinder = $('.map-color');
  public static countryLinks:ElementArrayFinder = element.all(by.css('.country-name'));

  public static setMapErrorMessage(name:string):string {
    return name + ' on Map Page is not loaded';
  };

  public static getMapImage():ElementFinder {
    return this.mapImage;
  };

  public static getCountryLink(id:number):ElementFinder {
    return $('span[href*="' + id + '"]');
  };

  public static getCountry(i:number):ElementFinder {
    return this.countryLinks.get(i);
  };
}

MapPage.prototype = Object.create(AbstractPage.prototype);
