#!/usr/bin/env node
/*eslint no-console: 0, no-sync: 0*/
'use strict';

const ghpages = require('gh-pages');
const path = require('path');

ghpages.publish(path.join(__dirname, '../dist'), {
  user: {
    name: 'Dmitriy Shekhovtsov',
    email: 'valorkin@gmail.com'
  }
}, function (err) {
  if (err) {
    console.log('Error while publish gh-pages', err);
    throw err;
  }
  console.log('gh-pages published successfully');
});
