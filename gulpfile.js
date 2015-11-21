var gulp = require('gulp');

/* ----- html processing ----- */

var minifyHtml = require('gulp-html-minifier');
var checkHtml = require('gulp-w3cjs');

/* ----- css processing ----- */

var translateLess = require('gulp-less');

var LessPluginCleanCSS = require('less-plugin-clean-css');
var cleanCss = new LessPluginCleanCSS({ advanced: true });

var checkCss = require('gulp-csslint');

/* ----- js processing ----- */

var minifyJs = require('gulp-closure-compiler-service');
var checkJs = require('gulp-jshint');
var styleOutput = require('jshint-stylish');

/* ----- other plugins ----- */

var concat = require('gulp-concat');

/* ~ deployment plugins ~ */

var connect = require('gulp-connect');

/* ~ base constants ~ */

var PRO_DIR_NAME = '../client_prod';

/* ----- tasks ----- */

gulp.task('html', function() {
  gulp.src('main.html')
      .pipe(minifyHtml({
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      }))
      // .pipe(checkHtml())
      .pipe(gulp.dest('../client_prod'));

  gulp.src('instruction.template')
      .pipe(gulp.dest('../client_prod'));
      
});

gulp.task('css', function() {
  gulp.src('less/*.less')
      .pipe(translateLess({
        plugins: [cleanCss]
      }))
      .pipe(concat('main.css'))
      .pipe(checkCss())
      .pipe(checkCss.reporter())
      .pipe(gulp.dest('../client_prod/css'));
});

gulp.task('js', function() {
  gulp.src([
    'js/satellitesDrawer-2.0.js',
    'js/earthDrawer.js',
    //'js/sender.js',
    'bower_components/angular/angular.min.js',
    'js/app.js'
  ])
      .pipe(minifyJs())
      .pipe(concat('main.js'))
      .pipe(checkJs())
      .pipe(checkJs.reporter(styleOutput))
      .pipe(gulp.dest('../client_prod/js'));

  gulp.src([
    'js/w_sender.js'
  ])
      .pipe(minifyJs())
      .pipe(checkJs())
      .pipe(checkJs.reporter(styleOutput))
      .pipe(gulp.dest('../client_prod/js'));
});

gulp.task('img', function() {
  gulp.src('img/*.*') // need optimize
      .pipe(gulp.dest('../client_prod/img'));
});

gulp.task('connect', function() {

    return connect.server({

        root: PRO_DIR_NAME,
        fallback: 'main.html',
        livereload: true
    });
});

gulp.task('default', ['html', 'css', 'js', 'img'], function() {});
