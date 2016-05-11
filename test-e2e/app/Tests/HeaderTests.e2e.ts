'use strict';

const data = require('../Data/DataProvider.ts');

describe('Footer test', () => {
    let using = require('jasmine-data-provider');
        using(data.footerTextInfo, (data, description) => {
            it('Check the ' + description + ' on footer', () => {
                expect($(data.logoCSS).getText()).toEqual(data.actualResult);
            });
        });
        using(data.footerBooleanInfo, (data, description) => {
            it('Check the ' + description + ' on footer', () => {
                expect($(data.logoCSS).isDisplayed()).toBeTruthy();
            });
        });
    });
