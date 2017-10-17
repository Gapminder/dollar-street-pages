'use strict';

import { AbstractPage } from './AbstractPage';
import { element, by, $ } from 'protractor';
import { ElementFinder, ElementArrayFinder } from 'protractor/built/index';

export class HomePage extends AbstractPage {
  public static familyName: ElementFinder = element.all(by.css('p[class="title desktop"]')).get(1);
  public static familyCountry: ElementFinder = element.all(by.css('p[class="title"]')).get(2);
  public static familyIncome: ElementFinder = element.all(by.css('p[class="title"]')).get(1);
  public static familyImages: ElementArrayFinder = element.all(by.css('.family-image'));
  public static thingNameOnImg: ElementArrayFinder = element.all(by.css('.image-description>span'));
  public static thingNameInBIS: ElementFinder = $('.header-container>span');
  public static closeInBIS: ElementFinder = $('.close-block>img');
  public static relatedSearchesInBIS: ElementFinder = $('.thing-button-container>p');
  public static relatedLinksInBIS: ElementArrayFinder = element.all(by.css('.thing-button-container>a'));
  public static mapWithLinkToCountryPage: ElementFinder = $('.map.map_gray');
  public static littleStreet: ElementFinder = $('#chart');
  public static homeOnLittleStreet: ElementFinder = $('polygon[class="hover"]');
}
