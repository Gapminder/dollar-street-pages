/**
 * Created by vs on 4/5/16.
 */
describe('Dollar Street test', function() {
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
  var TIMEOUT = 60000;
  //  browser.manage().timeouts().pageLoadTimeout(90000);
  browser.manage().window().maximize();
  /* Click on every page on SiteMap */
  beforeEach(function() {
    browser.get('/sitemap');
  });
  it('OpenMainPage', function () {
    browser.wait(EC.visibilityOf(mainPage), TIMEOUT, 'MainPage is not visibility');
    mainPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.concept_header.col-md-12>h2'))), TIMEOUT, 'MainPage is not visibility');
  });
  it('OpenMatrixPage', function () {
    matrixPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.search-title-thing-icon.pull-left.icon'))), TIMEOUT, 'MatrixPage is not visibility');
  });
  it('OpenPlacePage', function () {
    placePage.click();
    browser.wait(EC.visibilityOf(element(by.css('.photographer'))), TIMEOUT, 'PlacePage is not visibility');
  });
  it('OpenMapPage', function () {
    mapPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.mapBoxContainer>img.map-color'))), TIMEOUT, 'MapPage is not visibility');
  });
  it('OpenPhotographersPage', function () {
    photographersPage.click();
    browser.wait(EC.visibilityOf(element(by.css('#search'))), TIMEOUT, 'PhotographersPage is not visibility');
  });
  it('OpenPhotographerPage', function () {
    photographerPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.heading'))), TIMEOUT, 'PhotographerPage is not visibility');
  });
  it('OpenAmbassadorsPage', function () {
    ambassadorsPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.ambassadors-peoples>h2:nth-of-type(1)'))), TIMEOUT, 'AmbassadorsPage is not visibility');
  });
  it('OpenCountryPage', function () {
    countryPage.click();
    browser.wait(EC.visibilityOf(element(by.css('.heading'))), TIMEOUT, 'CountryPage is not visibility');
  });
  /*afterAll(function() {
    browser.close();
  });
*/
});



