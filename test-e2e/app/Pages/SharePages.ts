import { ElementFinder, $ } from 'protractor';
export class SharePages {
  public static inputFieldTwitter:ElementFinder = $('textarea[id*="status"]');
  public static buttonPostOnTwitter:ElementFinder = $('input[class*="button selected submit"]');
  public static logoLinkedin:ElementFinder = $('h1[class="title li-logo"]');
  public static logInLinkedin:ElementFinder = $('input[type="submit"]');
  public static logoGoogle:ElementFinder = $('div[id="logo"]');
  public static inputEmailGoogle:ElementFinder = $('input[id="Email"]');
  public static buttonNextGoogle:ElementFinder = $('span[class="RveJvd snByac"]');
  public static headerFacebook:ElementFinder = $('div[class="clearfix"]');
  public static loginFacebook:ElementFinder = $('input[name="login"]');
}
