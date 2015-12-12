let gulp = require('gulp');
class GulpTasks {
    constructor(config) {
        this.config = config;
    }
    task(task, funcao) {
        gulp.task(task, (callback) => funcao(this.config, callback));
    }
}
//# sourceMappingURL=GulpTasks.js.map