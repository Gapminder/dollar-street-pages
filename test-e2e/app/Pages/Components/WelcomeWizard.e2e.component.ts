import { $, ElementFinder } from 'protractor';

export class WelcomeWizard {
  static closeIcon: ElementFinder = $('.quick-guide-container > img');

  static closeWelcomeWizard() {
    this.closeIcon.click();
  }


}
