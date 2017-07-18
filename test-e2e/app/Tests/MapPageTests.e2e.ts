'use strict';

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
import { AbstractPage } from '../Pages/AbstractPage';
import { browser } from 'protractor';
import { MapPage } from '../Pages/MapPage';
let using = require('jasmine-data-provider');

describe('Map Page test', () => {
  beforeAll(() => {
    browser.get('map');
    browser.wait(AbstractPage.getEC().visibilityOf(MapPage.mapImage), AbstractPage.getTimeout, MapPage.setMapErrorMessage('Map Image didn"t load'));
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
describe('Map Page: hover on Marker', () => {
  beforeAll(()=> {
    browser.get('map');
    browser.wait(AbstractPage.getEC().visibilityOf(MapPage.mapImage), AbstractPage.getTimeout, MapPage.setMapErrorMessage('Map Image didn"t load'));
  });
  using(DataProvider.mapPageHover, (data:any, description:any) => {
  it('Click on hover, check pop-up with family info: ' + description, () => {
    MapPage.markers.each((element) => {
      browser.actions().mouseMove(element).perform();
      browser.sleep(50);
      expect(data.element().isDisplayed).toBeTruthy();
      });
    });
  });
});
