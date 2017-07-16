const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const sass = require('gulp-sass');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const cache = require('gulp-cache');
const cachebust = require('gulp-cache-bust');
const browserSync = require('browser-sync');

gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: './dist',
    },
  });
});

gulp.task('bs-reload', () => {
  browserSync.reload();
});

gulp.task('fonts', () => {
  gulp.src('src/assets/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('icons', () => {
  gulp.src('src/assets/icons/**/*')
    .pipe(gulp.dest('dist/assets/icons'));
});

gulp.task('img', () => {
  gulp.src('src/assets/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('css', () => {
  gulp.src(['src/sass/**/*.scss'])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log('css: ', error.message);
        this.emit('end');
      },
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleancss({debug: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('lint', () => {
  gulp.src(['src/js/index.js'])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log('lint: ', error.message);
        this.emit('end');
      },
    }))
    .pipe(eslint())
    .pipe(eslint.format())
});

gulp.task('js', ['lint'], () => {
  const bundler = browserify({
    entries: ['src/js/index.js'],
    debug: true,
  }).transform(babelify.configure({
    presets: ["es2015"],
    ignore: /node_modules/,
  }));

  return bundler.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(plumber({
      errorHandler: function(error) {
        console.log('js: ', error.message);
        this.emit('end');
      },
    }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', () => {
  gulp.src('src/index.html')
    .pipe(cachebust({
        type: 'timestamp'
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
})

gulp.task('build', ['fonts', 'icons', 'img', 'css', 'js', 'html']);

gulp.task('default', ['browser-sync'], () => {
  gulp.watch('src/sass/**/*.scss', ['css']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('*.html', ['bs-reload']);
});
