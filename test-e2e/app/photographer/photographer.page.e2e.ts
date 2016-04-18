describe('Photographer Page ', function() {
  //  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var searchField = element(by.css('#search'));
  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 10000;
  var zorianMiller = element(by.css('.photographer-card[href="/photographer?id=56ec0917af72e9437cbccf93"]'));
  var photographerPortreit = element(by.css('.header>img'));
  var photographerMessage = 'Photographer portrait is not visible';
  var families = element(by.css('.family>h3'));
  var totalPhotos = element(by.css('.photo'));
  var namePhotographer = element.all(by.css('.header>h2')).first();
  var country = element(by.css('.place-country>p>span'));
  browser.manage().window().maximize();
  /* Open Photographers Page
   * Click on the Photographer
   * Check existence name, Visited Families, Photos, Videos
   */
  beforeEach(function() {
    browser.get('/photographers');
    browser.wait(EC.visibilityOf(zorianMiller), TIMEOUT, 'Zorian Miller on PhotographersPage is not visible');
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
    browser.wait(EC.visibilityOf(totalPhotos), TIMEOUT, 'Icon Total Photos on Photographer Page is not visible');
    browser.wait(EC.visibilityOf(country), TIMEOUT, 'Countries on Photographer Page are not visible');
    expect(namePhotographer.isDisplayed()).toBe(true);
    expect(families.isDisplayed()).toBe(true);
    expect(totalPhotos.isDisplayed()).toBe(true);
  });
});
