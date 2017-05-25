'use strict';
import { element, by, $ } from 'protractor';
import { ElementFinder, ElementArrayFinder } from 'protractor';

export class ThingsPage {
  public static linkToThings:ElementFinder = $('a[href="/cms/things"] span');
  public static addNewThing:ElementFinder = $('button[ng-click*="editThing"]');
  public static h2:ElementFinder = $('h2');
  public static headerInPopUpThings:ElementFinder = $('.modal-title.ng-binding>b');
  public static fieldAddThingName:ElementFinder = $('input[ng-model*="name"]');
  public static fieldAddPluralOfThing:ElementFinder = $('input[ng-model*="plural"]');
  public static fieldAddDescriptionOfThing:ElementFinder = $('textarea[ng-model*="description"]');
  public static selectRelatedThings:ElementFinder = $('input[placeholder*="Select Related things"]');
  public static listOfRelatedThings:ElementArrayFinder = element.all(by.css('.ng-binding.ng-scope'));
  public static selectCategory:ElementFinder = $('input[placeholder*="Select Category"]');
  public static listOfCategories:ElementArrayFinder = element.all(by.css('.ng-binding.ng-scope'));
  public static fieldOfSynonymousOfThing:ElementFinder = $('input[placeholder*="synonymous"]');
  public static fieldOfTagsForThing:ElementFinder = $('input[placeholder*="Add a tag"]');
  public static buttonSaveThing:ElementFinder = $('button[type="submit"]');
  public static searchField:ElementFinder = $('#search');
  public static listOfThings:ElementArrayFinder = element.all(by.css('h4 b'));
  public static buttonEditArticle:ElementArrayFinder = element.all(by.css('a[href*="article-thing"] i'));
  public static shortDescriptionOfArticle:ElementFinder = $('textarea[ng-model*="article.short"]');
  public static buttonSaveArticle:ElementFinder = $('button[ng-click="save(article)"]');
  public static buttonDeleteThing:ElementArrayFinder = element.all(by.css('a[ng-click*="remove"]'));
  public static headerInPopUpDeleteThing:ElementFinder = $('.modal-title');
  public static buttonOkInDeletingThing:ElementFinder = $('button[ng-click="ok()"]');
  public static thingNameByDeleting:ElementFinder = $('h4[class="ng-binding"]');
  public static buttonEditThing:ElementFinder = $('.btn.btn-primary.btn-circle.btn-sm.ng-scope');
  public static headerEditingThing:ElementFinder = $('.modal-title.ng-binding');
  public static ratingStarsEmpty:ElementFinder = element.all(by.css('i[class*="glyphicon-star-empty"]')).last();
  public static ratingStarsNotEmpty:ElementArrayFinder = element.all(by.css('i[class*="glyphicon-star"]'));
  public static buttonWhiteList:ElementFinder = $('label[btn-radio*="white"]');
  public static pluralNameOfThing:ElementFinder = $('.col-md-1.ng-binding');
  public static descriptionOfThing:ElementFinder = $('td[class*="ng-binding col-md-2"]');
  public static buttonPublicThing:ElementFinder = element.all(by.css('.ios7-switch.sm>div')).last();
}
