'use strict';
import { element, by, $ } from 'protractor';
import { ElementFinder, ElementArrayFinder } from 'protractor';

export class DataProvider {
  public static PlacesPageString:any = {
    'Places (N)': {element: ():ElementFinder => element.all(by.css('.ng-binding')).first(), actualResult: 'Places (269)'},
    'Countries (N)': {element: ():ElementFinder => element.all(by.css('.ng-binding')).get(1), actualResult: 'Countries (51)'},
    'Profile': {element: ():ElementFinder => $('a[ui-sref*="admin.app.profile"]'), actualResult: 'Profile'}
  };
}
