'use strict';

const dataProvider = require('../Data/DataProvider.ts');
const FooterPage = require('../Pages/FooterPage.ts');
const using = require('jasmine-data-provider');
const MapPage = require('../Pages/MapPage.ts');
const CountryPage = require('../Pages/CountryPage.ts');
let footer = new FooterPage();

browser.manage().window().maximize();

describe ('Country Page test', ()=> {
    let mapPage = new MapPage();
    let countryPage = new CountryPage();
    afterAll(() => {
        footer.checkFooterText();
        footer.checkFooterImages();
    });
    for (let i = 0; i < 45; i++) {
        it('Check country ' + i + ' on Country Page: name, numbers, map, markers, texts', () => {
            browser.get('/map');
            let country = mapPage.getCountry().get(i);
            let countryName = mapPage.getCountry().get(i).getText();
            countryName.then((name) => {console.log(name);});
            country.click();
            browser.wait(countryPage.getEC.elementToBeClickable(countryPage.getBigMap()), countryPage.getTimeout);
            expect(countryPage.getCountryName()).toEqual(countryName);
            expect(countryPage.getNumberOfFamilies()).toEqual(countryPage.countNumberOfFamilies());
            expect(browser.isElementPresent(countryPage.getBigMap())).toBeTruthy();
            expect(browser.isElementPresent(countryPage.getMarkerOnMap())).toBeTruthy();
            using(dataProvider.countryPageText, (data) => {
                expect(data.element().isPresent()).toBeTruthy();
            });
        });
    }
});