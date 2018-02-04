#!/usr/bin/env node

'use strict';

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const BrowserStackTunnel = require('browserstacktunnel-wrapper');
const cwd = path.dirname(require.main.filename);

const TUNNEL_IDENTIFIER = process.env.TRAVIS_BUILD_NUMBER;
const READY_FILE = path.join(' ', 'tmp', 'bstack-' + TUNNEL_IDENTIFIER + '.ready').trim();
const ACCESS_KEY = process.env.BROWSER_STACK_ACCESS_KEY;
const HOST = 'localhost';
const PORT = process.env.PORT || 4200;

console.log('Starting tunnel on port', PORT);

shell.exec("wget https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip -P /tmp");
shell.exec("unzip -o /tmp/BrowserStackLocal-linux-x64.zip -d /tmp");

const tunnel = new BrowserStackTunnel({
  key: ACCESS_KEY,
  localidentifier: TUNNEL_IDENTIFIER,
  hosts: [{name: HOST,
    port: PORT,
    sslFlag: 0}],
    linux64Bin: "/tmp",
});

tunnel.start(function(error) {
  if (error) {
    console.error('Can not establish the tunnel', error);
  } else {
    console.log('Tunnel established.');

    if (READY_FILE) {
      fs.writeFile(READY_FILE, '');
    }
  }
});
