import { ElementArrayFinder, ElementFinder, element, by, $, browser, $$ } from 'protractor';

import { AbstractPage } from './Abstract.page';

export class PhotographersPage {
  static url = `${AbstractPage.url}/photographers`;
  
  static photographerName: ElementArrayFinder = element.all(by.css('.photographer-card>h3'));
  static photographerPortrait: ElementArrayFinder = element.all(by.css('.photographer-portrait'));
  static camerasIcon: ElementArrayFinder = element.all(by.css('.fa.fa-camera'));
  static homesIcon: ElementArrayFinder = element.all(by.css('.photographer-material>span>img'));
  static lastPhotographer: ElementArrayFinder = element.all(by.css('.photographer-portrait'));
  static searchButton: ElementFinder = $('input[placeholder="Search..."]');
  static foundPhotographer: ElementFinder = $('.photographer-card>h3');
  static familiesIcon: ElementFinder = $('.place');
  static photographerNamesInLeftSidepanel: ElementArrayFinder = $$('.photographers-list li');

  static getLastPhotographer(): ElementFinder {
    return this.lastPhotographer.last();
  }

  static setErrorMessage(): string {
    return 'Last photographer on Photographers Page is not loaded';
  }

  static setFamilyErrorMessage(name: string): string {
    return `${name} Families on Photographer Page is not loaded`;
  }
}
