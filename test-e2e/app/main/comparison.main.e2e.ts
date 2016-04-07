/**
 * Created by vs on 4/5/16.
 */
describe('Main Page test', function () {
  //  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var baseUrl;
  var frontDoors = element(by.xpath('.//*[@id=\'concept\']//span[.=\'Front doors\']'));
  var homes = element(by.xpath('.//*[@id=\'concept\']//span[.=\'Homes\']'));
  var sofas = element(by.xpath('.//*[@id=\'concept\']//span[.=\'Sofas\']'));
  var stoves = element(by.xpath('.//*[@id=\'concept\']//span[.=\'Stoves\']'));
  var toilets = element(by.xpath('.//*[@id=\'concept\']//span[.=\'Toilets\']'));
  var seeAll = element(by.xpath('.//*[@id=\'concept\']//a'));
  var allFamilies = element(by.xpath('.//*[@id=\'places\']//a[@class=\'see_more\']'));
  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 60000;

  baseUrl = 'http://consumer.dollarstreet.org/main';
  browser.manage().window().maximize();

    /* Click on every page on Main Page
    * Check every sub-menu: Front doors, homes, sofas, stoves, toilets
    * Check sub-header of every sub-menu: Front doors across the World
    * Check link See all of every sub-menu
    * Check link All Families*/

  afterEach(function () {
      browser.wait(EC.visibilityOf(allFamilies));
    });

  it('CheckAndOpenFrontDoors', function () {

      browser.get(baseUrl);
      browser.wait(EC.visibilityOf(frontDoors), TIMEOUT, 'Element FrontDors on MainPage is not visibility');
      browser.wait(EC.visibilityOf(homes), TIMEOUT, 'Element FrontDors on MainPage is not visibility');
      browser.wait(EC.visibilityOf(sofas), TIMEOUT, 'Element FrontDors on MainPage is not visibility');
      browser.wait(EC.visibilityOf(stoves), TIMEOUT, 'Element FrontDors on MainPage is not visibility');
      browser.wait(EC.visibilityOf(toilets), TIMEOUT, 'Element FrontDors on MainPage is not visibility');
      frontDoors.click();
      browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Front Doors on MainPage is not visibility');
      browser.wait(EC.visibilityOf(element(by.xpath('.//*[@id=\'concept\']//p[.=\'Front doors across the World\']'))));
    });

  it('CheckAndOpenHomes', function () {
      homes.click();
      browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Homes on MainPage is not visibility');
      browser.wait(EC.visibilityOf(element(by.xpath('.//*[@id=\'concept\']//p[.=\'Homes across the World\']'))));
    });

  it('CheckAndOpenSofas', function () {
      sofas.click();
      browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Sofas on MainPage is not visibility');
      browser.wait(EC.visibilityOf(element(by.xpath('.//*[@id=\'concept\']//p[.=\'Sofas across the World\']'))));
    });

  it('CheckAndOpenStoves', function () {
      stoves.click();
      browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Stoves on MainPage is not visibility');
      browser.wait(EC.visibilityOf(element(by.xpath('.//*[@id=\'concept\']//p[.=\'Stoves across the World\']'))));
    });

  it('CheckAndOpenToilets', function () {
      toilets.click();
      browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Toilets on MainPage is not visibility');
      browser.wait(EC.visibilityOf(element(by.xpath('.//*[@id=\'concept\']//p[.=\'Toilets across the World\']'))));
    });

  //  afterAll(function(){
  //      browser.close();
  //  });

});
