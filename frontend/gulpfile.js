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

gulp.task('sass', function () {
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

gulp.task('css-libs-move', function () {
    gulp.src('src/styles/librarys/*.css')
        .pipe(concatCss("librarys-concat.css"))
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload());
});

gulp.task('js-custom-min', function () {
    gulp.src('src/scripts/customs/*.js')
        .pipe(jsmin())
        .pipe(concat('all-customs.js'))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(livereload());
});

gulp.task('js-library-min', function () {
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
    gulp.watch('src/styles/*.scss', ['sass']);
    gulp.watch('src/styles/librarys/*.css', ['css-libs-move']);
    gulp.watch('*.html', ['html']);
    gulp.watch('src/scripts/customs/*.js', ['js-custom-min']);
    gulp.watch('src/scripts/librarys/*.js', ['js-library-min']);
    gulp.watch('*.json', ['img-saver']);
});

gulp.task('default', ['html', 'sass', 'css-libs-move', 'js-library-min', 'js-custom-min', 'img-saver', 'watch']);