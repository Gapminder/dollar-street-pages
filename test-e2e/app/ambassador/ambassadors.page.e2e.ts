'use strict';
describe('Ambassador PAge', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    const lastOgranization = $('.ambassadors-organization.show>img');
    const headerH2 = $('h2[class="heading"]');
    const logoHeader = $('.logo.pull-left>img');
    const menuHeader = $('.menu-icon');
    const contentH2 = element.all(by.css('div[class="ambassadors-peoples"] > h2'));
    const ambassadorsPeopleIMG = element.all(by.css('.ambassadors-people>img'));
    const ambassadorsPeopleNames = element.all(by.css('.name'));
    const ambassadorsPeopleCountries = element.all(by.css('.country'));
    const ambassadorsOrganizationsIMG = element.all(by.css('.ambassadors-organization.show>img'));
    const EC = protractor.ExpectedConditions;
    const TIMEOUT = 10000;
    browser.manage().timeouts().pageLoadTimeout(75000);
    browser.ignoreSynchronization = true;
    beforeAll(() => {
        browser.get('/ambassadors');
        browser.wait(EC.visibilityOf(lastOgranization), TIMEOUT, 'Last organization is not visible');
    });
    it ('Check header', () => {
        expect(headerH2.getText()).toEqual('Ambassadors');
        expect(logoHeader.isDisplayed()).toBe(true);
        expect(menuHeader.isDisplayed()).toBe(true);
    });
    it ('Check h2 in content', () => {
        expect(contentH2.first().getText()).toEqual('Teachers');
        expect(contentH2.get(1).getText()).toEqual('Writers');
        expect(contentH2.last().getText()).toEqual('Organisations');
    });
    it ('Check image and texts', () => {
        expect(ambassadorsPeopleIMG.count()).toBe(24);
        expect(ambassadorsPeopleNames.count()).toBe(32);
        expect(ambassadorsPeopleCountries.count()).toBe(32);
        expect(ambassadorsOrganizationsIMG.count()).toBe(8);
    });
    it ('Check footer', () => {
      let footerLogo = $('p[class^="logo_name"]');
      let footerGapminder = $('p[class^="logo_name"]+p');
      let footerFacebookIcon = $('div[class="footer"] div[class*="facebook"]');
      let footerTwitterIcon = $('div[class="footer"] div[class*="twitter"]');
      let footerGoogleIcon = $('div[class="footer"] div[class*="google"]');
      let footerLinkedinIcon = $('div[class="footer"] div[class*="linkedin"]');
      let footerCreativeCommons = $('.col-md-3.col-sm-3.f-creative-commons>a>img');
        expect(footerLogo.getText()).toEqual('DOLLAR STREET');
        expect(footerGapminder.getText()).toEqual('Powered by Gapminder');
        expect(footerFacebookIcon.isDisplayed()).toBe(true);
        expect(footerTwitterIcon.isDisplayed()).toBe(true);
        expect(footerGoogleIcon.isDisplayed()).toBe(true);
        expect(footerLinkedinIcon.isDisplayed()).toBe(true);
        expect(footerCreativeCommons.isDisplayed()).toBe(true);
    });
});
