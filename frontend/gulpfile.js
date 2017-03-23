var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    jsmin = require('gulp-jsmin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    clean = require('gulp-clean');

gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('styles-custom', function () {
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

gulp.task('styles-libs', function () {
    gulp.src('src/styles/librarys/*.css')
        .pipe(concatCss("librarys-concat.css"))
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload());
});

gulp.task('js-custom', function () {
    gulp.src(['src/scripts/customs/*.js', "!src/scripts/customs/login.js"])
        .pipe(jsmin())
        .pipe(concat('all-customs.js'))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(livereload());
    gulp.src("src/scripts/customs/login.js")
        .pipe(jsmin())
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(livereload());
});

gulp.task('js-libs', function () {
    gulp.src('src/scripts/librarys/*.js')
        .pipe(jsmin())
        .pipe(concat('all-librarys.js'))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(livereload());
});

gulp.task('img-saver', function () {
    gulp.src('src/images/*.*')
        .pipe(gulp.dest('dist/styles/images'))
        .pipe(livereload());
});

gulp.task('watch', function () {
    var server = livereload.listen();
    gulp.watch('src/styles/*.scss', ['styles-custom']);
    gulp.watch('src/styles/librarys/*.css', ['styles-libs']);
    gulp.watch('*.html', ['html']);
    gulp.watch('src/scripts/customs/*.js', ['js-custom']);
    gulp.watch('src/scripts/librarys/*.js', ['js-libs']);
    gulp.watch('*.json', ['img-saver']);
});

gulp.task('default', ['html', 'styles-custom', 'styles-libs', 'js-libs', 'js-custom', 'img-saver', 'watch']);