'use strict';

const gulp = require('gulp');
const fs = require('fs');

gulp.paths = {
  tssrc: [
    '**/*.ts',
    '!aot/**/*',
    '!node_modules/**/*',
    '!bundles/**/*',
    '!typings/**/*',
    '!test/**/*',
    '!dist/**/*',
    '!app/**/*.d.ts',
    '!test-e2e/**/*',
    '!e2e/**/*',
    '!src2/**/*',
    '!**/*.{ts,coffee,map}.js',
    '!**/*.{ngstyle, ngfactory, ngsummary}.ts'
  ]
};

// Code linting
const tslint = require('gulp-tslint');

const ten = 1010;
const paths = gulp.paths;

gulp.task('tslint', () =>
  gulp.src(paths.tssrc)
    .pipe(tslint({formatter: 'verbose'}))
    .pipe(tslint.report({
      emitError: true,
      reportLimit: 0
    }))
);

gulp.task('env', () => {
  const prodEnvFile = './src/environments/environment.prod.ts';
  const envInputKey = 'CONSUMER_URL';

  fs.readFile(prodEnvFile, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    let textByLine = data.split("\n");

    textByLine.forEach((line, index) => {
      if(line.match(/consumerApi:/g)) {
        textByLine[index] = `  consumerApi: \'${process.env[envInputKey]}\',`;
      }
    });

    fs.writeFile(prodEnvFile, textByLine.join('\n'), 'utf8', function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });
});

gulp.task('default', () => {
  gulp.start('tslint');
});
