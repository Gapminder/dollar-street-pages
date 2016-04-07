/**
 * Created by vs on 4/6/16.
 */
describe('Photographers Page ', function () {
  //  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var baseUrl;
  var searchField = element(by.xpath('.//*[@id=\'search\']'));
  var numElems = element.all(by.xpath('.//*[@id=\'photographers\']/div/div/div[1]/ul/li/div/ul/li'));
  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 10000;
  var zorianMiller = element(by.xpath('.//*[@id=\'photographers\']//h3[.=\'Zoriah Miller\']'));
  var message = 'Zorian Miller on PhotographersPage is not visibility';
  var photographerPortreit = element(by.xpath('.//*[@id=\'photographers\']//div[@class=\'photographer-portrait\']'));
  var photographerMessage = 'Photographer portrait is not visible';
  var isClickable = EC.elementToBeClickable(zorianMiller);

  baseUrl = 'http://consumer.dollarstreet.org/photographers';
  browser.manage().window().maximize();


  beforeAll(function () {
    browser.get(baseUrl);
    browser.wait(EC.visibilityOf(zorianMiller), TIMEOUT, message);
  });

  afterEach(function () {
    searchField.clear();
  });

  afterAll(function () {
    browser.close();
  });
  /* Enter query to Search field
   * Check visibility of photographers
   */

  it('test input bangladesh', function () {
    searchField.sendKeys('bangladesh\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input bolivia', function () {
    searchField.sendKeys('bolivia\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input bulgaria', function () {
    searchField.sendKeys('bulgaria\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input cambodia', function () {
    searchField.sendKeys('cambodia\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input china', function () {
    searchField.sendKeys('china\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input india', function () {
    searchField.sendKeys('india\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input latvia', function () {
    searchField.sendKeys('latvia\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input mexico', function () {
    searchField.sendKeys('mexico\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input nepal', function () {
    searchField.sendKeys('nepal\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input error data', function () {
    searchField.sendKeys('lalala\n');
    //  browser.wait(function() {
    //    return numElems.count();
    //// });
    expect(numElems.count()).toBe(0);
  });
  // Check quantity of photographers and countries

  it('Countries', function () {
    browser.get(baseUrl);
    var countries = element.all(by.xpath('.//*[@id=\'photographers\']//span[contains(@class, \'photographer-country\')]'));
    browser.wait(isClickable, 50000);
    expect(countries.count()).toBe(43);
    var photographers = element.all(by.xpath('.//*[@id=\'photographers\']/div/div/div[1]/ul/li/div/ul/li'));
    expect(photographers.count()).toBe(64);
  });

});
