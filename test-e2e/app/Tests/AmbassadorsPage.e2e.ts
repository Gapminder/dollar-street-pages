'use strict';

const dataProvider = require('../Data/DataProvider.ts');
const FooterPage = require('../Pages/FooterPage.ts');
const using = require('jasmine-data-provider');
let footer = new FooterPage();

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