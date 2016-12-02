'use strict';

const gulp = require('gulp');

gulp.paths = {
  tssrc: [
    '**/*.ts',
    '!node_modules/**/*',
    '!bundles/**/*',
    '!typings/**/*',
    '!modules/**/*',
    '!test/**/*',
    '!dist/**/*',
    '!app/**/*.d.ts',
    '!test-e2e/**/*',
    '!e2e/**/*',
    '!src2/**/*',
    '!**/*.{ts,coffee}.js'
  ]
};

// Code linting
const tslint = require('gulp-tslint');

const paths = gulp.paths;

gulp.task('tslint', () =>
  gulp.src(paths.tssrc)
    .pipe(tslint({formatter: 'verbose'}))
    .pipe(tslint.report({
      emitError: true,
      reportLimit: 0
    }))
);

gulp.task('default', () => {
  gulp.start('tslint');
});
