'use strict';

import { AbstractPage } from './AbstractPage';
import { element, by, $ } from 'protractor';
import { ElementFinder, ElementArrayFinder } from 'protractor';
import { $$ } from 'protractor';

export class MatrixPage {
  public static filterByThing:ElementFinder = $('.things-filter-button-content');
  public static filterByCountry:ElementFinder = $('.countries-filter-button');
  public static thingLinkInSearch:ElementArrayFinder = element.all(by.css('.thing-name'));
  public static searchInFilterByThing:ElementFinder = $('input[placeholder*="things"]');
  public static thingNameOnFilter:ElementFinder = element.all(by.css('.things-filter-button-content>span')).first();
  public static familyLink:ElementArrayFinder = element.all(by.css('div[class*="image-content"]'));
  public static placePagelink:ElementFinder = $('div[class*="mini-matrix-link"]');
  public static thingInFilter:ElementFinder = $('.thing-name');
  public static bigImageFromBigSection:ElementFinder = $('.view-image-container>img');
  public static homeLink:ElementFinder = $('.home-description-container>a[angulartics2on="click"]');
  public static getThingLinkInSearchInAllTopics:ElementFinder = $('.other-things-content .thing-name');
  public static getFloatFooterText:ElementArrayFinder = element.all(by.css('div[class*="float-footer"] span'));
  public static getAngleUp:ElementFinder = element.all(by.css('.back-to-top')).first();
  public static hamburgerMenu:ElementFinder = $('span[class="menu-icon"]');
  public static getButtonMaybeLaterOnWelcomeHeader:ElementFinder = element.all(by.css('div[class*="quick-guide"] button[type*="button"]')).last();
  public static zoomIncrease:ElementFinder = $('button[class="increase"]');
  public static zoomDecrease:ElementFinder = $('button[class="decrease"]');
  public static countryInFilter:ElementArrayFinder = $$('.name');
  public static okButtonInCountryFilter:ElementFinder = $('.ok-img');
  public static getThingLinkInSearch(thingNumber: number):ElementFinder {
    return this.thingLinkInSearch.get(thingNumber);
  };
  public static getLastThing():ElementFinder {
    return this.familyLink.last();
  };
  public static getFilter(type: string):ElementFinder {
    return element(by.id(type + '-filter'));
  };
  public static getShareButtonInHamburgerMenu(social:string):ElementFinder {
    return $('div[class*="share-button ' + social + '"]');
  }
}
MatrixPage.prototype = Object.create(AbstractPage.prototype);
