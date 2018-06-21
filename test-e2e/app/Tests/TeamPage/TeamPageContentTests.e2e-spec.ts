import { TeamPage } from '../../Pages/Team.page';
import { browser } from 'protractor';


describe('Team Page: Content', () => {
  beforeAll(async () => {
    browser.get(TeamPage.url);

  });

  it('Check Core Team title', async () => {
    expect(TeamPage.coreTeamTitle.getText()).toEqual('Core Team');
  });

  it('Check Core Team content', async () => {
    expect(TeamPage.coreTeamPeople.count()).toBe(3);
  });

  it('Check Contributor team title', async () => {
    expect(TeamPage.contributorTeamTitle.getText()).toEqual('Contributor');
  });

  it('Check Contributor Team content', async () => {
    expect(TeamPage.contributorTeamPeople.count()).toBe(12);
  });

});
