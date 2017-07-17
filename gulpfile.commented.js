/*
  gulp is a system that lets you run tasks on your website source files to prepare them for production.
  A gulpfile.js is usually split into tasks for each type of file, using this syntax:

    gulp.task('name', () => {
      gulp.src('path/to/src/file')
        .pipe(doSomething())
        .pipe(gulp.dest('path/to/dest/folder'))
    });

  Inside the task we specify a file(s), then use the .pipe method to save it in the specified destination folder.
  The .pipe method can be chained, meaning we can do something useful just before we save it.

  We can run a task by typing 'gulp [task name]' in the terminal. If a task has the name 'default', then you can
  just type 'gulp' to run that task.

  In the 'default' task we usually use gulp's .watch method. This will run a task and then listen for changes
  to the specified file(s) and then run the task again to keep the destination files up to date automatically.

  Since gulp runs on node, we can add modules from npm to help us get stuff done. Let's load all the plugins we
  will use, starting with gulp itself.
*/
const gulp = require('gulp');
/*
  Load gulp-plumber
  If a file gulp is watching throws an error, the pipe stream will break and gulp will stop watching all files.
  gulp-plumber prevents pipe breaking caused by errors from gulp plugins.
*/
const plumber = require('gulp-plumber');
/*
  Load gulp-rename
  Lets you rename files during the pipe, eg. adding .min to a minified file.
*/
const rename = require('gulp-rename');
/*
  Load gulp-sourcemaps
  Minified and bundled files are not very easy to debug - they can be read by browsers, but not humans.
  Sourcemaps keep track of how the production files relate to the original source files. When the browser
  finds an error in a production file, the sourcemap allows the browser to show you where the error
  originated in the relevant source file.
*/
const sourcemaps = require('gulp-sourcemaps');
/*
  Load gulp-autoprefixer
  Automatically adds -webkit-, -moz- and -ms- vendor prefixes to relevant CSS declarations so you don't have to.
*/
const autoprefixer = require('gulp-autoprefixer');
/*
  Load gulp-clean-css
  Optimizes and minifies CSS.
*/
const cleancss = require('gulp-clean-css');
/*
  Load gulp-sass
  Compiles SCSS files to CSS.
*/
const sass = require('gulp-sass');
/*
  Load browserify
  Bundles all JS files (including imported node modules) into one file that can be read by the browser.
*/
const browserify = require('browserify');
/*
  Load vinyl-source-stream and vinyl-buffer
  browserify uses conventional text streams, but gulp uses something called a vinyl stream. These plugins just
  make browserify play nice with gulp.
*/
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
/*
  Load babelify
  Used by browserify to compile es6 to es5 before bundling.
*/
const babelify = require('babelify');
/*
  Load gulp-eslint
  Alerts you to any errors or bad practices in your JS code.
*/
const eslint = require('gulp-eslint');
/*
  Load gulp-uglify
  Optimizes and minifies JS.
*/
const uglify = require('gulp-uglify');
/*
  Load gulp-imagemin
  Optimizes images.
*/
const imagemin = require('gulp-imagemin');
/*
  Load gulp-htmlmin
  Minifies HTML.
*/
const htmlmin = require('gulp-htmlmin');
/*
  Load gulp-cache
  Caches files so you don't reload them if they haven't changed.
*/
const cache = require('gulp-cache');
/*
  Load gulp-cache-bust
  Adds a timestamp to CSS and JS paths in HTML files so that cached files do reload when they have changed.
*/
const cachebust = require('gulp-cache-bust');
/*
  Load browser-sync
  Adds a JS script to your HTML files to inject updated CSS and JS into the page without you having to refresh.
*/
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
    .pipe(cache(cleancss({debug: true})))
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

gulp.task('default', ['build', 'browser-sync'], () => {
  gulp.watch('src/sass/**/*.scss', ['css']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/**/*.html', ['html', 'bs-reload']);
});
