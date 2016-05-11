'use strict';

const MapPage = require('../Pages/MapPage.ts');
const AbstractPage = require('../Pages/AbstractPage.ts');
const data = require('../Data/DataProvider.ts');
const PhotographersPage = require('../Pages/PhotographersPage.ts');
const using = require('jasmine-data-provider');
let abstractPage;

describe('SiteMap Page test', () => {
    abstractPage = new AbstractPage();
    beforeEach( () => {
        browser.get('/');
        $('a[href*="sitemap"]').click();
    });
        using(data.sitemapInfo, (data, description) => {
           it('Click on ' + description + ' page' , () => {
                browser.wait(abstractPage.getEC.visibilityOf($(data.element)), abstractPage.getTimeout, abstractPage.setElementErrorMessage(data.namePage));
                $(data.element).click();
                browser.wait(abstractPage.getEC.visibilityOf($(data.elementCSS)), abstractPage.getTimeout, abstractPage.setElementErrorMessage(data.namePage));
            });
        });
});
describe('Main Page test', () => {
    beforeAll( () => {
        browser.get('');
    });
    using(data.mainPageTextHeader, (data, description) => {
        it('Check the ' + description + ' on footer Main Page' , () => {
            expect($(data.element).getText()).toEqual(data.actualResult);
        });
    });
    using(data.mainPageBooleanHeader, (data, description) => {
        it('Check the ' + description + ' on footer Main Page' , () => {
            expect($(data.element).isDisplayed()).toBeTruthy();
        });
    });
    using(data.mainPageTextSubHeader, (data, description) => {
        it('Check the ' + description + ' on sub-header Main Page' , () => {
            expect($(data.textCSS).getText()).toEqual(data.actualResult);
        });
    });
    using(data.mainPageBooleanImages, (data, description) => {
        it('Check the ' + description + ' on image content Main Page' , () => {
                for (let i = 0; i < data.numberElems; i++) {
                expect(element.all(by.css(data.imgCSS)).get(i).isDisplayed()).toBeTruthy();
            }});
    });
});
describe('Photographer Page test', () => {
    abstractPage = new AbstractPage();
    let photographersPage = new PhotographersPage();
    beforeEach(() => {
        browser.get('/');
        let el = $('a[href*="photographers"]');
        el.click();
        browser.wait(abstractPage.getEC.visibilityOf(photographersPage.getLastPhotographer()), abstractPage.getTimeout, photographersPage.setErrorMessage());
    });
    afterEach(() => {
        using (data.photographerPageBoolean, (data) => {
                expect($(data.photographerDataCSS).isPresent()).toBeTruthy();
        });
    });
    using(data.photographersPageField, (data, description) => {
        it('Check the ' + description + ' on Photographer Page' , () => {
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
        browser.get('/');
        let el = $('a[href*="map?"]');
        el.click();
        browser.wait(abstractPage.getEC.visibilityOf(mapPage.getMapImage()), abstractPage.getTimeout, mapPage.setMapErrorMessage());
      browser.sleep(2000);
    });
    using(data.mapPageCountry, (data, description) => {
       it('Check ' + description + ' on Map page', () => {
          expect(data.element().getText()).toEqual(data.actualResult);
       });
    });
});
describe('Photographers Page test', () => {
    abstractPage = new AbstractPage();
    let photographersPage = new PhotographersPage();
    beforeAll(() => {
       browser.get('/');
       let el = $('a[href*="photographers"]');
       el.click();
       browser.wait(abstractPage.getEC.visibilityOf(photographersPage.getLastPhotographer()), abstractPage.getTimeout, photographersPage.setErrorMessage());
   });
    using(data.photographersPageSearch, (data, description) => {
        it('Check ' + description + ' on Photographers page', () => {
            let photographersPage = new PhotographersPage();
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
        browser.get('/');
        let el = $('a[href*="ambassadors"]');
        el.click();
    });
    using (data.ambassadorsPageText, (data, description) => {
        it ('Check' + description + ' on Ambassadors Page', () => {
            expect(data.element().getText()).toEqual(data.actualResult);
        });
    });
    using (data.ambassadorsPageBoolean, (data, description) => {
        it ('Check' + description + ' on Ambassadors Page', () => {
            expect(data.element().isDisplayed()).toBeTruthy();
        });
    });
});
