'use strict';

import { protractor, element, by } from 'protractor/globals';
import { ProtractorExpectedConditions, ElementArrayFinder, ElementFinder } from 'protractor/built/index';

export class AbstractPage {
  public static loader:ElementArrayFinder = element.all(by.css('.loader img'));
  public static getEC():ProtractorExpectedConditions {
    return protractor.ExpectedConditions;
  }

  public static getTimeout():number {
    return 10000;
  }

  public static getLoader():ElementFinder {
    return this.loader.first();
  }
}
