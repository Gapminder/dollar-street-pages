import {
  protractor,
  element,
  by,
  $,
  ProtractorExpectedConditions,
  ElementArrayFinder,
  ElementFinder, browser
} from 'protractor';
import { promise } from 'selenium-webdriver';

export class AbstractPage {
  public static loader: ElementFinder = element.all(by.css('div[class*="loader"]')).first();
  public static menuIcon: ElementFinder = $('span[class*="menu-icon"]');
  public static gamburgerMenuLinks: ElementArrayFinder = element.all(by.css('ul[class*="menu-list"] a'));
  public static getTimeout: number = 1000;
  public static logoIcon: ElementFinder = $('[class="logo"]');


  public static getEC(): ProtractorExpectedConditions {
    return protractor.ExpectedConditions;
  }

  public static getRandom(): number {
    return Math.floor(Math.random() * 15); // random number between 0 and 15
  }
}
