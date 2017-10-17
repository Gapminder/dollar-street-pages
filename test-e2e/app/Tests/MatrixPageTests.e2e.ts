import { browser, ElementFinder } from 'protractor';

import using = require('jasmine-data-provider');

import { DataProvider } from '../Data/DataProvider';
import { AbstractPage } from '../Pages/AbstractPage';
import { FooterPage } from '../Pages/FooterPage';
import { MatrixPage } from '../Pages/MatrixPage';
import { HomePage } from '../Pages/HomePage';

describe('Matrix Page test', () => {
  beforeAll(() => {
    browser.get('matrix');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 40000);
  });
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });

  using(DataProvider.matrixPageText, (data: any, description: string) => {
    it('Check ' + description + ' on Matrix Page (Home thing)', () => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });

  using(DataProvider.matrixPageBoolean, (data: any, description: string) => {
    it('Check ' + description + ' on Matrix Page', () => {
      expect(data.element().isDisplayed()).toBeTruthy();
    });
  });

  using(DataProvider.matrixPageImages, (data: any, description: string) => {
    it('Check ' + description + ' on Matrix Page', () => {
      for (let i = 0; i < 3; i++) {
        expect(data.element().get(i).isDisplayed()).toBeTruthy();
      }
    });
  });

  using(DataProvider.matrixPageSearchBoolean, (data: any, description: string) => {
    it('Check ' + description + ' on Matrix Page', () => {
      MatrixPage.filterByThing.click();
      expect(data.element().isPresent()).toBeTruthy();
    });
  });

  using(DataProvider.matrixPageSearchText, (data: any, description: string) => {
    it('Check things filter: ' + description + ' on Matrix Page', () => {
      MatrixPage.filterByThing.click().then(() => {
        expect(data.element().getText()).toEqual(data.actualResult);
      });
    });
  });

  using(DataProvider.matrixPageText, (data: any, description: string) => {
    it('Check ' + description + ' on Matrix Page after selection thing', () => {
      MatrixPage.filterByThing.click();
      MatrixPage.getThingLinkInSearch(4).click();
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });

  using(DataProvider.matrixPageQueries, (data: any, description: string) => {
    it('Check ' + description + ' on Matrix Page in Search popup', () => {
      MatrixPage.filterByThing.click();
      MatrixPage.searchInFilterByThing.clear().then(() => {
        MatrixPage.searchInFilterByThing.sendKeys(data.query);
        expect(MatrixPage.getThingLinkInSearchInAllTopics.getText()).toEqual(data.query);
      });
      MatrixPage.filterByThing.click();
    });
  });

  using(DataProvider.matrixPageQueries, (data: any, description: string) => {
    it('Check ' + description + ' on Matrix Page after Search thing', () => {
      MatrixPage.filterByThing.click();
      MatrixPage.searchInFilterByThing.clear().then(() => {
        MatrixPage.searchInFilterByThing.sendKeys(data.query);
      });
      MatrixPage.getThingLinkInSearch(0).click().then((): any => {
        using(DataProvider.matrixPageText, (data: any) => {
          expect(data.element()).toEqual(data.actualResult);
        });
        using(DataProvider.matrixPageBoolean, (data: any) => {
          expect(data.element().isDisplayed()).toBeTruthy();
        });
        using(DataProvider.matrixPageImages, (data: any) => {
          data.element().each((elem: ElementFinder) => {
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

describe('Matrix Page: big section -like in Google', () => {
  const NUMBER_OF_LINKS_TO_TEST = 3;

  beforeAll(() => {
    browser.get('matrix');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 40000);
  });

  for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
    it(`Big section elements present for ${i} image`, () => {
      browser.actions().mouseMove(MatrixPage.familyLink.get(i).getWebElement()).click().perform();
      using(DataProvider.matrixBigSection, (data: any) => {
        expect(data.element().isPresent()).toBeTruthy();
      });
      using(DataProvider.matrixBigSectionHower, (data: any) => {
        expect(data.element().isPresent()).toBeTruthy();
      });

      /**
       * check that country name match in preview and description
       */
      const familyCountry = MatrixPage.familyLink.get(i)
        .$$(HomePage.thingNameOnImg.first().locator().value).get(1) // dynamic locator to maintain the loop
        .getText();
      const countryInDescription = MatrixPage.familyName.getText();

      expect(countryInDescription).toContain(familyCountry);
    });
  }

  for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
    it(`Open image preview for ${i} image`, () => {
      /**
       * click on image in matrix page should open preview for that image
       */
      const pattern = /^.*(\/)/; // grab everything to last slash
      const familyImageSrc = MatrixPage.familyLink.get(i).getCssValue('background-image')
        .then(attr => attr.replace('url("', ''))
        .then(url => url.match(pattern)[0]);

      MatrixPage.familyLink.get(i).click();

      const previewSrc = MatrixPage.bigImageFromBigSection.getAttribute('src')
        .then(url => url.match(pattern)[0]);

      expect(familyImageSrc).toEqual(previewSrc);
    });
  }

  for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
    it(`Store state in URL for ${i} image`, () => {
      /**
       * click on image and swithing between images should store activeHouse in url
       */
      const urlBefore = browser.getCurrentUrl();

      MatrixPage.familyLink.get(i).click();

      const urlAfter = browser.getCurrentUrl();

      expect(urlBefore).not.toEqual(urlAfter);
      expect(urlAfter).toContain(`&activeHouse=${i + 1}`);
    });
  }

});


