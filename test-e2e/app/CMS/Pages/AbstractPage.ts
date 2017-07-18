'use strict';
import { ElementFinder } from 'protractor';
import { LogInPage } from './LogInPage';

export class AbstractPage {
  public static sendQuery(field: ElementFinder, query: string): any {
    field.clear().then(() => {
      field.sendKeys(query);
    });
  };
  public static sendQueryWithoutClear(field: ElementFinder, query: string): any {
    field.sendKeys(query);
  };

  public static logIn(): any {
    AbstractPage.sendQuery(LogInPage.emailField, 'super@admin.com');
    AbstractPage.sendQuery(LogInPage.parolField, 'dollarStreet');
    LogInPage.loginButton.click()/*.then(() => {
      LogInPage.buttonToAdminMode.click();
    });*/
  };
}
