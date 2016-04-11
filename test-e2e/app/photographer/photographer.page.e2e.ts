/**
 * Created by vs on 11/4/16.
 */
describe('Photographers Page ', function() {
  //  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var searchField = element(by.css('#search'));
  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 10000;
  var zorianMiller = element(by.css('.photographer-card[href=/photographer?id=56ec0917af72e9437cbccf93]'));
  var message = 'Zorian Miller on PhotographersPage is not visibility';
  var photographerPortreit = element(by.css('.photographer-portrait'));
  var photographerMessage = 'Photographer portrait is not visible';
  var country = element(by.css('.family>h3'));
  var totalPhotos = element(by.css('.photo'));
  var totalVideos = element(by.css('.camera'));
  var namePhotographer = element(by.css('.header>h2'));
  browser.manage().window().maximize();
  beforeEach(function() {
    browser.get('/photographers');
    browser.wait(EC.visibilityOf(zorianMiller), TIMEOUT, message);
  });
  afterEach (function check() {
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
    photographerPortreit.click();
    browser.isElementPresent(namePhotographer);
    browser.isElementPresent(country);
    browser.isElementPresent(totalPhotos);
    browser.isElementPresent(totalVideos);
  });
  /*afterAll(function() {
    browser.close();
  });*/
  /* Open Photographers Page
   * Click on the Photographer
   * Check existence name, Visited Families, Photos, Videos
   */
  it('test AJ SHARMA', function() {
    searchField.sendKeys('AJ SHARMA' + '\n');
  });
  it('test Anna Graboowska', function() {
    searchField.sendKeys('Anna Graboowska' + '\n');
  });
  it('test Zoriah Miller', function() {
    searchField.sendKeys('Zoriah Miller' + '\n');
  });
  it('test Luc Forsyth', function() {
    searchField.sendKeys('Luc Forsyth' + '\n');
  });
  it('test Jonathan Taylor', function() {
    searchField.sendKeys('Jonathan Taylor' + '\n');
  });
  it('test Abhineet Malhotra', function() {
    searchField.sendKeys('Abhineet Malhotra' + '\n');
  });
  it('test Konstatins Sigulis', function() {
    searchField.sendKeys('Konstatins Sigulis\n');
  });
  it('test Jose Ramirez', function() {
    searchField.sendKeys('Jose Ramirez\n');
  });
});
