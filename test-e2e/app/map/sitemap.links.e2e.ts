'use strict';
describe('Dollar Street sitemap', () => {
 jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  const mainPage = $('#sitemap>li>a[href*="main"]');
  const matrixPage = $('#sitemap>li>a[href*="matrix"]');
  const placePage = $('#sitemap>li>a[href*="place"]');
  const mapPage = $('#sitemap>li>a[href^="/map"]');
  const photographersPage = $('#sitemap>li>a[href*="photographers"]');
  const photographerPage = $('#sitemap>li>a[href*="photographer?"]');
  const ambassadorsPage = $('#sitemap>li>a[href*="ambass"]');
  const countryPage = $('#sitemap>li>a[href*="country"]');
  const EC = protractor.ExpectedConditions;
  const TIMEOUT = 10000;
  browser.manage().window().maximize();
  browser.manage().timeouts().pageLoadTimeout(75000);
  browser.ignoreSynchronization = true;
  /* Click on every page on SiteMap */
  beforeEach(function() {
    browser.get('/sitemap');
  });
  it('OpenMainPage', () => {
    browser.wait(EC.visibilityOf(mainPage), TIMEOUT, 'MainPage is not loaded');
    mainPage.click();
    browser.wait(EC.visibilityOf($('div[class*="menu pull-left"]>a[href*="matrix"]')), TIMEOUT, 'MainPage is not loaded');
  });
  it('OpenMatrixPage', () => {
    matrixPage.click();
    browser.wait(EC.visibilityOf($('.search-title-thing-icon.pull-left.icon')), TIMEOUT, 'MatrixPage is not loaded');
  });
  it('OpenPlacePage', () => {
    placePage.click();
    browser.wait(EC.visibilityOf($('.photographer')), TIMEOUT, 'PlacePage is not loaded');
  });
  it('OpenMapPage', () => {
    mapPage.click();
    browser.wait(EC.visibilityOf($('.mapBoxContainer>img.map-color')), TIMEOUT, 'MapPage is not loaded');
  });
  it('OpenPhotographersPage', () => {
    photographersPage.click();
    browser.wait(EC.visibilityOf($('#search')), TIMEOUT, 'PhotographersPage is not loaded');
  });
  it('OpenPhotographerPage', () => {
    photographerPage.click();
    browser.wait(EC.visibilityOf($('.heading')), TIMEOUT, 'PhotographerPage is not loaded');
  });
  it('OpenAmbassadorsPage', () => {
    ambassadorsPage.click();
    browser.wait(EC.visibilityOf($('.ambassadors-peoples>h2:nth-of-type(1)')), TIMEOUT, 'AmbassadorsPage is not loaded');
  });
  it('OpenCountryPage', () => {
    countryPage.click();
    browser.wait(EC.visibilityOf($('.heading')), TIMEOUT, 'CountryPage is not loaded');
  });
  it('Check footer', () => {
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



