/**
 * Created by vs on 4/5/16.
 */
describe('Main Page test', function() {
  //  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  var frontDoors = element.all(by.css('.concept_things_menu>ul>li>span')).first();
  var homes = element.all(by.css('.concept_things_menu>ul>li>span')).get(1);
  var sofas = element.all(by.css('.concept_things_menu>ul>li>span')).get(2);
  var stoves = element.all(by.css('.concept_things_menu>ul>li>span')).get(3);
  var toilets = element.all(by.css('.concept_things_menu>ul>li>span')).get(4);
  var seeAll = element(by.css('#concept a'));
  var allFamilies = element(by.css('#places a'));
  var acrossTheWorld = element(by.css('.concept-header-thing-title.pull-right>p'));
  var EC = protractor.ExpectedConditions;
  var TIMEOUT = 60000;
  browser.manage().window().maximize();
  /* Click on every page on Main Page
   * Check every sub-menu: Front doors, homes, sofas, stoves, toilets
   * Check sub-header of every sub-menu: Front doors across the World
   * Check link See all of every sub-menu
   * Check link All Families*/
  afterEach(function(){
    browser.wait(EC.visibilityOf(acrossTheWorld));
    browser.wait(EC.visibilityOf(allFamilies));
  });
  it('CheckAndOpenFrontDoors', function () {
    browser.get('/main');
    browser.wait(EC.visibilityOf(frontDoors), TIMEOUT, 'Element FrontDors on MainPage is not visibility');
    browser.wait(EC.visibilityOf(homes), TIMEOUT, 'Element FrontDors on MainPage is not visibility');
    browser.wait(EC.visibilityOf(sofas), TIMEOUT, 'Element FrontDors on MainPage is not visibility');
    browser.wait(EC.visibilityOf(stoves), TIMEOUT, 'Element FrontDors on MainPage is not visibility');
    browser.wait(EC.visibilityOf(toilets), TIMEOUT, 'Element FrontDors on MainPage is not visibility');
    frontDoors.click();
    browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Front Doors on MainPage is not visibility');
    browser.wait(EC.visibilityOf(element(by.css('.concept-header-thing-title.pull-right>p'))));
  });
  it('CheckAndOpenHomes', function () {
    homes.click();
    browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Homes on MainPage is not visibility');
  });
  it('CheckAndOpenSofas', function () {
    sofas.click();
    browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Sofas on MainPage is not visibility');
  });
  it('CheckAndOpenStoves', function () {
    stoves.click();
    browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Stoves on MainPage is not visibility');
  });
  it('CheckAndOpenToilets', function () {
    toilets.click();
    browser.wait(EC.visibilityOf(seeAll), TIMEOUT, 'Toilets on MainPage is not visibility');
  });
 /* afterAll(function(){
    browser.close();
  });*/
});
