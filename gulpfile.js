var gulp = require('gulp'),
  connect = require('gulp-connect'),
  proxy = require('http-proxy-middleware');

gulp.task('connect', function () {
  connect.server({
    port: 4200,
    livereload: true,
    middleware: function (connect, opt) {
      return [ proxy('http://www.radio-browser.info/webservice', { changeOrigin: true }) ]
    }
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

gulp.task('default', [ 'connect', 'watch' ]);
