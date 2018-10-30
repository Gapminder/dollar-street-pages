import { AbstractPage } from './Abstract.page';
import { $, ElementFinder } from 'protractor';
import { waitForVisible } from '../Helpers';
import { waitForLoader } from '../Helpers/commonHelper';
import { HamburgerMenu } from './Components/HamburgerMenu.e2e.component';

export class AboutPage {
  static url = `${AbstractPage.url}/about`;
  static title: ElementFinder = $('.header-title');
  static pageContent: ElementFinder = $('#info-context');
  static visitDollarStreetLink: ElementFinder = AboutPage.pageContent.$('h2 a');
  static pageContentTitle: ElementFinder = AboutPage.pageContent.$('h1');
  static youtubeVideo: ElementFinder = $('iframe[src=\'//www.youtube.com/embed/ndV1lm97398\']');
  static tedVideo: ElementFinder = $('iframe[src=\'https://embed.ted.com/talks/anna_rosling_ronnlund_see_how_the_rest_of_the_world_lives_organized_by_income\']');

  static async open(): Promise<void> {
    await HamburgerMenu.goToAboutPage();
    await waitForLoader();
    await waitForVisible(this.title);
    await waitForVisible(this.pageContent);
  }
}
