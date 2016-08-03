'use strict';

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
import { AbstractPage } from '../Pages/AbstractPage';
let using = require('jasmine-data-provider');
import { browser } from 'protractor/globals';
import { MapPage } from '../Pages/MapPage';

describe('Map Page test', () => {
  beforeAll(() => {
    browser.get('/map');
    browser.wait(AbstractPage.getEC().visibilityOf(MapPage.getMapImage()), AbstractPage.getTimeout(), MapPage.setMapErrorMessage('Map Image'));
    browser.sleep(2000);
  });
  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });
  using(DataProvider.mapPageCountry, (data:any, description:any) => {
    it('Check ' + description + ' on Map page', () => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
});
