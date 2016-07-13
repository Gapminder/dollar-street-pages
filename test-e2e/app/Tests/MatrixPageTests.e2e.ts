'use strict';

const dataProvider = require('../Data/DataProvider.ts');
const FooterPage = require('../Pages/FooterPage.ts');
const using = require('jasmine-data-provider');
const MatrixPage = require('../Pages/MatrixPage.ts');
let footer = new FooterPage();
let matrixPage;
browser.manage().window().maximize();

describe('Matrix Page test', () => {
    matrixPage = new MatrixPage();
    beforeAll(() => {
        browser.get('/matrix');
    });
    afterAll(() => {
        footer.checkFooterText();
        footer.checkFooterImages();
    });
    using (dataProvider.matrixPageText, (data, description) => {
        it ('Check ' + description + ' on Matrix Page (Home thing)', () => {
            expect(data.element().getText()).toEqual(data.actualResult);
        });
    });
    using (dataProvider.matrixPageBoolean, (data, description) => {
        it ('Check ' + description + ' on Matrix Page', () => {
            expect(data.element().isDisplayed()).toBeTruthy();
        });
    });
    using (dataProvider.matrixPageImages, (data, description) => {
        it ('Check ' + description + ' on Matrix Page', () => {
            for (let i = 0; i < 15; i++){
                expect(data.element().get(i).isDisplayed()).toBeTruthy();
            }});
    });
    using (dataProvider.matrixPageSearchBoolean, (data, description) => {
        it ('Check ' + description + ' on Matrix Page', () => {
            matrixPage.getFilterByThing().click();
            expect(data.element().isPresent()).toBeTruthy();
        });
    });
    using (dataProvider.matrixPageSearchText, (data, description) => {
        it ('Check things filter: ' + description + ' on Matrix Page', () => {
            matrixPage.getFilterByThing().click().then(() => {
                expect(data.element().getText()).toEqual(data.actualResult);
            });
        });
    });
    using (dataProvider.matrixPageText, (data, description) => {
        it ('Check ' + description + ' on Matrix Page after selection thing', () => {
            matrixPage.getFilterByThing().click();
            matrixPage.getThingLinkInSearch(4).click();
            expect(data.element().getText()).toEqual(data.actualResult);
        });
    });
    using (dataProvider.matrixPageQueries, (data, description) => {
        it ('Check ' + description + ' on Matrix Page in Search popup', () => {
            matrixPage.getFilterByThing().click();
            matrixPage.getSearchInFilterByThing().clear().then(() => {
                matrixPage.getSearchInFilterByThing().sendKeys(data.query);
                expect(matrixPage.getThingLinkInSearch(0).getText()).toEqual(data.query);
            });
            matrixPage.getFilterByThing().click();
        });
    });
    using (dataProvider.matrixPageQueries, (data, description) => {
        it ('Check ' + description + ' on Matrix Page after Search thing', () => {
            matrixPage.getFilterByThing().click();
            matrixPage.getSearchInFilterByThing().clear().then(() => {
                matrixPage.getSearchInFilterByThing().sendKeys(data.query);
            });
            matrixPage.getThingLinkInSearch(0).click();
            browser.wait(matrixPage.getEC.visibilityOf(matrixPage.getLastThing()), 20000);
            using (dataProvider.matrixPageText, (data) => {
                expect(data.element().getText()).toEqual(data.actualResult);
            });
            using (dataProvider.matrixPageBoolean, (data) => {
                expect(data.element().isDisplayed()).toBeTruthy();
            });
            using (dataProvider.matrixPageImages, (data) => {
              data.element().each((elem) => {
                  expect(elem.isDisplayed()).toBeTruthy();
              });
          });
        });
    });
    it('Check clickability filters', () => {
        matrixPage.getFilter('incomes').click();
        matrixPage.getFilter('things').click();
        matrixPage.getFilter('countries').click();
    });
});
describe('Matrix Page: test big section -like in Google', ()=> {
    beforeAll(() => {
        browser.get('/matrix');
    });
  for (let i = 0; i < 20; i++) {
     it('Click on ' + i + ' home and open big section', ()=> {
       matrixPage = new MatrixPage();
        matrixPage.getFamilyLink().get(i).click().then(()=> {
          using(dataProvider.matrixBigSection, (data) => {
          expect(data.element().isPresent()).toBeTruthy();});
          using(dataProvider.matrixBigSectionHower, (datas) => {
            expect(datas.element().isPresent()).toBeTruthy();
        });
      });
    });
  }
});
