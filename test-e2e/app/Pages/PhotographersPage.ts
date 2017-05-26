'use strict';

import { AbstractPage } from '../Pages/AbstractPage';
import { element, by, $ } from 'protractor';
import { ElementArrayFinder, ElementFinder } from 'protractor/built/index';

export class PhotographersPage {
  public static photographerName:ElementArrayFinder = element.all(by.css('.photographer-card>h3'));
  public static photographerPortrait:ElementArrayFinder = element.all(by.css('.photographer-portrait'));
  public static camerasIcon:ElementArrayFinder = element.all(by.css('.fa.fa-camera'));
  public static homesIcon:ElementArrayFinder = element.all(by.css('.photographer-material>span>img'));
  public static lastPhotographer:ElementArrayFinder = element.all(by.css('.photographer-portrait'));
  public static searchButton:ElementFinder = $('#search');
  public static foundPhotographer:ElementFinder = $('.photographer-card>h3');
  public static familiesIcon:ElementFinder = $('.place');

  public static isDisplayedPhotographerName():boolean {
    return this.photographerName.isDisplayed();
  };

  public static isDisplayedPhotographerPortrait():boolean {
    return this.photographerPortrait.isDisplayed();
  };

  public static isDisplayedCamerasIcon():boolean {
    return this.camerasIcon.isDisplayed();
  };

  public static isDisplayedHomesIcon():boolean {
    return this.homesIcon.isDisplayed();
  };

  public static getLastPhotographer():ElementFinder {
    return this.lastPhotographer.last();
  };

  public static setErrorMessage():string {
    return 'Last photographer on Photographers Page is not loaded';
  };

  public static setFamilyErrorMessage(name:string):string {
    return name + 'Families on Photographer Page is not loaded';
  };
}
PhotographersPage.prototype = Object.create(AbstractPage.prototype);
