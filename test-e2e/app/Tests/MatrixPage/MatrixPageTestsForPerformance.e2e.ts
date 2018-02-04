'use strict';

import { AbstractPage } from '../../Pages/AbstractPage';
import { browser} from 'protractor';
import { MatrixPage } from '../../Pages/MatrixPage';

describe('Matrix Page test', () => {
   beforeAll(() => {
    browser.get('matrix');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 80000);
  });
    it('Checkfirst img on Matrix Page', () => {
      expect(MatrixPage.familyLink.first().isDisplayed()).toBeTruthy();
      expect(MatrixPage.familyLink.get(6).isDisplayed()).toBeTruthy();
    });
});
describe('Matrix BIS performance, last row', ()=> {
  beforeAll(() => {
    browser.get('/matrix?thing=Families&countries=World&regions=World&zoom=4&row=39&lowIncome=26&highIncome=15000&activeHouse=149');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 80000);
  });
  it('Check img in BIS and another info in BIS', ()=> {
    expect(MatrixPage.bigImageFromBigSection.isDisplayed()).toBeTruthy();
    expect(MatrixPage.familyLink.isDisplayed()).toBeTruthy();
  });
});

describe('Matrix BIS performance, center row', ()=> {
  beforeAll(() => {
    browser.get('matrix?thing=Families&countries=World&regions=World&zoom=4&row=19&lowIncome=26&highIncome=15000&activeHouse=71');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 80000);
  });
  it('Check img in BIS and another info in BIS', ()=> {
    expect(MatrixPage.bigImageFromBigSection.isDisplayed()).toBeTruthy();
    expect(MatrixPage.familyLink.isDisplayed()).toBeTruthy();
  });
});
