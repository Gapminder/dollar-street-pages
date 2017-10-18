import { $, $$, browser, ElementArrayFinder, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

export class Street {
  leftToddler: ElementFinder = $('.left-scroll');
  rightToddler: ElementFinder = $('.right-scroll');
  road: ElementFinder = $('.road');
  chart: ElementFinder = $('#chart');
  leftOpacityArea: ElementFinder = $$('.left-scroll-opacity-part-street').get(0);
  rightOpacityArea: ElementFinder = $$('.left-scroll-opacity-part-street').get(1);
  leftScrollLabel: ElementFinder = $('.left-scroll-label');
  rightScrollLabel: ElementFinder = $('.right-scroll-label');
  housesOnStreet: ElementArrayFinder = $$('#houses');

  toddlerFootStep: number;

  getRoadLength() {
    return browser.executeScript(`return document.getElementById('chart').clientWidth`)
      .then(entireBlockWidth => {
        return this.leftOpacityArea.getAttribute('width').then(leftWidth => {
          return this.rightOpacityArea.getAttribute('width').then(rightWidth => {
            return Math.round(Number(entireBlockWidth) - Number(leftWidth) - Number(rightWidth));
          });
        });
      });
  }

  moveLeftToddler() {
    return this.moveToddler();
  }

  moveRightToddler() {
    return this.moveToddler(this.rightToddler, -200);
  }

  moveToddler(element: ElementFinder = this.leftToddler, x = 200, y = 0) {
    this.toddlerFootStep = Math.abs(x);
    let label: ElementFinder;
    element === this.leftToddler ? label = this.leftScrollLabel : label = this.rightScrollLabel;

    browser.actions()
      .mouseMove(element)
      .mouseDown()
      .mouseMove({x: x, y: y})
      .perform();

    const toddlerValue = label.getText()
      .then(value => Number(value.replace('$', ''))); // get toddler value after move

    browser.actions()
      .mouseUp()
      .perform();

    return toddlerValue;
  }

  // getToddlersValues(): { left: promise.Promise<number>; right: promise.Promise<number> } {
  //   browser.actions()
  //     .mouseMove(this.leftToddler)
  //     .mouseDown()
  //     .mouseMove({x: 0, y: 0}) // cos labels appear only on mouseMove
  //     .perform();
  //
  //   const leftToddlerValue = this.leftScrollLabel.getText()
  //     .then(value => Number(value.replace('$', '')));
  //
  //   const rightToddlerValue = this.rightScrollLabel.getText()
  //     .then(value => Number(value.replace('$', '')));
  //
  //   browser.actions()
  //     .mouseUp()
  //     .perform();
  //
  //   return {
  //     left: leftToddlerValue,
  //     right: rightToddlerValue
  //   };
  // }
}
