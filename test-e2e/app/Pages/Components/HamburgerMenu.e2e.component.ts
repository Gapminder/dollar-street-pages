import { ElementFinder, $ } from 'protractor';
import { waitForVisible } from '../../Helpers';

export class HamburgerMenu {
  static rootSelector: ElementFinder = $('main-menu');

  static menuBtn: ElementFinder = HamburgerMenu.rootSelector.$('.main-menu .btn-group');
  static dropdownMenu: ElementFinder = HamburgerMenu.rootSelector.$('.dropdown-menu');
  static homeLink: ElementFinder = HamburgerMenu.rootSelector.$('[routerLink="/matrix"]');
  static quickGuide: ElementFinder = HamburgerMenu.rootSelector.$$('li').get(1);
  static aboutLink: ElementFinder = HamburgerMenu.rootSelector.$('[routerLink="/about"]');
  static donateLink: ElementFinder = HamburgerMenu.rootSelector.$('[routerLink="/donate"]');
  static mapLink: ElementFinder = HamburgerMenu.rootSelector.$('[routerLink="/map"]');
  static facebookIcon: ElementFinder = HamburgerMenu.rootSelector.$('.dropdown-menu .share-button.facebook');
  static comparisonButton: ElementFinder = HamburgerMenu.rootSelector.$('#comparisonButton');

  static async open() {
    await waitForVisible(this.menuBtn);
    await this.menuBtn.click();
    await waitForVisible(this.dropdownMenu);

  }

  static async goToHome() {
    await this.open();
    await this.homeLink.click();
  }

  static async goToAboutPage() {
    await this.open();
    await this.aboutLink.click();
  }

  static async goToDonatePage() {
    await this.open();
    await this.donateLink.click();
  }

  static async goToMapPage() {
    await this.open();
    await this.mapLink.click();
  }

  static async openQuickGuide() {
    await this.open();
    await this.quickGuide.click();
  }

  static async openEmbedModal() {
    await this.open();
    await this.comparisonButton.click();
  }
}
