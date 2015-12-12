"use strict";

/* --------------------------------------- */
/* | Import                                */
/* --------------------------------------- */
require('typescript-require');
let gulp = require('gulp');

let config = require('./config');

/* --------------------------------------- */
/* | Gulp imports                          */
/* --------------------------------------- */
let Compile = require('./gulp_modules/Compile.ts').Compile;
let CompileSimple = require('./gulp_modules/CompileSimple.ts').CompileSimple;

/* --------------------------------------- */
/* | INIT                                  */
/* --------------------------------------- */
//Compile.constructor(config);
new CompileSimple(config);

gulp.watch(config.includes, ['Compile']);
