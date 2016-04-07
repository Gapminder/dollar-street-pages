/**
 * Created by vs on 4/5/16.
 */
describe('Dollar Street test', function () {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var baseUrl;
  var mainPage = element(by.xpath('.//*[@id=\'sitemap\']//a[.=\'Main page\']'));
  var matrixPage = element(by.xpath('.//*[@id=\'sitemap\']//a[.=\'Matrix page\']'));
  var placePage = element(by.xpath('.//*[@id=\'sitemap\']//a[.=\'Place page\']'));
  var mapPage = element(by.xpath('.//*[@id=\'sitemap\']//a[.=\'Map page\']'));
  var photographersPage = element(by.xpath('.//*[@id=\'sitemap\']//a[.=\'Photographers page\']'));
  var photographerPage = element(by.xpath('.//*[@id=\'sitemap\']//a[.=\'Photographer page\']'));
  var ambassadorsPage = element(by.xpath('.//*[@id=\'sitemap\']//a[.=\'Ambassadors page\']'));
  var countryPage = element(by.xpath('.//*[@id=\'sitemap\']//a[.=\'Country page\']'));
  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 60000;

  //  browser.manage().timeouts().pageLoadTimeout(90000);
  browser.manage().window().maximize();
  baseUrl = 'http://consumer.dollarstreet.org/sitemap';

    /* Click on every page on SiteMap */

  beforeEach(function () {
      browser.get(baseUrl);
    });

  it('OpenMainPage', function () {

      browser.wait(EC.visibilityOf(mainPage), TIMEOUT, 'MainPage is not visibility');
      mainPage.click();
      browser.wait(EC.visibilityOf(element(by.xpath('.//*[@id=\'concept\']//h2[.=\'Dollar Street\']'))), TIMEOUT, 'MainPage is not visibility');
    });
  it('OpenMatrixPage', function () {

      matrixPage.click();
      browser.wait(EC.visibilityOf(element(by.css('.search-title-thing-icon.pull-left.icon'))), TIMEOUT, 'MatrixPage is not visibility');
    });
  it('OpenPlacePage', function () {

      placePage.click();
      browser.wait(EC.visibilityOf(element(by.xpath('html/body/consumer-app/place/div[2]/slider-place/div/div[3]/div/div[2]/div[2]/div/div[1]/span'))), TIMEOUT, 'PlacePage is not visibility');
    });
  it('OpenMapPage', function () {
      mapPage.click();
      browser.wait(EC.visibilityOf(element(by.xpath('.//*[@id=\'places\']/div[1]/div[1]//img[@class=\'map-color\']'))), TIMEOUT, 'MapPage is not visibility');
    });
  it('OpenPhotographersPage', function () {
      photographersPage.click();
      browser.wait(EC.visibilityOf(element(by.xpath('.//*[@id=\'search\']'))), TIMEOUT, 'PhotographersPage is not visibility');
    });
  it('OpenPhotographerPage', function () {
      photographerPage.click();
       // browser.wait(EC.visibilityOf(element(by.xpath(".//*[@id='places']/div[1]/div[1]//img[@class='map-color']"))), 60000, "PhotographerPage is not visibility");
    });
  it('OpenAmbassadorsPage', function () {
      ambassadorsPage.click();
      browser.wait(EC.visibilityOf(element(by.xpath('.//h2[.=\'Teachers\']'))), TIMEOUT, 'AmbassadorsPage is not visibility');
    });
  it('OpenCountryPage', function () {
      countryPage.click();
      browser.wait(EC.visibilityOf(element(by.xpath('.//h2[.=\'Country\']'))), TIMEOUT, 'CountryPage is not visibility');
    });

   // afterAll(function() {
   //     browser.close();
 //   });

});

