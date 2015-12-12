define(["require", "exports"], function (require, exports) {
    var gulp = require('gulp');
    var del = require('del');
    var concat = require('gulp-concat');
    var babel = require('gulp-babel');
    var rename = require('gulp-rename');
    var uglify = require('gulp-uglify');
    var runSequence = require('run-sequence');
    class Compile extends GulpTasks {
        constructor(config) {
            super(config);
            this.config = config;
            this.task('clean', this.clean);
            this.task('concat', this.concat);
            this.task('babel', this.babel);
            this.task('compress', this.compress);
            this.task('Compile', this.tasks);
        }
        tasks(config, cb) {
            runSequence('concat', 'babel', 'compress', cb); //, 'clean'
        }
        clean(config, cb) {
            del([config.cache], cb);
        }
        concat(config) {
            return gulp.src(config.includes)
                .pipe(concat(config.name.concat))
                .pipe(gulp.dest(config.cache));
        }
        babel(config) {
            return gulp.src(config.src.cache.concat)
                .pipe(babel({ stage: 0, modules: "ignore" }))
                .pipe(rename(config.name.babel))
                .pipe(gulp.dest(config.cache));
        }
        compress(config) {
            return gulp.src(config.src.cache.babel)
                .pipe(uglify())
                .pipe(rename(config.name.producao))
                .pipe(gulp.dest(config.producao));
        }
    }
    exports.Compile = Compile;
    ;
});
//# sourceMappingURL=Compile.js.map