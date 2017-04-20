'use strict';

import { AbstractPage } from './AbstractPage';
import { element, by, $ } from 'protractor';
import { ElementFinder, ElementArrayFinder } from 'protractor/built/index';
import { Instance } from '../Data/TypeInstance';

export class CountryPage {
  public static countryName:ElementFinder = $('h2[class*="heading"]');
  public static numberOfFamilies:ElementFinder = $('div[id*="item-profile' + Instance.additionToInstance + '"] .home span[class*="total-count"]');
  public static numberOfPhotos:ElementFinder = $('p[class="photo"] span[class="total-count"]');
  public static numberOfFamiliesEach:ElementArrayFinder = element.all(by.css('.custom-button'));
  public static numberOfPhotosEachFamily:ElementArrayFinder = element.all(by.css('.place-country>p>span'));
  public static bigMap:ElementFinder = $('div[class*="header"] img[class*="map map_gray"]');
  public static markerOnMap:ElementFinder = $('div[class*="header"] img[class*="marker"]');
  public static familyImage:ElementFinder = element.all(by.css('div[class="image"] img')).first();
  public static linkVisitFamily:ElementFinder = element.all(by.css('div[class*="link"] a[class*="custom-button"]')).first();

  public static getCountryName():string {
    return this.countryName.getText();
  };

  public static getNumberOfFamilies():string {
    return this.numberOfFamilies.getText();
  };

  public static countNumberOfFamilies():string {
    return this.numberOfFamiliesEach.count().then((count:number):string => {
      return count.toString();
    });
  };

  public static count():number {
    return this.numberOfPhotosEachFamily.count();
  };
}
CountryPage.prototype = Object.create(AbstractPage.prototype);
