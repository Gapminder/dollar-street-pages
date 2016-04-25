'use strict';
describe('Dollar Street test - map', () => {
 jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  const mainPage = element(by.css('#sitemap>li>a[href*="main"]'));
  const matrixPage = element(by.css('#sitemap>li>a[href*="matrix"]'));
  const placePage = element(by.css('#sitemap>li>a[href*="place"]'));
  const mapPage = element(by.css('#sitemap>li>a[href^="/map"]'));
  const photographersPage = element(by.css('#sitemap>li>a[href*="photographers"]'));
  const photographerPage = element(by.css('#sitemap>li>a[href*="photographer?"]'));
  const ambassadorsPage = element(by.css('#sitemap>li>a[href*="ambass"]'));
  const countryPage = element(by.css('#sitemap>li>a[href*="country"]'));
  const EC = protractor.ExpectedConditions;
  const TIMEOUT = 10000;
  browser.manage().window().maximize();
  browser.manage().timeouts().pageLoadTimeout(75000);
  /* Click on every page on SiteMap */
  beforeEach(function() {
    browser.get('/sitemap');
  });
  it('OpenMainPage', () => {
    browser.wait(EC.visibilityOf(mainPage), TIMEOUT, 'MainPage is not loaded');
    mainPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.concept_header.col-md-12>h2'))), TIMEOUT, 'MainPage is not loaded');
  });
  it('OpenMatrixPage', () => {
    matrixPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.search-title-thing-icon.pull-left.icon'))), TIMEOUT, 'MatrixPage is not loaded');
  });
  it('OpenPlacePage', () => {
    placePage.click();
    browser.wait(EC.visibilityOf(element(by.css('.photographer'))), TIMEOUT, 'PlacePage is not loaded');
  });
  it('OpenMapPage', () => {
    mapPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.mapBoxContainer>img.map-color'))), TIMEOUT, 'MapPage is not loaded');
  });
  it('OpenPhotographersPage', () => {
    photographersPage.click();
    browser.wait(EC.visibilityOf(element(by.css('#search'))), TIMEOUT, 'PhotographersPage is not loaded');
  });
  it('OpenPhotographerPage', () => {
    photographerPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.heading'))), TIMEOUT, 'PhotographerPage is not loaded');
  });
  it('OpenAmbassadorsPage', () => {
    ambassadorsPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.ambassadors-peoples>h2:nth-of-type(1)'))), TIMEOUT, 'AmbassadorsPage is not loaded');
  });
  it('OpenCountryPage', () => {
    countryPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.heading'))), TIMEOUT, 'CountryPage is not loaded');
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



