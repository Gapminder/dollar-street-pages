import { browser } from 'protractor';

import { MatrixPage } from '../../Pages';
import { Footer } from '../../Pages/Components';
import { disableAnimations, getRandomNumber, waitForVisible } from '../../Helpers';
import { getRandomString, switchWindow, waitForInvisibility } from '../../Helpers/commonHelper';
import { TwitterPage } from '../../Pages/SocialNetworks/Twitter.page';

let tweetText: string;
let actualTweetText: string;
let defaultTweetText: string = 'See how people really live- Dollar Street';

describe('Twitter test', () => {
  beforeAll(async () => {
    tweetText = getRandomString(12);
    await browser.get(MatrixPage.url);
    waitForInvisibility(MatrixPage.spinner);
    await browser
      .actions()
      .mouseMove(MatrixPage.familyLink.get(10))
      .perform();
    await disableAnimations();
  });

  it('Check default tweet text', async () => {
    await Footer.twitterIcon.click();

    await switchWindow(1);
    await browser.waitForAngularEnabled(false);
    await waitForVisible(TwitterPage.messageBox);

    actualTweetText = await TwitterPage.messageBox.getText();
    expect(actualTweetText).toContain(defaultTweetText);
    await browser.close();
    await browser.waitForAngularEnabled(true);
    await switchWindow(0);
  });

  it('Checks user can share the tweet form floating footer', async () => {
    await Footer.twitterIcon.click();

    await switchWindow(1);
    await browser.waitForAngularEnabled(false);
    await waitForVisible(TwitterPage.messageBox);

    await TwitterPage.login();
    await TwitterPage.addTweet(tweetText);
    await TwitterPage.post();

    let win = await browser.getAllWindowHandles();
    expect(win.length).toBe(1, 'Twitter window is still open');

    await browser.waitForAngularEnabled(true);
    await switchWindow(0);

    await Footer.twitterIcon.click();
    await switchWindow(1);

    await browser.waitForAngularEnabled(false);
    await waitForVisible(TwitterPage.messageBox);

    TwitterPage.addTweet(tweetText);
    TwitterPage.post();

    expect(TwitterPage.bannerErrorSameTweet.isPresent()).toBeTruthy();
  });
});
