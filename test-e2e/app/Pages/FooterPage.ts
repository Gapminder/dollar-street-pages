import { $ } from 'protractor';

import using = require('jasmine-data-provider');

import { DataProvider } from '../Data/DataProvider';

export class FooterPage {
  public static dollarStrretText = $('.logo-container>p');
  public static heartIcon = $('.pin-icon');

  public static checkFooterText(): void {
    using(DataProvider.footerTextInfo, (data: any) => {
      expect(data.element().getText()).toEqual(data.actualResult);
    });
  };

  public static checkFooterImages(): void {
    using(DataProvider.footerBooleanInfo, (data: any) => {
      expect($(data.logoCSS).isPresent()).toBeTruthy();
    });
  };
}
