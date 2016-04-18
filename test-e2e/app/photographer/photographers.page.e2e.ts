/**
 * Created by vs on 4/6/16.
 */
describe('Photographers Page ', function() {
  //  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var searchField = element(by.css('#search'));
  var numPhotographers = element.all(by.css('.photographers-list>li'));
  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 10000;
  var zorianMiller = element(by.css('.photographer-card[href="/photographer?id=56ec0917af72e9437cbccf93"]'));
  var message = 'Zorian Miller on PhotographersPage is not visibility';
  var photographerPortreit = element(by.css('.photographer-portrait'));
  var photographerMessage = 'Photographer portrait is not visible';
  var isClickableLastPhotographerLink = EC.elementToBeClickable(zorianMiller);
  var country = element(by.css('.country-card>div>span'));
  var photosIcon = element.all(by.css('.photographer-material>span>i[class*="fa-camera"]'));
  var homesIcon = element.all(by.css('.photographer-material>span>img'));
  browser.manage().window().maximize();

  beforeAll(function() {
    browser.get('/photographers', 10000); //with timeout:will wait for loading page before 60 sec
    browser.wait(EC.visibilityOf(zorianMiller), TIMEOUT, message);
  });

  /* Enter query to Search field
   * Check visibility of photographers
   * Check icons with guantity Photos, videos, Homes at the first Photographer
   */

  it('test input bangladesh', function(){
    searchField.sendKeys('bangladesh\n');
    browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
    searchField.clear();
  });
  it('test check icons with guantity Photos, videos, Homes at the first Photographer', function(){
    browser.wait(EC.visibilityOf(country));
    browser.wait(EC.visibilityOf(photosIcon.first()));
    browser.wait(EC.visibilityOf(homesIcon.first()));
    expect(country.isDisplayed()).toBe(true);
    expect(photosIcon.first().isDisplayed()).toBe(true);
    expect(homesIcon.first().isDisplayed()).toBe(true);
  });
  it('test check icons with guantity Photos, videos, Homes at the last Photographer', function(){
    browser.wait(EC.visibilityOf(country));
    browser.wait(EC.visibilityOf(photosIcon.last()));
    browser.wait(EC.visibilityOf(homesIcon.last()));
    expect(country.isDisplayed()).toBe(true);
    expect(photosIcon.last().isDisplayed()).toBe(true);
    expect(homesIcon.last().isDisplayed()).toBe(true);
  });
  /*it('test input bulgaria', function(){
   searchField.sendKeys('bulgaria\n');
   browser.wait(EC.visibilityOf(photographerPortreit), TIMEOUT, photographerMessage);
   });
   it('test input error data', function(){
   searchField.sendKeys('lalala\n');
   expect(numPhotographers.count()).toBe(0);
   });*/
  // Check quantity of photographers and countries

  it ('Countries', function(){
    browser.get('/photographers');
    var countries = element.all(by.css('.photographer-country'));
    browser.wait(isClickableLastPhotographerLink, 10000);
    expect(countries.count()).toBe(43);
    expect(numPhotographers.count()).toBe(64);
  });
});