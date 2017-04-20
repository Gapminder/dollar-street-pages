import { ElementFinder, $ } from 'protractor';
export class SharePages {
  public static inputFieldTwitter:ElementFinder = $('textarea[id*="status"]');
  public static buttonPostOnTwitter:ElementFinder = $('input[class*="button selected submit"]');
  public static logoLinkedin:ElementFinder = $('div[class="logo_container"]');
  public static logInLinkedin:ElementFinder = $('input[type="submit"]');
  public static logoGoogle:ElementFinder = $('div[class="logo logo-w"]');
  public static inputEmailGoogle:ElementFinder = $('input[id="Email"]');
  public static buttonNextGoogle:ElementFinder = $('input[id="next"]');
  public static headerFacebook:ElementFinder = $('div[class="clearfix"]');
  public static loginFacebook:ElementFinder = $('input[name="login"]');
}
