let gulp = require('gulp');

class GulpTasks {
    config : JSON;
    
    constructor(config : JSON) {
        this.config = config;
    }

    task(task : String, funcao : Function) {
        gulp.task(task, (callback) => funcao(this.config, callback));
    }
}