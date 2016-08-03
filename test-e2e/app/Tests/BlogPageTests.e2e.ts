'use strict';

import { browser } from 'protractor/globals';
import { BlogPage } from '../Pages/BlogPage';
import { DataProvider } from '../Data/DataProvider';
let using = require('jasmine-data-provider');
browser.driver.manage().window().maximize();

describe('Blog Page test', ()=> {
  beforeAll(() => {
    browser.get('/blog');
  });

  using(DataProvider.blogPagePosts, (data:any, description:string) => {
      it('Check ' + description, () => {
        expect(data.element().getText()).toEqual(data.actualResult);
      });
    }
  );
  using(DataProvider.ambassadorsPageBoolean, (data:any, description:string) => {
    it('Check ' + description, () => {
      expect(data.element().isDisplayed()).toBeTruthy();
    });
  });
  for (let i = 0; i < 1; i++) {
    it('Blog Page - click on ' + i + ' post and check texts', () => {
      browser.get('/blog');
      let post = BlogPage.getPost().get(i);
      browser.actions().mouseMove(post).click(post).perform().then(()=> {
        using(DataProvider.blogPagePosts, (data:any) => {
          expect(data.element().isDisplayed()).toBeTruthy();
          expect(data.element().isEnabled()).toBe(true);
        });
      });
    });
  }
});
