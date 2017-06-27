const gulp = require('gulp');
const babel = require('gulp-babel');
const jasmine = require('gulp-jasmine');

gulp.task('transpile', () => {
    return gulp.src('public/src/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default',['transpile']);
gulp.task('test', () => {
    return gulp.src('tests/**/*.spec.js')
        .pipe(jasmine());
});
gulp.task('testwatch', () => {
    return gulp.watch('tests/**/*.spec.js', ['test']);
});
