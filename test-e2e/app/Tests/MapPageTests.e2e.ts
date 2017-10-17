import { browser } from 'protractor';

import using = require('jasmine-data-provider');

import { DataProvider } from '../Data/DataProvider';
import { FooterPage } from '../Pages/FooterPage';
import { AbstractPage } from '../Pages/AbstractPage';
import { MapPage } from '../Pages/MapPage';


xdescribe('Map Page test', () => {
  /**
   * why check this?
   */

  beforeAll(() => {
    browser.get('map');
    browser.wait(AbstractPage.getEC().visibilityOf(MapPage.mapImage), AbstractPage.getTimeout, MapPage.setMapErrorMessage('Map Image didn"t load'));
  });

  afterAll(() => {
    FooterPage.checkFooterText();
    FooterPage.checkFooterImages();
  });

  using(DataProvider.mapPageCountry, (data: any, description: any) => {
    it('Check ' + description + ' on Map page', () => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  });
});

describe('Map Page: hover on Marker', () => {
  beforeAll(() => {
    browser.get('map');
    browser.wait(AbstractPage.getEC().visibilityOf(MapPage.mapImage), AbstractPage.getTimeout, MapPage.setMapErrorMessage('Map Image didn"t load'));
  });

  it('Click on hover, check pop-up with family info', () => {
    MapPage.markers.each(element => {
      browser.actions().mouseMove(element).perform();

      using(DataProvider.mapPageHover, (data: any) => {
        expect(data.element().isDisplayed).toBeTruthy();
      });
    });
  });
});
