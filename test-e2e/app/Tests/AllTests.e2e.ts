'use strict';

/// <reference path="../../../typings/require.d.ts"/>
/// <reference path="../../../typings/main.d.ts"/>
/// <reference path="../../../typings/protractor.d.ts"/>

//TODO Need to reed about Typings and remove this temporary solution

const MapPage = require('../Pages/MapPage.ts');
const AbstractPage = require('../Pages/AbstractPage.ts');
const dataProvider = require('../Data/DataProvider.ts');
const PhotographersPage = require('../Pages/PhotographersPage.ts');
const FooterPage = require('../Pages/FooterPage.ts');
const MatrixPage = require('../Pages/MatrixPage.ts');
const using = require('jasmine-data-provider');
let abstractPage;
let photographersPage;
let matrixPage;
let footer = new FooterPage();
browser.ignoreSynchronization = true;
browser.manage().window().maximize();

describe('Main Page test', () => {
  beforeAll(() => {
    browser.get('/');
  });
  afterAll(() => {
    footer.checkFooterText();
    footer.checkFooterImages();
  });
  using(dataProvider.mainPageTextHeader, (data, description) => {
    it('Check the ' + description + ' on header Main Page' , () => {
      expect($(data.element).getText()).toEqual(data.actualResult);
    });
  });
  using(dataProvider.mainPageBooleanHeader, (data, description) => {
    it('Check the ' + description + ' on header Main Page' , () => {
      expect($(data.element).isDisplayed()).toBeTruthy();
    });
  });
  using(dataProvider.mainPageTextSubHeader, (data, description) => {
    it('Check the ' + description + ' on sub-header Main Page' , () => {
      expect($(data.textCSS).getText()).toEqual(data.actualResult);
    });
  });
  using(dataProvider.mainPageBooleanImages, (data, description) => {
    it('Check the ' + description + ' on image content Main Page' , () => {
      for (let i = 0; i < data.numberElems; i++) {
        expect(element.all(by.css(data.imgCSS)).get(i).isDisplayed()).toBeTruthy();
      }});
  });
});
describe('Photographer Page test', () => {
  abstractPage = new AbstractPage();
  photographersPage = new PhotographersPage();
  beforeEach(() => {
    browser.get('/photographers');
    browser.wait(abstractPage.getEC.visibilityOf(photographersPage.getLastPhotographer()), abstractPage.getTimeout, photographersPage.setErrorMessage());
  });
  afterEach(() => {
    using (dataProvider.photographerPageBoolean, (data) => {
      expect($(data.photographerDataCSS).isDisplayed()).toBeTruthy();
    });
  });
  afterAll(() => {
    footer.checkFooterText();
    footer.checkFooterImages();
  });
  using(dataProvider.photographersPageField, (data, description) => {
    it('Check ' + description + ' on Photographer Page' , () => {
      photographersPage = new PhotographersPage();
      photographersPage.getSearchButton().sendKeys(data.photographerQuery + '\n');
      photographersPage.getFoundPhotographer().click();
      browser.wait(abstractPage.getEC.visibilityOf(photographersPage.getFamiliesIcon()), abstractPage.getTimeout, photographersPage.setFamilyErrorMessage(description));
    });
  });
});
describe('Map Page test', () => {
  abstractPage = new AbstractPage();
  beforeAll(() => {
    let mapPage = new MapPage();
    browser.get('/map');
    browser.wait(abstractPage.getEC.visibilityOf(mapPage.getMapImage()), abstractPage.getTimeout, mapPage.setMapErrorMessage());
    browser.sleep(2000);
  });
  afterAll(() => {
    footer.checkFooterText();
    footer.checkFooterImages();
  });
  using(dataProvider.mapPageCountry, (data, description) => {
    it('Check ' + description + ' on Map page', () => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
});
describe('Photographers Page test', () => {
  abstractPage = new AbstractPage();
  photographersPage = new PhotographersPage();
  beforeAll(() => {
    browser.get('/photographers');
    browser.wait(abstractPage.getEC.visibilityOf(photographersPage.getLastPhotographer()), abstractPage.getTimeout, photographersPage.setErrorMessage());
  });
  afterAll(() => {
    footer.checkFooterText();
    footer.checkFooterImages();
  });
  using(dataProvider.photographersPageSearch, (data, description) => {
    it('Check ' + description + ' on Photographers page', () => {
      photographersPage = new PhotographersPage();
      photographersPage.getSearchButton().sendKeys(data.countryQuery);
      expect(photographersPage.isDisplayedPhotographerName()).toBeTruthy();
      expect(photographersPage.isDisplayedPhotographerPortrait()).toBeTruthy();
      expect(photographersPage.isDisplayedHomesIcon()).toBeTruthy();
      expect(photographersPage.isDisplayedCamerasIcon()).toBeTruthy();
      photographersPage.getSearchButton().clear();
    });
  });
});
describe('Ambassadors Page test', () => {
  beforeAll(() => {
    browser.get('/ambassadors');
  });
  afterAll(() => {
    footer.checkFooterText();
    footer.checkFooterImages();
  });
  using (dataProvider.ambassadorsPageText, (data, description) => {
    it ('Check ' + description + ' on Ambassadors Page', () => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
  using (dataProvider.ambassadorsPageBoolean, (data, description) => {
    it ('Check ' + description + ' on Ambassadors Page', () => {
      expect(data.element().isDisplayed()).toBeTruthy();
    });
  });
});
describe('Matrix Page test', () => {
  browser.ignoreSynchronization = false;
  beforeAll(() => {
    browser.get('/matrix');
  });
  afterAll(() => {
    footer.checkFooterText();
    footer.checkFooterImages();
  });
  using (dataProvider.matrixPageText, (data, description) => {
    it ('Check ' + description + ' on Matrix Page', () => {
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
      for (let i = 0; i < 15; i++) {
        expect(data.element().get(i).isDisplayed()).toBeTruthy();
      }});
  });
  using (dataProvider.matrixPageSearchBoolean, (data, description) => {
    it ('Check ' + description + ' on Matrix Page', () => {
      matrixPage = new MatrixPage();
      matrixPage.getGlass().click();
      expect(data.element().isPresent()).toBeTruthy();
    });
  });
  using (dataProvider.matrixPageSearchText, (data, description) => {
    it ('Check ' + description + ' on Matrix Page', () => {
      matrixPage = new MatrixPage();
      matrixPage.getGlass().click();
      expect(data.element().getText()).toEqual(data.actualResult);
      matrixPage.getGlass().click();
    });
  });
  using (dataProvider.matrixPageText, (data, description) => {
    it ('Check ' + description + ' on Matrix Page after selection thing', () => {
      matrixPage = new MatrixPage();
      browser.ignoreSynchronization = false;
      matrixPage.getGlass().click();
      matrixPage.getThing(4).click();
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
});
