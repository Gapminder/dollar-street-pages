/**
 * Created by igor on 4/5/16.
 */
'use strict';
describe('App', () => {
  browser.get('/map?thing=5477537786deda0b00d43be5');

  it('should have a title', () => {
    let subject = browser.getTitle();
    let result = 'Dollar Street';
    expect(subject).toEqual(result);
  });

  it('search-title-thing-icon', () => {
    let subject = element(by.css('.search-title-thing-icon')).isPresent();
    let result = true;
    expect(subject).toEqual(result);
  });

  it('search-text', () => {
    let subject = element(by.css('.search-text > span')).isPresent();
    let result = true;
    expect(subject).toEqual(result);

    browser.wait(() => {
      return element(by.css('.search-text')).element(by.tagName('span')).getText();
    });
    let thing = element(by.css('.search-text')).element(by.tagName('span')).getText();
    let resultThing = 'Home';
    expect(thing).toEqual(resultThing);
  });

  it('search menu open', () => {
    element(by.css('.search-content')).click().then(() => {
      browser.wait(() => {
        return element(by.css('.dropdown-menu')).isDisplayed();
      });
      let count = element(by.css('.search-list-categories')).all(by.tagName('li')).count();
      expect(count).toEqual(189);
      let input = element(by.css('#search'));
      input.sendKeys('Chickens');
      browser.wait(() => {
        return element(by.css('.dropdown-menu')).isDisplayed();
      });
      count = element(by.css('.search-list-categories')).all(by.tagName('li')).count();
      expect(count).toEqual(1);
    });
  });
});
