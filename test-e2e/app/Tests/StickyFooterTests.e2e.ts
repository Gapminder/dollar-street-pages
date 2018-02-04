import { browser } from 'protractor';

import using = require('jasmine-data-provider');

import { AbstractPage } from '../Pages/AbstractPage';
import { MatrixPage } from '../Pages/MatrixPage';
import { DataProvider } from '../Data/DataProvider';

describe('Matrix Page sticky footer test', () => {
  beforeAll(() => {
    browser.get('matrix');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 40000);
  });
  it('Scroll down and check texts, icons', () => {
    browser.actions().mouseMove(MatrixPage.familyLink.get(13)).perform();
    browser.sleep(1000);
    MatrixPage.getFloatFooterText.first().getText().then(footerText => {
      expect(footerText).toEqual('Share:');
    });

    using(DataProvider.stickyFooterIcons, (data: any) => {
      expect(data.element().isDisplayed()).toBeTruthy();
    });
  });
  afterAll(() => {
    MatrixPage.getAngleUp.click().then(() => {
      expect(MatrixPage.filterByThing.isDisplayed()).toBeTruthy();
      expect(AbstractPage.getEC().invisibilityOf(MatrixPage.getFloatFooterText.last())).toBeTruthy();
    });
  });
});
