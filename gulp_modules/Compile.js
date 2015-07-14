"use strict";

var gulp = require('gulp');

var del = require('del');

var concat = require('gulp-concat');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var runSequence = require('run-sequence');


var Compile = {
	config: '',

  constructor: function(config) {
		this.config = config;

    this.task('clean', this.clean);

		this.task('concat', this.concat);
		this.task('babel', this.babel);
		this.task('compress', this.compress);


		this.task('Compile', this.tasks);
  },

	tasks: function(config, cb) {
		runSequence('concat', 'babel', 'compress', cb); //, 'clean'
	},

	task: function(task, funcao) {
		gulp.task(task, function(cb) { return funcao(this.config, cb); }.bind(this));
	},


  clean: function(config, cb) {
      del([config.cache], cb);
  },

  concat: function(config) {
    return gulp.src(config.includes)
  		.pipe(concat(config.name.concat))
  		.pipe(gulp.dest(config.cache));
  },

	babel: function(config) {
    return gulp.src(config.src.cache.concat)
        .pipe(babel({stage: 0}))
		.pipe(rename(config.name.babel))
        .pipe(gulp.dest(config.cache));
	},

	compress: function(config) {
    return gulp.src(config.src.cache.babel)
    		.pipe(uglify())
    		.pipe(rename(config.name.producao))
    		.pipe(gulp.dest(config.producao));
	},
};

module.exports = Compile;
