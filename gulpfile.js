// Gulp
var gulp = require('gulp');

// Plugins
var server = require('gulp-server-livereload');

// Server
gulp.task('server', function() {
  gulp.src('./')
    .pipe(server({
      livereload: true,
      open: true
    }));
});

// Watch
gulp.task('watch', function () {
  gulp.watch(
    ['scripts/*.js']
  );
});

// Default Task
gulp.task('default', ['server', 'watch']);