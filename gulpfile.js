var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var del  = require('del');
var runSequence = require('run-sequence');

gulp.task('preview', function(cb) {
  runSequence('clean', 'copy-files',
              cb);
});

gulp.task('clean', function (cb) {
  return del([
    'public/*'
  ], cb);
});

gulp.task('copy-files', function() {
  return gulp.src(['app/**'], {dot: true})
    .pipe(gulp.dest('public'));
});

//watch function
gulp.task('watch', function(){
  gulp.watch(['./app/**/*.js', './app/**/*.html'], ['preview']);
});

gulp.task('default', ['preview'], function() {
  // place code for your default task here
});
