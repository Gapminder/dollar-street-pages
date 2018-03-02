import { $, $$, browser, ElementArrayFinder, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

export class Street {
  leftToddler: ElementFinder = $('.left-scroll');
  rightToddler: ElementFinder = $('.right-scroll');
  road: ElementFinder = $('.road');
  chart: ElementFinder = $('#chart');
  leftOpacityArea: ElementFinder = $('.left-scroll-opacity-part-street');
  rightOpacityArea: ElementFinder = $('.right-scroll-opacity-part-street');
  leftScrollLabel: ElementFinder = $('.left-scroll-label');
  rightScrollLabel: ElementFinder = $('.right-scroll-label');
  housesOnStreet: ElementArrayFinder = $$('#houses');

  toddlerFootStep: number;

  getRoadLength() {
    return browser.executeScript(`return document.getElementById('chart').clientWidth`).then(entireBlockWidth => {
      return this.leftOpacityArea.getAttribute('width').then(leftWidth => {
        return this.rightOpacityArea.getAttribute('width').then(rightWidth => {
          return Math.round(Number(entireBlockWidth) - Number(leftWidth) - Number(rightWidth));
        });
      });
    });
  }

  async moveLeftToddler(): Promise<number> {
    return this.moveToddler();
  }

  async moveRightToddler(): Promise<number> {
    return this.moveToddler(this.rightToddler, -200);
  }

  async moveToddler(element: ElementFinder = this.leftToddler, x = 200, y = 0): Promise<number> {
    this.toddlerFootStep = Math.abs(x);
    let label: ElementFinder;
    element === this.leftToddler ? (label = this.leftScrollLabel) : (label = this.rightScrollLabel);

    await browser
      .actions()
      .mouseMove(element)
      .perform();
    await browser
      .actions()
      .mouseDown()
      .perform();
    await browser
      .actions()
      .mouseMove({ x: x, y: y })
      .perform();

    // get toddler value after move
    const toddlerValue = await label.getText().then(value => Number(value.replace('$', '')));

    browser
      .actions()
      .mouseUp()
      .perform();

    return toddlerValue;
  }
}
