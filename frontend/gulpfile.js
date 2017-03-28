var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    jsmin = require('gulp-jsmin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    concat_multi = require('gulp-concat-multi');
    concatCss = require('gulp-concat-css'),
    clean = require('gulp-clean');
    webserver = require('gulp-webserver');
    merge = require('merge-stream');

gulp.task('html:dev', function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('html:prod', function () {
    return gulp.src('src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
});

gulp.task('styles-custom:dev', function () {
    return gulp.src('src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concatCss("customs-concat.css"))
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload());
});

gulp.task('styles-custom:prod', function () {
    return gulp.src('src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concatCss("customs-concat.css"))
        .pipe(gulp.dest('dist/styles'))
});

gulp.task('styles-libs:dev', function () {
    return gulp.src('src/styles/librarys/*.css')
        .pipe(concatCss("librarys-concat.css"))
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload());
});

gulp.task('styles-libs:prod', function () {
    return gulp.src('src/styles/librarys/*.css')
        .pipe(concatCss("librarys-concat.css"))
        .pipe(gulp.dest('dist/styles'))
});

gulp.task('js-custom:dev', function () {
    return concat_multi({
        'main.js': ["src/scripts/customs/config.dev.js", 'src/scripts/customs/main.js'],
        'login.js': ["src/scripts/customs/config.dev.js", 'src/scripts/customs/login.js']
    })
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(livereload());
});

gulp.task('js-custom:prod', function () {
    return concat_multi({
        'main.js': ["src/scripts/customs/config.prod.js", 'src/scripts/customs/main.js'],
        'login.js': ["src/scripts/customs/config.prod.js", 'src/scripts/customs/login.js']
    })
    .pipe(jsmin())
    .pipe(gulp.dest('dist/scripts/'))
});

gulp.task('js-libs:dev', function () {
    return gulp.src('src/scripts/librarys/*.js')
        .pipe(concat('all-librarys.js'))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(livereload());
});

gulp.task('js-libs:prod', function () {
    return gulp.src('src/scripts/librarys/*.js') 
        .pipe(concat('all-librarys.js'))
        .pipe(gulp.dest('dist/scripts/'))
});

gulp.task('img-saver:dev', function () {
    return gulp.src('src/images/*.*')
        .pipe(gulp.dest('dist/styles/images'))
        .pipe(livereload());
});

gulp.task('img-saver:prod', function () {
    return gulp.src('src/images/*.*')
        .pipe(gulp.dest('dist/styles/images'))
});

gulp.task('watch', function () {
    var server = livereload.listen();
    gulp.watch('src/styles/*.scss', ['styles-custom:dev']);
    gulp.watch('src/styles/librarys/*.css', ['styles-libs:dev']);
    gulp.watch('*.html', ['html:dev']);
    gulp.watch('src/scripts/customs/*.js', ['js-custom:dev']);
    gulp.watch('src/scripts/librarys/*.js', ['js-libs:dev']);
    gulp.watch('*.json', ['img-saver:dev']);
});

gulp.task('webserver', function() {
  gulp.src('./dist/')
    .pipe(webserver({
        livereload: false,
        directoryListing: false,
        open: false
    }));
});

gulp.task('dev', ['html:dev', 'styles-custom:dev', 'styles-libs:dev', 'js-libs:dev', 'js-custom:dev', 'img-saver:dev', 'watch', 'webserver']);
gulp.task('prod', ['html:prod', 'styles-custom:prod', 'styles-libs:prod', 'js-libs:prod', 'js-custom:prod', 'img-saver:prod']);