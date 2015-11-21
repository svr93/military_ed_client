var gulp = require('gulp');

/* ----- html processing ----- */

var minifyHtml = require('gulp-html-minifier');
var checkHtml = require('gulp-w3cjs');
var htmlify = require('gulp-angular-htmlify');
var replaceHtmlBlocks = require('gulp-html-replace');

/* ----- css processing ----- */

var translateLess = require('gulp-less');

var LessPluginCleanCSS = require('less-plugin-clean-css');
var cleanCss = new LessPluginCleanCSS({ advanced: true });

var checkCss = require('gulp-csslint');

/* ----- js processing ----- */

var minifyJs = require('gulp-closure-compiler-service');
var checkJs = require('gulp-jshint');
var styleOutput = require('jshint-stylish');
var babel = require('gulp-babel');

/* ----- other plugins ----- */

var concat = require('gulp-concat');
var gulpif = require('gulp-if');

/* ~ deployment plugins ~ */

var connect = require('gulp-connect');

/* ~ base constants ~ */

var PRO_DIR_NAME = '../client_prod';
var CONNECT = (process.argv.indexOf('connect') !== -1);
var PRODUCTION = (process.argv.indexOf('--production') !== -1);

/* ----- tasks ----- */

/* ~ html processing ~ */
gulp.task('html', function() {

    return gulp.src([ 'main.html', '*.template' ])
        .pipe(gulpif(PRODUCTION, replaceHtmlBlocks({

            js: {

                src: '/js/main.js',
                tpl: '<script defer src="%s" onload="init()"></script>'
            }
        })))
        .pipe(gulpif(PRODUCTION, minifyHtml({

            removeComments: true,
            minifyCSS: true,
            minifyJS: true
        })))
        .pipe(htmlify())
        .pipe(gulpif('!' + '*.template', checkHtml()))
        .pipe(gulp.dest('../client_prod'))
        .pipe(gulpif(CONNECT, connect.reload()));
});

gulp.task('css', function() {
  gulp.src('less/*.less')
      .pipe(translateLess({
        plugins: [cleanCss]
      }))
      .pipe(concat('main.css'))
      .pipe(checkCss())
      .pipe(checkCss.reporter())
      .pipe(gulp.dest('../client_prod/css'))
      .pipe(gulpif(CONNECT, connect.reload()));
});

/* ~ js processing ~ */
gulp.task('js', function() {

    var IGNORE_CONCAT = 'w_sender.js';

    var FILE_LIST = [

        'js/satellitesDrawer-2.0.js',
        'js/earthDrawer.js',
        'bower_components*/**/*.min.js',
        'bower_components*/**/require.js',
        'js/app.js'
    ];
    FILE_LIST.push('js/' + IGNORE_CONCAT);

    return gulp.src(FILE_LIST)
        .pipe(gulpif('!' + '**/*.min.js', checkJs()))
        .pipe(gulpif('!' + '**/*.min.js', checkJs.reporter(styleOutput)))
        .pipe(gulpif('!' + '**/*.min.js', babel({ presets: ['es2015'] })))
        .pipe(gulpif(PRODUCTION && '!' + '**/*.min.js', minifyJs()))
        .pipe(gulpif(PRODUCTION && '!' + IGNORE_CONCAT, concat('main.js')))
        .pipe(gulpif(
            '!' + 'bower_components/**/*.js',
            gulp.dest(PRO_DIR_NAME + '/js'),
            gulp.dest(PRO_DIR_NAME)
        ))
        .pipe(gulpif(CONNECT, connect.reload()));
});

gulp.task('img', function() {
  gulp.src('img/*.*') // need optimize
      .pipe(gulp.dest('../client_prod/img'));
});

gulp.task('watch', function() {

    gulp.watch('main.html', ['html']);
    gulp.watch('js/**/*.js', ['js']);
});

gulp.task('connect', ['watch'], function() {

    return connect.server({

        root: PRO_DIR_NAME,
        fallback: PRO_DIR_NAME + '/main.html',
        livereload: true,
        port: 8001
    });
});

gulp.task('default', ['html', 'css', 'js', 'img'], function() {});
