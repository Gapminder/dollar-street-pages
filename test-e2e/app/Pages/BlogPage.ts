'use strict';

const data = require('../Data/DataProvider.ts');
const using = require('jasmine-data-provider');
const AbstractPage = require('../Pages/AbstractPage.ts');

let h1EveryPost = element.all(by.css('h3[href*="/post?"]'));

let BlogPage = function() {
    this.getPost = () => {return h1EveryPost;};
};

BlogPage.prototype = Object.create(AbstractPage.prototype);
module.exports = BlogPage;
