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
        .pipe(gulp.dest('.tmp/styles/sass-css'))
        .pipe(livereload());
});

gulp.task('preffix', function () {
    gulp.src('.tmp/styles/sass-css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('.tmp/styles/css-preffix'))
        .pipe(livereload());
});

gulp.task('minify-css', function () {
    return gulp.src('.tmp/styles/css-preffix/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('.tmp/styles/minified'))
        .pipe(livereload());
});

gulp.task('js-custom-min', function () {
    gulp.src('src/scripts/customs/*.js')
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('.tmp/scripts/min/customs/'))
        .pipe(livereload());
});

gulp.task('js-library-min', function () {
    gulp.src('src/scripts/librarys/*.js')
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('.tmp/scripts/min/librarys/'))
        .pipe(livereload());
});

gulp.task('js-concat-customs', function () {
    return gulp.src('.tmp/scripts/min/customs/*.js')
        .pipe(concat('all-customs.js'))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(livereload());
});

gulp.task('js-concat-librarys', function () {
    return gulp.src('.tmp/scripts/min/librarys/*.js')
        .pipe(concat('all-librarys.js'))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(livereload());
});

gulp.task('css-libs-move', function () {
    gulp.src('src/styles/librarys/*.css')
        .pipe(gulp.dest('.tmp/styles/librarys'))
        .pipe(livereload());
});

gulp.task('css-libs-concat', function () {
    return gulp.src('.tmp/styles/librarys/*.css')
        .pipe(concatCss("librarys-concat.css"))
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload());
});
gulp.task('css-customs-concat', function () {
    return gulp.src('.tmp/styles/minified/*.css')
        .pipe(concatCss("customs-concat.css"))
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload());
});


gulp.task('data-saver', function () {
    gulp.src('src/data/*.*')
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('img-saver', function () {
    gulp.src('src/images/*.*')
        .pipe(gulp.dest('dist/styles/images'))
        .pipe(livereload());
});

gulp.task('clean', function () {
    return gulp.src('.tmp', {read: false})
        .pipe(clean());
});


gulp.task('watch', function () {
    var server = livereload.listen();
    gulp.watch('src/styles/*.scss', ['sass']);
    gulp.watch('.tmp/styles/sass-css/*.css', ['preffix']);
    gulp.watch('.tmp/styles/css-preffix/*.css', ['minify-css']);
    gulp.watch('*.html', ['html']);
    gulp.watch('src/scripts/customs/*.js', ['js-custom-min']);
    gulp.watch('src/scripts/librarys/*.js', ['js-library-min']);
    gulp.watch('.tmp/scripts/min/customs/*.js', ['js-concat-customs']);
    gulp.watch('.tmp/scripts/min/librarys/*.js', ['js-concat-librarys']);

    gulp.watch('src/styles/librarys/*.css', ['css-libs-move']);
    gulp.watch('.tmp/styles/librarys/*.css', ['css-libs-concat']);
    gulp.watch('.tmp/styles/minified/*.css', ['css-customs-concat']);
    gulp.watch('*.json', ['data-saver']);
    gulp.watch('*.json', ['img-saver']);
});

gulp.task('default', ['html', 'sass', 'preffix', 'minify-css', 'js-library-min', 'js-custom-min', 'js-concat-customs', 'js-concat-librarys', 'css-libs-concat', 'css-libs-move', 'css-customs-concat', 'data-saver', 'img-saver', 'watch']);