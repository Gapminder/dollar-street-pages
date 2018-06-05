import { browser, ExpectedConditions as EC, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

import { AbstractPage } from '../Pages';

const _numbers = [];
export function getRandomNumber(): number {
  if (_numbers.length >= 10) {
    return _numbers.shift();
  }

  const randomNumber = Math.floor(Math.random() * 15); // random number between 0 and 15

  if (!_numbers.includes(randomNumber)) {
    _numbers.push(randomNumber);

    return randomNumber;
  } else {
    return getRandomNumber();
  }
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
  await browser.wait(EC.invisibilityOf(AbstractPage.loader), timeout);
}

export async function waitForInvisibility(element: ElementFinder, timeout = 40000): Promise<void> {
  await browser.wait(EC.invisibilityOf(element), timeout);
}

export async function scrollIntoView(element: ElementFinder): Promise<void> {
  await browser.executeScript(el => {
    el.scrollIntoView({ block: 'center' });
  }, element);
}

export async function waitForVisible(element: ElementFinder, timeout = 5000, message = '' ): Promise<void> {
  await browser.wait(EC.visibilityOf(element), timeout, message);
}

export async function waitForPresence(element: ElementFinder, timeout = 5000): Promise<void> {
  await browser.wait(EC.presenceOf(element), timeout);
}

export function isInViewport(element: ElementFinder): promise.Promise<boolean> {
  return browser.executeScript(elementToCheck => {
    const rect = elementToCheck.getBoundingClientRect();
    const html = document.documentElement;

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      (rect.bottom * 0.90) <= (window.innerHeight || html.clientHeight) &&
      rect.right <= (window.innerWidth || html.clientWidth)
    );
  }, element);
}

export function getRandomString(length: number): string {
  let str = '';
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    str += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return str;
}

export async function switchWindow(winToSwitch: number) {
  let win = await browser.getAllWindowHandles(); //Get All available windows
  if (win.length - 1 >= winToSwitch) {
    browser.switchTo().window(win[winToSwitch]);
  }
}
export async function waitTillWindowClosed() {
  let win = await browser.getAllWindowHandles(); //Get All available windows
  let winAfter
  let win2 ;
  let winBefore = win.length;
  for (let i = 0; i < 15; i++) {
     win2 = await browser.getAllWindowHandles();
     winAfter = win2.length;
    if (winBefore > winAfter) {
      return;
    }
    browser.sleep(500);
  }
}
export async function waitForURLContain(url: string, timeout = 40000): Promise<void> {
  await browser.wait(EC.urlContains(url), timeout);
}
