import { ElementArrayFinder, ElementFinder, element, by, $ } from 'protractor';
import { promise } from 'selenium-webdriver';

import { AbstractPage } from './AbstractPage';

export class PhotographersPage extends AbstractPage {
  public static photographerName: ElementArrayFinder = element.all(by.css('.photographer-card>h3'));
  public static photographerPortrait: ElementArrayFinder = element.all(by.css('.photographer-portrait'));
  public static camerasIcon: ElementArrayFinder = element.all(by.css('.fa.fa-camera'));
  public static homesIcon: ElementArrayFinder = element.all(by.css('.photographer-material>span>img'));
  public static lastPhotographer: ElementArrayFinder = element.all(by.css('.photographer-portrait'));
  public static searchButton: ElementFinder = $('input[placeholder="Search..."]');
  public static foundPhotographer: ElementFinder = $('.photographer-card>h3');
  public static familiesIcon: ElementFinder = $('.place');

  public static isDisplayedPhotographerName(): promise.Promise<boolean> {
    return this.photographerName.isDisplayed();
  };

  public static isDisplayedPhotographerPortrait(): promise.Promise<boolean> {
    return this.photographerPortrait.isDisplayed();
  };

  public static isDisplayedCamerasIcon(): promise.Promise<boolean> {
    return this.camerasIcon.isDisplayed();
  };

  public static isDisplayedHomesIcon(): promise.Promise<boolean> {
    return this.homesIcon.isDisplayed();
  };

  public static getLastPhotographer(): ElementFinder {
    return this.lastPhotographer.last();
  };

  public static setErrorMessage(): string {
    return 'Last photographer on Photographers Page is not loaded';
  };

  public static setFamilyErrorMessage(name: string): string {
    return name + 'Families on Photographer Page is not loaded';
  };
}
