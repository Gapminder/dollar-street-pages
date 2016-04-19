/**
 * Created by vs on 13/4/16.
 */
describe('Map Page ', function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var countryLink = new Array();
  countryLink = element.all(by.css('.country-name'));
  var mapImg = element(by.css('.map-color'));
  var iconHomes = element(by.css('.home>img'));
  var messageAboutMap = 'Map is not loaded';
  var messageAboutCountryLink = 'Page is not loaded';
  var searchButton = element(by.css('.matrix-search-button>img'));
  var searchField = element(by.css('#search'));
  var itemsAroundTheWorld = element.all(by.css('.search-item-name')).last();
  var countryLetter = element.all(by.css('.country-letter'));
  var country = element.all(by.css('span[class*="country-name"]'));

  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 5000;
  browser.manage().window().maximize();
  browser.manage().timeouts().pageLoadTimeout(75000);
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
    browser.sleep(2000);
    var elem = country.first();
    expect(elem.getText()).toEqual('Bangladesh');
  });

  it ('Check country Colombia', function () {
    var elem = country.get(7);
    expect(elem.getText()).toEqual('Colombia');
  });

  it ('Check country Indonesia', function () {
    var elem = country.get(13);
    expect(elem.getText()).toEqual('Indonesia');
  });

  it ('Check country Malawi', function () {
    var elem = country.get(20);
    expect(elem.getText()).toEqual('Malawi');
  });

  it ('Check country South Korea', function () {
    var elem = country.get(30);
    expect(elem.getText()).toEqual('South Korea');
  });

  it ('Check sub-title Home on the World map', function () {
    browser.sleep(1000);
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

  it ('Checking search field and search result using keyword Cows ', function () {
    browser.wait(EC.elementToBeClickable(searchButton), TIMEOUT, 'SearchButton is not clickable');
    searchButton.click();
    searchField.sendKeys('Cows\n');
    browser.wait(EC.elementToBeClickable(itemsAroundTheWorld), TIMEOUT, 'Element is not clickable');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Fruit ', function () {
    browser.wait(EC.elementToBeClickable(searchButton), TIMEOUT, 'SearchButton is not clickable');
    searchButton.click();
    searchField.sendKeys('frui\n');
    browser.wait(EC.elementToBeClickable(itemsAroundTheWorld), TIMEOUT, 'Element is not clickable');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Dish ', function () {
    browser.wait(EC.elementToBeClickable(searchButton), TIMEOUT, 'SearchButton is not clickable');
    searchButton.click();
    searchField.sendKeys('soa\n');
    browser.wait(EC.elementToBeClickable(itemsAroundTheWorld), TIMEOUT, 'Element is not clickable');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Meat ', function () {
    browser.wait(EC.elementToBeClickable(searchButton), TIMEOUT, 'SearchButton is not clickable');
    searchButton.click();
    searchField.sendKeys('meat\n');
    browser.wait(EC.elementToBeClickable(itemsAroundTheWorld), TIMEOUT, 'Element is not clickable');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Teeth ', function () {
    browser.wait(EC.elementToBeClickable(searchButton), TIMEOUT, 'SearchButton is not clickable');
    searchButton.click();
    searchField.sendKeys('eth\n');
    browser.wait(EC.elementToBeClickable(itemsAroundTheWorld), TIMEOUT, 'Element is not clickable');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Earings ', function () {
    browser.wait(EC.elementToBeClickable(searchButton), TIMEOUT, 'SearchButton is not clickable');
    searchButton.click();
    searchField.sendKeys('ear\n');
    browser.wait(EC.elementToBeClickable(itemsAroundTheWorld), TIMEOUT, 'Element is not clickable');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Trash ', function () {
    browser.wait(EC.elementToBeClickable(searchButton), TIMEOUT, 'SearchButton is not clickable');
    searchButton.click();
    searchField.sendKeys('rash\n');
    browser.wait(EC.elementToBeClickable(itemsAroundTheWorld), TIMEOUT, 'Element is not clickable');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  it ('Checking search field and search result using keyword Books ', function () {
    browser.wait(EC.elementToBeClickable(searchButton), TIMEOUT, 'SearchButton is not clickable');
    searchButton.click();
    searchField.sendKeys('books\n');
    browser.wait(EC.elementToBeClickable(itemsAroundTheWorld), TIMEOUT, 'Element is not clickable');
    itemsAroundTheWorld.click();
    browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
    expect(countryLetter.first().isDisplayed()).toBe(true);
  });
  afterAll(function () {
    var footerLogo = element(by.css('p[class^="logo_name"]'));
    var footerGapminder = element(by.css('p[class^="logo_name"]+p'));
    var footerFacebookIcon = element(by.css('div[class="footer"] div[class*="facebook"]'));
    var footerTwitterIcon = element(by.css('div[class="footer"] div[class*="twitter"]'));
    var footerGoogleIcon = element(by.css('div[class="footer"] div[class*="google"]'));
    var footerLinkedinIcon = element(by.css('div[class="footer"] div[class*="linkedin"]'));
    var footerCreativeCommons = element(by.css('.col-md-3.col-sm-3.f-creative-commons>a>img'));
    expect(footerLogo.getText()).toEqual('DOLLAR STREET');
    expect(footerGapminder.getText()).toEqual('Powered by Gapminder');
    expect(footerFacebookIcon.isDisplayed()).toBe(true);
    expect(footerTwitterIcon.isDisplayed()).toBe(true);
    expect(footerGoogleIcon.isDisplayed()).toBe(true);
    expect(footerLinkedinIcon.isDisplayed()).toBe(true);
    expect(footerCreativeCommons.isDisplayed()).toBe(true);
  });
});
