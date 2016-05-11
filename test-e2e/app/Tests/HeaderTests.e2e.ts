'use strict';

const dataProvider = require('../Data/DataProvider.ts');

describe('Footer test', () => {
    let using = require('jasmine-data-provider');
        using(dataProvider.footerTextInfo, (data, description) => {
            it('Check the ' + description + ' on footer', () => {
                expect($(data.logoCSS).getText()).toEqual(data.actualResult);
            });
        });
        using(dataProvider.footerBooleanInfo, (data, description) => {
            it('Check the ' + description + ' on footer', () => {
                expect($(data.logoCSS).isDisplayed()).toBeTruthy();
            });
        });
    });
