'use strict';
/*eslint-disable*/
const fs = require('fs');
const outFile = `/tmp/bs_session_url_${process.TRAVIS_BUILD_NUMBER}.out`;

browser.driver.session_.then(sessionData => {
  fs.writeFileSync(outFile, `https://www.browserstack.com/automate/sessions/${sessionData.id_}.json`);
});
/*eslint-enable*/
