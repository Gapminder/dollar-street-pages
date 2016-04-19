describe('Photographer Page ', function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var searchField = element(by.css('#search'));
  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 10000;
  var zorianMiller = element(by.css('.photographer-card[href="/photographer?id=56ec0917af72e9437cbccf93"]'));
  var photographerPortreit = element(by.css('.header>img'));
  var photographerMessage = 'Photographer portrait is not loaded';
  var families = element(by.css('.family>h3'));
  var totalPhotos = element(by.css('.photo'));
  var namePhotographer = element.all(by.css('.header>h2')).first();
  var country = element(by.css('.place-country>p>span'));
  browser.manage().window().maximize();
  browser.manage().timeouts().pageLoadTimeout(75000);
  /* Open Photographers Page
   * Click on the Photographer
   * Check existence name, Visited Families, Photos, Videos
   */
  beforeEach(function() {
    browser.get('/photographers');
    browser.wait(EC.visibilityOf(zorianMiller), TIMEOUT, 'Zorian Miller on PhotographersPage is not loaded');
  });
  it('test AJ SHARMA', function() {
    searchField.sendKeys('SHARMA' + '\n');
    element(by.css('.photographer-card>h3')).click();
  });
  it('test Anna Graboowska', function() {
    browser.get('/photographer?id=56ec0914af72e9437cbccf86', TIMEOUT);
  });
  it('test Zoriah Miller', function() {
    browser.get('/photographer?id=56ec0917af72e9437cbccf93', TIMEOUT);
  });
 /* it('test Luc Forsyth', function() {
    browser.get('/photographer?id=56ec0918af72e9437cbccf97', TIMEOUT);
  });
  it('test Jonathan Taylor', function() {
    browser.get('/photographer?id=56e946bed360263447ff6f96', TIMEOUT);
  });
  it('test Abhineet Malhotra', function() {
    browser.get('/photographer?id=56e946c0d360263447ff6f9d', TIMEOUT);
  });
  it('test Konstatins Sigulis', function() {
    browser.get('/photographer?id=56e946c5d360263447ff6fae', TIMEOUT);
  });*/
  afterEach (function check() {
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
    browser.wait(EC.visibilityOf(totalPhotos), TIMEOUT, 'Icon Total Photos on Photographer Page is not loaded');
    browser.wait(EC.visibilityOf(country), TIMEOUT, 'Countries on Photographer Page are not loaded');
    expect(namePhotographer.isDisplayed()).toBe(true);
    expect(families.isDisplayed()).toBe(true);
    expect(totalPhotos.isDisplayed()).toBe(true);
  });
  afterAll(function () {
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
