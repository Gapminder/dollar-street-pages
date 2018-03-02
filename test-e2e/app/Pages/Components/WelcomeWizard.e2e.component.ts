import { $, ElementFinder, browser } from 'protractor';

export class WelcomeWizard {
  static rootSelector: ElementFinder = $('quick-guide');
  static quckGuideContainer: ElementFinder = WelcomeWizard.rootSelector.$('.quick-guide-container');
  static closeIcon: ElementFinder = WelcomeWizard.rootSelector.$('.quick-guide-container > img');

  static async closeWizard(): Promise<void> {
    await this.closeIcon.click();
  }

  static async disableWizard(): Promise<void> {
    try {
      await browser.executeScript(() => {
        window.localStorage.setItem('quick-guide', 'true');
      });
      // ensure that it was used from local strage
      await browser.refresh();
    } catch (err) {
      throw new Error(err);
    }
  }
}
