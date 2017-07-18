'use strict';

import { protractor, element, by, $ } from 'protractor';
import { ProtractorExpectedConditions, ElementArrayFinder, ElementFinder } from 'protractor/built/index';

export class AbstractPage {
  public static loader: ElementFinder = element.all(by.css('div[class*="loader"]')).first();
  public static menuIcon: ElementFinder = $('span[class*="menu-icon"]');
  public static gamburgerMenuLinks: ElementArrayFinder = element.all(by.css('ul[class*="menu-list"] a'));
  public static getTimeout: number = 1000;

  public static getEC(): ProtractorExpectedConditions {
    return protractor.ExpectedConditions;
  };
}
