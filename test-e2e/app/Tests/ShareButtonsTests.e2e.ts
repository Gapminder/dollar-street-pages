'use strict';

import { AbstractPage } from '../Pages/AbstractPage';
import { browser } from 'protractor';
import { MatrixPage } from '../Pages/MatrixPage';
import { SharePages } from '../Pages/SharePages';

describe('Matrix Page Social share buttons, hamburger menu:', () => {
  beforeAll(() => {
    browser.get('matrix');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 40000);
  });

  afterEach(()=>{
    browser.ignoreSynchronization = false;
  });

  it('Check twitter', ()=>{
    MatrixPage.hamburgerMenu.click();
    MatrixPage.getShareButtonInHamburgerMenu('twitter').click().then(()=> {
      browser.sleep(1000);
      browser.getAllWindowHandles().then((handles:any)=> {
        browser.ignoreSynchronization = true;
        browser.switchTo().window(handles[1]).then(()=> {
          browser.ignoreSynchronization = true;
          expect(browser.getCurrentUrl()).toContain('https://twitter.com/intent/tweet?url=https://is.gd/A1wFyq&text=See%20how%20people%20really%20live-%20Dollar%20Street');
          expect(SharePages.inputFieldTwitter.getText()).toContain('See how people really live- Dollar Street https://is.gd/A1wFyq');
          expect(SharePages.buttonPostOnTwitter.isDisplayed()).toBeTruthy();
        });
        browser.switchTo().window(handles[0]);
      });
    });
  });
  it('Check facebook', ()=>{
    MatrixPage.getShareButtonInHamburgerMenu('facebook').click().then(()=> {
      browser.sleep(1000);
      browser.getAllWindowHandles().then((handles:any)=> {
        browser.sleep(1000);
        browser.switchTo().window(handles[2]).then(()=> {
          browser.ignoreSynchronization = true;
          expect(browser.getCurrentUrl()).toContain('https://www.facebook.com/login.php?skip_api_login=1&api_key=966242223397117&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fsharer.php%3Fu%3Dhttps%253A%252F%252Fis.gd');
          expect(SharePages.headerFacebook.isDisplayed()).toBeTruthy();
          expect(SharePages.loginFacebook.isDisplayed()).toBeTruthy();
        });
        browser.switchTo().window(handles[0]);
        browser.sleep(2000);
      });
    });
  });
  it('Check linkedin', ()=>{
    MatrixPage.getShareButtonInHamburgerMenu('linkedin').click().then(()=> {
      browser.sleep(1000);
      browser.getAllWindowHandles().then((handles:any)=> {
        browser.sleep(1000);
        browser.switchTo().window(handles[3]).then(()=> {
          browser.ignoreSynchronization = true;
          expect(SharePages.logoLinkedin.isDisplayed()).toBeTruthy();
          expect(browser.getCurrentUrl()).toContain('https://www.linkedin.com/start/join?trk=login_reg_redirect&session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fsharing%2Fshare-offsite%3Fmini%3Dtrue%26url%3Dhttps%3A%2F%2Fis.gd%2FA1wFyq%26summary%3DSee%2520how%2520people%2520really%2520live');
          //expect(SharePages.logInLinkedin.isDisplayed()).toBeTruthy();
        });
        browser.switchTo().window(handles[0]);
      });
    });
  });

  it('Check Google+', ()=>{
    MatrixPage.getShareButtonInHamburgerMenu('google').click().then(()=> {
      browser.sleep(1000);
      browser.getAllWindowHandles().then((handles:any)=> {
        browser.sleep(1000);
        browser.switchTo().window(handles[4]).then(()=> {
          browser.ignoreSynchronization = true;
          expect(browser.getCurrentUrl()).toContain('https://accounts.google.com/signin/v2/identifier?service=oz&passive=1209600&continue=https%3A%2F%2Fplus.google.com%2Fup%2F%3Fcontinue%3Dhttps%3A%2F%2Fplus.google.com%2Fshare%3Furl%253Dhttps%3A%2F%2Fis.gd%2FA1wFyq%2526text%253DSee%252Bhow%252Bpeople%252Breally%252Blive%26gpsrc%3Dgplp0&flowName=GlifWebSignIn&flowEntry=ServiceLogin');
          expect(SharePages.inputEmailGoogle.isDisplayed).toBeTruthy();
          expect(SharePages.logoGoogle.isDisplayed()).toBe(true);
          expect(SharePages.buttonNextGoogle.isDisplayed()).toBe(true);
        });
      });
    });
  });
});

