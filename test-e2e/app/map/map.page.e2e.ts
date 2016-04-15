/**
 * Created by vs on 13/4/16.
 */
describe('Map Page ', function() {

    var countryLink = element.all(by.css('.country-name'));
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
    /*
    Open Map Link
    Click on every Link with Country
    Write the Text to Colsole about checked link
     */

    beforeEach(function(){
        browser.get('/map');
        browser.wait(EC.visibilityOf(mapImg), TIMEOUT, messageAboutMap);
});
  it('Click on every link with country 0 - 10', function () {
            for (var i = 0; i < 10; i++) {
                countryLink.get(i).click();
                browser.getCurrentUrl().then(function (text) {
                    console.log(text + ' checking');
                });
                try {
                    browser.wait(EC.visibilityOf(iconHomes), TIMEOUT, messageAboutCountryLink + ' the ' + i + '-th country');
                    browser.getCurrentUrl().then(function (text) {
                        console.log(' checked ok');
                    })
                    (function(err) {
                            console.error('error sending keys ' + err);
                            throw err;
                    });
                } catch (err) {
                    console.log('error occured ' + err);
                    continue;
                }
                browser.get('/map');
            }});
    it('Click on every link with country 30 - 41', function () {
        for (var i = 30; i < 41; i++) {
            countryLink.get(i).click();
            browser.getCurrentUrl().then(function (text) {
                console.log(text + ' checking');
            });
            try {
                browser.wait(EC.visibilityOf(iconHomes), TIMEOUT, messageAboutCountryLink + ' the ' + i + '-th country');
                browser.getCurrentUrl().then(function (text) {
                    console.log(' checked ok');
                })
                  (function(err) {
                        console.error('error sending keys ' + err);
                        throw err;
                    });
            } catch (err) {
                console.log('error occured ' + err);
                continue;
            }
            browser.get('/map');
        }});

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
