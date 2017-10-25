import { browser, ElementFinder } from 'protractor';

import using = require('jasmine-data-provider');

import { DataProvider } from '../../Data/DataProvider';
import { AbstractPage } from '../../Pages/AbstractPage';
import { FooterPage } from '../../Pages/FooterPage';
import { MatrixPage } from '../../Pages/MatrixPage';
import { Street } from '../../Pages/Components/Street.e2e.component';
import { Header } from '../../Pages/Components/Header.e2e.component';
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

describe('Matrix Page: Zoom buttons', () => {
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

describe('Matrix Page: Sorting on matrix', () => {
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
      const nextImage = MatrixPage.getFamilyIncome(i);
      const previousImage = MatrixPage.getFamilyIncome(i - 1);

      previousImage.then(previous => {
        expect(nextImage).toBeGreaterThan(previous);
      });
    }
  });

  it('Images resorted on zoom in', () => {
    const IMAGES_IN_ROW = 4;
    MatrixPage.zoomIncrease.click();

    for (let i = 1; i < IMAGES_IN_ROW - 1; ++i) {
      const nextImage = MatrixPage.getFamilyIncome(i);
      const previousImage = MatrixPage.getFamilyIncome(i - 1);

      previousImage.then(previous => {
        expect(nextImage).toBeGreaterThan(previous);
      });
    }
  });
});

describe('Matrix Page: Filters', () => {

  beforeEach(() => {
    browser.get('matrix');
    browser.executeScript('window.localStorage.setItem("quick-guide", true)'); // TODO quick guide could broke tests
  });

  it('Filter by Country', () => {
    const COUNTRY = 'Sweden';
    const totalCountriesBefore = MatrixPage.familyLink.count();

    Header.filterByCountry(COUNTRY);

    const totalCountriesAfter = MatrixPage.familyLink.count();

    totalCountriesAfter.then(countriesAfter => {
      expect(totalCountriesBefore).toBeGreaterThan(countriesAfter);
    });

    MatrixPage.countryInImageDescription.each(family => {
      expect(family.getText()).toEqual(COUNTRY);
    });
    expect(Header.countryFilter.getText()).toEqual(COUNTRY);
    expect(browser.getCurrentUrl()).toContain(`countries=${COUNTRY}`);
  });

  it('Filter by two countries', () => {
    const COUNTRY1 = 'Sweden';
    const COUNTRY2 = 'Bangladesh';
    const totalCountriesBefore = MatrixPage.familyLink.count();

    Header.filterByCountry(COUNTRY1, COUNTRY2);

    const totalCountriesAfter = MatrixPage.familyLink.count();

    totalCountriesAfter.then(countriesAfter => {
      expect(totalCountriesBefore).toBeGreaterThan(countriesAfter);
    });

    MatrixPage.countryInImageDescription.each(family => {
      family.getText().then(familyCountry => {
        expect(familyCountry.includes(COUNTRY1) || familyCountry.includes(COUNTRY2)).toBeTruthy();
      });
    });
    expect(Header.countryFilter.getText()).toEqual(`${COUNTRY2} & ${COUNTRY1}`);
    expect(browser.getCurrentUrl()).toContain(`countries=${COUNTRY1},${COUNTRY2}`);
  });

  it('Show all countries', () => {
    const COUNTRY = 'Sweden';
    const totalCountriesBefore = MatrixPage.familyLink.count();

    Header.filterByCountry(COUNTRY);
    Header.filterByAllCountries();

    const totalCountriesAfter = MatrixPage.familyLink.count();

    expect(Header.countryFilter.getText()).toEqual('the World');
    expect(totalCountriesBefore).toEqual(totalCountriesAfter);
    expect(browser.getCurrentUrl()).toContain(`countries=World`);
  });

  it('Search in country filter', () => {
    const COUNTRY = 'Pakistan';
    const totalCountriesBefore = MatrixPage.familyLink.count();

    Header.searchInCountryFilter(COUNTRY);

    const totalCountriesAfter = MatrixPage.familyLink.count();


    totalCountriesAfter.then(countriesAfter => {
      expect(totalCountriesBefore).toBeGreaterThan(countriesAfter);
    });

    MatrixPage.countryInImageDescription.each(family => {
      expect(family.getText()).toEqual(COUNTRY);
    });
    expect(Header.countryFilter.getText()).toEqual(COUNTRY);
    expect(browser.getCurrentUrl()).toContain(`countries=${COUNTRY}`);
  });

  it('Filter by Income: currency updated in images list', () => {
    const expectedCurrency = {
      name: 'Euro',
      symbol: '€',
      code: 'eur'
    };

    Header.filterByIncome(expectedCurrency.name);

    MatrixPage.familyIncomeOnImage.each(familyDescription => {
      familyDescription.getText()
        .then(familyIncome => familyIncome.replace(/(\d).*/g, '').trim())
        .then(familyCurrency => {
          expect(familyCurrency).toEqual(expectedCurrency.symbol);
        });
    });
    expect(browser.getCurrentUrl()).toContain(`currency=${expectedCurrency.code}`);
  });

  it('Filter by Income: currency updated in image preview', () => {
    const random = AbstractPage.getRandom();
    const expectedCurrency = {
      name: 'Krona',
      symbol: 'kr',
      code: 'sek'
    };

    Header.filterByIncome(expectedCurrency.name);
    MatrixPage.familyLink.get(random).click();

    MatrixPage.familyIncomeInPreview.getText()
      .then(familyIncome => familyIncome.replace(/(\d).*/g, '').trim())
      .then(familyCurrency => {
        expect(familyCurrency).toEqual(expectedCurrency.symbol);
      });
    expect(browser.getCurrentUrl()).toContain(`currency=${expectedCurrency.code}`);
  });

  it('Filter by Income: currency updated on family page', () => {
    const random = AbstractPage.getRandom();
    const expectedCurrency = {
      name: 'Euro',
      symbol: '€',
      code: 'eur'
    };

    Header.filterByIncome(expectedCurrency.name);
    MatrixPage.familyLink.get(random).click();
    MatrixPage.visitThisHomeBtn.click();
    HomePage.familyIncome.getText()
      .then(familyIncome => familyIncome.replace(/(\d).*/g, '').trim())
      .then(familyCurrency => {
        expect(familyCurrency).toEqual(expectedCurrency.symbol);
      });

    expect(browser.getCurrentUrl()).toContain(`currency=${expectedCurrency.code}`);
  });
});
