var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

// Styles
gulp.task('styles', function () {
    return gulp.src('src/styles/main.scss')
        .pipe(sass({style: 'expanded'}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({message: 'Styles task complete'}));
});

gulp.task('sass', function () {
    return sass('src/styles/*.scss', {
            style: 'compressed',
        })
        .pipe(gulp.dest('dist/styles'));
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(gulp.dest('dist/scripts'))
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(notify({message: 'Scripts task complete'}));
});

// Images
gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({message: 'Images task complete'}));
});


// Default task
gulp.task('default', function () {
    gulp.run('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function () {

    // Listen on port 35729
    server.listen(35729, function (err) {
        if (err) {
            return console.log(err)
        }
        ;

        // Watch .scss files
        gulp.watch('src/styles/**/*.scss', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            gulp.run('styles');
        });

        // Watch .js files
        gulp.watch('src/scripts/**/*.js', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            gulp.run('scripts');
        });

        // Watch image files
        gulp.watch('src/images/**/*', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            gulp.run('images');
        });

    });

});