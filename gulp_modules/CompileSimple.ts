let sourcemaps = require('gulp-sourcemaps');
let concat = require('gulp-concat');
let runSequence = require('run-sequence');

export class CompileSimple extends GulpTasks {
    constructor(config) {
        super(config);
        this.config = config;

        this.registerTasks();
    }

    registerTasks() {
        this.task('concat', this.concat);
        this.task('CompileSimple', () => runSequence('concat'));
    }

    concat(config) {
        return gulp.src(config.includes)
                   .pipe(sourcemaps.init())
                      .pipe(concat(config.name.concat))
                      .pipe(gulp.dest(config.cache))
                   .pipe(sourcemaps.write())
                   .pipe(gulp.dest(config.cache));
    }
}