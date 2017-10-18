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
  };

  static isImageInViewport(element: ElementFinder): promise.Promise<boolean> {

    return browser.executeScript(`const rect = arguments[0].getBoundingClientRect();
  const html = document.documentElement;

  return rect.top >= 0 && rect.left >= 0 &&
  rect.bottom <= (window.innerHeight || html.clientHeight) && rect.right <= (window.innerWidth || html.clientWidth);`, element);
  }
}
