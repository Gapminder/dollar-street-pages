var gulp = require('gulp');

gulp.paths = {
  tssrc: [
    '**/*.ts',
    '!node_modules/**/*',
    '!bundles/**/*',
    '!typings/**/*',
    '!**/*.{ts,coffee}.js'],
  jssrc: [
    '*.js',
    'tools/*.js',
    '!app/**/*',
    '!bundles/*.js',
    '!node_modules/**/*',
    '!**/*.{ts,coffee}.js']
};

// Code linting
var esLint = require('gulp-eslint');
var tslint = require('gulp-tslint');

var paths = gulp.paths;

gulp.task('eslint', function () {
  return gulp.src(paths.jssrc)
    .pipe(esLint({useEslintrc: true}))
    .pipe(esLint.format())
    .pipe(esLint.failOnError());
});

gulp.task('tslint', function () {
  return gulp.src(paths.tssrc)
    .pipe(tslint())
    .pipe(tslint.report('verbose', {
      emitError: true,
      reportLimit: 0
    }));
});

gulp.task('lint', ['tslint', 'eslint']);

// gulp default task
gulp.task('default', function () {
  gulp.start('lint');
});
