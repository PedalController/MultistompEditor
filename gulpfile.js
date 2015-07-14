"use strict";

/* --------------------------------------- */
/* | Import                                */
/* --------------------------------------- */
var gulp = require('gulp');

var runSequence = require('run-sequence');

var config = require('./config');

/* --------------------------------------- */
/* | Gulp imports                          */
/* --------------------------------------- */
var Compile = require(__dirname + '/gulp_modules/Compile.js');


/* --------------------------------------- */
/* | INIT                                  */
/* --------------------------------------- */
Compile.constructor(config);

gulp.watch(config.includes, ['Compile']);
