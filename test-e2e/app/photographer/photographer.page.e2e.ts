/**
 * Created by vs on 11/4/16.
 */
describe('Photographers Page ', function() {
  //  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var searchField = element(by.css('#search'));
  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 10000;
  var zorianMiller = element(by.css('.photographer-card[href="/photographer?id=56e946bed360263447ff6f95"]'));
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
    /*browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
    photographerPortreit.click();*/
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
    browser.get('/photographer?id=56ec091caf72e9437cbccfab');
  });
  it('test Zoriah Miller', function() {
    browser.get('/photographer?id=56ec0917af72e9437cbccf93');
  });
  it('test Luc Forsyth', function() {
    browser.get('/photographer?id=56ec0918af72e9437cbccf97');
  });
  it('test Jonathan Taylor', function() {
    browser.get('/photographer?id=56ec0917af72e9437cbccf94');
  });
  it('test Abhineet Malhotra', function() {
    browser.get('/photographer?id=56ec0919af72e9437cbccf9b');
  });
  it('test Konstatins Sigulis', function() {
    browser.get('/photographer?id=56ec091caf72e9437cbccfac');
  });
  /*it('test Jose Ramirez', function() {
    searchField.sendKeys('Jose Ramirez\n');
  });*/
});
