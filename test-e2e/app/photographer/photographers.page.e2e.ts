'use strict';
describe('Photographers Page ', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  const searchField = $('#search');
  const numPhotographers = element.all(by.css('.photographers-list>li'));
  const EC = protractor.ExpectedConditions;
  const TIMEOUT = 10000;
  const zorianMiller = $('.photographer-card[href="/photographer?id=56ec0917af72e9437cbccf93"]');
  const message = 'Zorian Miller on PhotographersPage is not loaded';
  const photographerPortreit = $('.photographer-portrait');
  const photographerMessage = 'Photographer portrait is not loaded';
  const isClickableLastPhotographerLink = EC.elementToBeClickable(zorianMiller);
  const country = $('.country-card>div>span');
  const photosIcon = element.all(by.css('.photographer-material>span>i[class*="fa-camera"]'));
  const homesIcon = element.all(by.css('.photographer-material>span>img'));
  browser.manage().window().maximize();
  browser.manage().timeouts().pageLoadTimeout(30000);
  browser.ignoreSynchronization = true;

  beforeAll(() => {
    browser.get('/photographers', 10000);
    browser.wait(EC.visibilityOf(zorianMiller), TIMEOUT, message);
  });
  beforeEach(() => {
    browser.wait(EC.invisibilityOf($('.loader>img')));
  });
  /* Enter query to Search field
   * Check visibility of photographers
   * Check icons with guantity Photos, videos, Homes at the first Photographer
   */
  it('test input bangladesh', () => {
    searchField.sendKeys('bang\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
    searchField.clear();
  });
  it('test check icons with guantity Photos, videos, Homes at the first Photographer', () => {
    browser.wait(EC.visibilityOf(country));
    browser.wait(EC.visibilityOf(photosIcon.first()));
    browser.wait(EC.visibilityOf(homesIcon.first()));
    expect(country.isDisplayed()).toBe(true);
    expect(photosIcon.first().isDisplayed()).toBe(true);
    expect(homesIcon.first().isDisplayed()).toBe(true);
  });
  it('test check icons with guantity Photos, videos, Homes at the last Photographer', () => {
    browser.wait(EC.visibilityOf(country));
    browser.wait(EC.visibilityOf(photosIcon.last()));
    browser.wait(EC.visibilityOf(homesIcon.last()));
    expect(country.isDisplayed()).toBe(true);
    expect(photosIcon.last().isDisplayed()).toBe(true);
    expect(homesIcon.last().isDisplayed()).toBe(true);
  });
  it ('Countries', () => {
    browser.get('/photographers');
    let countries = element.all(by.css('.photographer-country'));
    browser.wait(isClickableLastPhotographerLink, 10000);
    expect(countries.count()).toBe(46);
    expect(numPhotographers.count()).toBe(66);
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
