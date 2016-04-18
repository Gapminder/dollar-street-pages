/**
 * Created by vs on 13/4/16.
 */
describe('Map Page ', function() {

  var countryLink = new Array();
  countryLink = element.all(by.css('.country-name'));
  var mapImg = element(by.css('.map-color'));
  var iconHomes = element(by.css('.home>img'));
  var messageAboutMap = 'Map can not continue loading';
  var messageAboutCountryLink = 'Page can not loading';
  var searchButton = element(by.css('.matrix-search-button>img'));
  var searchField = element(by.css('#search'));
  var itemsAroundTheWorld = element.all(by.css('.search-item-name')).last();
  var countryLetter = element.all(by.css('.country-letter'));

  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 10000;
  browser.manage().window().maximize();
  //browser.manage().timeouts().pageLoadTimeout(10000);
  /*
   Open Map Link
   Click on every Link with Country
   Write the Text to Colsole about checked link
   */

  /*   beforeEach(function(done){ //TODO This code need for starting tests on Mozilla Firefox. Start
   browser.get('/map');
   browser.waitForAngular();
   $('body').isPresent().then(function() {
   done();
   }, function (){
   done();
   });
   browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
   }); //TODO This code need for starting tests on Mozilla Firefox. Finish*/

  beforeEach(function(){ //TODO This code need for starting tests on Chrome. Start
    browser.get('/map');
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
  }); //TODO This code need for starting tests on Chrome. Finish

  it ('Check country Bangladesh', function () {
    var elem = element.all(by.css('span[class*="country-name"]')).first();
    expect(elem.getText()).toEqual('Bangladesh');
  });

  it ('Check country Colombia', function () {
    var elem = element.all(by.css('span[class*="country-name"]')).get(7);
    expect(elem.getText()).toEqual('Colombia');
  });

  it ('Check country Indonesia', function () {
    var elem = element.all(by.css('span[class*="country-name"]')).get(13);
    expect(elem.getText()).toEqual('Indonesia');
  });

  it ('Check country Malawi', function () {
    var elem = element.all(by.css('span[class*="country-name"]')).get(20);
    expect(elem.getText()).toEqual('Malawi');
  });

  it ('Check country South Korea', function () {
    var elem = element.all(by.css('span[class*="country-name"]')).get(30);
    expect(elem.getText()).toEqual('South Korea');
  });

  it ('Check name of logo Dollar Street', function () {
    var elem = element(by.css('p[class*="logo_name"]'));
    expect(elem.getText()).toEqual('DOLLAR STREET');
  });
  it ('Check sub-title Home on the World map', function () {
    var elem = element(by.css('div[class*="search-text"]>span'));
    expect(elem.getText()).toEqual('Home on the World map');
  });

  /* it('Click on every link with country 0 - 5', function () {
   for (var i = 0; i < 5; i++) {
   countryLink.get(i).click();
   browser.getCurrentUrl().then(function (text) {
   console.log(text + ' checking');
   });
   //browser.driver.sleep(1000);
   browser.wait(EC.visibilityOf(iconHomes), TIMEOUT, messageAboutCountryLink + ' the ' + i + '-th country');
   browser.getCurrentUrl().then(function (text) {
   console.log(' checked ok');
   });}
   browser.get('/map');

   });
   it('Click on every link with country 35 - 41', function () {
   for (var i = 35; i < 41; i++) {
   countryLink.get(i).click();
   browser.getCurrentUrl().then(function (text) {
   console.log(text + ' checking');
   });
   browser.wait(EC.visibilityOf(iconHomes), TIMEOUT, messageAboutCountryLink + ' the ' + i + '-th country');
   browser.getCurrentUrl().then(function (text) {
   console.log(' checked ok');
   });}
   browser.get('/map');
   browser.waitForAngular();
   });*/

  it ('Checking search field and search result using keyword Cows', function () {
    searchButton.click();
    searchField.sendKeys('Cows\n');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Fruit tree ', function () {
    searchButton.click();
    searchField.sendKeys('fruit\n');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Dish washing soap ', function () {
    searchButton.click();
    searchField.sendKeys('soap\n');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Meat ', function () {
    searchButton.click();
    searchField.sendKeys('meat\n');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Teeth ', function () {
    searchButton.click();
    searchField.sendKeys('teeth\n');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Earings ', function () {
    searchButton.click();
    searchField.sendKeys('ear\n');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Trash ', function () {
    searchButton.click();
    searchField.sendKeys('trash\n');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Books ', function () {
    searchButton.click();
    searchField.sendKeys('books\n');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
});
