'use strict';

const dataProvider = require('../Data/DataProvider.ts');
const FooterPage = require('../Pages/FooterPage.ts');
const using = require('jasmine-data-provider');
const MatrixPage = require('../Pages/MatrixPage.ts');
let footer = new FooterPage();
let matrixPage;

browser.manage().window().maximize();

describe ('Home Page test', ()=> {
    beforeEach(() => {
      browser.get('matrix');
    });
  for (let i = 0; i < 20; i++){
    it('Check ' + i + ' family: images and content on HomePage', ()=> {
      matrixPage = new MatrixPage();
      browser.wait(matrixPage.getEC.not(matrixPage.getEC.visibilityOf(matrixPage.getLoader)), 20000);
      matrixPage.getFamilyLink().get(i).click().then(()=> {
      matrixPage.getHomeLink().click().then(()=> {
      using(dataProvider.homePageBoolean, (data)=> {
        expect(data.element().isDisplayed()).toBeTruthy();
      });
      using(dataProvider.homePageText, (data)=> {
        expect(data.element().getText()).toEqual(data.actualResult);
      });
    });
      });
    });
  }
  afterEach(() => {
    footer.checkFooterText();
    footer.checkFooterImages();
  });
});
