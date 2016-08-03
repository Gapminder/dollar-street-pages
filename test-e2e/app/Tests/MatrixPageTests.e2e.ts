'use strict';

import { DataProvider } from '../Data/DataProvider';
import { AbstractPage } from '../Pages/AbstractPage';
import { FooterPage } from '../Pages/FooterPage';
let using = require('jasmine-data-provider');
import { browser } from 'protractor/globals';
import { MatrixPage } from '../Pages/MatrixPage';
import { ElementFinder } from 'protractor/built/index';
browser.driver.manage().window().maximize();

describe('Matrix Page test', () => {
  beforeAll(() => {
    browser.get('/matrix');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.getLoader())), 40000);
  });
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
  using(DataProvider.matrixPageText, (data:any, description:string) => {
    it('Check ' + description + ' on Matrix Page (Home thing)', () => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
  using(DataProvider.matrixPageBoolean, (data:any, description:string) => {
    it('Check ' + description + ' on Matrix Page', () => {
      expect(data.element().isDisplayed()).toBeTruthy();
    });
  });
  using(DataProvider.matrixPageImages, (data:any, description:string) => {
    it('Check ' + description + ' on Matrix Page', () => {
      for (let i = 0; i < 15; i++) {
        expect(data.element().get(i).isDisplayed()).toBeTruthy();
      }
    });
  });
  using(DataProvider.matrixPageSearchBoolean, (data:any, description:string) => {
    it('Check ' + description + ' on Matrix Page', () => {
      MatrixPage.getFilterByThing().click();
      expect(data.element().isPresent()).toBeTruthy();
    });
  });
  using(DataProvider.matrixPageSearchText, (data:any, description:string) => {
    it('Check things filter: ' + description + ' on Matrix Page', () => {
      MatrixPage.getFilterByThing().click().then(() => {
        expect(data.element().getText()).toEqual(data.actualResult);
      });
    });
  });
  using(DataProvider.matrixPageText, (data:any, description:string) => {
    it('Check ' + description + ' on Matrix Page after selection thing', () => {
      MatrixPage.getFilterByThing().click();
      MatrixPage.getThingLinkInSearch(4).click();
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
  using(DataProvider.matrixPageQueries, (data:any, description:string) => {
    it('Check ' + description + ' on Matrix Page in Search popup', () => {
      MatrixPage.getFilterByThing().click();
      MatrixPage.getSearchInFilterByThing().clear().then(() => {
        MatrixPage.getSearchInFilterByThing().sendKeys(data.query);
        expect(MatrixPage.getThingLinkInSearch(0).getText()).toEqual(data.query);
      });
      MatrixPage.getFilterByThing().click();
    });
  });
  using(DataProvider.matrixPageQueries, (data:any, description:string) => {
    it('Check ' + description + ' on Matrix Page after Search thing', () => {
      MatrixPage.getFilterByThing().click();
      MatrixPage.getSearchInFilterByThing().clear().then(() => {
        MatrixPage.getSearchInFilterByThing().sendKeys(data.query);
      });
      MatrixPage.getThingLinkInSearch(0).click().then(():any => {
      browser.wait(AbstractPage.getEC().visibilityOf(MatrixPage.getLastThing()), 40000);
      using(DataProvider.matrixPageText, (data:any) => {
        expect(data.element()).toEqual(data.actualResult);
      });
      using(DataProvider.matrixPageBoolean, (data:any) => {
        expect(data.element().isDisplayed()).toBeTruthy();
      });
      using(DataProvider.matrixPageImages, (data:any) => {
        data.element().each((elem:ElementFinder) => {
          expect(elem.isDisplayed()).toBeTruthy();
        });
      });
    });
    });
  });
  it('Check clickability filters', () => {
    MatrixPage.getFilter('incomes').click();
    MatrixPage.getFilter('things').click();
    MatrixPage.getFilter('countries').click();
  });
});
describe('Matrix Page: test big section -like in Google', ()=> {
  beforeAll(() => {
    browser.get('/matrix');
  });
  for (let i = 0; i < 20; i++) {
    it('Click on ' + i + ' home and open big section', ()=> {
      MatrixPage.getFamilyLink().get(i).click().then(()=> {
        browser.sleep(3000);
        using(DataProvider.matrixBigSection, (data:any) => {
          expect(data.element().isDisplayed()).toBeTruthy();
        });
        using(DataProvider.matrixBigSectionHower, (data:any) => {
          expect(data.element().isDisplayed()).toBeTruthy();
        });
      });
    });
  }
});
