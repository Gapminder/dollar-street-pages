'use strict';
describe('Main Page test', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  const frontDoors = element.all(by.css('.concept_things_menu>ul>li>span')).get(0);
  const homes = element.all(by.css('.concept_things_menu>ul>li>span')).get(1);
  const sofas = element.all(by.css('.concept_things_menu>ul>li>span')).get(2);
  const stoves = element.all(by.css('.concept_things_menu>ul>li>span')).get(3);
  const toilets = element.all(by.css('.concept_things_menu>ul>li>span')).get(4);
  const seeAll = element(by.css('#concept a'));
  const allFamilies = element(by.css('#places a'));
  const acrossTheWorld = element(by.css('.concept-header-thing-title.pull-right>p'));
  const EC = protractor.ExpectedConditions;
  const TIMEOUT = 20000;
  browser.manage().window().maximize();
  browser.manage().timeouts().pageLoadTimeout(75000);
  /* Click on every page on Main Page
   * Check every sub-menu: Front doors, homes, sofas, stoves, toilets
   * Check sub-header of every sub-menu: Front doors across the World
   * Check link See all of every sub-menu
   * Check link All Families*/
  afterEach(() => {
    browser.wait(EC.visibilityOf(acrossTheWorld));
    browser.wait(EC.visibilityOf(allFamilies));
  });
  it('CheckAndOpenFrontDoors', () => {
    browser.get('/main');
    browser.sleep(4000);
    browser.wait(EC.visibilityOf(frontDoors), TIMEOUT, 'Element FrontDors on MainPage is not visible');
    browser.wait(EC.visibilityOf(homes), TIMEOUT, 'Element Homes on MainPage is not visible');
    browser.wait(EC.visibilityOf(sofas), TIMEOUT, 'Element Sofas on MainPage is not visible');
    browser.wait(EC.visibilityOf(stoves), TIMEOUT, 'Element Stoves on MainPage is not visible');
    browser.wait(EC.visibilityOf(toilets), TIMEOUT, 'Element Toilets on MainPage is not visible');
    frontDoors.click();
    browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'See all on MainPage is not visible');
    browser.wait(EC.visibilityOf(element(by.css('.concept-header-thing-title.pull-right>p'))));
  });
  it('CheckAndOpenHomes', () => {
    homes.click();
    browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'See all on MainPage is not visible');
  });
  it('CheckAndOpenSofas', () => {
    sofas.click();
    browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Sofas on MainPage is not loaded');
  });
  it('CheckAndOpenStoves', () => {
    stoves.click();
    browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Stoves on MainPage is not loaded');
  });
  it('CheckAndOpenToilets', () => {
    toilets.click();
    browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Toilets on MainPage is not loaded');
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
