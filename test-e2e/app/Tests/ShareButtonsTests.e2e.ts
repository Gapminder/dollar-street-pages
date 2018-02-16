import { browser, ExpectedConditions as EC } from 'protractor';

import { AbstractPage } from '../Pages/AbstractPage';
import { MatrixPage } from '../Pages/MatrixPage';
import { SharePages } from '../Pages/SharePages';

// TODO disabled because it works bad locally
xdescribe('Matrix Page Social share buttons, hamburger menu:', () => {
  beforeAll(() => {
    browser.get('matrix');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 40000);
    MatrixPage.hamburgerMenu.click();
  });

  afterEach(() => {
    closeSocialTabAndSwitchToDefault();
    browser.waitForAngularEnabled(true);
  });

  it('Check twitter', () => {
    MatrixPage.getShareButtonInHamburgerMenu('twitter').click().then(() => {
      browser.waitForAngularEnabled(false);
      browser.sleep(1000);

      browser.getAllWindowHandles().then((handles: any) => {
        browser.switchTo().window(handles[1]).then(() => {
          browser.wait(EC.visibilityOf(SharePages.inputFieldTwitter), 5000);
          expect(browser.getCurrentUrl()).toContain('https://twitter.com/intent/tweet?url=https');
          expect(browser.getCurrentUrl()).toContain('text=See%20how%20people%20really%20live-%20Dollar%20Street');
          expect(SharePages.inputFieldTwitter.getText()).toContain('Imagine the world as a street. Everyone lives on Dollar Street. The richest to the left and the poorest to the right. Every else live somewhere in between. Where would you live? Visit Dollar Street and see homes from hundreds of homes from all over the World.');
          expect(SharePages.buttonPostOnTwitter.isDisplayed()).toBeTruthy();
        });
      });
    });
  });
  it('Check facebook', () => {
    MatrixPage.getShareButtonInHamburgerMenu('facebook').click().then(() => {
      browser.waitForAngularEnabled(false);
      browser.sleep(1000);

      browser.getAllWindowHandles().then((handles: any) => {
        browser.switchTo().window(handles[1]).then(() => {
          browser.wait(EC.visibilityOf(SharePages.headerFacebook), 5000);

          expect(browser.getCurrentUrl()).toContain('https://www.facebook.com/login.php?skip_api_login=1&api_key=966242223397117&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fsharer.php%3Fu%3Dhttps%253A%252F%252Fis.gd');
          expect(SharePages.headerFacebook.isDisplayed()).toBeTruthy();
          expect(SharePages.loginFacebook.isDisplayed()).toBeTruthy();
        });
      });
    });
  });
  it('Check linkedin', () => {
    MatrixPage.getShareButtonInHamburgerMenu('linkedin').click().then(() => {
      browser.waitForAngularEnabled(false);
      browser.sleep(1000);

      browser.getAllWindowHandles().then((handles: any) => {
        browser.switchTo().window(handles[1]).then(() => {
          browser.wait(EC.visibilityOf(SharePages.logoLinkedin), 5000);

          expect(SharePages.logoLinkedin.isDisplayed()).toBeTruthy();
          expect(browser.getCurrentUrl()).toContain('www.linkedin.com%2Fsharing%2Fshare-offsite%3Fmini%3Dtrue%26url%3Dhttps%3A%2F%2F');
          expect(browser.getCurrentUrl()).toContain('summary%3DSee%2520how%2520people%2520really%2520live');
          //expect(SharePages.logInLinkedin.isDisplayed()).toBeTruthy();
        });
      });
    });
  });

  it('Check Google+', () => {
    browser.executeScript('return navigator.userAgent.includes("HeadlessChrome")').then(userAgent => {
      if (userAgent) {
        // Google+ doesn't support HeadlessChrome so ignore this test when the suit run in headless
        return expect(true).toBe(false, 'skipped in headless chrome');
      }

      MatrixPage.getShareButtonInHamburgerMenu('google').click().then(() => {
        browser.waitForAngularEnabled(false);
        browser.sleep(1000);

        browser.getAllWindowHandles().then((handles: any) => {
          browser.switchTo().window(handles[1]).then(() => {
            browser.wait(EC.visibilityOf(SharePages.logoGoogle), 5000);

            expect(browser.getCurrentUrl()).toContain('https://accounts.google.com/signin/v2/identifier?service=oz&passive=1209600&continue=https%3A%2F%2Fplus.google.com%2Fup%2F%3Fcontinue%3Dhttps%3A%2F%2Fplus.google.com%2Fshare%3Furl%253Dhttps%3A%2F%');
            expect(browser.getCurrentUrl()).toContain('text%253DSee%252Bhow%252Bpeople%252Breally%252Blive%26gpsrc%3Dgplp0&flowName=GlifWebSignIn&flowEntry=ServiceLogin');
            expect(SharePages.inputEmailGoogle.isDisplayed).toBeTruthy();
            expect(SharePages.logoGoogle.isDisplayed()).toBeTruthy();
            expect(SharePages.buttonNextGoogle.isDisplayed()).toBeTruthy();
          });
        });
      });
    });

  });
});

function closeSocialTabAndSwitchToDefault() {
  browser.getAllWindowHandles().then(handles => {

    if (handles.length > 1) {
      const socialTab = handles[1];
      const defaultTab = handles[0];

      browser.switchTo().window(socialTab);
      browser.close();
      browser.switchTo().window(defaultTab);
    }
  });
}
