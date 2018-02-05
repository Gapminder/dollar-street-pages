import { browser } from 'protractor';

import using = require('jasmine-data-provider');

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
import { MatrixPage } from '../Pages/MatrixPage';
import { HomePage } from '../Pages/HomePage';
import { CountryPage } from '../Pages/CountryPage';

describe('Home Page test (go to Home after Matrix)', () => {
  beforeAll(() => {
    browser.get('matrix');
    MatrixPage.getButtonMaybeLaterOnWelcomeHeader.click();
  });

  for (let i = 0; i < 2; i++) {
    it('Check ' + i + ' family: images and content on HomePage', () => {
      browser.get('matrix');
      MatrixPage.familyLink.get(i).click().then(() => {
        browser.actions().mouseMove(MatrixPage.homeLink).click().perform();
        using(DataProvider.homePageBoolean, (data: any) => {
          expect(data.element().isPresent()).toBeTruthy();
        });
      }).then(() => {
        using(DataProvider.homePageText, (data: any) => {
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

describe('Home Page (direct opening): ', () => {
  using(DataProvider.homePageLinks, (data: any, description: any) => {
    it('Open ' + description + ' and check little street, all BIS: images, content', () => {
      /**
       * open 'place' page and check text
       */
      browser.get(`family?place=${data.element()}`);

      HomePage.familyName.getText().then(familyName => {
        expect(familyName).toEqual(data.actualFamilyName() + ' family');
      });

      expect(HomePage.familyCountry.getText()).toEqual(data.actualCountry());
      HomePage.familyIncome.getText().then(familyIncome => {
        expect(familyIncome).toEqual('$' + data.actualIncome());
      });

      expect(HomePage.littleStreet.isDisplayed()).toBeTruthy();
      expect(HomePage.homeOnLittleStreet.isDisplayed()).toBeTruthy();

      for (let i = 0; i < 5; i++) {
        HomePage.familyImages.get(i).click().then(() => {
          expect(HomePage.thingNameOnImg.get(i).getText()).toEqual(HomePage.thingNameInBIS.getText());
          expect(HomePage.closeInBIS.isDisplayed()).toBeTruthy();

          HomePage.relatedSearchesInBIS.getText().then(relatedSearhesInBIS => {
            expect(relatedSearhesInBIS).toEqual('Related searches');
          });

          HomePage.thingNameOnImg.get(i).getText().then(() => {
            expect(HomePage.relatedLinksInBIS.get(0).getText()).toContain(' in ' + data.actualCountry());
          });
        });
      }

      using(DataProvider.homePageBoolean, (data: any) => {
        expect(data.element().isPresent()).toBeTruthy();
      });
      using(DataProvider.homePageText, (data: any) => {
        expect(data.element().getText()).toEqual(data.actualResult);
      });
    });
  });
});

describe('Home Page: ', () => {
  using(DataProvider.homePageLinks, (data: any, description: any) => {
    it('Open ' + description + ', go to Country Page and check info', () => {
      browser.get('family?place=' + data.element());

      HomePage.mapWithLinkToCountryPage.click();

      const visitedFamilies = CountryPage.numberOfFamilies.getText().then(res => Number(res));
      const numberOfFamilies = CountryPage.numberOfFamiliesEach.count();

      expect(numberOfFamilies).toEqual(visitedFamilies);

      CountryPage.numberOfPhotosEachFamily.count().then(res => {
        let summOfPhotos = 0;
        for (let i = 0; i < res; i++) {
          CountryPage.numberOfPhotosEachFamily.get(i).getText().then(result => {
            summOfPhotos = summOfPhotos + Number(result);
            if (i === res - 1) {
              CountryPage.numberOfPhotos.getText().then(text => {
                const textWithoutSpaces = text.replace(/ /, '');
                expect(Number(textWithoutSpaces)).toEqual(summOfPhotos);
              });
            }
          });
        }
      });
    });
  });
});

