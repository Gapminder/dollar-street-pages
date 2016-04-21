
#!/usr/bin/env node

'use strict';

const https = require('https');
const fs = require('fs');
const url = require('url');

const outFile = `/tmp/bs_session_url_${process.TRAVIS_BUILD_NUMBER}.out`;

function getBrowserStackUrls(){
  const sessionJsonUrl = fs.readFileSync(outFile, 'utf8');
  const parsedUrl = url.parse(sessionJsonUrl);
  https.request({
    protocol: parsedUrl.protocol,
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname,
    method: 'GET',
    auth: `${process.env.BROWSER_STACK_USERNAME}:${process.env.BROWSER_STACK_ACCESS_KEY}`
  }, function(response){
      response.setEncoding('utf8');
      response.on('data', data => {
        console.log('\n\n==========================');
        console.log('BROWSERSTACK session URL:', JSON.parse(data).automation_session.browser_url);
        console.log('BROWSERSTACK video URL:', JSON.parse(data).automation_session.video_url);
        console.log('==========================\n\n');
      });
    }).end();
  };

getBrowserStackUrls();
