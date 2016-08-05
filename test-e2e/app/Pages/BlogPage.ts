'use strict';
import { AbstractPage } from './AbstractPage';
import { element, by } from 'protractor/globals';
import { ElementArrayFinder } from 'protractor/built/index';

export class BlogPage {
  public static h1EveryPost:ElementArrayFinder = element.all(by.css('h3[href*="/post?"]'));

  public static getPost():ElementArrayFinder {
    return this.h1EveryPost;
  }
}

BlogPage.prototype = Object.create(AbstractPage.prototype);
