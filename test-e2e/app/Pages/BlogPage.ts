'use strict';
import { AbstractPage } from './AbstractPage';
import { element, by, $ } from 'protractor';
import { ElementArrayFinder, ElementFinder } from 'protractor/built/index';

export class BlogPage {
  public static getPostHeader:ElementFinder = $('a[rel*="bookmark"]');
  public static h1EveryPost:ElementArrayFinder = element.all(by.css('.post-title'));
  public static gapminderLogo:ElementFinder = element.all(by.css('a[title*="Gapminder"]')).get(0);
}

BlogPage.prototype = Object.create(AbstractPage.prototype);
