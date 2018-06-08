import { $, ElementFinder } from 'protractor';

import { DataProvider } from '../../Data/DataProvider';

export class TwitterPage {

  static inputPassword: ElementFinder  = $('.row.password input');
  static inputEmail: ElementFinder  = $('.row.user input');
  static buttonSubmit: ElementFinder  = $('.button.submit');
  static messageBox: ElementFinder  = $('.field textarea');
  static bannerErrorSameTweet: ElementFinder  = $('.error');

  static async addTweet(tweetText: string): Promise<void> {
    await TwitterPage.messageBox.clear();
    await TwitterPage.messageBox.sendKeys(tweetText);
  }
  static async login(login = DataProvider.socialNetworksAccounts.Twitter.userEmail,
                     password = DataProvider.socialNetworksAccounts.Twitter.password ): Promise<void> {
    await TwitterPage.inputEmail.sendKeys(login);
    await TwitterPage.inputPassword.sendKeys(password);
  }
  static async post(): Promise<void> {
    await TwitterPage.buttonSubmit.click();
  }
}
