import { browser, ExpectedConditions as EC, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

import { AbstractPage } from '../Pages';

export function getRandomNumber(): number {
  return Math.floor(Math.random() * 15); // random number between 0 and 15
}

export async function disableAnimations(): Promise<{}> {
  return browser.executeScript(`var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '* {' +
    '-webkit-transition: none !important;' +
    '-moz-transition: none !important' +
    '-o-transition: none !important' +
    '-ms-transition: none !important' +
    'transition: none !important' +
    '}';
  document.getElementsByTagName('head')[0].appendChild(style);`);
}

export async function waitForLoader(timeout = 40000): Promise<void> {
  await browser.wait(EC.invisibilityOf(AbstractPage.loader), 40000);
}

export async function scrollIntoView(element: ElementFinder): Promise<void> {
  await browser.executeScript(el => {
    el.scrollIntoView({ block: 'center' });
  }, element);
}

export async function waitForVisible(element: ElementFinder, timeout = 5000): Promise<void> {
  await browser.wait(EC.visibilityOf(element), timeout);
}

export function isInViewport(element: ElementFinder): promise.Promise<boolean> {
  return browser.executeScript(elementToCheck => {
    const rect = elementToCheck.getBoundingClientRect();
    const html = document.documentElement;

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || html.clientHeight) &&
      rect.right <= (window.innerWidth || html.clientWidth)
    );
  }, element);
}
