'use strict';

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
import { browser } from 'protractor';
import { MatrixPage } from '../Pages/MatrixPage';
import { HomePage } from '../Pages/HomePage';
import { ElementFinder } from 'protractor';
import { CountryPage } from '../Pages/CountryPage';
let using = require('jasmine-data-provider');

describe('Home Page test (go to Home after Matrix)', ()=> {
  beforeAll(() => {
    browser.get('matrix');
    MatrixPage.getButtonMaybeLaterOnWelcomeHeader.click();
  });
  for (let i = 0; i < 11; i++) {
    it('Check ' + i + ' family: images and content on HomePage', ()=> {
      browser.get('matrix');
      MatrixPage.familyLink.get(i).click().then(()=> {
        browser.actions().mouseMove(MatrixPage.homeLink).click().perform();
          using(DataProvider.homePageBoolean, (data:any)=> {
            browser.sleep(1000);
            expect(data.element().isPresent()).toBeTruthy();
          });
          }).then(() => {
          using(DataProvider.homePageText, (data:any)=> {
            expect(data.element().getText()).toEqual(data.actualResult);
        });
      });
    });
  }
  afterEach(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
});

describe('Home Page (direct opening): ', ()=> {
  using(DataProvider.homePageLinks, (data: any, description: any) => {
    it('Open ' + description + ' and check little street, all BIS: images, content', () => {
      browser.get('family?place=' + data.element());
      expect(HomePage.familyName.getText()).toEqual(data.actualFamilyName() + ' family');
      expect(HomePage.familyCountry.getText()).toEqual(data.actualCountry());
      expect(HomePage.familyIncome.getText()).toEqual('$' + data.actualIncome());
      expect(HomePage.littleStreet.isDisplayed()).toBeTruthy();
      expect(HomePage.homeOnLittleStreet.isDisplayed()).toBeTruthy();
      HomePage.familyImages.each((image: ElementFinder, numberImg: number) => {
        if (numberImg < 16) {
          image.click().then(() => {
            expect(HomePage.thingNameOnImg.get(numberImg).getText()).toEqual(HomePage.thingNameInBIS.getText());
            expect(HomePage.closeInBIS.isDisplayed()).toBeTruthy();
            expect(HomePage.relatedSearchesInBIS.getText()).toEqual('Related searches');
            HomePage.thingNameOnImg.get(numberImg).getText().then(() => {
              expect(HomePage.relatedLinksInBIS.get(0).getText()).toContain(' in ' + data.actualCountry());
            });
          });
        }
      });
      using(DataProvider.homePageBoolean, (data: any) => {
        expect(data.element().isPresent()).toBeTruthy();
      });
      using(DataProvider.homePageText, (data: any) => {
        expect(data.element().getText()).toEqual(data.actualResult);
      });
    });
  });
});
describe('Home Page: ', ()=> {
  using(DataProvider.homePageLinks, (data: any, description:any) => {
    it('Open ' + description + ', go to Country Page and check info', ()=> {
      browser.get('family?place=' + data.element());
      HomePage.mapWithLinkToCountryPage.click().then(()=>{
        let visitedFamilies;
        CountryPage.numberOfFamilies.getText().then((res)=>{
          visitedFamilies = parseInt(res);
          expect(CountryPage.numberOfFamiliesEach.count()).toEqual(visitedFamilies);
        });
      });
      CountryPage.numberOfPhotosEachFamily.count().then((res)=>{
        let summOfPhotos = 0;
        for (let i = 0; i < res; i++){
          CountryPage.numberOfPhotosEachFamily.get(i).getText().then((result)=>{
            summOfPhotos = summOfPhotos + parseInt(result);
            if(i == res - 1){
              CountryPage.numberOfPhotos.getText().then((text)=> {
                let textWithoutSpaces = text.replace(/ /, '');
                //browser.sleep(200);
                expect(parseInt(textWithoutSpaces)).toEqual(summOfPhotos);
              })
            }
          });
        }
      });
    });
  });
});

