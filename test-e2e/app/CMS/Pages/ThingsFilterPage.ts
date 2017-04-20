import { ElementFinder, $, ElementArrayFinder, by, element } from 'protractor';
export class ThingsFilterPage{
  public static linkToThingsFilter: ElementFinder = $('a[href="/cms/things-filter"] span');
  public static h2: ElementFinder = $('h2');
  public static popularHeader:ElementFinder = element.all(by.css('.col-md-12.background-white')).first();
  public static allTopicsHeader:ElementFinder = element.all(by.css('.col-md-12.background-white')).last();
  public static inputForPopular:ElementFinder = element.all(by.css('input')).first();
  public static inputForAllTopics:ElementFinder = element.all(by.css('input')).last();
  public static listOfThingsInInput:ElementArrayFinder = element.all(by.css('.ui-select-choices-row-inner'));
  public static quantityOfChosenThingsInPopular:ElementArrayFinder = element.all(by.css('span[placeholder*="Popular"] span[class*="ui-select-match-item"]'));
  public static quantityOfChosenThingsInAll:ElementArrayFinder = element.all(by.css('span[placeholder*="Topics"] span[class*="ui-select-match-item"]'));
  public static buttonSave:ElementFinder = $('.btn.btn-w-m.btn-primary');
  public static deleteButtonsOnPopular:ElementArrayFinder = element.all(by.css('span[placeholder*="Popular"] span[class*="close"]'));
  public static deleteButtonsOnAll:ElementArrayFinder = element.all(by.css('span[placeholder*="Topics"] span[class*="close"]'));
}
