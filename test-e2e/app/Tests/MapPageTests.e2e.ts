'use strict';

const dataProvider = require('../Data/DataProvider.ts');
const FooterPage = require('../Pages/FooterPage.ts');
const using = require('jasmine-data-provider');
const MapPage = require('../Pages/MapPage.ts');
let footer = new FooterPage();

describe('Map Page test', () => {
    let mapPage = new MapPage();
    beforeAll(() => {
        browser.get('/map');
        browser.wait(mapPage.getEC.visibilityOf(mapPage.getMapImage()), mapPage.getTimeout, mapPage.setMapErrorMessage());
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