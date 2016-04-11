/**
 * Created by vs on 4/6/16.
 */
describe('Photographers Page ', function() {
  //  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var searchField = element(by.css('#search'));
  var numPhotographers = element.all(by.css('.photographers-list>li'));
  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 10000;
  var zorianMiller = element(by.css('.photographer-card[href=/photographer?id=56ec0917af72e9437cbccf93]'));
  var message = 'Zorian Miller on PhotographersPage is not visibility';
  var photographerPortreit = element(by.css('.photographer-portrait'));
  var photographerMessage = 'Photographer portrait is not visible';
  var isClickable = EC.elementToBeClickable(zorianMiller);
  browser.manage().window().maximize();
  beforeAll(function() {
    browser.get('/photographers', 60000); //with timeout:will wait for loading page before 60 sec
    browser.wait(EC.visibilityOf(zorianMiller), TIMEOUT, message);
  });

  afterEach(function(){
    searchField.clear();
  });

 /* afterAll(function(){
    browser.close();
  });*/
  /* Enter query to Search field
   * Check visibility of photographers
   */

  it('test input bangladesh', function(){
    searchField.sendKeys('bangladesh\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input bolivia', function(){
    searchField.sendKeys('bolivia\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input bulgaria', function(){
    searchField.sendKeys('bulgaria\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input cambodia', function(){
    searchField.sendKeys('cambodia\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input china', function(){
    searchField.sendKeys('china\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input india', function(){
    searchField.sendKeys('india\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input latvia', function(){
    searchField.sendKeys('latvia\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input mexico', function(){
    searchField.sendKeys('mexico\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input nepal', function(){
    searchField.sendKeys('nepal\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
  });
  it('test input error data', function(){
    searchField.sendKeys('lalala\n');
    expect(numPhotographers.count()).toBe(0);
  });
  // Check quantity of photographers and countries

  it ('Countries', function(){
    browser.get('/photographers');
    var countries = element.all(by.css('.photographer-country'));
    browser.wait(isClickable, 50000);
    expect(countries.count()).toBe(43);
    expect(numPhotographers.count()).toBe(64);
  });
});
