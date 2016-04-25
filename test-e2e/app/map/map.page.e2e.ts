'use strict';
describe('Map Page ', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  const mapImg = element(by.css('.map-color'));
  const messageAboutMap = 'Map is not loaded';
  const country = element.all(by.css('span[class*="country-name"]'));
  const EC = protractor.ExpectedConditions;
  const TIMEOUT = 10000;
  browser.manage().window().maximize();
  browser.manage().timeouts().pageLoadTimeout(75000);
  /*
   Open Map Link
   Click on every Link with Country
   Write the Text to Colsole about checked link
   */
   beforeAll(function(){
    browser.get('/map');
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
  });
  it ('Check country Bangladesh', () => {
    browser.sleep(2000);
    let elem = $('span[href$="55ef338d0d2b3c82037884d0"]');
    expect(elem.getText()).toEqual('Bangladesh');
  });
  it ('Check country Colombia', () => {
    let elem = $('span[href$="55ef338d0d2b3c820378846c"]');
    expect(elem.getText()).toEqual('Colombia');
  });
  it ('Check country Indonesia', () => {
    let elem = $('span[href$="55ef338d0d2b3c82037884d9"]');
    expect(elem.getText()).toEqual('Indonesia');
  });
  it ('Check country Lithuania', () => {
    let elem = $('span[href$="55ef338d0d2b3c820378844a"]');
    expect(elem.getText()).toEqual('Lithuania');
  });
  it ('Check country Rwanda', () => {
    let elem = $('span[href$="55ef338d0d2b3c82037884b9"]');
    expect(elem.getText()).toEqual('Rwanda');
  });
  it ('Check sub-title Home on the World map', () => {
    let elem = element(by.css('div[class*="search-text"]>span'));
    expect(elem.getText()).toEqual('Home on the World map');
  });
  it('Check footer', () => {
    let footerLogo = element(by.css('p[class^="logo_name"]'));
    let footerGapminder = element(by.css('p[class^="logo_name"]+p'));
    let footerFacebookIcon = element(by.css('div[class="footer"] div[class*="facebook"]'));
    let footerTwitterIcon = element(by.css('div[class="footer"] div[class*="twitter"]'));
    let footerGoogleIcon = element(by.css('div[class="footer"] div[class*="google"]'));
    let footerLinkedinIcon = element(by.css('div[class="footer"] div[class*="linkedin"]'));
    let footerCreativeCommons = element(by.css('.col-md-3.col-sm-3.f-creative-commons>a>img'));
    expect(footerLogo.getText()).toEqual('DOLLAR STREET');
    expect(footerGapminder.getText()).toEqual('Powered by Gapminder');
    expect(footerFacebookIcon.isDisplayed()).toBe(true);
    expect(footerTwitterIcon.isDisplayed()).toBe(true);
    expect(footerGoogleIcon.isDisplayed()).toBe(true);
    expect(footerLinkedinIcon.isDisplayed()).toBe(true);
    expect(footerCreativeCommons.isDisplayed()).toBe(true);
  });
});
