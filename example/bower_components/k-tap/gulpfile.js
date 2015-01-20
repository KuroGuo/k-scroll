var gulp = require('gulp');

var uglify = require('gulp-uglify');

gulp.task('default', function () {
  gulp.src('./src/k-tap.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});