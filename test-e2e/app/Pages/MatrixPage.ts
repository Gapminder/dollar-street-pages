'use strict';

import { AbstractPage } from './AbstractPage';
import { element, by, $ } from 'protractor/globals';
import { ElementFinder, ElementArrayFinder } from 'protractor/built/index';

export class MatrixPage {
  public static filterByThing:ElementFinder = $('.things-filter-button-content');
  public static thingLinkInSearch:ElementArrayFinder = element.all(by.css('.thing-name'));
  public static searchInFilterByThing:ElementFinder = $('input[type*="search"]');
  public static thingNameOnFilter:ElementFinder = element.all(by.css('.things-filter-button-content>span')).first();
  public static familyLink:ElementArrayFinder = element.all(by.css('div[class*="image-content"]'));
  public static placePagelink:ElementFinder = $('div[class*="mini-matrix-link"]');
  public static thingInFilter:ElementFinder = $('.thing-name');
  public static bigImageFromBigSection:ElementFinder = $('.view-image-container>img');
  public static homeLink:ElementFinder = $('.description-footer-container>a');

  public static getFilterByThing():ElementFinder {
    return this.filterByThing;
  };
  public static getThingLinkInSearch(thingNumber: number):ElementFinder {
    return this.thingLinkInSearch.get(thingNumber);
  };
  public static getSearchInFilterByThing():ElementFinder {
    return this.searchInFilterByThing;
  };
  public static getThingNameOnFilter():ElementFinder {
    return this.thingNameOnFilter;
  };
  public static getFamilyLink():ElementArrayFinder {
    return this.familyLink;
  };
  public static getPlacePageLink():ElementFinder {
    return this.placePagelink;
  };
  public static getLastThing():ElementFinder {
    return this.familyLink.last();
  };
  public static getFilter(type: string):ElementFinder {
    return element(by.id(type + '-filter'));
  };
  public static getThingInFilter():ElementFinder {
    return this.thingInFilter;
  };
  public static getBigImageFromBigSection():ElementFinder {
    return this.bigImageFromBigSection;
  };
  public static getHomeLink():ElementFinder {
    return this.homeLink;
  };
}
MatrixPage.prototype = Object.create(AbstractPage.prototype);
