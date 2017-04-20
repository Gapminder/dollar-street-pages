'use strict';

import { DataProvider } from '../Data/DataProvider';
import { $ } from 'protractor';
let using = require ('jasmine-data-provider');

export class FooterPage {
  public static checkFooterText():any {
    using(DataProvider.footerTextInfo, (data:any) => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  };

  public static checkFooterImages():any {
    using(DataProvider.footerBooleanInfo, (data:any) => {
      expect($(data.logoCSS).isPresent()).toBeTruthy();
    });
  };
}
