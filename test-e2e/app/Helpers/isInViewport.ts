import { ElementFinder, browser } from 'protractor';
import { promise } from 'selenium-webdriver';

export function isInViewport(element: ElementFinder): promise.Promise<boolean> {

    return browser.executeScript(`const rect = arguments[0].getBoundingClientRect();
  const html = document.documentElement;

  return rect.top >= 0 && rect.left >= 0 &&
  rect.bottom <= (window.innerHeight || html.clientHeight) &&
  rect.right <= (window.innerWidth || html.clientWidth);`, element);
  }
