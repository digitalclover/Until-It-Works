//include promise to remedy server bug
require('es6-promise').polyfill();

//Gulp & Gulp Plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var environments = require('gulp-environments');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var gulpCopy = require('gulp-copy');

//NPM dependencies
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');
var browsersync = require('browser-sync');

//Set global variables
var development = environments.development;
var production = environments.production;


//Styling Tasks
gulp.task('sass', function(){
  gulp.src('dev/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dev/styles/'));
}),

gulp.task('styles',['sass'], function(){
  gulp.src(['dev/styles/*.css'])
  .pipe(concat('styles.dev.css'))
  .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
  .pipe((cssnano()))
  .pipe(postcss([ require('postcss-flexibility') ]))
  .pipe((rename('styles.min.css')))
  .pipe(gulp.dest('dist/styles'));
}),

gulp.task('fonts', function(){
  gulp.src('dev/fonts/*')
    .pipe(gulpCopy('dist/fonts/',{prefix:2}));
}),

gulp.task('modernizr', function(){
  gulp.src('dev/modernizr/*')
    .pipe(gulpCopy('dist/modernizr/',{prefix:2}));
}),

//JavaScript (Front-end) Tasks
gulp.task('scripts', function(){
  gulp.src('dev/scripts/*.js')
  .pipe(concat('scripts.dev.js'))
  .pipe((uglify()))
  .pipe((rename('scripts.min.js')))
  .pipe(gulp.dest('dist/scripts'));
}),

//Image Compression Tasks
gulp.task('images', function(){
    gulp.src('dev/images/**/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/images'));
});

//Browser Sync reloads

gulp.task('styles-watch',['styles'], browsersync.reload);
gulp.task('scripts-watch',['scripts'], browsersync.reload);
gulp.task('images-watch',['images'], browsersync.reload);
gulp.task('refresh', browsersync.reload);

//Tasks Definitions
gulp.task('watch',['default'], function() {
    browsersync.init({
		port: 3000, 
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('dev/styles/*.scss', ['styles-watch']);
    gulp.watch('dev/scripts/*', ['scripts-watch']);
    gulp.watch('dev/images/**/*', ['images-watch']);
    gulp.watch('server.js',['refresh']);
});


gulp.task('default', ['images','fonts','modernizr','scripts','styles']);

