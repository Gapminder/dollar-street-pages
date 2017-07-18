'use strict';

import { DataProvider } from '../Data/DataProvider';
import { AbstractPage } from '../Pages/AbstractPage';
import { FooterPage } from '../Pages/FooterPage';
import { browser, ElementFinder } from 'protractor';
import { MatrixPage } from '../Pages/MatrixPage';
let using = require('jasmine-data-provider');

describe('Matrix Page test', () => {
  beforeAll(() => {
    browser.get('matrix');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 40000);
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
      MatrixPage.filterByThing.click();
      expect(data.element().isPresent()).toBeTruthy();
    });
  });
  using(DataProvider.matrixPageSearchText, (data:any, description:string) => {
    it('Check things filter: ' + description + ' on Matrix Page', () => {
      MatrixPage.filterByThing.click().then(() => {
        expect(data.element().getText()).toEqual(data.actualResult);
      });
    });
  });
  using(DataProvider.matrixPageText, (data:any, description:string) => {
    it('Check ' + description + ' on Matrix Page after selection thing', () => {
      MatrixPage.filterByThing.click();
      MatrixPage.getThingLinkInSearch(4).click();
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
  using(DataProvider.matrixPageQueries, (data:any, description:string) => {
    it('Check ' + description + ' on Matrix Page in Search popup', () => {
      MatrixPage.filterByThing.click();
      MatrixPage.searchInFilterByThing.clear().then(() => {
        MatrixPage.searchInFilterByThing.sendKeys(data.query);
        expect(MatrixPage.getThingLinkInSearchInAllTopics.getText()).toEqual(data.query);
      });
      MatrixPage.filterByThing.click();
    });
  });
  using(DataProvider.matrixPageQueries, (data:any, description:string) => {
    it('Check ' + description + ' on Matrix Page after Search thing', () => {
      MatrixPage.filterByThing.click();
      MatrixPage.searchInFilterByThing.clear().then(() => {
        MatrixPage.searchInFilterByThing.sendKeys(data.query);
      });
      MatrixPage.getThingLinkInSearch(0).click().then(():any => {
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
    MatrixPage.getFilter('things').click();
    MatrixPage.getFilter('countries').click();
  });
});
describe('Matrix Page: test big section -like in Google', ()=> {
  beforeAll(() => {
    browser.get('matrix');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 40000);
  });
  for (let i = 0; i < 20; i++) {
    it('Click on ' + i + ' home and open big section', ()=> {
        browser.actions().mouseMove(MatrixPage.familyLink.get(i).getWebElement()).click().perform();
        using(DataProvider.matrixBigSection, (data:any) => {
          expect(data.element().isPresent()).toBeTruthy();
        });
        using(DataProvider.matrixBigSectionHower, (data:any) => {
          expect(data.element().isPresent()).toBeTruthy();
        });
      });
  }
});
