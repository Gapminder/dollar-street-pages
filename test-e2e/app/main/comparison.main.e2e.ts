'use strict';
describe('Main Page test', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  const homesInHeader = $('div[class*="menu"]>a[href*="matrix"]');
  const mapInHeader = $('div[class*="menu"]>a[href^="/map"]');
  const photographersInHeader = $('div[class*="menu"]>a[href*="photographers"]');
  const ambassadorsInHeader = $('div[class*="menu"]>a[href*="ambassadors"]');
  const sitemapInHeader = $('div[class*="menu"]>a[href*="sitemap"]');
  const EC = protractor.ExpectedConditions;
  const TIMEOUT = 20000;
  browser.manage().window().maximize();
  browser.manage().timeouts().pageLoadTimeout(75000);
  browser.ignoreSynchronization = true;

  beforeAll(() => {
    browser.get('/main');
    browser.sleep(3500);
  });
  it ('Check the Link Texts on Header', () => {
    expect(homesInHeader.getText()).toEqual('Homes');
    expect(mapInHeader.getText()).toEqual('Map');
    expect(photographersInHeader.getText()).toEqual('Photographers');
    expect(ambassadorsInHeader.getText()).toEqual('Ambassadors');
    expect(sitemapInHeader.getText()).toEqual('Sitemap');
  });
  it ('Check social icons on the header', () => {
    let facebookIconHeader = $('div[class*="header"] .fa.fa-facebook');
    let twitterIconHeader = $('div[class*="header"] .fa.fa-twitter');
    let googleIconHeader = $('div[class*="header"] .fa.fa-google-plus');
    let linkedinIconHeader = $('div[class*="header"] .fa.fa-linkedin');
    expect(facebookIconHeader.isDisplayed()).toBe(true);
    expect(twitterIconHeader.isDisplayed()).toBe(true);
    expect(googleIconHeader.isDisplayed()).toBe(true);
    expect(linkedinIconHeader.isDisplayed()).toBe(true);
  });
  it ('Check sub-headers', () => {
    let welcome = $('div[class*="welcome-header"]>h1');
    expect(welcome.getText()).toEqual('Welcome to Dollar Street');
    let about = $('div[class*="about-header"]>h2');
    expect(about.getText()).toEqual('ABOUT');
    let similarities = $('div[class*="similarities"]>h2');
    expect(similarities.getText()).toEqual('SIMILARITIES');
  });
  it ('Check visibility images and videos', () => {
    let wayWithHomes = $('.description.col-md-12>img');
    expect(wayWithHomes.isDisplayed()).toBe(true);
    let video = $('.video-content>p');
    expect(video.isDisplayed()).toBe(true);
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
