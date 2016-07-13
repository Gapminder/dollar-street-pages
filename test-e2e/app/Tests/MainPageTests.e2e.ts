'use strict';

const dataProvider = require('../Data/DataProvider.ts');
const FooterPage = require('../Pages/FooterPage.ts');
const using = require('jasmine-data-provider');
let footer = new FooterPage();

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