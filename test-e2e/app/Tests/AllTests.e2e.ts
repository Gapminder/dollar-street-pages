'use strict';

const MapPage = require('../Pages/MapPage.ts');
const AbstractPage = require('../Pages/AbstractPage.ts');
const dataProvider = require('../Data/DataProvider.ts');
const PhotographersPage = require('../Pages/PhotographersPage.ts');
const using = require('jasmine-data-provider');
let abstractPage;
let photographersPage;
browser.ignoreSynchronization = true;

describe('Main Page test', () => {
    beforeAll( () => {
        browser.get('/');
    });
    using(dataProvider.mainPageTextHeader, (data, description) => {
        it('Check the ' + description + ' on footer Main Page' , () => {
            expect($(data.element).getText()).toEqual(data.actualResult);
        });
    });
    using(dataProvider.mainPageBooleanHeader, (data, description) => {
        it('Check the ' + description + ' on footer Main Page' , () => {
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
                expect($(data.photographerDataCSS).isPresent()).toBeTruthy();
        });
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
    abstractPage = new AbstractPage();
    beforeAll(() => {
        browser.get('/ambassadors');
    });
    using (dataProvider.ambassadorsPageText, (data, description) => {
        it ('Check' + description + ' on Ambassadors Page', () => {
            expect(data.element().getText()).toEqual(data.actualResult);
        });
    });
    using (dataProvider.ambassadorsPageBoolean, (data, description) => {
        it ('Check' + description + ' on Ambassadors Page', () => {
            expect(data.element().isDisplayed()).toBeTruthy();
        });
    });
});
