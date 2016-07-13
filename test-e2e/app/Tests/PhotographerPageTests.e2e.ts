'use strict';

const dataProvider = require('../Data/DataProvider.ts');
const FooterPage = require('../Pages/FooterPage.ts');
const using = require('jasmine-data-provider');
const PhotographersPage = require('../Pages/PhotographersPage.ts');
let footer = new FooterPage();
let photographersPage;

browser.manage().window().maximize();

describe('Photographer Page test', () => {
    photographersPage = new PhotographersPage();
    beforeEach(() => {
        browser.get('/photographers');
        browser.wait(photographersPage.getEC.visibilityOf(photographersPage.getLastPhotographer()), photographersPage.getTimeout, photographersPage.setErrorMessage());
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
            browser.wait(photographersPage.getEC.visibilityOf(photographersPage.getFamiliesIcon()), photographersPage.getTimeout, photographersPage.setFamilyErrorMessage(description));
        });
    });
});