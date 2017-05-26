module.exports = function (config) {
  let browser = ['Chrome'];
  if (process.env.TRAVIS) {
    browser = ['Chrome_travis_ci'];
  }
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-spec-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    files: [
     {pattern: './src/test.ts', watched: false}
    ],
    preprocessors: {'./src/test.ts': ['@angular/cli']},
    mime: {'text/x-typescript': ['ts', 'tsx']},
    coverageIstanbulReporter: {
      reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov'
      }
    },
    angularCli: {
      config: './angular-cli.json',
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
     ? ['spec', 'coverage-istanbul']
     : ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: browser,
    singleRun: false
  });
};
