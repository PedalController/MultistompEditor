"use strict";

function includesGenerator(importsFile) {
	var includes = require(importsFile).includes;

	var retorno = [];
	var sulfix = ".js";

	for (var pacote in includes)
		for (var include = 0; include < includes[pacote].length; include++)
			retorno.push(config.dev + config.imports + pacote + "/" + includes[pacote][include] + sulfix);

	return retorno;
}

var config = {
	dev: 'src/',
	dist: 'dist/',
	cache : 'dist/cache/',
	producao: 'dist/js/',
	imports: '',

	name: {
		concat:'concat.js',
		babel:'babel.js',
		producao:'producao.js',

		imports: 'import.json',
	},

	src: {
		producao: undefined,
		dev: {},
		dist: {},
		cache: {}
	}
};

config.src.producao = config.producao + config.name.producao;

config.src.dev.jsfiles = config.dev + config.imports + '*/*.js';
config.src.dev.imports = config.dev + config.imports + config.name.imports;

config.src.cache.concat = config.cache + config.name.concat;
config.src.cache.babel  = config.cache + config.name.babel;

config.includes = includesGenerator("./" + config.src.dev.imports);

module.exports = config;
