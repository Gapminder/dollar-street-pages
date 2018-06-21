import { AbstractPage } from './Abstract.page';
import { $, $$, ElementArrayFinder, ElementFinder } from 'protractor';


export class TeamPage {

  static url = `${AbstractPage.url}/team`;

  static pageTitle: ElementFinder = $('.header-title');

  static coreTeam: ElementFinder = $$('.team-peoples').first();
  static coreTeamTitle: ElementFinder = TeamPage.coreTeam.$('h2');
  static coreTeamPeople: ElementArrayFinder = TeamPage.coreTeam.$$('.team-people');

  static contributor: ElementFinder = $$('.team-peoples').last();
  static contributorTeamTitle: ElementFinder = TeamPage.contributor.$('h2');
  static contributorTeamPeople: ElementArrayFinder = TeamPage.contributor.$$('.team-people');


}
