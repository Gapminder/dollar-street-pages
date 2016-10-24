'use strict';
const compression = require('compression');
const historyApi = require('connect-history-api-fallback');

module.exports = function liteServerConfig() {
  return {
    port: 3000,
    files: ['./dist/**/*.{html,css,js,js.map}'],
    server: {
      baseDir: './dist',
      middleware: {
        1: historyApi({index: '/index.html', verbose: true}),
        2: compression()
      }
    }
  };
};
