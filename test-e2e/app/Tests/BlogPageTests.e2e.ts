'use strict';

const BlogPage = require('../Pages/BlogPage.ts');
const dataProvider = require('../Data/DataProvider.ts');
const FooterPage = require('../Pages/FooterPage.ts');
const using = require('jasmine-data-provider');
let footer = new FooterPage();

browser.manage().window().maximize();

 describe ('Blog Page test', ()=> {
   let blogPage = new BlogPage();
   beforeAll(() => {
     browser.get('/blog');
   });
   using(dataProvider.blogPageText, (data, description) => {
     it('Check ' + description, () => {
       expect(data.element().getText()).toEqual(data.actualResult);
     });
   });
   using(dataProvider.ambassadorsPageBoolean, (data, description) => {
     it('Check ' + description, () => {
       expect(data.element().isDisplayed()).toBeTruthy();
     });
   });
   for (let i = 0; i < 32; i++){
        it ('Blog Page - click on ' + i + ' post and check texts', () => {
          browser.get('/blog');
          let post = blogPage.getPost().get(i);
          browser.actions().mouseMove(post).click(post).perform();
          using(dataProvider.blogPagePosts, (data) => {
            expect(data.element().isDisplayed()).toBeTruthy();
          });
        });
   }
 });
