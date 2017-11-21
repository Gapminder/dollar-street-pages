import { element, by, $, $$, ElementFinder, ElementArrayFinder, browser, ExpectedConditions as EC } from 'protractor';
import { promise } from 'selenium-webdriver';

import { AbstractPage } from './AbstractPage';

export class MatrixPage extends AbstractPage {
  public static filterByThing: ElementFinder = $('.things-filter-button-content');
  public static filterByCountry: ElementFinder = $('.countries-filter-button');
  public static thingLinkInSearch: ElementArrayFinder = element.all(by.css('.thing-name'));
  public static searchInFilterByThing: ElementFinder = $('input[placeholder*="things"]');
  public static thingNameOnFilter: ElementFinder = element.all(by.css('.things-filter-button-content>span')).first();
  public static familyLink: ElementArrayFinder = element.all(by.css('matrix-images div[class*="image-content"]'));
  public static placePagelink: ElementFinder = $('div[class*="mini-matrix-link"]');
  public static thingInFilter: ElementFinder = $('.thing-name');
  public static bigImageFromBigSection: ElementFinder = $('.view-image-container>img');
  public static homeLink: ElementFinder = $('.home-description-container>a[angulartics2on="click"]');
  public static getThingLinkInSearchInAllTopics: ElementFinder = $$('.other-things-content .thing-name').first();
  public static getFloatFooterText: ElementArrayFinder = element.all(by.css('div[class*="float-footer"] span'));
  public static getAngleUp: ElementFinder = element.all(by.css('.back-to-top')).first();
  public static hamburgerMenu: ElementFinder = $('span[class="menu-icon"]');
  public static getButtonMaybeLaterOnWelcomeHeader: ElementFinder = element.all(by.css('div[class*="quick-guide"] button[type*="button"]')).last();
  public static zoomIncrease: ElementFinder = $$('button .sign').first();
  public static zoomDecrease: ElementFinder = $$('button .sign').get(1);
  public static countryInFilter: ElementArrayFinder = $$('.name');
  public static okButtonInCountryFilter: ElementFinder = $('.ok-img');
  public static familyName: ElementFinder = $('.home-description-container>h3');
  public static previewCloseBtn: ElementFinder = $('.close-container');
  public static fancyPreview: ElementFinder = $('.fancyBox-image');
  public static spinner: ElementFinder = $('[class="load"]');
  public static imagesContainer: ElementFinder = $('.images-container .flex-container');
  public static visitThisHomeBtn: ElementFinder = $('.home-description-container > a:nth-child(4)'); // TODO add tests class
  public static allFamiliesInCountryBtn: ElementFinder = $('.home-description-container > a:nth-child(5)'); // TODO add tests class
  public static countryInImageDescription: ElementArrayFinder = $$('.place-image-box-country');
  public static minimap: ElementFinder = $('#map-content');
  public static photographerName: ElementFinder = $('.photographer-container a:nth-child(2)'); // TODO add test class
  public static familyIncomeOnImage: ElementArrayFinder = element.all(by.css('.place-image-box-income'));
  public static familyIncomeInPreview: ElementFinder = $('.matrix-view-block .header-container');

  /**
   * Embed feature
   */
  public static pinContainer: ElementFinder = $('.pin-container');
  public static heartIconsOnImage: ElementArrayFinder = $$('matrix-images .heart-circle');
  public static pinnedImages: ElementArrayFinder = $$('.pin-place > img');
  public static pinnedImagesCountry: ElementArrayFinder = $$('.pin-place .place-image-box-country');
  public static housesOnPinnedStreet: ElementArrayFinder = $$('.street-pinned-box-container .point');
  public static pinHeader: ElementFinder = $('.pin-header');
  public static shareButton: ElementFinder = $('.pin-done-share');
  public static deselectImageBtns: ElementArrayFinder = $$('.pin-container .heart-circle');
  public static pinnedStreet: ElementFinder = $('street-pinned .road');
  public static shareNowBtn: ElementFinder = $$('.share-close-buttons span').first();
  public static cancelSharingBtn: ElementFinder = $$('.share-close-buttons span').get(1);


  public static getThingLinkInSearch(thingNumber: number): ElementFinder {
    return this.thingLinkInSearch.get(thingNumber);
  };

  public static getLastThing(): ElementFinder {
    return this.familyLink.last();
  };

  public static getFilter(type: string): ElementFinder {
    return element(by.id(type + '-filter'));
  };

  public static getShareButtonInHamburgerMenu(social: string): ElementFinder {
    return $('main-menu div[class*="share-button ' + social + '"]');
  }

  public static waitForSpinner(): promise.Promise<void> {
    return browser.wait(EC.invisibilityOf(this.spinner), 10000);
  }

  public static getFamilyIncome(index: number): promise.Promise<number> {
    return this.familyIncomeOnImage.get(index).getText()
      .then(income => Number(income.replace(/\D/g, '')));
  }

  public static getFamilyIncomeFromPreviw(index: number): promise.Promise<number> {
    return this.familyIncomeInPreview.get(index).getText()
      .then(income => Number(income.replace(/\D/g, '')));
  }
}
