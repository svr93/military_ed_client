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

var BUILD_DIR_NAME = '../client_prod';
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

    var WORKER_FILE_PATH = 'js/w_sender.js';

    /**
     * Checks the need to concatenate current file with others.
     * @param {Object} file
     * @return {boolean}
     */
    var concatenationChecker = function(file) {

        var path = file.path;

        return (PRODUCTION &&
            path.indexOf('bower_components/cesium') === -1 &&
            path.indexOf('bower_components/requirejs') === -1 &&
            path.indexOf(WORKER_FILE_PATH) === -1);
    };

    /**
     * Checks the need to translate current file.
     * @param  {Object} file
     * @return {boolean}
     */
    var babelTranslationChecker = function(file) {

        var path = file.path;

        return (path.indexOf('js/module') !== -1);
    };

    var FILE_LIST = [

        'js/satellitesDrawer-2.0.js',
        'js/earthDrawer.js',

        'bower_components*/**/*min.js',
        'bower_components*/requirejs/require.js',

        'js/app.js',
        'js/module*/**/*.js',
        WORKER_FILE_PATH
    ];

    if (!CONNECT) { FILE_LIST.push('bower_components*/cesium/**/*.js'); }

    var NON_BOWER_FILE = '!bower_components/**/*.js';

    return gulp.src(FILE_LIST)
        .pipe(gulpif(NON_BOWER_FILE, checkJs()))
        .pipe(gulpif(NON_BOWER_FILE, checkJs.reporter(styleOutput)))

        .pipe(gulpif(
            babelTranslationChecker,
            babel({

                presets: ['es2015'],
                plugins: ['transform-es2015-modules-amd']
            })
        ))
        .pipe(gulpif(PRODUCTION && NON_BOWER_FILE, minifyJs()))

        .pipe(gulpif(concatenationChecker, concat('main.js')))
        .pipe(gulpif(
            NON_BOWER_FILE,
            gulp.dest(BUILD_DIR_NAME + '/js'),
            gulp.dest(BUILD_DIR_NAME)
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

        root: BUILD_DIR_NAME,
        fallback: BUILD_DIR_NAME + '/main.html',
        livereload: true,
        port: 8001
    });
});

gulp.task('default', ['html', 'css', 'js', 'img'], function() {});
