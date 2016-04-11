#!/usr/bin/env node

'use strict';

var path = require('path');
var fs = require('fs');

var shell = require('shelljs');

var iterNum = process.env.TRAVIS_BUILD_NUMBER;
var max_tries = 30;
var file = path.join(' ', 'tmp', 'bstack-' + iterNum + '.ready').trim();

var counter = max_tries;

while (counter){
    if (shell.test("-e", file)){
        console.log('wait4tunnel: ok');
        process.exit(0);
    };
    shell.exec("sleep 1");
    counter--;
};
console.log('Seems like bstack tunnel is not established. Timed out. Exiting.');
process.exit(1);
