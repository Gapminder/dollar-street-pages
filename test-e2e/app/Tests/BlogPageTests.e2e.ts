'use strict';

import { browser } from 'protractor';
import { BlogPage } from '../Pages/BlogPage';
import { AbstractPage } from '../Pages/AbstractPage';

describe('Blog page redirect', ()=> {
  it('Check redirect blog', ()=> {
    browser.get('about');
    AbstractPage.menuIcon.click();
    AbstractPage.gamburgerMenuLinks.get(3).click().then(()=> {
      browser.sleep(1000);
      browser.getAllWindowHandles().then((handles:any)=> {
        browser.switchTo().window(handles[1]).then(()=> {
          browser.ignoreSynchronization = true;
          expect(browser.getCurrentUrl()).toContain('gapminder.org/category/dollarstreet/');
          expect(BlogPage.getPostHeader.getText()).toEqual('A dream come true');
          expect(BlogPage.gapminderLogo.isPresent()).toBe(true);
        });
        });
        });
    });
});
