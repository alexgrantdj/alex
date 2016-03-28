var gulp = require('gulp');
var server = require('gulp-server-livereload'),
	sass = require('gulp-sass'),
	useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
	wiredep = require('wiredep').stream,
    del = require('del'),
    imagemin = require('gulp-imagemin');


//Server
gulp.task('server', function() {
    gulp.src('app')
        .pipe(server({
            livereload: true,
            defaultFile: 'index.html',
            open: true
        }));
});

//Bower
gulp.task('bower', function () {
  gulp.src('app/*.html')
    .pipe(wiredep({
      directory: 'app/bower_components'
    }))
    .pipe(gulp.dest('app'));
});

//Styles
gulp.task('styles', function() {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
					browsers: ['last 15 versions'],
					cascade: false
				}))
        .pipe(gulp.dest('app/css'));
});

//Images
gulp.task('images', function(){
    return gulp.src('app/img/**/*')
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 7
        }))
        .pipe(gulp.dest('build/img'));
});

//Build
gulp.task('build', ['images','del'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('build'));
});

//Del
gulp.task('del', function () {
  return del('build/css/*');
});

//Watch
gulp.task('watch', function() {
    gulp.watch('app/sass/**/*.sass', ['styles']);
    gulp.watch('bower.json', ['bower']);
});

//Default
gulp.task('default', ['server', 'watch']);
