const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('transpile', () => {
    return gulp.src('public/src/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default',['transpile']);
