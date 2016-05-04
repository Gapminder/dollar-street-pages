'use strict';
describe('Photographer Page ', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  const searchField = $('#search');
  const EC = protractor.ExpectedConditions;
  const TIMEOUT = 10000;
  const zorianMiller = $('.photographer-card[href="/photographer?id=56ec0917af72e9437cbccf93"]');
  const photographerPortreit = $('.header>img');
  const photographerMessage = 'Photographer portrait is not loaded';
  const families = $('.family>h3');
  const totalPhotos = $('.photo');
  const namePhotographer = element.all(by.css('.header>h2')).first();
  const country = $('.place-country>p>span');
  browser.manage().window().maximize();
  browser.manage().timeouts().pageLoadTimeout(75000);
  browser.ignoreSynchronization = true;
  /* Open Photographers Page
   * Click on the Photographer
   * Check existence name, Visited Families, Photos, Videos
   */
  beforeEach(() => {
    browser.get('/photographers');
    browser.wait(EC.visibilityOf(zorianMiller), TIMEOUT, 'Zorian Miller on PhotographersPage is not loaded');
  });
  afterEach (() => {
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
    browser.wait(EC.visibilityOf(totalPhotos), TIMEOUT, 'Icon Total Photos on Photographer Page is not loaded');
    browser.wait(EC.visibilityOf(country), TIMEOUT, 'Countries on Photographer Page are not loaded');
    expect(namePhotographer.isDisplayed()).toBe(true);
    expect(families.isDisplayed()).toBe(true);
    expect(totalPhotos.isDisplayed()).toBe(true);
  });
  it('test AJ SHARMA', () => {
    searchField.sendKeys('SHARMA' + '\n');
    $('.photographer-card>h3').click();
  });
  it('test Anna Graboowska', () => {
    browser.get('/photographer?id=56ec0914af72e9437cbccf86', TIMEOUT);
  });
  it('test Zoriah Miller', () => {
    browser.get('/photographer?id=56ec0917af72e9437cbccf93', TIMEOUT);
  });
  afterAll(('Check footer', () => {
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
  }));
});
