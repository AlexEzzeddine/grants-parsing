var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin');

gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src('src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload());
});

gulp.task('preffix', function () {
    gulp.src('dist/styles/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/styles'))
});

gulp.task('watch', function () {
    var server = livereload.listen();
    gulp.watch('src/styles/*.scss', ['sass']);
    gulp.watch('*.html', ['html']);
});

gulp.task('default', ['sass', 'html', 'preffix', 'watch']);