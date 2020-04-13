var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function () {
  connect.server({
    port: 4200,
    host: "0.0.0.0",
    livereload: true,
  });
});

gulp.task('production', function () {
  connect.server({
    port: 4200,
    host: "0.0.0.0",
  });
});

gulp.task('reload', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch([
      './controllers/**/*',
      './css/**/*',
      './partials/**/*',
      './services/**/*',
      './templates/**/*',
      './*.html',
      './*.js' ],
    [ 'reload' ]);
});

gulp.task('default', gulp.series([ 'connect', 'watch' ]));
