import { browser, ElementFinder } from 'protractor';

import using = require('jasmine-data-provider');

import { DataProvider } from '../../Data/DataProvider';
import { AbstractPage } from '../../Pages/AbstractPage';
import { FooterPage } from '../../Pages/FooterPage';
import { MatrixPage } from '../../Pages/MatrixPage';
import { Street } from '../../Pages/Components/Street.e2e.component';
import { HomePage } from '../../Pages/HomePage';

describe('Matrix Page test', () => {
  beforeAll(() => {
    browser.get('matrix');
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

describe('Zoom buttons', () => {
  beforeEach(() => {
    browser.get('matrix');
  });

  it('Decrease zoom', () => {
    const IMAGES_IN_ROW = 4;
    MatrixPage.zoomDecrease.click();

    expect(MatrixPage.imagesContainer.getAttribute('class')).toContain(`column-${IMAGES_IN_ROW + 1}`);
    expect(browser.getCurrentUrl()).toContain(`&zoom=${IMAGES_IN_ROW + 1}&`);
  });

  it('Increase zoom', () => {
    const IMAGES_IN_ROW = 4;
    MatrixPage.zoomIncrease.click();

    expect(MatrixPage.imagesContainer.getAttribute('class')).toContain(`column-${IMAGES_IN_ROW - 1}`);
    expect(browser.getCurrentUrl()).toContain(`&zoom=${IMAGES_IN_ROW - 1}&`);
  });
});

describe('Sorting on matrix', () => {
  beforeEach(() => {
    browser.get('matrix');
  });

  it('Images resorted when move toddlers', () => {
    const IMAGES_IN_ROW = 4;

    const street: Street = new Street();
    const lowIncome = street.moveLeftToddler();
    const highIncome = street.moveRightToddler();

    const firstFamilyIncome = MatrixPage.familyIncomeOnImage.first().getText()
      .then(income => Number(income.replace('$', '')));
    const lastFamilyIncome = MatrixPage.familyIncomeOnImage.get(IMAGES_IN_ROW).getText()
      .then(income => Number(income.replace('$', '')));

    lowIncome.then(lowIncome => {
      expect(firstFamilyIncome).toBeGreaterThan(lowIncome);
    });
    highIncome.then(highIncome => {
      expect(lastFamilyIncome).toBeLessThan(highIncome);
    });
  });

  it('Images resorted on zoom out', () => {
    const IMAGES_IN_ROW = 4;
    MatrixPage.zoomDecrease.click();
    MatrixPage.zoomDecrease.click();

    for (let i = 1; i < IMAGES_IN_ROW + 2; ++i) {
      const nextImage = MatrixPage.familyIncomeOnImage.get(i).getText()
        .then(income => Number(income.replace(/$|\W/g, '')));

      MatrixPage.familyIncomeOnImage.get(i - 1).getText()
        .then(previousImage => Number(previousImage.replace(/$|\W/g, '')))
        .then(previousImage => expect(nextImage).toBeGreaterThan(previousImage));
    }
  });


});
