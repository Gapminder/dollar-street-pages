import { $, $$, browser, ElementFinder } from 'protractor';

export class StreetChart {
  leftToddler: ElementFinder = $('.left-scroll');
  rightToddler: ElementFinder = $('.right-scroll');
  road: ElementFinder = $('.road');
  chart: ElementFinder = $('#chart');
  leftOpacityArea: ElementFinder = $$('.left-scroll-opacity-part-street').get(0);
  rightOpacityArea: ElementFinder = $$('.left-scroll-opacity-part-street').get(1);

  toddlerFootStep: number;

  getRoadLength() {
    return browser.executeScript(`return document.getElementById('chart').clientWidth`)
      .then(chartWidth => {
        return this.leftOpacityArea.getAttribute('width').then(leftWidth => {
          return this.rightOpacityArea.getAttribute('width').then(rightWidth => {
            return Math.round(Number(chartWidth) - Number(leftWidth) - Number(rightWidth));
          });
        });
      });
  }

  dragAndDropChartRange(element: ElementFinder = this.chart, x = 200, y = 0) {
    return browser.actions()
      .mouseMove(element)
      .mouseDown()
      .mouseMove({x: x, y: y})
      .mouseUp()
      .perform();
  }

  moveLeftToddler() {
    return this.moveToddler();
  }

  moveToddler(element: ElementFinder = this.leftToddler, x = 200, y = 0) {
    this.toddlerFootStep = x;

    return browser.actions()
      .mouseMove(element)
      .mouseDown()
      .mouseMove({x: x, y: y})
      .mouseUp()
      .perform();
  }

}
