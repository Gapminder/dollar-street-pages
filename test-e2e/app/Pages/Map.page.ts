import { $, $$, browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';

import { waitForLoader } from '../Helpers/commonHelper';
import { AbstractPage } from './Abstract.page';
import { waitForVisible } from '../Helpers';

export class MapPage {
  static url = `${AbstractPage.url}/map`;

  static mapImage: ElementFinder = $('.map-color');
  static countryLinks: ElementArrayFinder = $$('.country-name');
  static markers: ElementArrayFinder = $$('.marker');

  static familyPopup: ElementFinder = $('.hover_portrait_box');
  static familyPopupDescription: ElementFinder = $('.hover_portrait_description');
  static familyPopupStack: ElementFinder = $('.hover_portrait.shadow_to_right');
  static familyPopupLink: ElementFinder =  MapPage.familyPopup.$('.see-all-span');
  static familyPopupCountyText: ElementFinder =  MapPage.familyPopup.$('.country');
  static familyPopupIncome: ElementFinder =  MapPage.familyPopup.$('.income');

  static sideFamiliesContainer: ElementFinder = $('.left-side-info.open');
  static sidePhotos: ElementArrayFinder = MapPage.sideFamiliesContainer.$$('.family-photo');
  static sideFamilyInfoBox: ElementArrayFinder = MapPage.sideFamiliesContainer.$$('.info-box');
  static sideFamilyCountry: ElementArrayFinder = MapPage.sideFamiliesContainer.$$('.country');
  static sideFamilyName: ElementArrayFinder = MapPage.sideFamiliesContainer.$$('.name');
  static sideFamilyIncome: ElementArrayFinder = MapPage.sideFamiliesContainer.$$('.income');
  static sideFamilyTitleLink: ElementFinder = MapPage.sideFamiliesContainer.$('.header a');
  static sideFamilyContainerClose: ElementFinder = MapPage.sideFamiliesContainer.$('.close-button');

  static searchInFilterByThing: ElementFinder = $('input[placeholder*="things"]');
  static filterByThing: ElementFinder = $('.things-filter-button-content');
  static mapTitle: ElementFinder = $('.map-things-text');
  static countryListBlock: ElementFinder = $('.row.countries-list');
  static allTopicsBox: ElementFinder = $('.other-things-content');
  static thingsFilterFirsResult: ElementFinder = MapPage.allTopicsBox.$$('.thing-name').first();
  static selectedFilter: ElementFinder = $$('.things-filter-button-content span').first();
  static countryList: ElementArrayFinder = MapPage.countryListBlock.$$('.row.countries-list li');

  static async open(): Promise<void> {
    await browser.get(this.url);
    await waitForLoader();
    await waitForVisible(this.mapImage);
    await waitForVisible(this.markers.first());
  }

  static async hoverFirstMarker() {
    await waitForVisible(this.markers.first());
    const mapMarker = await MapPage.markers.first();
    await browser.actions().mouseMove(mapMarker).perform();
    await waitForVisible(MapPage.familyPopupDescription);
    await waitForVisible(MapPage.familyPopupLink);
  }


  static async openSideMenu() {
    await waitForVisible(MapPage.familyPopupLink);
    await MapPage.familyPopupLink.click();
    await waitForVisible(MapPage.sideFamiliesContainer);
  }

  static getCountry(i: number): ElementFinder {
    return this.countryLinks.get(i);
  }
  static getSideFamilies(): ElementArrayFinder {
    return this.sidePhotos;
  }

  static async closeSideFamiliesContainer() {
    await this.sideFamilyContainerClose.click();
  }

  static getCurrentCuntryListCount() {
    return MapPage.countryList.count();
  }
  static getFilter(type: string): ElementFinder {
    return element(by.id(`${type}-filter`));
  }
}
