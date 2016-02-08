'use strict';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    let subject = browser.getTitle();
    let result = 'Gapminder: Unveiling the beauty of statistics for a fact based world view.';
    expect(subject).toEqual(result);
  });

  it('should have alert', () => {
    let subject = element(by.css('alert[type="info"]')).isPresent();
    let result = true;
    expect(subject).toEqual(result);
  });
});
