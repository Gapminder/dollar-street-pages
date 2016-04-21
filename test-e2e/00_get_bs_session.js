const fs = require('fs');
const outFile = '/tmp/bs_session_url_'+process.TRAVIS_BUILD_NUMBER+'.out';

browser.driver.session_.then(function (sessionData) {
  fs.writeFileSync(outFile, 'https://www.browserstack.com/automate/sessions/'+sessionData.id_+'.json')
});
