'use strict';

var gulp = require('gulp'),
  watch = require('gulp-watch'), // Ребилд только измененных файлов
  plumber = require('gulp-plumber'), // Защита gulp от вылета
  uglify = require('gulp-uglify'),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  cleancss = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  twig = require('gulp-twig'), // JS шаблонизатор с синтаксисом TWIG
  concat = require('gulp-concat'),
  rimraf = require('rimraf'), // Очистка директорий
  Server = require('karma').Server,
  browserSync = require("browser-sync"),
  reload = browserSync.reload,
  babel = require('gulp-babel');


var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    cssimg: 'build/css/img/',
    images: 'build/images/',
    fonts: 'build/fonts/',
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/*.js',
    babelIn: 'src/js/es6/*.js',
    babelOut: 'src/js/',
    jsmain: 'src/js/main.js',
    scss: 'src/scss/*.*',
    cssimg: 'src/scss/img/**/*.*',
    images: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    test: 'src/test/test.spec.js'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/*.js',
    scss: 'src/scss/**/*.scss',
    cssimg: 'src/scss/img/**/*.*',
    images: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};


var config = {
  server: {
    baseDir: "./build"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "Frontend_Devil"
};

gulp.task('webserver', function () {
  // browserSync(config); // Запуск веб-сервера
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(twig())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

gulp.task('babel:build', () => {
  return gulp.src(path.src.babelIn)
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(path.src.babelOut));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    // .pipe(uglify()) // For minify JS files
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
  gulp.src(path.src.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', sass.logError)
    .pipe(prefixer())
    .pipe(concat('styles.css'))
    //.pipe(cleancss()) // For minify CSS files
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

gulp.task('cssimg:build', function () {
  gulp.src(path.src.cssimg)
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.cssimg))
    .pipe(reload({stream: true}));
});

gulp.task('images:build', function () {
  gulp.src(path.src.images)
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.images))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
  gulp.src(path.src.fonts)
    .pipe(plumber())
    .pipe(gulp.dest(path.build.fonts))
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('build', [
  'html:build',
  'babel:build',
  'js:build',
  'style:build',
  'fonts:build',
  'cssimg:build',
  'images:build',
  'test'
]);

gulp.task('watch', function () {
  watch([path.watch.html], function (event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.scss], function (event, cb) {
    gulp.start('style:build');
  });
  watch([path.src.babelIn], function (event, cb) {
    gulp.start('babel:build');
  });
  watch([path.watch.js], function (event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.cssimg], function (event, cb) {
    gulp.start('cssimg:build');
  });
  watch([path.watch.images], function (event, cb) {
    gulp.start('images:build');
  });
  watch([path.watch.fonts], function (event, cb) {
    gulp.start('fonts:build');
  });
  watch([path.watch.js], function (event, cb) {
    gulp.start('tdd');
  });
});


gulp.task('default', ['build', 'webserver', 'watch']);