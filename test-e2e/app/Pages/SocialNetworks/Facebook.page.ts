import { $, $$, browser, ElementFinder } from 'protractor';

import { DataProvider } from '../../Data/DataProvider';
import { waitTillWindowClosed } from '../../Helpers/commonHelper';
import { waitForVisible } from '../../Helpers';

export class FacebookPage {

  static baseURL = 'https://www.facebook.com/';

  static inputPassword: ElementFinder  = $('#pass');
  static inputEmail: ElementFinder  = $('#email');
  static buttonLogIn: ElementFinder  = $('input[type="submit"]');
  static buttonSubmit: ElementFinder  = $('button[name="__CONFIRM__"]');
  static messageBox: ElementFinder  = $('.input.textInput');
  static postLinkToDollarStreet: ElementFinder = $$('a._52c6').first();

  static async addMessage(messageText: string): Promise<void> {
    await this.messageBox.clear();
    await this.messageBox.sendKeys(messageText);
  }
  static async login(login = DataProvider.socialNetworksAccounts.Facebook.userEmail,
                     password = DataProvider.socialNetworksAccounts.Facebook.password ): Promise<void> {
    await this.inputEmail.sendKeys(login);
    await this.inputPassword.sendKeys(password);
    await this.buttonLogIn.click();

  }
  static async post(): Promise<void> {
    await this.buttonSubmit.click();
  }

  static async addPost(messageText: string = 'Dollar Street Test'): Promise<void> {
    await waitForVisible(FacebookPage.buttonLogIn);
    await FacebookPage.login();
    await waitForVisible(FacebookPage.messageBox);
    await FacebookPage.addMessage(messageText);
    await FacebookPage.post();
    await waitTillWindowClosed();
    await browser.sleep(3000);
  }
  static async navigateAndClickOnLastPost(): Promise<void> {
    await browser.get(FacebookPage.baseURL);
    await waitForVisible(FacebookPage.postLinkToDollarStreet);
    await FacebookPage.postLinkToDollarStreet.click();
  }
}
