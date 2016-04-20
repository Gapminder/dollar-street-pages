/**
 * Created by vs on 4/19/16.
 */

describe('Ambassador PAge', function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;


    var lastOgranization = element(by.css('.ambassadors-organization.show>img'));
    var headerH2 = element(by.css('h2[class="heading"]'));
    var logoHeader = element(by.css('.logo.pull-left>img'));
    var menuHeader = element(by.css('.menu-icon'));
    var contentH2 = element.all(by.css('div[class="ambassadors-peoples"] > h2'));
    var ambassadorsPeopleIMG = element.all(by.css('.ambassadors-people>img'));
    var ambassadorsPeopleNames = element.all(by.css('.name'));
    var ambassadorsPeopleCountries = element.all(by.css('.country'));
    var ambassadorsOrganizationsIMG = element.all(by.css('.ambassadors-organization.show>img'));
    var seeMore = element.all(by.css('.custom-button'));

    var EC = protractor.ExpectedConditions;
    var TIMEOUT = 10000;
    browser.manage().timeouts().pageLoadTimeout(75000);

    beforeAll(function () {
        browser.get('/ambassadors');
        browser.wait(EC.visibilityOf(lastOgranization), TIMEOUT, 'Last organization is not visible');
    });

    it ('Check header', function () {
        expect(headerH2.getText()).toEqual('Ambassadors');
        expect(logoHeader.isDisplayed()).toBe(true);
        expect(menuHeader.isDisplayed()).toBe(true);
    });

    it ('Check h2 in content', function () {
        expect(contentH2.first().getText()).toEqual('Teachers');
        expect(contentH2.get(1).getText()).toEqual('Writers');
        expect(contentH2.last().getText()).toEqual('Organisations');
    });

    it ('Check image and texts', function () {
        expect(ambassadorsPeopleIMG.count()).toBe(24);
        expect(ambassadorsPeopleNames.count()).toBe(32);
        expect(ambassadorsPeopleCountries.count()).toBe(32);
        expect(ambassadorsOrganizationsIMG.count()).toBe(8);
    });

    it ('Check link VIEW MORE on Teachers', function () {
        seeMore.first().click();
        expect(ambassadorsPeopleNames.get(7).isDisplayed()).toBe(true);
        expect(ambassadorsPeopleNames.get(9).isDisplayed()).toBe(true);
        expect(ambassadorsPeopleNames.get(11).isDisplayed()).toBe(true);
    });

    it ('Check link VIEW LESS on Teachers', function () {
        seeMore.first().click();
        expect(ambassadorsPeopleNames.get(7).isDisplayed()).toBe(false);
        expect(ambassadorsPeopleNames.get(9).isDisplayed()).toBe(false);
        expect(ambassadorsPeopleNames.get(11).isDisplayed()).toBe(false);
    });

    it ('Check link VIEW MORE on Writers', function () {
        seeMore.last().click();
        expect(ambassadorsPeopleIMG.get(19).isDisplayed()).toBe(true);
        expect(ambassadorsPeopleIMG.get(20).isDisplayed()).toBe(true);
        expect(ambassadorsPeopleIMG.get(22).isDisplayed()).toBe(true);
    });

    it ('Check link VIEW LESS on Writers', function () {
        seeMore.last().click();
      browser.sleep(300);
        expect(ambassadorsPeopleIMG.get(19).isDisplayed()).toBe(false);
        expect(ambassadorsPeopleIMG.get(20).isDisplayed()).toBe(false);
        expect(ambassadorsPeopleIMG.get(22).isDisplayed()).toBe(false);
    });

    it ('Check footer', function () {
        var footerLogo = element(by.css('p[class^="logo_name"]'));
        var footerGapminder = element(by.css('p[class^="logo_name"]+p'));
        var footerFacebookIcon = element(by.css('div[class="footer"] div[class*="facebook"]'));
        var footerTwitterIcon = element(by.css('div[class="footer"] div[class*="twitter"]'));
        var footerGoogleIcon = element(by.css('div[class="footer"] div[class*="google"]'));
        var footerLinkedinIcon = element(by.css('div[class="footer"] div[class*="linkedin"]'));
        var footerCreativeCommons = element(by.css('.col-md-3.col-sm-3.f-creative-commons>a>img'));
        expect(footerLogo.getText()).toEqual('DOLLAR STREET');
        expect(footerGapminder.getText()).toEqual('Powered by Gapminder');
        expect(footerFacebookIcon.isDisplayed()).toBe(true);
        expect(footerTwitterIcon.isDisplayed()).toBe(true);
        expect(footerGoogleIcon.isDisplayed()).toBe(true);
        expect(footerLinkedinIcon.isDisplayed()).toBe(true);
        expect(footerCreativeCommons.isDisplayed()).toBe(true);
    });

});
