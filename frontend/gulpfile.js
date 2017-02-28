var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css');

gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src('src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/styles/sass-css'))
        .pipe(livereload());
});

gulp.task('preffix', function () {
    gulp.src('src/styles/sass-css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('src/styles/css-preffix'))
        .pipe(livereload());
});

gulp.task('minify-css', function () {
    return gulp.src('src/styles/css-preffix/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload());
});

gulp.task('watch', function () {
    var server = livereload.listen();
    gulp.watch('src/styles/*.scss', ['sass']);
    gulp.watch('src/styles/sass-css/*.css', ['preffix']);
    gulp.watch('src/styles/css-preffix/*.css', ['minify-css']);
    gulp.watch('*.html', ['html']);
});

gulp.task('default', ['sass', 'html', 'preffix', 'minify-css', 'watch']);