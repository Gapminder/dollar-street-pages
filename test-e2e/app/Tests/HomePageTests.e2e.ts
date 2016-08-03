'use strict';

import { DataProvider } from '../Data/DataProvider';
import { AbstractPage } from '../Pages/AbstractPage';
import { FooterPage } from '../Pages/FooterPage';
let using = require('jasmine-data-provider');
import { browser } from 'protractor/globals';
import { MatrixPage } from '../Pages/MatrixPage';

browser.driver.manage().window().maximize();

describe('Home Page test', ()=> {
  beforeEach(() => {
    browser.get('matrix');
  });
  for (let i = 0; i < 20; i++) {
    it('Check ' + i + ' family: images and content on HomePage', ()=> {
      browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.getLoader())), 40000);
      MatrixPage.getFamilyLink().get(i).click().then(()=> {
        MatrixPage.getHomeLink().click().then(()=> {
          using(DataProvider.homePageBoolean, (data:any)=> {
            expect(data.element().isDisplayed()).toBeTruthy();
          });
          using(DataProvider.homePageText, (data:any)=> {
            expect(data.element().getText()).toEqual(data.actualResult);
          });
        });
      });
    });
  }
  afterEach(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
});
