/*
    goals:
    [x] minify css and js
    [x] auto prefix our css
    [x] minify html and change reference to minified files
    - transpile javasscript to es5
    [x] cache busting

*/

var gulp = require('gulp');
var minifyCSS = require('gulp-csso');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var processhtml = require('gulp-processhtml')
var htmlmin = require('gulp-htmlmin');
var babel = require('gulp-babel');
var cachebust = require('gulp-cache-bust');

gulp.task('css', () => {
  
    return gulp.src("src/css/*.css")
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(rename((path) => {
        path.extname = ".min.css";
    }))
    .pipe(gulp.dest("dist/css"));
})

gulp.task('es5js', () => {
    return gulp.src("src/js/index.js")
    .pipe(babel({
			presets: ['es2015', 'stage-0']
		}))
    .pipe(uglify())
    .pipe(rename((path) => {
        path.extname = ".min.js";
    }))
    .pipe(gulp.dest("dist/js"));
})

gulp.task('html', () => {
  return gulp.src("src/index.html")
  .pipe(processhtml())
  .pipe(cachebust({
    type: 'timestamp'
  }))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest("dist"))
})

gulp.task('default', ['css', 'es5js', 'html']);
