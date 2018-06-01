import { $, ElementFinder } from 'protractor';
import { DataProvider } from '../../Data/DataProvider';

export class Footer {
  static rootSelector: ElementFinder = $('footer');
  static floatingFooter: ElementFinder = $('.float-footer-container')

  static dollarStreetText: ElementFinder = Footer.rootSelector.$('.logo-container>p');
  static heartIcon: ElementFinder = Footer.floatingFooter.$('.pin-icon');
  static twitterIcon: ElementFinder = Footer.floatingFooter.$('.share-button.twitter');

  static async checkFooterText(): Promise<void> {
    for (const [name, { element, actualResult }] of Object.entries(DataProvider.footerTextInfo)) {
      expect(await element().getText()).toEqual(actualResult);
    }
  }

  static async checkFooterImages(): Promise<void> {
    for (const [name, { logoCSS }] of Object.entries(DataProvider.footerBooleanInfo)) {
      expect(await $(logoCSS).isPresent()).toBeTruthy();
    }
  }
}
