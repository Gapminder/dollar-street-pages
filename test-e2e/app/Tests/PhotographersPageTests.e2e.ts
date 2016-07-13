'use strict';

const dataProvider = require('../Data/DataProvider.ts');
const FooterPage = require('../Pages/FooterPage.ts');
const using = require('jasmine-data-provider');
const PhotographersPage = require('../Pages/PhotographersPage.ts');
let footer = new FooterPage();
let photographersPage;

describe('Photographers Page test', () => {
    photographersPage = new PhotographersPage();
    beforeAll(() => {
        browser.get('/photographers');
        browser.wait(photographersPage.getEC.visibilityOf(photographersPage.getLastPhotographer()), photographersPage.getTimeout, photographersPage.setErrorMessage());
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