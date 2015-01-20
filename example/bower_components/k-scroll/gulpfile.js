var gulp = require('gulp');

var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');

gulp.task('default', function () {
  gulp.src('./src/k-scroll.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));

  gulp.src('./src/k-scroll.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist/'));
});