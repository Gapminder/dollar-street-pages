import { ElementFinder, $, element, by, ElementArrayFinder } from 'protractor';
export class AbstractPage{
  public static langChinaOutside:ElementFinder = element.all(by.css('div[class="lang-outside"]')).last();
  public static langEnglishOutside:ElementFinder = element.all(by.css('div[class="lang-outside"]')).first();
  public static buttonLangDropDown:ElementFinder = $('button[id="single-button"]');
  public static langListInDropDown:ElementArrayFinder = element.all(by.css('button[id="single-button"]'));
}
