/**
 * Created by vs on 4/5/16.
 */
describe('Dollar Street test - map', function() {
 jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var mainPage = element(by.css('#sitemap>li>a[href*="main"]'));
  var matrixPage = element(by.css('#sitemap>li>a[href*="matrix"]'));
  var placePage = element(by.css('#sitemap>li>a[href*="place"]'));
  var mapPage = element(by.css('#sitemap>li>a[href^="/map"]'));
  var photographersPage = element(by.css('#sitemap>li>a[href*="photographers"]'));
  var photographerPage = element(by.css('#sitemap>li>a[href*="photographer?"]'));
  var ambassadorsPage = element(by.css('#sitemap>li>a[href*="ambass"]'));
  var countryPage = element(by.css('#sitemap>li>a[href*="country"]'));
  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 10000;
  browser.manage().window().maximize();
  browser.manage().timeouts().pageLoadTimeout(75000);
  /* Click on every page on SiteMap */
  beforeEach(function() {
    browser.get('/sitemap');
  });
  it('OpenMainPage', function () {
    browser.wait(EC.visibilityOf(mainPage), TIMEOUT, 'MainPage is not loaded');
    mainPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.concept_header.col-md-12>h2'))), TIMEOUT, 'MainPage is not loaded');
  });
  it('OpenMatrixPage', function () {
    matrixPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.search-title-thing-icon.pull-left.icon'))), TIMEOUT, 'MatrixPage is not loaded');
  });
  it('OpenPlacePage', function () {
    placePage.click();
    browser.wait(EC.visibilityOf(element(by.css('.photographer'))), TIMEOUT, 'PlacePage is not loaded');
  });
  it('OpenMapPage', function () {
    mapPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.mapBoxContainer>img.map-color'))), TIMEOUT, 'MapPage is not loaded');
  });
  it('OpenPhotographersPage', function () {
    photographersPage.click();
    browser.wait(EC.visibilityOf(element(by.css('#search'))), TIMEOUT, 'PhotographersPage is not loaded');
  });
  it('OpenPhotographerPage', function () {
    photographerPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.heading'))), TIMEOUT, 'PhotographerPage is not loaded');
  });
  it('OpenAmbassadorsPage', function () {
    ambassadorsPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.ambassadors-peoples>h2:nth-of-type(1)'))), TIMEOUT, 'AmbassadorsPage is not loaded');
  });
  it('OpenCountryPage', function () {
    countryPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.heading'))), TIMEOUT, 'CountryPage is not loaded');
  });
  /*afterAll(function() {
    browser.close();
  });
*/
  afterAll(function () {
    var footerLogo = element(by.css('p[class^="logo_name"]'));
    var footerGapminder = element(by.css('p[class^="logo_name"]+p'));
    expect(footerLogo.getText()).toEqual('DOLLAR STREET');
    expect(footerGapminder.getText()).toEqual('Powered by Gapminder');
  });
});



