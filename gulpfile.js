var gulp = require('gulp');

gulp.paths = {
  tssrc: [
    '**/*.ts',
    '!node_modules/**/*',
    '!bundles/**/*',
    '!typings/**/*',
    '!**/*.{ts,coffee}.js']
};

// Code linting
var tslint = require('gulp-tslint');

var paths = gulp.paths;

gulp.task('tslint', function () {
  return gulp.src(paths.tssrc)
    .pipe(tslint())
    .pipe(tslint.report('verbose', {
      emitError: true,
      reportLimit: 0
    }));
});

// gulp default task
gulp.task('default', function () {
  gulp.start('tslint');
});
