"use strict";

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HomeController = (function () {
	function HomeController(presenter) {
		_classCallCheck(this, HomeController);

		this.presenter = presenter;

		this.patchDetails = null;
		this.pedalboard = null;

		this.inicializarComponentes();
	}

	_createClass(HomeController, [{
		key: "inicializarComponentes",
		value: function inicializarComponentes() {
			this.patchDetails = new PatchDetailsComponent("patchDetails");
			this.pedalboard = new PedalboardComponent("pedalboard", this);
		}
	}, {
		key: "setPatchTitle",
		value: function setPatchTitle(title) {
			this.patchDetails.setName(title);
		}
	}, {
		key: "setPatchNumber",
		value: function setPatchNumber(number) {
			this.patchDetails.setNumber(number);
		}
	}, {
		key: "active",
		value: function active(effect) {
			this.pedalboard.pedals[effect].active();
		}
	}, {
		key: "disable",
		value: function disable(effect) {
			this.pedalboard.pedals[effect].disable();
		}
	}, {
		key: "toogleEffectOf",
		value: function toogleEffectOf(index) {
			this.presenter.toogleEffectOf(index);
		}
	}]);

	return HomeController;
})();

var PatchDetailsComponent = (function () {
	function PatchDetailsComponent(patchDetailsId) {
		_classCallCheck(this, PatchDetailsComponent);

		var patchDetails = document.getElementById(patchDetailsId);

		this.nameElement = patchDetails.querySelector("#patchName");
		this.numberElement = patchDetails.querySelector("#patchNumber");
	}

	_createClass(PatchDetailsComponent, [{
		key: "setName",
		value: function setName(name) {
			this.nameElement.innerHTML = name;
		}
	}, {
		key: "setNumber",
		value: function setNumber(number) {
			if (number < 10) number = "0" + number;
			this.numberElement.innerHTML = number;
		}
	}]);

	return PatchDetailsComponent;
})();

var PedalboardComponent = function PedalboardComponent(pedalboardId, controller) {
	var _this = this;

	_classCallCheck(this, PedalboardComponent);

	this.pedals = document.getElementById(pedalboardId).querySelectorAll("guitar-pedal");

	var _loop = function (i) {
		var pedal = _this.pedals[i];
		pedal.click = function () {
			return controller.toogleEffectOf(i);
		};
	};

	for (var i = 0; i < this.pedals.length; i++) {
		_loop(i);
	}
};

"use strict";

var Pagina = (function () {
	function Pagina(router) {
		_classCallCheck(this, Pagina);

		this["router"] = router;
	}

	_createClass(Pagina, [{
		key: "barra",
		value: function barra() {
			return this["router"].barra;
		}
	}, {
		key: "router",
		value: function router() {
			return this["router"];
		}
	}, {
		key: "inicializar",

		/** Realiza as ações de inicialização
   * quando a tela é chamada
   */
		value: function inicializar() {}
	}, {
		key: "finalizar",

		/** Realiza as ações de encerramento
   */
		value: function finalizar() {}
	}]);

	return Pagina;
})();

"use strict";

var HomePagina = (function (_Pagina) {
	_inherits(HomePagina, _Pagina);

	function HomePagina(router) {
		_classCallCheck(this, HomePagina);

		_get(Object.getPrototypeOf(HomePagina.prototype), "constructor", this).call(this, router);
		this.controller = new HomeController(this);
		this.pedal = null;
	}

	_createClass(HomePagina, [{
		key: "inicializar",
		value: function inicializar(parametros) {
			var _this2 = this;

			var selectPedalPromise = function selectPedalPromise(pedals) {
				return new Promise(function (resolve, reject) {
					return resolve(pedals[0]);
				});
			};
			var showPedalController = function showPedalController(pedalController) {
				console.log(pedalController);

				_this2.pedal = pedalController;

				_this2.pedal.on();
				_this2.pedal.addListenner(_this2);
				_this2.pedal.send(ZoomGSeriesMessages.REQUEST_CURRENT_PATCH_NUMBER());
			};

			var pedalLoader = new PedalLoader(selectPedalPromise);

			pedalLoader.load().then(showPedalController);
		}
	}, {
		key: "finalizar",
		value: function finalizar() {
			this.pedal.off();
		}
	}, {
		key: "onChange",

		////////////////////////////////////////

		value: function onChange(messages) {
			var _this3 = this;

			messages.getBy(CommonCause.ACTIVE_EFFECT).forEach(function (message) {
				return _this3.updateEffect(message, CommonCause.ACTIVE_EFFECT);
			});
			messages.getBy(CommonCause.DISABLE_EFFECT).forEach(function (message) {
				return _this3.updateEffect(message, CommonCause.DISABLE_EFFECT);
			});

			messages.getBy(CommonCause.TO_PATCH).forEach(function (message) {
				return _this3.setPatch(message);
			});

			messages.getBy(CommonCause.SET_PARAM).forEach(function (message) {
				return console.log(_this3.pedal);
			});

			messages.getBy(CommonCause.PATCH_NAME).forEach(function (message) {
				_this3.controller.setPatchTitle(message.details.value);
			});
			messages.getBy(CommonCause.PATCH_NUMBER).forEach(function (message) {
				_this3.controller.setPatchNumber(message.details.value);
			});
		}
	}, {
		key: "updateEffect",
		value: function updateEffect(message, cause) {
			var patch = message.details.patch;
			var effect = message.details.effect;

			if (patch != this.pedal.multistomp().getIdCurrentPatch()) return;

			if (cause == CommonCause.ACTIVE_EFFECT) this.controller.active(effect);else this.controller.disable(effect);
		}
	}, {
		key: "setPatch",
		value: function setPatch(message) {
			var idPatch = message.details.patch;

			this.pedal.send(ZoomGSeriesMessages.REQUEST_SPECIFIC_PATCH_DETAILS(idPatch));
			this.controller.setPatchNumber(idPatch);
		}
	}, {
		key: "toogleEffectOf",
		value: function toogleEffectOf(effect) {
			this.pedal.toogleEffect(effect);
		}
	}]);

	return HomePagina;
})(Pagina);

"use strict";

var PaginaRouter = (function () {
	function PaginaRouter() {
		_classCallCheck(this, PaginaRouter);

		this.historico = new Historico();

		this["paginas"] = {};
		this._adicionarPaginasEm(this["paginas"]);
	}

	_createClass(PaginaRouter, [{
		key: "_adicionarPaginasEm",
		value: function _adicionarPaginasEm(dicionario) {
			dicionario["home"] = new HomePagina(this);
		}
	}, {
		key: "_irParaPagina",
		value: function _irParaPagina(pagina, parametros) {
			var paginaAtual = this.historico.atual();

			if (paginaAtual) paginaAtual.pagina.finalizar();

			paginaAtual = new PaginaHistorico(this["paginas"][pagina], parametros);
			this.historico.atual(paginaAtual);

			paginaAtual.pagina.inicializar(parametros);
		}
	}, {
		key: "irParaPaginaHome",
		value: function irParaPaginaHome() {
			this._irParaPagina("home");
		}
	}, {
		key: "irParaPaginaAnterior",
		value: function irParaPaginaAnterior() {
			if (this.historico.size() <= 1) return;

			var paginaAtual = this.historico.voltar();
			paginaAtual.pagina.finalizar();

			paginaAtual = this.historico.atual();
			paginaAtual.pagina.inicializar(paginaAtual.parametros);
		}
	}]);

	return PaginaRouter;
})();

var Historico = (function () {
	function Historico() {
		_classCallCheck(this, Historico);

		this.pilha = new Pilha();
	}

	_createClass(Historico, [{
		key: "atual",
		value: function atual(novoAtual) {
			if (novoAtual) this.pilha.add(novoAtual);else return this.pilha.last();
		}
	}, {
		key: "anterior",
		value: function anterior() {
			return this.pilha.last();
		}
	}, {
		key: "voltar",
		value: function voltar() {
			return this.pilha.pop();
		}
	}, {
		key: "size",
		value: function size() {
			return this.pilha.size();
		}
	}]);

	return Historico;
})();

var Pilha = (function () {
	function Pilha() {
		_classCallCheck(this, Pilha);

		this.lista = [];
	}

	_createClass(Pilha, [{
		key: "add",
		value: function add(elemento) {
			this.lista.push(elemento);
		}
	}, {
		key: "last",
		value: function last() {
			return this.lista[this.lista.length - 1];
		}
	}, {
		key: "pop",
		value: function pop() {
			return this.lista.pop();
		}
	}, {
		key: "size",
		value: function size() {
			return this.lista.length;
		}
	}]);

	return Pilha;
})();

var PaginaHistorico = function PaginaHistorico(pagina, parametros) {
	_classCallCheck(this, PaginaHistorico);

	this.pagina = pagina;
	this.parametros = parametros;
};

"use strict";

var Includer = (function () {
	function Includer(href) {
		_classCallCheck(this, Includer);

		var content = document.querySelector("link[rel=\"import\"][href^=\"" + href + "\"]");
		this.template = content["import"].querySelector("template");
	}

	_createClass(Includer, [{
		key: "gerarEm",
		value: function gerarEm(tag) {
			var content = document.importNode(this.template.content, true);
			tag.appendChild(content);
		}
	}]);

	return Includer;
})();

"use strict";

var PedalGerador = (function () {
	function PedalGerador() {
		_classCallCheck(this, PedalGerador);

		this.pedals = this.getContentOf("src/app/template/pedal/zoom-g3v2.html");

		console.log(this.pedals);
	}

	_createClass(PedalGerador, [{
		key: "getContentOf",
		value: function getContentOf(href) {
			return document.querySelector("link[rel=\"import\"][href^=\"" + href + "\"]");
		}
	}, {
		key: "generateFor",
		value: function generateFor(name) {
			var knobsTemplate = this.knobsTemplateOf(name);

			var guitarPedal = document.createElement("guitar-pedal");
			var knobs = document.importNode(knobsTemplate.content, true);
			guitarPedal.addKnobs(knobs);
			guitarPedal.name = name;

			return guitarPedal;
		}
	}, {
		key: "knobsTemplateOf",
		value: function knobsTemplateOf(pedalName) {
			return this.pedals["import"].querySelector("template[data-name=\"" + pedalName + "\"]");
		}
	}, {
		key: "pedalsNames",
		value: function pedalsNames() {
			var pedalsNames = [];
			var pedals = this.pedals["import"].querySelectorAll("template");

			for (var i = 0; i < pedals.length; i++) {
				var pedal = pedals[i];
				pedalsNames.push(pedal.getAttribute("data-name"));
			}

			return pedalsNames;
		}
	}]);

	return PedalGerador;
})();

var ErrorClass = (function (_Error) {
	_inherits(ErrorClass, _Error);

	function ErrorClass(message) {
		_classCallCheck(this, ErrorClass);

		_get(Object.getPrototypeOf(ErrorClass.prototype), "constructor", this).call(this);

		if (Error.hasOwnProperty("captureStackTrace")) Error.captureStackTrace(this, this.constructor);else Object.defineProperty(this, "stack", {
			value: new Error().stack
		});

		Object.defineProperty(this, "message", {
			value: message
		});
	}

	return ErrorClass;
})(Error);

"use strict";

var ImplemetationError = (function (_ErrorClass) {
	_inherits(ImplemetationError, _ErrorClass);

	function ImplemetationError() {
		_classCallCheck(this, ImplemetationError);

		_get(Object.getPrototypeOf(ImplemetationError.prototype), "constructor", this).apply(this, arguments);
	}

	return ImplemetationError;
})(ErrorClass);

"use strict";

var DeviceNotFoundError = (function (_ErrorClass2) {
	_inherits(DeviceNotFoundError, _ErrorClass2);

	function DeviceNotFoundError() {
		_classCallCheck(this, DeviceNotFoundError);

		_get(Object.getPrototypeOf(DeviceNotFoundError.prototype), "constructor", this).apply(this, arguments);
	}

	return DeviceNotFoundError;
})(ErrorClass);

var AbstractClassError = (function (_ErrorClass3) {
	_inherits(AbstractClassError, _ErrorClass3);

	function AbstractClassError(classe) {
		_classCallCheck(this, AbstractClassError);

		_get(Object.getPrototypeOf(AbstractClassError.prototype), "constructor", this).call(this, "The \"" + classe.constructor.name + "\" class is abstract");
	}

	return AbstractClassError;
})(ErrorClass);

var AbstractMethodError = (function (_ErrorClass4) {
	_inherits(AbstractMethodError, _ErrorClass4);

	function AbstractMethodError(message) {
		_classCallCheck(this, AbstractMethodError);

		_get(Object.getPrototypeOf(AbstractMethodError.prototype), "constructor", this).call(this, message);
	}

	return AbstractMethodError;
})(ErrorClass);

function abstract(target, name, descriptor) {
	var isMethod = descriptor !== undefined && descriptor.value !== undefined;

	if (isMethod) descriptor.value = function () {
		if (this.constructor.name == target.constructor.name) throw new AbstractMethodError("The method \"" + name + "\" of \"" + target.constructor.name + "\" is abstract");else throw new AbstractMethodError("The method \"" + name + "\" of \"" + this.constructor.name + "\" is a \"" + target.constructor.name + "\" abstract method. It must be implemented");
	};

	return descriptor;
}

"use strict";

var BinarioUtil = (function () {
	function BinarioUtil() {
		_classCallCheck(this, BinarioUtil);
	}

	_createClass(BinarioUtil, null, [{
		key: "byteArrayToHex",

		/**
   * @param byte[] a
   * @return String
   */
		value: function byteArrayToHex(bytes) {
			var returned = " ";
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = bytes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var byte = _step.value;

					returned += byte.toString(16).toUpperCase() + " ";
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return "[" + returned + "]";
		}
	}]);

	return BinarioUtil;
})();

//@abstract

var MessagesCollection = (function () {
	function MessagesCollection() {
		_classCallCheck(this, MessagesCollection);

		this.messages = new Array();
	}

	_createClass(MessagesCollection, [{
		key: "add",
		value: function add(message) {
			this.messages.push(message);

			return this;
		}
	}, {
		key: "concatWith",
		value: function concatWith(messages) {
			var _this4 = this;

			messages.forEach(function (message) {
				return _this4.add(message);
			});

			return this;
		}
	}, {
		key: Symbol.iterator,

		/**
   * @return Iterator<Message>
   */
		value: function value() {
			return this.messages[Symbol.iterator]();
		}
	}, {
		key: "forEach",
		value: function forEach(funcao) {
			this.messages.forEach(funcao);
		}
	}, {
		key: "toString",

		/**
      * @return String
      */
		//@Override
		value: function toString() {
			var returned = "";

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.messages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var message = _step2.value;

					returned += message.toString();
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
						_iterator2["return"]();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return returned;
		}
	}]);

	return MessagesCollection;
})();

"use strict";

var MidiMessageTester = (function () {

	/**
  * @param MidiMessage message
  */

	function MidiMessageTester(message) {
		_classCallCheck(this, MidiMessageTester);

		this.message = message;
	}

	_createClass(MidiMessageTester, [{
		key: "init",

		/**
   * @return MidiMessageTester
   */
		value: function init() {
			this.tests = new Tests();

			return this;
		}
	}, {
		key: "test",

		/**
   * @return boolean
   */
		value: function test() {
			return this.tests.finalResult();
		}
	}, {
		key: "isLessThen",

		/**
   * @param byte[] bytes
   * @return {Boolean}
   */
		value: function isLessThen(bytes) {
			this.tests.add(this.message.length < bytes.length);

			return this;
		}
	}, {
		key: "startingWith",

		/**
   * @param byte[] bytes
   * @return MidiMessageTester
   */
		value: function startingWith(bytes) {
			if (!(bytes.length <= this.message.length)) {
				this.tests.add(false);

				return this;
			}

			for (var i = 0; i < bytes.length; i++) {
				if (bytes[i] != this.message[i]) this.tests.add(false);
			}this.tests.add(true);

			return this;
		}
	}, {
		key: "sizeIs",

		/**
   * @param int size
   * @return MidiMessageTester
   */
		value: function sizeIs(size) {
			this.tests.add(this.message.length == size);

			return this;
		}
	}, {
		key: "endingWith",

		/**
   * @param byte[] bytes
   * @return MidiMessageTester
   */
		value: function endingWith(bytes) {
			if (!(bytes.length <= this.message.length)) {
				this.tests.add(false);

				return this;
			}

			for (var i = 1; i <= bytes.length; i++) {
				if (bytes[bytes.length - i] != this.message[this.message.length - i]) this.tests.add(false);
			}this.tests.add(true);

			return this;
		}
	}]);

	return MidiMessageTester;
})();

var Tests = (function () {
	function Tests() {
		_classCallCheck(this, Tests);

		this.result = true;
	}

	_createClass(Tests, [{
		key: "add",

		/**
   * @param boolean result
   */
		value: function add(result) {
			if (this.result == false) return;
			this.result = result;
		}
	}, {
		key: "finalResult",
		value: function finalResult() {
			return this.result;
		}
	}]);

	return Tests;
})();

"use strict";

var Optional = (function () {
	function Optional(content) {
		_classCallCheck(this, Optional);

		this.content = content;
	}

	_createClass(Optional, [{
		key: "isPresent",
		value: function isPresent() {
			return this.content !== null;
		}
	}, {
		key: "get",
		value: function get() {
			if (!this.isPresent()) throw new Error("NullPointerException");

			return this.content;
		}
	}], [{
		key: "of",
		value: function of(content) {
			return new Optional(content);
		}
	}, {
		key: "empty",
		value: function empty() {
			return new Optional(null);
		}
	}]);

	return Optional;
})();

"use strict";

// FIXME - Fazer SimpleInterface utilizar também um genérico deste

var MultistompChanger = (function () {

	/**
  * @param PedalController controller
  * @return
  */

	function MultistompChanger(controller) {
		_classCallCheck(this, MultistompChanger);

		this.controller = controller;
	}

	_createClass(MultistompChanger, [{
		key: "attempt",

		/**
   * @param Message message
   */
		value: function attempt(message) {
			if (message.is(CommonCause.TO_PATCH)) this.controller.toPatch(message.details.patch);else if (this.isActiveEffectCurrentPatch(message)) this.controller.activeEffect(message.details.effect);else if (this.isActiveEffectSpecificPatch(message)) this.controller.multistomp().patchs[message.details.patch].effects[message.details.effect].active();else if (this.isDisableEffectCurrentPatch(message)) this.controller.disableEffect(message.details.effect);else if (this.isDisableEffectSpecificPatch(message)) this.controller.multistomp().patchs[message.details.patch].effects[message.details.effect].disable();else if (message.is(CommonCause.SET_PARAM)) {
				var idEffect = message.details.effect;
				var idParam = message.details.param;
				var newValue = message.details.value;

				this.controller.setEffectParam(idEffect, idParam, newValue);
			} else if (message.is(CommonCause.PATCH_NAME)) this.controller.multistomp().currentPatch().name = message.details.value;
		}
	}, {
		key: "isActiveEffectCurrentPatch",
		value: function isActiveEffectCurrentPatch(message) {
			return message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch == Messages.Details.NULL;
		}
	}, {
		key: "isDisableEffectCurrentPatch",
		value: function isDisableEffectCurrentPatch(message) {
			return message.is(CommonCause.DISABLE_EFFECT) && message.details.patch == Messages.Details.NULL;
		}
	}, {
		key: "isActiveEffectSpecificPatch",
		value: function isActiveEffectSpecificPatch(message) {
			message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch != Details.NULL;
		}
	}, {
		key: "isDisableEffectSpecificPatch",
		value: function isDisableEffectSpecificPatch(message) {
			message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch != Details.NULL;
		}
	}]);

	return MultistompChanger;
})();

"use strict";

var PedalCompany = (function () {

	/**
  * @param String name
  */

	function PedalCompany(name) {
		_classCallCheck(this, PedalCompany);

		this.name = name;
	}

	_createClass(PedalCompany, [{
		key: "getName",
		value: function getName() {
			return this.name;
		}
	}, {
		key: "toString",

		/**
   * @return String
   */
		//@Override
		value: function toString() {
			return this.name;
		}
	}]);

	return PedalCompany;
})();

PedalCompany.NULL = new PedalCompany("Unknown Company"), PedalCompany.ZoomCorp = new PedalCompany("Zoom Corporation"), PedalCompany.Line6 = new PedalCompany("Line 6"), PedalCompany.Roland = new PedalCompany("Roland Corporation");

"use scrict";

var PedalController = (function () {

	/**
  * @param pedal Multistomp
  */

	function PedalController(midiConnection, pedal) {
		_classCallCheck(this, PedalController);

		this.controllerListenners = new Array();
		this.realMultistompListenners = new Array();
		this.realChange = false;

		this.started = false;

		this.pedal = pedal;

		this.connection = midiConnection;
		this.connection.setListenner(this);

		this.pedal.addListenner(this);

		this.controllerListenners.push(new Log("Controller"));
		this.realMultistompListenners.push(new Log("Real Multistomp"));
	}

	_createClass(PedalController, [{
		key: "on",

		/*************************************************/

		/** Turn on and inicialize the pedal
   */
		value: function on() {
			if (this.started) return;

			this.started = true;
			this.connection.start();

			this.connection.send(this.pedal.start());
			this.realChange = false; // FIXME - GAMBIARRA
		}
	}, {
		key: "off",

		/** Close connection and turn off the pedal
   */
		value: function off() {
			if (!this.started) return;

			this.started = false;
			this.connection.stop();
		}
	}, {
		key: "hasStarted",

		/*************************************************/

		value: function hasStarted() {
			return this.started;
		}
	}, {
		key: "multistomp",
		value: function multistomp() {
			return this.pedal;
		}
	}, {
		key: "nextPatch",

		/*************************************************/

		value: function nextPatch() {
			this.pedal.nextPatch();
		}
	}, {
		key: "beforePatch",
		value: function beforePatch() {
			this.pedal.beforePatch();
		}
	}, {
		key: "toPatch",
		value: function toPatch(index) {
			this.pedal.toPatch(index);
		}
	}, {
		key: "toogleEffect",

		/*************************************************/

		/**
   * @param idEffect int
   */
		value: function toogleEffect(idEffect) {
			this.pedal.currentPatch().effects[idEffect].toggle();
		}
	}, {
		key: "hasActived",

		/**
   * @param idEffect int
   */
		value: function hasActived(idEffect) {
			return this.pedal.currentPatch().effects[idEffect].hasActived();
		}
	}, {
		key: "activeEffect",

		/**
   * @param idEffect int
   */
		value: function activeEffect(idEffect) {
			this.pedal.currentPatch().effects[idEffect].active();
		}
	}, {
		key: "disableEffect",

		/**
   * @param idEffect int
   */
		value: function disableEffect(idEffect) {
			this.pedal.currentPatch().effects[idEffect].disable();
		}
	}, {
		key: "setEffectParam",

		/**
   * @param int idEffect
   * @param int idParam
   * @param int value
   */
		value: function setEffectParam(idEffect, idParam, value) {
			this.pedal.currentPatch().effects[idEffect].params[idParam].setValue(value);
		}
	}, {
		key: "getAmountEffects",

		/** @return Amount of effects that the current patch has
   */
		value: function getAmountEffects() {
			return this.pedal.currentPatch().effects.length;
		}
	}, {
		key: "addListenner",

		/** @return listenner OnMultistompListenner
   */
		value: function addListenner(listenner) {
			this.pedal.addListenner(listenner);
		}
	}, {
		key: "toString",

		/*************************************************/
		value: function toString() {
			var retorno = "State: ";
			retorno += started ? "On" : "Off";
			retorno += "\n";

			return retorno + this.pedal.toString();
		}
	}, {
		key: "onChange",

		/** Multistomp Change */
		/**
   * @param messages Messages
   */
		value: function onChange(messages) {
			if (this.realChange) {
				this.realChange = false;
				return;
			}

			this.connection.send(messages);
			this.notify(this.controllerListenners, messages);
		}
	}, {
		key: "update",

		/** Real multistomp Change */
		/**
   * @param messages Messages
   */
		value: function update(messages) {
			this.realChange = true;

			var changer = new MultistompChanger(this);
			messages.forEach(function (message) {
				return changer.attempt(message);
			});

			this.notify(this.realMultistompListenners, messages);
		}
	}, {
		key: "notify",

		/**
   * @param listenners []
   * @param messages Messages
   */
		value: function notify(listenners, messages) {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = listenners[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var listenner = _step3.value;

					listenner.onChange(messages);
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
						_iterator3["return"]();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
		}
	}, {
		key: "sendMessage",

		/**
   * @param SysexMessage
   */
		//@Deprecated
		value: function sendMessage(sysexMessage) {
			this.connection.send(sysexMessage);
		}
	}, {
		key: "send",

		/**
   * @param messages Messages
   */
		value: function send(messages) {
			this.connection.send(messages);
			this.realChange = true;
		}
	}]);

	return PedalController;
})();

"use strict";

var PedalGenerator = (function () {
	function PedalGenerator(midiConnection) {
		_classCallCheck(this, PedalGenerator);

		this.midiConnection = midiConnection;
	}

	_createClass(PedalGenerator, [{
		key: "generateFor",
		value: function generateFor(pedalType) {
			var pedal = MultistompFactory.For(pedalType);

			return new PedalController(this.midiConnection, pedal);
		}
	}]);

	return PedalGenerator;
})();

"use strict";

/**
 * Load the real pedal patchs and generate the Pedal object
 */

var PedalLoader = (function () {
	function PedalLoader(selectPedalPromise) {
		_classCallCheck(this, PedalLoader);

		this.selectPedalPromise = selectPedalPromise;

		this.midiSystem = new MidiSystem();
	}

	_createClass(PedalLoader, [{
		key: "load",
		value: function load() {
			return this.midiSystem.start().then(this.findPedals.bind(this)).then(this.selectPedal.bind(this)).then(this.findPedalDevices.bind(this)).then(this.generateConnection.bind(this)).then(this.generateMultistomp.bind(this));
		}
	}, {
		key: "findPedals",
		value: function findPedals() {
			var finder = new PedalsFinder(this.midiSystem);
			var pedalsFound = finder.find(PedalType.values);

			return new Promise(function (resolve) {
				return resolve(pedalsFound);
			});
		}
	}, {
		key: "selectPedal",
		value: function selectPedal(pedalsFound) {
			return this.selectPedalPromise(pedalsFound);
		}
	}, {
		key: "findPedalDevices",
		value: function findPedalDevices(pedalType) {
			var pedalDevices = this.midiSystem.devicesOf(pedalType);

			return new Promise(function (resolve) {
				resolve({ pedalType: pedalType, pedalDevices: pedalDevices });
			});
		}
	}, {
		key: "generateConnection",
		value: function generateConnection(pedal) {
			var pedalType = pedal.pedalType;
			var pedalDevices = pedal.pedalDevices;

			var connection = new MidiConnection(pedalType, pedalDevices);

			return new Promise(function (resolve) {
				resolve({ connection: connection, pedalType: pedalType });
			});
		}
	}, {
		key: "generateMultistomp",
		value: function generateMultistomp(params) {
			var connection = params.connection;
			var pedalType = params.pedalType;

			var generator = new PedalGenerator(connection);
			var multistomp = generator.generateFor(pedalType);

			return new Promise(function (resolve) {
				return resolve(multistomp);
			});
		}
	}]);

	return PedalLoader;
})();

"use strict";

var PedalsFinder = (function () {
	function PedalsFinder(midiSystem) {
		_classCallCheck(this, PedalsFinder);

		this.midiSystem = midiSystem;
	}

	_createClass(PedalsFinder, [{
		key: "find",
		value: function find(pedalsType) {
			var pedals = new Array();

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = pedalsType[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var multistomp = _step4.value;

					if (this.isConnected(multistomp)) pedals.push(multistomp);
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
						_iterator4["return"]();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			return pedals;
		}
	}, {
		key: "isConnected",
		value: function isConnected(multistomp) {
			return this.findDevicesFor(multistomp).length != 0;
		}
	}, {
		key: "findDevicesFor",

		/**
   * @param PedalType type
   * @return List<Info> all devices that corresponding the PedalType
   */
		value: function findDevicesFor(type) {
			var devices = new Array();

			var device = undefined;

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.midiSystem.midiDevices[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					device = _step5.value;

					if (device.name.includes(type.USBName)) devices.push(device);
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
						_iterator5["return"]();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			return devices;
		}
	}]);

	return PedalsFinder;
})();

var MidiMessage = function MidiMessage() {
	_classCallCheck(this, MidiMessage);

	this.message = [];
	var _iteratorNormalCompletion6 = true;
	var _didIteratorError6 = false;
	var _iteratorError6 = undefined;

	try {
		for (var _len = arguments.length, bytes = Array(_len), _key = 0; _key < _len; _key++) {
			bytes[_key] = arguments[_key];
		}

		for (var _iterator6 = bytes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
			var byte = _step6.value;

			this.message.push(byte);
		}
	} catch (err) {
		_didIteratorError6 = true;
		_iteratorError6 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
				_iterator6["return"]();
			}
		} finally {
			if (_didIteratorError6) {
				throw _iteratorError6;
			}
		}
	}
};

var MidiMessages = (function (_MessagesCollection) {
	_inherits(MidiMessages, _MessagesCollection);

	function MidiMessages() {
		_classCallCheck(this, MidiMessages);

		_get(Object.getPrototypeOf(MidiMessages.prototype), "constructor", this).apply(this, arguments);
	}

	return MidiMessages;
})(MessagesCollection);

"use strict";

var MidiSystem = (function () {
	function MidiSystem() {
		_classCallCheck(this, MidiSystem);
	}

	_createClass(MidiSystem, [{
		key: "start",
		value: function start() {
			return navigator.requestMIDIAccess({ sysex: true }).then(this.onStartPromised.bind(this), this.onError.bind(this));
		}
	}, {
		key: "onStartPromised",
		value: function onStartPromised(midiAccess) {
			this.onStart(midiAccess);

			return new Promise(function (resolve) {
				return resolve();
			});
		}
	}, {
		key: "onStart",
		value: function onStart(midiAccess) {
			this.midiInputs = midiAccess.inputs;
			this.midiOutputs = midiAccess.outputs;

			console.log("Connected");
		}
	}, {
		key: "onError",
		value: function onError(midiAccess) {
			console.log(midiAccess);
			console.log("Deu pau :/");
		}
	}, {
		key: "devicesOf",
		value: function devicesOf(pedalType) {
			return {
				"input": this.inputMidiDeviceOf(pedalType),
				"output": this.outputMidiDeviceOf(pedalType)
			};
		}
	}, {
		key: "inputMidiDeviceOf",
		value: function inputMidiDeviceOf(pedalType) {
			return this.midiDeviceOfType(pedalType, this.midiInputs);
		}
	}, {
		key: "outputMidiDeviceOf",
		value: function outputMidiDeviceOf(pedalType) {
			return this.midiDeviceOfType(pedalType, this.midiOutputs);
		}
	}, {
		key: "midiDeviceOfType",
		value: function midiDeviceOfType(pedalType, listDevices) {
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = listDevices.values()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var device = _step7.value;

					if (device.name.includes(pedalType.USBName)) return Optional.of(device);
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
						_iterator7["return"]();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			return Optional.empty();
		}
	}, {
		key: "midiDevices",
		get: function get() {
			var devices = [];

			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = this.midiInputs.values()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var input = _step8.value;

					devices.push(input);
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
						_iterator8["return"]();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = this.midiOutputs.values()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var output = _step9.value;

					devices.push(output);
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9["return"]) {
						_iterator9["return"]();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}

			return devices;
		}
	}]);

	return MidiSystem;
})();

var MidiConnection = (function () {
	function MidiConnection(pedalType, pedalDevices) {
		_classCallCheck(this, MidiConnection);

		this.listenner = Optional.empty();
		this.analyzer = Optional.empty();

		this.transmition = new MidiTransmition(pedalDevices);
		this.transmition.setOnDataListenerReceived(this);

		this.codification = MessageCodificationFactory.For(pedalType);
	}

	_createClass(MidiConnection, [{
		key: "start",

		/*************************************************/

		value: function start() {
			this.transmition.start();
		}
	}, {
		key: "stop",
		value: function stop() {
			this.transmition.stop();
		}
	}, {
		key: "send",

		/*************************************************/

		/**
  * @param messages Messages
  */
		value: function send(messages) {
			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				for (var _iterator10 = this.generateMidiMessages(messages)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var midiMessage = _step10.value;

					this.sendMidiMessage(midiMessage);
				}
			} catch (err) {
				_didIteratorError10 = true;
				_iteratorError10 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion10 && _iterator10["return"]) {
						_iterator10["return"]();
					}
				} finally {
					if (_didIteratorError10) {
						throw _iteratorError10;
					}
				}
			}
		}
	}, {
		key: "generateMidiMessages",

		/**
  * @param messages Messages
   *
   * @return List<MidiMessage>
  */
		value: function generateMidiMessages(messages) {
			return this.codification.encode(messages);
		}
	}, {
		key: "sendMidiMessage",

		/**
   * @param MidiMessage message
   */
		value: function sendMidiMessage(message) {
			console.log("PASSAR PARA ANALIZER");
			console.log("MIDI sended: ");
			console.log(" " + BinarioUtil.byteArrayToHex(message.message));

			this.transmition.send(message.message);
		}
	}, {
		key: "setListenner",

		/*************************************************/

		/**
   * @param listenner OnUpdateListenner
   */
		value: function setListenner(listenner) {
			this.listenner = Optional.of(listenner);
		}
	}, {
		key: "onDataReceived",

		/**
   * @param message MidiMessage
   */
		//@override
		value: function onDataReceived(message) {
			console.log("PASSAR PARA ANALIZER");
			console.log("MIDI received: ");
			console.log(" " + BinarioUtil.byteArrayToHex(message));

			if (this.analyzer.isPresent()) this.analyzer.get().analyze(message);

			if (!this.codification.isForThis(message)) {
				console.log(" unknown ");
				return;
			}

			var messagesDecoded = this.codification.decode(message);

			if (this.listenner.isPresent()) this.listenner.get().update(messagesDecoded);
		}
	}]);

	return MidiConnection;
})();

MidiConnection.OnUpdateListenner = (function () {
	function OnUpdateListenner() {
		_classCallCheck(this, OnUpdateListenner);
	}

	_createClass(OnUpdateListenner, [{
		key: "update",

		/**
   * @param messages Messages
   */
		value: function update(messages) {}
	}]);

	return OnUpdateListenner;
})();

"use strict";

var MidiMessagesAnalyzer = (function () {
	function MidiMessagesAnalyzer(pedalController, changes) {
		_classCallCheck(this, MidiMessagesAnalyzer);

		this.pedal = pedalController;
		this.pedal.connection.analyzer = Optional.of(this);

		this.started = false;
		this.messages = undefined;
		this.changes = changes;
	}

	_createClass(MidiMessagesAnalyzer, [{
		key: "start",
		value: function start() {
			this.started = true;
			this.messages = [];

			while (this.changes.hasNext()) this.changes.next();
		}
	}, {
		key: "stop",
		value: function stop() {
			this.started = false;
		}
	}, {
		key: "analyze",
		value: function analyze(message) {
			if (!this.started) return;

			this.messages.push(message);
		}
	}]);

	return MidiMessagesAnalyzer;
})();

"use strict";

// FIXME - Utilize *yeld generators...

var PedalChanges = (function () {
	function PedalChanges(pedalController, totalChanges) {
		_classCallCheck(this, PedalChanges);

		this.totalChanges = totalChanges;
		this.currentChange = 0;

		this.pedal = pedalController;
	}

	_createClass(PedalChanges, [{
		key: "init",
		value: function init() {}
	}, {
		key: "hasNext",
		value: function hasNext() {
			return this.currentChange < this.totalChanges;
		}
	}, {
		key: "next",
		value: function next() {
			this.currentChange++;
			this.nextImp();
		}
	}, {
		key: "nextImp",
		value: function nextImp() {}
	}]);

	return PedalChanges;
})();

var ZoomGSeriesDetectPedalChanges = (function (_PedalChanges) {
	_inherits(ZoomGSeriesDetectPedalChanges, _PedalChanges);

	function ZoomGSeriesDetectPedalChanges(pedalController) {
		_classCallCheck(this, ZoomGSeriesDetectPedalChanges);

		_get(Object.getPrototypeOf(ZoomGSeriesDetectPedalChanges.prototype), "constructor", this).call(this, pedalController, 25);
	}

	_createClass(ZoomGSeriesDetectPedalChanges, [{
		key: "init",
		value: function init() {
			this.pedal.toPatch(8);
			this.zeroParams(0);

			this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(1, 117));
			this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(2, 117));
			this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(3, 117));
			this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(4, 117));
			this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(5, 117));
		}
	}, {
		key: "zeroParams",
		value: function zeroParams(idPedal) {
			this.pedal.setEffectParam(idPedal, 0, 0);
			this.pedal.setEffectParam(idPedal, 1, 0);
			this.pedal.setEffectParam(idPedal, 2, 0);
			this.pedal.setEffectParam(idPedal, 3, 0);
			this.pedal.setEffectParam(idPedal, 4, 0);
			this.pedal.setEffectParam(idPedal, 5, 0);
			this.pedal.setEffectParam(idPedal, 6, 0);
			this.pedal.setEffectParam(idPedal, 7, 0);
			this.pedal.setEffectParam(idPedal, 8, 0);
		}
	}, {
		key: "nextImp",
		value: function nextImp() {
			this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(1, this.currentPatch));
			this.zeroParams(0);
		}
	}]);

	return ZoomGSeriesDetectPedalChanges;
})(PedalChanges);

"use strict";

var MessageCodification = (function () {
	function MessageCodification(encoder, decoder) {
		_classCallCheck(this, MessageCodification);

		this.encoder = encoder;
		this.decoder = decoder;
	}

	_createClass(MessageCodification, [{
		key: "encode",
		value: function encode(message) {
			return this.encoder.encode(message);
		}
	}, {
		key: "decode",
		value: function decode(message) {
			return this.decoder.decode(message);
		}
	}, {
		key: "isForThis",
		value: function isForThis(message) {
			return this.decoder.isForThis(message);
		}
	}]);

	return MessageCodification;
})();

"use strict";

var MessageCodificationFactory = (function () {
	function MessageCodificationFactory() {
		_classCallCheck(this, MessageCodificationFactory);
	}

	_createClass(MessageCodificationFactory, null, [{
		key: "For",

		/**
   * @param PedalType pedalType
   * @return MessageEncoder
   */
		value: function For(pedalType) {
			if (PedalType.G3 == pedalType) return new MessageCodification(new ZoomGSeriesMessageEncoder(), new ZoomGSeriesMessageDecoder());

			throw new Error("MessageCodification not found for: " + pedalType);
		}
	}]);

	return MessageCodificationFactory;
})();

"use strict";

var MidiTransmition = (function () {

	/**
  * @param PedalType pedalType
  */

	function MidiTransmition(midiDevices) {
		_classCallCheck(this, MidiTransmition);

		if (!midiDevices.input.isPresent() || !midiDevices.output.isPresent()) throw new DeviceNotFoundError("Midi device(s) not found for: " + pedalType + " (" + pedalType.getUSBName() + ")");

		this.sender = new MidiTransmitionSender(midiDevices.output.get());
		this.reader = new MidiTransmitionReader(midiDevices.input.get());
	}

	_createClass(MidiTransmition, [{
		key: "start",
		value: function start() {
			this.sender.start();
			this.reader.start();
		}
	}, {
		key: "stop",
		value: function stop() {
			this.sender.stop();
			this.reader.stop();
		}
	}, {
		key: "setOnDataListenerReceived",
		value: function setOnDataListenerReceived(listener) {
			this.reader.setListenner(listener);
		}
	}, {
		key: "send",
		value: function send(midiMessage) {
			this.sender.send(midiMessage);
		}
	}]);

	return MidiTransmition;
})();

"use strict";

var AbstractMidiTransmition = (function () {
	function AbstractMidiTransmition(device) {
		_classCallCheck(this, AbstractMidiTransmition);

		this.device = device;
	}

	_createClass(AbstractMidiTransmition, [{
		key: "start",
		value: function start() {
			this.device.open();
		}
	}, {
		key: "stop",
		value: function stop() {
			this.device.close();
		}
	}]);

	return AbstractMidiTransmition;
})();

"use strict";

/**
 * Send the messages to real Multistomp
 */

var MidiTransmitionReader = (function (_AbstractMidiTransmition) {
	_inherits(MidiTransmitionReader, _AbstractMidiTransmition);

	function MidiTransmitionReader(device) {
		var _this5 = this;

		_classCallCheck(this, MidiTransmitionReader);

		_get(Object.getPrototypeOf(MidiTransmitionReader.prototype), "constructor", this).call(this, device);

		this.device.onmidimessage = function (message) {
			return _this5.send(message);
		};
	}

	_createClass(MidiTransmitionReader, [{
		key: "setListenner",

		/**
   * @param MidiReaderListenner listenner
   */
		value: function setListenner(listenner) {
			this.listenner = listenner;
		}
	}, {
		key: "send",

		/**
   * @param MidiMessage message
   */
		value: function send(message) {
			this.listenner.onDataReceived(message.data);
		}
	}]);

	return MidiTransmitionReader;
})(AbstractMidiTransmition);

"use strict";

/**
 * Send the messages to real Multistomp
 */

var MidiTransmitionSender = (function (_AbstractMidiTransmition2) {
	_inherits(MidiTransmitionSender, _AbstractMidiTransmition2);

	function MidiTransmitionSender(device) {
		_classCallCheck(this, MidiTransmitionSender);

		_get(Object.getPrototypeOf(MidiTransmitionSender.prototype), "constructor", this).call(this, device);
	}

	_createClass(MidiTransmitionSender, [{
		key: "send",

		/**
   * @param MidiMessage message
   */
		value: function send(message) {
			this.device.send(message);
		}
	}]);

	return MidiTransmitionSender;
})(AbstractMidiTransmition);

var MidiMessagesGenerator = (function () {
	function MidiMessagesGenerator(messages, encoder) {
		_classCallCheck(this, MidiMessagesGenerator);

		this.messages = messages;
		this.encoder = encoder;

		this.messagesGenerated = new MidiMessages();
	}

	_createClass(MidiMessagesGenerator, [{
		key: "forEachOfType",
		value: function forEachOfType(cause) {
			var _this6 = this;

			var generate = function generate(method) {
				var messages = _this6._generateMessages(method, cause);
				_this6.messagesGenerated.concatWith(messages);
			};

			return {
				generate: generate
			};
		}
	}, {
		key: "generateMidiMessages",
		value: function generateMidiMessages() {
			return this.messagesGenerated;
		}
	}, {
		key: "_generateMessages",
		value: function _generateMessages(method, cause) {
			method = this._bind(method);

			var messages = new MidiMessages();
			var messagesOfCause = this.messages.getBy(cause);

			messagesOfCause.forEach(function (message) {
				messages.concatWith(method(message, cause));
			});

			return messages;
		}
	}, {
		key: "_bind",
		value: function _bind(method) {
			return method.bind(this.encoder);
		}
	}]);

	return MidiMessagesGenerator;
})();

"use strict";

var PedalType = (function () {
	_createClass(PedalType, null, [{
		key: "values",
		value: new Array(),
		enumerable: true
	}]);

	/**
  * @param String       name
  * @param PedalCompany company
  * @param String       USBName
  */

	function PedalType(name, company, USBName) {
		_classCallCheck(this, PedalType);

		this.name = name;
		this.company = company;
		this.USBName = USBName;

		PedalType.values.push(this);
	}

	_createClass(PedalType, [{
		key: "getId",

		/**
   * @return int
   */
		value: function getId() {
			return this.id;
		}
	}, {
		key: "getCompany",

		/**
   * @return PedalCompany
   */
		value: function getCompany() {
			return this.company;
		}
	}, {
		key: "toString",

		/**
   * @return String
   */
		//@Override
		value: function toString() {
			return this.name + " - " + this.company.toString();
		}
	}, {
		key: "getUSBName",

		/**
   * @return String
   *
   * The name will be used to find out which is the USB which is connected to the PC
   * that is corresponding Pedal
   */
		value: function getUSBName() {
			return this.USBName;
		}
	}]);

	return PedalType;
})();

PedalType.Null = new PedalType("Unknown Pedal", PedalCompany.NULL, "Pedal Unknown is unimplemented"), PedalType.G2Nu = new PedalType("Zoom G2Nu", PedalCompany.ZoomCorp, "G2Nu/G2.1Nu"), PedalType.G3 = new PedalType("Zoom G3v2.0", PedalCompany.ZoomCorp, "ZOOM G Series");

"use strict";

var CommonCause = function CommonCause() {
	_classCallCheck(this, CommonCause);
};

;

CommonCause.TO_PATCH = "TO_PATCH";
CommonCause.GENERAL_VOLUME = "GENERAL_VOLUME";

// Patch
CommonCause.PATCH_NUMBER = "PATCH_NUMBER";
CommonCause.PATCH_VOLUME = "PATCH_VOLUME";
CommonCause.PATCH_NAME = "PATCH_NAME";

// Effect
CommonCause.ACTIVE_EFFECT = "ACTIVE_EFFECT";
CommonCause.DISABLE_EFFECT = "DISABLE_EFFECT";
// Param
CommonCause.SET_PARAM = "SET_PARAM";

var Messages = (function (_MessagesCollection2) {
	_inherits(Messages, _MessagesCollection2);

	function Messages() {
		_classCallCheck(this, Messages);

		_get(Object.getPrototypeOf(Messages.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(Messages, [{
		key: "getBy",

		/**
   * @param Cause cause
   * @return Messages
   */
		value: function getBy(cause) {
			var returned = new Messages();

			var _iteratorNormalCompletion11 = true;
			var _didIteratorError11 = false;
			var _iteratorError11 = undefined;

			try {
				for (var _iterator11 = this[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
					var message = _step11.value;

					if (message.is(cause)) returned.add(message);
				}
			} catch (err) {
				_didIteratorError11 = true;
				_iteratorError11 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion11 && _iterator11["return"]) {
						_iterator11["return"]();
					}
				} finally {
					if (_didIteratorError11) {
						throw _iteratorError11;
					}
				}
			}

			return returned;
		}
	}]);

	return Messages;
})(MessagesCollection);

Messages.Details = (function () {
	function Details() {
		_classCallCheck(this, Details);

		this.patch = Details.NULL;
		this.effect = Details.NULL;
		this.param = Details.NULL;
		this.value = Details.NULL;
	}

	_createClass(Details, [{
		key: "toString",

		/**
   * @return String
   */
		//@Override
		value: function toString() {
			var retorno = "";
			if (this.patch != Details.NULL) retorno += " patch=" + this.patch;
			if (this.effect != Details.NULL) retorno += " effect=" + this.effect;
			if (this.param != Details.NULL) retorno += " param=" + this.param;
			if (this.value != Details.NULL) retorno += " value=" + this.value;

			return retorno;
		}
	}], [{
		key: "NULL",

		// int
		value: -1,
		enumerable: true
	}]);

	return Details;
})();

Messages.Message = (function () {

	/**
  * @param Cause cause
  */

	function Message(cause, details) {
		_classCallCheck(this, Message);

		if (details === undefined) this._MessageCause(cause);else this._MessageCauseDetails(cause, details);
	}

	_createClass(Message, [{
		key: "_MessageCause",
		value: function _MessageCause(cause) {
			this._MessageCauseDetails(cause, new Messages.Details());
		}
	}, {
		key: "_MessageCauseDetails",

		/**
   * @param Cause   cause
   * @param Details details
   */
		value: function _MessageCauseDetails(cause, details) {
			this.cause = cause;
			this.details = details;
		}
	}, {
		key: "details",

		/**
   * @return Details
   */
		value: function details() {
			return this.details;
		}
	}, {
		key: "is",

		/**
   * @param Cause cause
   * @return {Boolean}
   */
		value: function is(cause) {
			return this.cause == cause;
		}
	}, {
		key: "toString",

		/**
   * @return String
   */
		//@Override
		value: function toString() {
			var retorno = this.cause + ": (" + this.details + ")";

			return retorno;
		}
	}]);

	return Message;
})();

"use strict";

var Effect = (function () {

	/**
  * @param int    midiId
  * @param String name
  */

	function Effect(midiId, name) {
		_classCallCheck(this, Effect);

		this.state = false;
		this.params = new Array();
		this.listenner = Optional.empty();

		this.midiId = midiId;
		this.name = name;
	}

	_createClass(Effect, [{
		key: "getMidiId",

		/**
   * Midi Id for send message
      * @return int
      */
		value: function getMidiId() {
			return this.midiId;
		}
	}, {
		key: "getName",

		/**
   * @return String
   */
		value: function getName() {
			return this.name;
		}
	}, {
		key: "active",
		value: function active() {
			this.setState(true);
		}
	}, {
		key: "disable",
		value: function disable() {
			this.setState(false);
		}
	}, {
		key: "toggle",
		value: function toggle() {
			if (this.hasActived()) this.disable();else this.active();
		}
	}, {
		key: "setState",

		/**
   * @param boolean state
   */
		value: function setState(state) {
			this.state = state;

			var details = new Details(Details.TypeChange.PEDAL_STATUS, state ? 1 : 0);

			var message = new ChangeMessage(MultistompCause.EFFECT, this, details);
			this.notify(message);
		}
	}, {
		key: "hasActived",

		/**
   * @return {Boolean}
   */
		value: function hasActived() {
			return this.state;
		}
	}, {
		key: "addParam",

		/**
   * @param Param param
   */
		value: function addParam(param) {
			this.params.push(param);
			param.setListenner(this);
		}
	}, {
		key: "toString",

		/**
   * @return {String}
   */
		value: function toString() {
			var builder = this.name + ": " + this.midiId + " " + Effect.name + " - ";
			builder += this.state ? "Actived" : "Disabled";

			var _iteratorNormalCompletion12 = true;
			var _didIteratorError12 = false;
			var _iteratorError12 = undefined;

			try {
				for (var _iterator12 = this.params[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
					var param = _step12.value;

					builder += param.toString();
				}
			} catch (err) {
				_didIteratorError12 = true;
				_iteratorError12 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion12 && _iterator12["return"]) {
						_iterator12["return"]();
					}
				} finally {
					if (_didIteratorError12) {
						throw _iteratorError12;
					}
				}
			}

			builder += ")";

			return builder;
		}
	}, {
		key: "setListenner",

		/*************************************************/

		/**
   * @param OnChangeListenner<Effect> listenner
   */
		value: function setListenner(listenner) {
			this.listenner = Optional.of(listenner);
		}
	}, {
		key: "onChange",

		/**
   * @param ChangeMessage<Param> message
   */
		//@Override
		value: function onChange(message) {
			var newMessage = new ChangeMessage(MultistompCause.SUPER, this, message);
			this.notify(newMessage);
		}
	}, {
		key: "notify",

		/**
   * @param ChangeMessage<Effect> message
   */
		value: function notify(message) {
			if (!this.listenner.isPresent()) return;

			this.listenner.get().onChange(message);
		}
	}]);

	return Effect;
})();

"use strict";

var Multistomp = (function () {
	function Multistomp() {
		_classCallCheck(this, Multistomp);

		this.listenners = new Array();
		this.patchs = new Array();
		this.idCurrentPatch = 0;
	}

	_createDecoratedClass(Multistomp, [{
		key: "getPedalType",
		decorators: [abstract],
		value: function getPedalType() {}
	}, {
		key: "addPatch",

		/*************************************************/

		/**
   * @param {Patch} patch
   */
		value: function addPatch(patch) {
			this.patchs.push(patch);
			patch.setListenner(this);
		}
	}, {
		key: "currentPatch",

		/**
   * @return Patch
   */
		value: function currentPatch() {
			try {
				return this.patchs[this.idCurrentPatch];
			} catch (e) {
				throw new ImplemetationError("This multistomp havent any Patch. \nAdd the Patchs in the Pedal Construtor: " + this.name);
			}
		}
	}, {
		key: "getIdCurrentPatch",

		/**
   * @return {int}
   */
		value: function getIdCurrentPatch() {
			return this.idCurrentPatch;
		}
	}, {
		key: "nextPatch",
		value: function nextPatch() {
			this.toPatch(this.idCurrentPatch + 1);
		}
	}, {
		key: "beforePatch",
		value: function beforePatch() {
			this.toPatch(this.idCurrentPatch - 1);
		}
	}, {
		key: "toPatch",

		/**
   * @param  {int}
   */
		value: function toPatch(index) {
			if (index >= this.patchs.length) index = 0;else if (index < 0) index = this.patchs.length - 1;

			this.idCurrentPatch = index;

			var details = new Details(Details.TypeChange.PATCH_NUMBER, this.idCurrentPatch);

			var newMessage = new ChangeMessage(MultistompCause.MULTISTOMP, this, details);
			this.notify(newMessage);
		}
	}, {
		key: "patchs",

		/**
   * @return {List<Patch>}
   */
		value: (function (_patchs) {
			function patchs() {
				return _patchs.apply(this, arguments);
			}

			patchs.toString = function () {
				return _patchs.toString();
			};

			return patchs;
		})(function () {
			return patchs;
		})
	}, {
		key: "toString",

		/*************************************************/

		/**
   * @return {String}
   */
		//@Override
		value: function toString() {
			var retorno = "";
			retorno += "Multistomp: " + Multistomp.name + "\n";
			retorno += " - Current Patch: " + this.currentPatch().toString() + "\n";
			retorno += " - Effects: \n";

			var _iteratorNormalCompletion13 = true;
			var _didIteratorError13 = false;
			var _iteratorError13 = undefined;

			try {
				for (var _iterator13 = this.currentPatch().effects[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
					var effect = _step13.value;

					retorno += "  |- " + effect.toString() + "\n";
				}
			} catch (err) {
				_didIteratorError13 = true;
				_iteratorError13 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion13 && _iterator13["return"]) {
						_iterator13["return"]();
					}
				} finally {
					if (_didIteratorError13) {
						throw _iteratorError13;
					}
				}
			}

			return retorno;
		}
	}, {
		key: "addListenner",

		/*************************************************/

		/**
   * @param {OnMultistompListenner} listenner
   */
		value: function addListenner(listenner) {
			this.listenners.push(listenner);
		}
	}, {
		key: "listenners",

		/**
   * @return {List<OnMultistompListenner>}
   */
		value: function listenners() {
			return this.listenners;
		}
	}, {
		key: "onChange",

		/**
   * @param  {ChangeMessage<Patch>} message
   */
		//@Override
		value: function onChange(message) {
			var newMessage = new ChangeMessage(MultistompCause.SUPER, this, message);
			this.notify(newMessage);
		}
	}, {
		key: "notify",

		/**
   * @param  {ChangeMessage<Multistomp>} ChangeMessage<Multistomp> message
   */
		value: function notify(message) {
			var messages = MultistompMessagesConverter.convert(message);

			this.listenners.forEach(function (listenner) {
				return listenner.onChange(messages);
			});
		}
	}, {
		key: "start",

		/*************************************************/

		/**
   * @return {Messages}
   */
		value: function start() {}
	}]);

	return Multistomp;
})();

"use strict";

var MultistompMessagesConverter = (function () {
	function MultistompMessagesConverter() {
		_classCallCheck(this, MultistompMessagesConverter);
	}

	_createClass(MultistompMessagesConverter, null, [{
		key: "convert",

		/**
   * @param ChangeMessage<Multistomp> message
   * @return Messages
   */
		value: function convert(message) {
			var msg = null;
			var details = new Messages.Details();

			if (message.is(MultistompCause.MULTISTOMP)) msg = this.convertToPatch(message, details);else if (message.is(MultistompCause.PATCH)) msg = this.convertPatch(message, details);else if (message.is(MultistompCause.EFFECT)) msg = this.convertStatusEffect(message, details);else if (message.is(MultistompCause.PARAM)) msg = this.convertSetParam(message, details);

			if (msg != null) return new Messages().add(msg);else return new Messages();
		}
	}, {
		key: "convertToPatch",

		/**
   * @param  ChangeMessage<Multistomp> message
   * @param  Details                   details
   *
   * @return Message
   */
		value: function convertToPatch(message, details) {
			details.patch = message.causer.getIdCurrentPatch();

			return new Messages.Message(CommonCause.TO_PATCH, details);
		}
	}, {
		key: "convertPatch",
		value: function convertPatch(message, details) {
			if (!details.type == Details.TypeChange.PATCH_NAME) return new Messages();

			details.value = message.realMessage().details.newValue;

			return new Messages.Message(CommonCause.PATCH_NAME, details);
		}
	}, {
		key: "convertStatusEffect",

		/**
   * @param  ChangeMessage<Multistomp> message
   * @param  Details                   details
   *
   * @return Message
   */
		value: function convertStatusEffect(message, details) {
			var patch = message.nextMessage.causer;
			details.patch = message.causer.patchs.indexOf(patch);

			var effect = message.realMessage().causer;
			var idEffect = patch.effects.indexOf(effect);

			details.effect = idEffect;
			var cause = effect.hasActived() ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

			return new Messages.Message(cause, details);
		}
	}, {
		key: "convertSetParam",

		/**
   * @param ChangeMessage<Multistomp> message
   * @param Details                   details
   *
   * @return Message
   */
		value: function convertSetParam(message, details) {
			var patch = message.nextMessage.causer;
			var effect = message.nextMessage.nextMessage.causer;
			var idEffect = patch.effects.indexOf(effect);

			details.effect = idEffect;
			details.param = effect.params.indexOf(message.realMessage().causer);
			details.value = message.realMessage().causer.getValue();

			return new Messages.Message(CommonCause.SET_PARAM, details);
		}
	}]);

	return MultistompMessagesConverter;
})();

"use strict";

var Param = (function () {

	/**
  * @param String name
  * @param int    minValue
  * @param int    maxValue
  * @param int    defaultValue
  * @param int    stepByStep
  */

	function Param(name, minValue, maxValue, defaultValue, stepByStep) {
		_classCallCheck(this, Param);

		this.stepByStep = 1;
		this.listenner = Optional.empty();

		this.name = name;

		this.minValue = minValue;
		this.maxValue = maxValue;

		this.setCurrentValue(defaultValue);
		this.stepByStep = stepByStep;
	}

	_createClass(Param, [{
		key: "setCurrentValue",

		/**
   * @param int newValue
   */
		value: function setCurrentValue(newValue) {
			if (!this.isValidValue(newValue)) {
				if (newValue > this.maxValue) newValue = this.maxValue;else newValue = this.minValue;
			}

			this.currentValue = newValue;

			var details = new Details(Details.TypeChange.PARAM, this.currentValue);

			var message = new ChangeMessage(MultistompCause.PARAM, this, details);
			this.notify(message);
		}
	}, {
		key: "isValidValue",

		/**
   * @param int value
   * @return {Boolean}
   */
		value: function isValidValue(value) {
			return !(value < this.minValue || value > this.maxValue);
		}
	}, {
		key: "notify",

		/**
   * @param ChangeMessage<Param> message
   */
		value: function notify(message) {
			if (!this.listenner.isPresent()) return;

			this.listenner.get().onChange(message);
		}
	}, {
		key: "getName",

		/**
   * @return String
   */
		value: function getName() {
			return this.name;
		}
	}, {
		key: "getValue",

		/**
   * @return int
   */
		value: function getValue() {
			return this.currentValue;
		}
	}, {
		key: "setValue",

		/**
   * @param int
   */
		value: function setValue(value) {
			this.setCurrentValue(value);
		}
	}, {
		key: "addValue",
		value: function addValue() {
			var newValue = this.currentValue + this.stepByStep;

			if (!this.isValidValue(newValue))
				// Don't change current value
				return;

			this.setValue(newValue);
		}
	}, {
		key: "getMinValue",

		/**
   * @return int
   */
		value: function getMinValue() {
			return this.minValue;
		}
	}, {
		key: "getMaxValue",

		/**
   * @return int
   */
		value: function getMaxValue() {
			return this.maxValue;
		}
	}, {
		key: "setListenner",

		/*************************************************/

		/**
   * @param OnChangeListenner<Param> listenner
   */
		value: function setListenner(listenner) {
			this.listenner = Optional.of(listenner);
		}
	}, {
		key: "toString",

		/**
   * @return String
   */
		//@Override
		value: function toString() {
			return this.name + " = " + this.currentValue + " [" + this.minValue + " - " + this.maxValue + "]";
		}
	}]);

	return Param;
})();

"use strict";

var Patch = (function () {

	/**
  * @param int id
  */

	function Patch(id) {
		_classCallCheck(this, Patch);

		this.patchName = "";
		this.effects = new Array();
		this.listenner = Optional.empty();

		this.id = id;
	}

	_createClass(Patch, [{
		key: "getId",

		/**
   * @return {id}
   */
		value: function getId() {
			return id;
		}
	}, {
		key: "addEffect",

		/**
   * @param {Effect} effect
   */
		value: function addEffect(effect) {
			this.effects.push(effect);
			effect.setListenner(this);
		}
	}, {
		key: "setListenner",

		/*************************************************/

		/**
   * @param {OnChangeListenner<Patch>} listenner
   */
		value: function setListenner(listenner) {
			this.listenner = Optional.of(listenner);
		}
	}, {
		key: "onChange",

		/**
   * @param ChangeMessage<Effect> message
   */
		//@Override
		value: function onChange(message) {
			var newMessage = new ChangeMessage(MultistompCause.SUPER, this, message);
			this.notify(newMessage);
		}
	}, {
		key: "notify",

		/**
   * @param ChangeMessage<Patch> message
   */
		value: function notify(message) {
			if (!this.listenner.isPresent()) return;

			this.listenner.get().onChange(message);
		}
	}, {
		key: "toString",

		/*************************************************/

		/**
   * @return String
   */
		//@Override
		value: function toString() {
			return "Patch " + this.id + " - " + this.name + " (" + this.effects.length + ") Effect(s))";
		}
	}, {
		key: "name",

		/*************************************************/

		get: function get() {
			return this.patchName;
		},
		set: function set(name) {
			this.patchName = name;

			var details = new Details(Details.TypeChange.PATCH_NAME, this.patchName);

			var newMessage = new ChangeMessage(MultistompCause.PATCH, this, details);
			this.notify(newMessage);
		}
	}]);

	return Patch;
})();

"use strict";

var ChangeMessage = (function () {
	_createClass(ChangeMessage, null, [{
		key: "None",

		/**
   * @param Multistomp multistomp
   *
   * @return ChangeMessage<Multistomp>
   */
		value: function None(multistomp) {
			return new ChangeMessage() < Multistomp > (MultistompCause.NONE, multistomp, Details.NONE());
		}
	}, {
		key: "For",

		/**
   * @param Multistomp multistomp
   * @param Details    details
   *
   * @return ChangeMessage<Multistomp>
   */
		value: function For(multistomp, details) {
			return new ChangeMessage() < Multistomp > (MultistompCause.MULTISTOMP, multistomp, details);
		}
	}, {
		key: "For",

		/**
   * @param Multistomp multistomp
   * @param Patch      patch
   * @param Details    details
   */
		value: function For(multistomp, patch, details) {
			var patchMsg = new ChangeMessage() < Patch > (MultistompCause.PATCH, patch, details);
			var multistompMsg = new ChangeMessage() < Multistomp > (MultistompCause.SUPER, multistomp, patchMsg);

			return multistompMsg;
		}
	}, {
		key: "For",

		/**
   * @param Multistomp multistomp
   * @param Patch      patch
   * @param Effect     effect
   * @param Details    details
   */
		value: function For(multistomp, patch, effect, details) {
			var effectMsg = new ChangeMessage() < Effect > (MultistompCause.EFFECT, effect, details);
			var patchMsg = new ChangeMessage() < Patch > (MultistompCause.SUPER, patch, effectMsg);
			var multistompMsg = new ChangeMessage() < Multistomp > (MultistompCause.SUPER, multistomp, patchMsg);

			return multistompMsg;
		}
	}, {
		key: "For",

		/**
   * @param Multistomp multistomp
   * @param Patch      patch
   * @param Effect     efeito
   * @param Param      param
   * @param Details    details
   */
		value: function For(multistomp, patch, efeito, param, details) {
			var paramMsg = new ChangeMessage() < Param > (MultistompCause.PARAM, param, details);
			var effectMsg = new ChangeMessage() < Effect > (MultistompCause.SUPER, efeito, paramMsg);
			var patchMsg = new ChangeMessage() < Patch > (MultistompCause.SUPER, patch, effectMsg);
			var multistompMsg = new ChangeMessage() < Multistomp > (MultistompCause.SUPER, multistomp, patchMsg);

			return multistompMsg;
		}
	}]);

	function ChangeMessage(cause, causer, what) {
		_classCallCheck(this, ChangeMessage);

		this.nextMessage = null;

		if (what instanceof ChangeMessage) this._constructorMessage(cause, causer, what);else this._constructorDetails(cause, causer, what);
	}

	_createClass(ChangeMessage, [{
		key: "_constructorMessage",

		/**
   * @param Cause            cause
   * @param Causer           causer
   * @param ChangeMessage<?> nextMessage
   */
		value: function _constructorMessage(cause, causer, nextMessage) {
			this._constructorDetails(cause, causer, Details.NONE());
			this.nextMessage = nextMessage;
		}
	}, {
		key: "_constructorDetails",

		/**
   * @param Cause   cause
   * @param Causer  causer
   * @param Details details
   */
		value: function _constructorDetails(cause, causer, details) {
			this.cause = cause;
			this.causer = causer;
			this.details = details;
		}
	}, {
		key: "details",

		/** Details of what has changed
      * @return Details
      */
		value: (function (_details) {
			function details() {
				return _details.apply(this, arguments);
			}

			details.toString = function () {
				return _details.toString();
			};

			return details;
		})(function () {
			return details;
		})
	}, {
		key: "is",

		/**
   * @param Cause cause
   * @return {Boolean}
   */
		value: function is(cause) {
			return cause === this.realMessage().cause;
		}
	}, {
		key: "realMessage",

		/**
   * @return {ChangeMessage<?>}
   */
		value: function realMessage() {
			var message = this;

			while (message.cause == MultistompCause.SUPER) message = message.nextMessage;

			return message;
		}
	}, {
		key: "toString",

		/**
   * @return String
   */
		//@Override
		value: function toString() {
			var returned = "";

			returned += this.causer.getClass().getSimpleName();

			if (this.cause == MultistompCause.SUPER) returned += " -> " + this.nextMessage.toString();else returned += " (" + this.cause.toString() + ")";

			return returned;
		}
	}]);

	return ChangeMessage;
})();

"use strict";

var Details = (function () {
	_createClass(Details, null, [{
		key: "NONE",

		/**
   * @return Details
   */
		value: function NONE() {
			return new Details(Details.TypeChange.NONE, 0);
		}
	}]);

	/**
  * @param TypeChange type
  * @param int        newValue
  */

	function Details(type, newValue) {
		_classCallCheck(this, Details);

		this.type = type;
		this.newValue = newValue;
	}

	_createClass(Details, [{
		key: "newValue",

		/**
   * @return int
   */
		value: function newValue() {
			return this.newValue;
		}
	}, {
		key: "type",

		/**
   * @return TypeChange
   */
		value: function type() {
			return this.type;
		}
	}, {
		key: "toString",

		/**
   * @return String
   */
		//@Override
		value: function toString() {
			return "(" + this.type + " " + this.newValue + ")";
		}
	}]);

	return Details;
})();

Details.TypeChange = {
	NONE: "NONE",
	PEDAL_STATUS: "PEDAL_STATUS",
	PARAM: "PARAM",
	PATCH_NUMBER: "PATCH_NUMBER",
	PATCH_NAME: "PATCH_NAME"
};

"use strict";

var MultistompCause = function MultistompCause() {
	_classCallCheck(this, MultistompCause);
};

MultistompCause.SUPER = "SUPER";
/** None change detected */
MultistompCause.NONE = "NONE";

MultistompCause.MULTISTOMP = "MULTISTOMP";
MultistompCause.PATCH = "PATCH";
MultistompCause.EFFECT = "EFFECT";
MultistompCause.PARAM = "PARAM";

"use strict";

var MultistompFactory = (function () {
	function MultistompFactory() {
		_classCallCheck(this, MultistompFactory);
	}

	_createClass(MultistompFactory, null, [{
		key: "For",

		/**
   * @param PedalType pedalType
   * @return PedalController
   */
		value: function For(pedalType) {
			var pedal = undefined;
			var company = pedalType.getCompany();

			if (company == PedalCompany.ZoomCorp) pedal = new ZoomMultistompFactory().generate(pedalType);else if (company == PedalCompany.Roland) pedal = new NullMultistomp();else if (company == PedalCompany.Line6) pedal = new NullMultistomp();else pedal = new NullMultistomp();

			return pedal;
		}
	}]);

	return MultistompFactory;
})();

"use strict";

var Log = (function () {

	/**
  * @param String type
  */

	function Log(type) {
		_classCallCheck(this, Log);

		this.type = type;
	}

	_createClass(Log, [{
		key: "onChange",

		/**
   * @param Messages messages
   */
		//@Override
		value: function onChange(messages) {
			var _iteratorNormalCompletion14 = true;
			var _didIteratorError14 = false;
			var _iteratorError14 = undefined;

			try {
				for (var _iterator14 = messages[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
					var message = _step14.value;

					console.info("LOG:: " + this.type);
					console.log("LOG:: " + message.toString());
				}
			} catch (err) {
				_didIteratorError14 = true;
				_iteratorError14 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion14 && _iterator14["return"]) {
						_iterator14["return"]();
					}
				} finally {
					if (_didIteratorError14) {
						throw _iteratorError14;
					}
				}
			}
		}
	}]);

	return Log;
})();

"use strict";

var MultistompSimulator = (function (_Multistomp) {
	_inherits(MultistompSimulator, _Multistomp);

	/**
  * @param {int} int totalPatch
  */

	function MultistompSimulator(totalPatch) {
		_classCallCheck(this, MultistompSimulator);

		_get(Object.getPrototypeOf(MultistompSimulator.prototype), "constructor", this).call(this);
		for (var i = 0; i < totalPatch; i++) {
			var patch = new Patch(i);
			var _iteratorNormalCompletion15 = true;
			var _didIteratorError15 = false;
			var _iteratorError15 = undefined;

			try {
				for (var _iterator15 = this.genEffects()[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
					var effect = _step15.value;

					patch.addEffect(effect);
				}
			} catch (err) {
				_didIteratorError15 = true;
				_iteratorError15 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion15 && _iterator15["return"]) {
						_iterator15["return"]();
					}
				} finally {
					if (_didIteratorError15) {
						throw _iteratorError15;
					}
				}
			}

			this.addPatch(patch);
		}
	}

	_createClass(MultistompSimulator, [{
		key: "genEffects",

		/**
   * @return {List<Effect>} [description]
   */
		value: function genEffects() {
			var effects = new Array();

			effects.push(this.genEffect(0, "Overdrive"));
			effects.push(this.genEffect(1, "Reverb"));
			effects.push(this.genEffect(2, "Chorus"));

			return effects;
		}
	}, {
		key: "genEffect",

		/**
   * @param  {int}    id
   * @param  {String} name
   * @return {Effect}
   */
		value: function genEffect(id, name) {
			var effect = new Effect(id, name);
			effect.addParam(new Param("Gain", 0, 50, 0, 1));
			effect.addParam(new Param("Volume", 0, 25, 0, 1));

			return effect;
		}
	}, {
		key: "start",

		/**
   * @return {Messages}
   */
		//@Override
		value: function start() {
			return new Messages();
		}
	}, {
		key: "getPedalType",

		/**
   * @return {PedalType}
   */
		//@Override
		value: function getPedalType() {
			return PedalType.Null;
		}
	}]);

	return MultistompSimulator;
})(Multistomp);

"use strict";

var NullMultistomp = (function (_Multistomp2) {
	_inherits(NullMultistomp, _Multistomp2);

	function NullMultistomp() {
		_classCallCheck(this, NullMultistomp);

		_get(Object.getPrototypeOf(NullMultistomp.prototype), "constructor", this).call(this);
		this.MSG_ERROR = "Pedal Unknown is unimplemented";
		this.addPatch(new Patch(0));
		console.log(this.MSG_ERROR);
	}

	_createClass(NullMultistomp, [{
		key: "getPedalType",

		/**
   * @return PedalType
   */
		//@Override
		value: function getPedalType() {
			return PedalType.Null;
		}
	}, {
		key: "start",

		/**
   * @return Messages
   */
		//@Override
		value: function start() {
			return new Messages();
		}
	}]);

	return NullMultistomp;
})(Multistomp);

"use strict";

var ZoomMultistompFactory = (function () {
	function ZoomMultistompFactory() {
		_classCallCheck(this, ZoomMultistompFactory);
	}

	_createClass(ZoomMultistompFactory, [{
		key: "generate",

		/**
   * @param PedalType type
   * @return Multistomp
   */
		//@Override
		value: function generate(type) {
			if (type == PedalType.G2Nu) return new ZoomG2Nu();else if (type == PedalType.G3) return new ZoomGSeries(100, 6, 8);else return new ZoomGSeries(0, 5, 9);
		}
	}]);

	return ZoomMultistompFactory;
})();

"use strict";

/** For:
 *  - Zoom G3
 *  - Zoom G5
 *  - Zoom Ms-50G
 *  - Zoom Ms-70cd
 *  - Zoom MS-200bt
 *  - Zoom MS-50B
 */

var ZoomGSeries = (function (_Multistomp3) {
	_inherits(ZoomGSeries, _Multistomp3);

	/**
  * @param int         totalPatchs     Max Patches that Pedal may have
  * @param int         totalEffects    Max Effects that Patches may have
  * @param @Deprecated int totalParams
  */

	function ZoomGSeries(totalPatchs, totalEffects, totalParams) {
		_classCallCheck(this, ZoomGSeries);

		_get(Object.getPrototypeOf(ZoomGSeries.prototype), "constructor", this).call(this);
		this.TOTAL_PATCHS = totalPatchs;
		this.TOTAL_EFFECTS = totalEffects;
		this.SIZE_PARAMS = totalParams;

		var patchs = this.createPatchs(this.TOTAL_PATCHS);

		var _iteratorNormalCompletion16 = true;
		var _didIteratorError16 = false;
		var _iteratorError16 = undefined;

		try {
			for (var _iterator16 = patchs[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
				var patch = _step16.value;

				this.addPatch(patch);
			}
		} catch (err) {
			_didIteratorError16 = true;
			_iteratorError16 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion16 && _iterator16["return"]) {
					_iterator16["return"]();
				}
			} finally {
				if (_didIteratorError16) {
					throw _iteratorError16;
				}
			}
		}
	}

	_createClass(ZoomGSeries, [{
		key: "createPatchs",

		/**
   * @param int totalPatch
   * @return List<Patch>
   */
		value: function createPatchs(totalPatch) {
			var patchs = new Array();

			for (var i = 0; i < totalPatch; i++) {
				var patch = new Patch(i);
				var _iteratorNormalCompletion17 = true;
				var _didIteratorError17 = false;
				var _iteratorError17 = undefined;

				try {
					for (var _iterator17 = this.createEffects(this.TOTAL_EFFECTS)[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
						var effect = _step17.value;

						patch.addEffect(effect);
					}
				} catch (err) {
					_didIteratorError17 = true;
					_iteratorError17 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion17 && _iterator17["return"]) {
							_iterator17["return"]();
						}
					} finally {
						if (_didIteratorError17) {
							throw _iteratorError17;
						}
					}
				}

				patchs.push(patch);
			}

			return patchs;
		}
	}, {
		key: "createEffects",

		/**
   * @param int totalEffects
   * @return List<Effect>
   */
		value: function createEffects(totalEffects) {
			var effects = new Array();

			for (var i = 0; i < totalEffects; i++) {
				//effects.push(new ZoomGenericEffect(i, "Position "+i, SIZE_PARAMS));
				effects.push(ZoomGSeriesEffect.COMP.generate());
			}return effects;
		}
	}, {
		key: "start",

		/**
   * @return Messages
   */
		//@Override
		value: function start() {
			var messages = new Messages();
			messages.concatWith(ZoomGSeriesMessages.LISSEN_ME()).concatWith(ZoomGSeriesMessages.YOU_CAN_TALK());

			return messages;
		}
	}, {
		key: "getPedalType",

		/**
   * @return PedalType
   */
		//@Override
		value: function getPedalType() {
			return PedalType.G3; // FIXME
		}
	}]);

	return ZoomGSeries;
})(Multistomp);

"use strict";

var ZoomGSeriesCause = (function (_CommonCause) {
	_inherits(ZoomGSeriesCause, _CommonCause);

	function ZoomGSeriesCause() {
		_classCallCheck(this, ZoomGSeriesCause);

		_get(Object.getPrototypeOf(ZoomGSeriesCause.prototype), "constructor", this).apply(this, arguments);
	}

	return ZoomGSeriesCause;
})(CommonCause);

ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER = "REQUEST_CURRENT_PATCH_NUMBER";
ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS = "REQUEST_CURRENT_PATCH_DETAILS";
ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS = "REQUEST_SPECIFIC_PATCH_DETAILS";

ZoomGSeriesCause.LISSEN_ME = "LISSEN_ME";
ZoomGSeriesCause.YOU_CAN_TALK = "YOU_CAN_TALK";

ZoomGSeriesCause.SET_EFFECT = "SET_EFFECT";

"use strict";

var ZoomGSeriesEffect = (function () {
	function ZoomGSeriesEffect() {
		_classCallCheck(this, ZoomGSeriesEffect);
	}

	_createClass(ZoomGSeriesEffect, null, [{
		key: "COMP",
		value: new ((function () {
			function COMP() {
				_classCallCheck(this, COMP);
			}

			_createClass(COMP, [{
				key: "generate",

				/**
     * @return Effect
     */
				//@Override
				value: function generate() {
					var effect = new Effect(0, this.constructor.name);

					effect.addParam(new Param("Sense", 0, 10, 6, 1));
					effect.addParam(new Param("Tone", 0, 10, 6, 1));
					effect.addParam(new Param("Level", 0, 150, 100, 1));
					effect.addParam(new Param("ATTCK", 0, 1, 0, 1));

					return effect;
				}
			}]);

			return COMP;
		})())(),
		enumerable: true
	}]);

	return ZoomGSeriesEffect;
})();

"use strict";

var ZoomGSeriesMessageDecoder = (function () {
	function ZoomGSeriesMessageDecoder() {
		_classCallCheck(this, ZoomGSeriesMessageDecoder);

		this.decoders = new Array();

		this.decoders.push(new ZoomGSeriesPatchDecoder());

		this.decoders.push(new ZoomGSeriesSelectPatchDecoder());
		//this.decoders.push(new ZoomGSeriesActiveEffectDecoder());
		//this.decoders.push(new ZoomGSeriesDisableEffectDecoder());
		//this.decoders.push(new ZoomGSeriesSetValueParamDecoder());
	}

	_createClass(ZoomGSeriesMessageDecoder, [{
		key: "isForThis",

		/**
   * @param MidiMessage message
   * @return {Boolean}
   */
		//@Override
		value: function isForThis(message) {
			return this.decodesFor(message).length > 0;
		}
	}, {
		key: "decode",

		/**
   * @param MidiMessage message
   * @param Multistomp  multistomp
   * @return Messages
   */
		value: function decode(midiMessage, multistomp) {
			var decoders = this.decodesFor(midiMessage);

			var messages = new Messages();

			decoders.forEach(function (decoder) {
				return messages.concatWith(decoder.decode(midiMessage, multistomp));
			});

			return messages;
		}
	}, {
		key: "decodesFor",
		value: function decodesFor(midiMessage) {
			var decoders = new Array();
			var _iteratorNormalCompletion18 = true;
			var _didIteratorError18 = false;
			var _iteratorError18 = undefined;

			try {
				for (var _iterator18 = this.decoders[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
					var decoder = _step18.value;

					if (decoder.isForThis(midiMessage)) decoders.push(decoder);
				}
			} catch (err) {
				_didIteratorError18 = true;
				_iteratorError18 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion18 && _iterator18["return"]) {
						_iterator18["return"]();
					}
				} finally {
					if (_didIteratorError18) {
						throw _iteratorError18;
					}
				}
			}

			return decoders;
		}
	}]);

	return ZoomGSeriesMessageDecoder;
})();

var ZoomGSeriesMessageEncoder = (function () {
	function ZoomGSeriesMessageEncoder() {
		_classCallCheck(this, ZoomGSeriesMessageEncoder);
	}

	_createClass(ZoomGSeriesMessageEncoder, [{
		key: "encode",

		/**
   * @param Messages messages
   * @return MidiMessages
   */
		//@Override
		value: function encode(messages) {
			var generator = new MidiMessagesGenerator(messages, this);

			generator.forEachOfType(CommonCause.TO_PATCH).generate(this.toPatchMessages);

			generator.forEachOfType(CommonCause.ACTIVE_EFFECT).generate(this.statusEffectMessages);
			generator.forEachOfType(CommonCause.DISABLE_EFFECT).generate(this.statusEffectMessages);

			generator.forEachOfType(CommonCause.SET_PARAM).generate(this.setParamMessages);

			generator.forEachOfType(ZoomGSeriesCause.SET_EFFECT).generate(this.setEffectMessages);

			generator.forEachOfType(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER).generate(this.requestCurrentPatchNumberMessages);
			generator.forEachOfType(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS).generate(this.requestCurrentPatchDetailsMessages);
			generator.forEachOfType(ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS).generate(this.requestSpecificPatchDetailsMessages);

			generator.forEachOfType(ZoomGSeriesCause.LISSEN_ME).generate(this.lissenMeMessages);
			generator.forEachOfType(ZoomGSeriesCause.YOU_CAN_TALK).generate(this.youCanTalkMessages);

			return generator.generateMidiMessages();
		}
	}, {
		key: "toPatchMessages",
		value: function toPatchMessages(message) {
			var SET_PATH = 0xc0; //ShortMessage.PROGRAM_CHANGE;
			var patch = message.details.patch;

			var toPatch = new MidiMessage(SET_PATH, patch);

			return new MidiMessages().add(toPatch);
		}
	}, {
		key: "statusEffectMessages",

		/**
   * @param Message     message
   * @param CommonCause cause
   *
   * @return MidiMessages
   */
		value: function statusEffectMessages(message, cause) {
			var effect = message.details.effect;

			var actived = cause == CommonCause.ACTIVE_EFFECT;
			var byteActived = actived ? 0x01 : 0x00;

			var manipuleEffect = this.manipuleEffectMessages(effect, ZoomGSeriesMessageEncoder.SET_STATUS, byteActived);

			return new MidiMessages().concatWith(this.lissenMeMessages()).concatWith(manipuleEffect);
		}
	}, {
		key: "setParamMessages",

		/**
   * @param Message message
   * @return MidiMessage
   */
		value: function setParamMessages(message) {
			var effect = message.details.effect;
			var param = message.details.param;
			var value = message.details.value;

			return this.manipuleEffectMessages(effect, param + ZoomGSeriesMessageEncoder.PARAM_EFFECT, value);
		}
	}, {
		key: "setEffectMessages",

		/**
   * @param Message message
   * @return MidiMessage
   */
		value: function setEffectMessages(message) {
			var effect = message.details.effect;
			var value = message.details.value;

			return this.manipuleEffectMessages(effect, ZoomGSeriesMessageEncoder.CHANGE_EFFECT, value);
		}
	}, {
		key: "manipuleEffectMessages",
		// Base

		/**
   * @param int effect
   * @param int type
   * @param int value
   *
   * @return MidiMessage
   */
		value: function manipuleEffectMessages(effect, type, value) {
			var value2 = value / 128 | 0;
			value = value % 128;

			var manupuleEffect = new MidiMessage(0xF0, 0x52, 0x00, 0x5A, 0x31, effect, type, value, value2, 0xF7);

			return new MidiMessages().add(manupuleEffect);
		}
	}, {
		key: "requestCurrentPatchNumberMessages",

		///////////////////////////////////////
		// SPECIFIC ZOOM
		///////////////////////////////////////

		value: function requestCurrentPatchNumberMessages(message) {
			var requestCurrentPatchNumber = new MidiMessage(0xF0, 0x52, 0x00, 0x5A, 0x33, 0xF7);

			return new MidiMessages().add(requestCurrentPatchNumber);
		}
	}, {
		key: "requestCurrentPatchDetailsMessages",
		value: function requestCurrentPatchDetailsMessages(message) {
			var requestCurrentPatchDetails = new MidiMessage(0xF0, 0x52, 0x00, 0x5A, 0x29, 0xF7);

			return new MidiMessages().add(requestCurrentPatchDetails);
		}
	}, {
		key: "requestSpecificPatchDetailsMessages",
		value: function requestSpecificPatchDetailsMessages(message) {
			var patch = message.details.patch;

			var requestSpecificPatchDetails = new MidiMessage(0xF0, 0x52, 0x00, 0x5A, 0x09, 0x00, 0x00, patch, 0xF7);

			return new MidiMessages().add(requestSpecificPatchDetails);
		}
	}, {
		key: "lissenMeMessages",
		value: function lissenMeMessages() {
			var lissenMe = new MidiMessage(0xF0, 0x52, 0x00, 0x5A, 0x50, 0xF7);

			return new MidiMessages().add(lissenMe);
		}
	}, {
		key: "youCanTalkMessages",
		value: function youCanTalkMessages() {
			var youCanTalk = new MidiMessage(0xF0, 0x52, 0x00, 0x5A, 0x16, 0xF7);

			return new MidiMessages().add(youCanTalk);
		}
	}], [{
		key: "SET_STATUS",
		value: 0,
		enumerable: true
	}, {
		key: "CHANGE_EFFECT",
		value: 1,
		enumerable: true
	}, {
		key: "PARAM_EFFECT",
		value: 2,
		enumerable: true
	}]);

	return ZoomGSeriesMessageEncoder;
})();

"use strict";

var ZoomGSeriesMessages = (function () {
	function ZoomGSeriesMessages() {
		_classCallCheck(this, ZoomGSeriesMessages);
	}

	_createClass(ZoomGSeriesMessages, null, [{
		key: "REQUEST_CURRENT_PATCH_NUMBER",

		/**
   * @return Messages
   */
		value: function REQUEST_CURRENT_PATCH_NUMBER() {
			return new Messages().add(new Messages.Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER));
		}
	}, {
		key: "REQUEST_CURRENT_PATCH_DETAILS",

		/**
   * @return Messages
   */
		value: function REQUEST_CURRENT_PATCH_DETAILS() {
			return new Messages().add(new Messages.Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS));
		}
	}, {
		key: "REQUEST_SPECIFIC_PATCH_DETAILS",

		/**
   * @param int idPatch
   * @return Messages
   */
		value: function REQUEST_SPECIFIC_PATCH_DETAILS(idPatch) {
			var details = new Messages.Details();
			details.patch = idPatch;

			return new Messages().add(new Messages.Message(ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS, details));
		}
	}, {
		key: "LISSEN_ME",

		/**
   * @return Messages
   */
		value: function LISSEN_ME() {
			return new Messages().add(new Messages.Message(ZoomGSeriesCause.LISSEN_ME));
		}
	}, {
		key: "YOU_CAN_TALK",

		/**
   * @return Messages
   */
		value: function YOU_CAN_TALK() {
			return new Messages().add(new Messages.Message(ZoomGSeriesCause.YOU_CAN_TALK));
		}
	}, {
		key: "SET_EFFECT",

		/**
   * @param int effectPos
   * @param int newEffect
   *
   * @return Messages
   */
		value: function SET_EFFECT(effectPos, newEffect) {
			var details = new Messages.Details();
			details.effect = effectPos;
			details.value = newEffect;

			return new Messages().add(new Messages.Message(ZoomGSeriesCause.SET_EFFECT, details));
		}
	}]);

	return ZoomGSeriesMessages;
})();

var ZoomGSeriesPatchDecoder = (function () {
	function ZoomGSeriesPatchDecoder() {
		_classCallCheck(this, ZoomGSeriesPatchDecoder);
	}

	_createClass(ZoomGSeriesPatchDecoder, [{
		key: "isForThis",

		//@Override
		value: function isForThis(message) {
			var MESSAGE_SIZE = 120;

			var tester = new MidiMessageTester(message);

			return tester.init().sizeIs(MESSAGE_SIZE).test();
		}
	}, {
		key: "decode",

		/**
   * @param MidiMessage message
   * @return Messages
   */
		//@Override
		value: function decode(message) {
			var messages = new Messages();

			var patchName = new ZoomGSeriesPatchNameDecoder();
			var patchNumber = new ZoomGSeriesPatchNumberDecoder();
			var effects = new ZoomGSeriesPatchEffectsDecoder();

			messages.concatWith(patchName.decode(message)).concatWith(patchNumber.decode(message)).concatWith(effects.decode(message));

			return messages;
		}
	}]);

	return ZoomGSeriesPatchDecoder;
})();

var ZoomGSeriesPatchEffectsDecoder = (function () {
	function ZoomGSeriesPatchEffectsDecoder() {
		_classCallCheck(this, ZoomGSeriesPatchEffectsDecoder);
	}

	_createClass(ZoomGSeriesPatchEffectsDecoder, [{
		key: "isForThis",

		//@Override
		value: function isForThis(message) {
			return true;
		}
	}, {
		key: "decode",

		/**
   * @param MidiMessage message
   * @return Messages
   */
		//@Override
		value: function decode(message) {
			var messages = new Messages();

			var effectsStatus = new ZoomGSeriesPatchEffectsStatusDecoder();
			//let typeEffects   = new ZoomGSeriesPatchEffectsTypeDecoder();

			messages.concatWith(effectsStatus.decode(message));
			//		.concatWith(typeEffects.decode(message));

			return messages;
		}
	}]);

	return ZoomGSeriesPatchEffectsDecoder;
})();

var ZoomGSeriesPatchEffectsStatusDecoder = (function () {
	function ZoomGSeriesPatchEffectsStatusDecoder() {
		_classCallCheck(this, ZoomGSeriesPatchEffectsStatusDecoder);
	}

	_createClass(ZoomGSeriesPatchEffectsStatusDecoder, [{
		key: "isForThis",

		//@Override
		value: function isForThis(message) {
			return true;
		}
	}, {
		key: "decode",

		/**
   * @param MidiMessage message
   * @return Messages
   */
		//@Override
		value: function decode(message) {
			var PATCHES = [6 + 5, 19 + 5, 33 + 5, 47 + 5, 60 + 5, 74 + 5];

			var messages = new Messages();
			for (var idPedal = 0; idPedal < PATCHES.length; idPedal++) {
				var patch = PATCHES[idPedal];

				var actived = this.hasActived(message, patch);
				messages.add(this.generateMessageFor(idPedal, actived));
			}

			return messages;
		}
	}, {
		key: "hasActived",
		value: function hasActived(midiMessage, position) {
			var LSB = 0x01; // Least Significant Bit

			var actived = midiMessage[position] & LSB;

			return actived == 1;
		}
	}, {
		key: "generateMessageFor",

		/**
   * @param int     effect
   * @param boolean actived
   * @return Messages.Message
   */
		value: function generateMessageFor(effect, actived) {
			var cause = actived ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

			var message = new Messages.Message(cause);
			message.details.effect = effect;

			return message;
		}
	}]);

	return ZoomGSeriesPatchEffectsStatusDecoder;
})();

var ZoomGSeriesPatchNameDecoder = (function () {
	function ZoomGSeriesPatchNameDecoder() {
		_classCallCheck(this, ZoomGSeriesPatchNameDecoder);
	}

	_createClass(ZoomGSeriesPatchNameDecoder, [{
		key: "isForThis",

		/**
   * @param MidiMessage message
   * @return {Boolean}
   */
		//@Override
		value: function isForThis(message) {
			var tester = new MidiMessageTester(message);

			var patchInfo = tester.init().sizeIs(120).test();
			var changeName = false; //tester.init().sizeIs(120).test();

			return patchInfo || changeName;
		}
	}, {
		key: "decode",

		//@Override
		value: function decode(midiMessage) {
			var message = new Messages.Message(CommonCause.PATCH_NAME);
			message.details.value = this.getNameBy(midiMessage);

			return new Messages().add(message);
		}
	}, {
		key: "getNameBy",
		value: function getNameBy(midiMessage) {
			var firstChar = ZoomGSeriesPatchNameDecoder.FIRST_LETTER;
			var lastChar = ZoomGSeriesPatchNameDecoder.LAST_LETTER;

			var name = "";
			for (var i = firstChar; i < lastChar; i++) {
				var char = midiMessage[i];
				name += String.fromCharCode(char);
			}

			return name;
		}
	}], [{
		key: "FIRST_LETTER",
		value: 102,
		enumerable: true
	}, {
		key: "LAST_LETTER",
		value: 102 + 11,
		enumerable: true
	}]);

	return ZoomGSeriesPatchNameDecoder;
})();

var ZoomGSeriesPatchNumberDecoder = (function () {
	function ZoomGSeriesPatchNumberDecoder() {
		_classCallCheck(this, ZoomGSeriesPatchNumberDecoder);
	}

	_createClass(ZoomGSeriesPatchNumberDecoder, [{
		key: "isForThis",

		//@Override
		value: function isForThis(midiMessage) {
			var tester = new MidiMessageTester(midiMessage);

			return tester.init().sizeIs(120).test();
		}
	}, {
		key: "decode",

		//@Override
		value: function decode(midiMessage) {
			var patchNumber = this.getPatchNumber(midiMessage);

			return new Messages().add(this.generateMessageFor(patchNumber));
		}
	}, {
		key: "getPatchNumber",
		value: function getPatchNumber(midiMessage) {
			var PATCH_INFO = 7;

			return midiMessage[PATCH_INFO];
		}
	}, {
		key: "generateMessageFor",
		value: function generateMessageFor(patchNumber) {
			var message = new Messages.Message(CommonCause.PATCH_NUMBER);
			message.details.patch = patchNumber;

			return message;
		}
	}]);

	return ZoomGSeriesPatchNumberDecoder;
})();

"use strict";

// TODO - Agregar este dentro de PatchDecoder - Pode fazer um esquema de composição interna

var ZoomGSeriesPedalsDecoder = (function () {
	function ZoomGSeriesPedalsDecoder() {
		_classCallCheck(this, ZoomGSeriesPedalsDecoder);
	}

	_createClass(ZoomGSeriesPedalsDecoder, [{
		key: "isForThis",

		/**
   * @param MidiMessage message
   * @return {Boolean}
   */
		//@Override
		value: function isForThis(message) {
			var tester = new MidiMessageTester(message);

			var patchInfo = tester.init().sizeIs(120).test();
			var changePedal = false; //tester.init().sizeIs(120).test();

			return patchInfo || changePedal;
		}
	}, {
		key: "decode",

		/**
  * @param MidiMessage message
  * @param Multistomp  multistomp
  * @return Messages
  */
		//@Override
		value: function decode(message, multistomp) {
			var details = new Messages.Details();

			var _iteratorNormalCompletion19 = true;
			var _didIteratorError19 = false;
			var _iteratorError19 = undefined;

			try {
				for (var _iterator19 = ZoomGSeriesPedalsDecoder.PEDALS_INDEX[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
					var index = _step19.value;

					var actived = this.hasActived(message, index);

					console.log(message[index] - 1, actived, actived ? message[index] - 1 : message[index]);
				}
			} catch (err) {
				_didIteratorError19 = true;
				_iteratorError19 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion19 && _iterator19["return"]) {
						_iterator19["return"]();
					}
				} finally {
					if (_didIteratorError19) {
						throw _iteratorError19;
					}
				}
			}

			return new Messages();
		}
	}, {
		key: "hasActived",

		/**
   * @param MidiMessage message
   * @param int         position
   * @return {Boolean}
   */
		value: function hasActived(message, position) {
			var LSB = 0x01; // Least Significant Bit

			var actived = message[position] & LSB;

			return actived == 1;
		}
	}], [{
		key: "PEDALS_INDEX",
		value: [8, 24, 38, 52, 65, 79],
		enumerable: true
	}]);

	return ZoomGSeriesPedalsDecoder;
})();

"use strict";

/**
 * c0 PATCH
 */

var ZoomGSeriesSelectPatchDecoder = (function () {
	function ZoomGSeriesSelectPatchDecoder() {
		_classCallCheck(this, ZoomGSeriesSelectPatchDecoder);
	}

	_createClass(ZoomGSeriesSelectPatchDecoder, [{
		key: "isForThis",

		/**
   * @param MidiMessage message
   * @return {Boolean}
   */
		//@Override
		value: function isForThis(message) {
			var begin = [0xc0];

			var tester = new MidiMessageTester(message);

			return tester.init().sizeIs(2).startingWith(begin).test();
		}
	}, {
		key: "decode",

		//@Override
		value: function decode(midiMessage) {
			var message = new Messages.Message(CommonCause.TO_PATCH);
			message.details.patch = midiMessage[ZoomGSeriesSelectPatchDecoder.PATCH];

			return new Messages().add(message);
		}
	}], [{
		key: "PATCH",
		value: 1,
		enumerable: true
	}]);

	return ZoomGSeriesSelectPatchDecoder;
})();

// TestsResults

// MidiMessage

// PedalController

// String

// bolean

// Multistomp

// MidiConnection

// List<OnMultistompListenner>

// List<OnMultistompListenner>

// boolean

/** Optional<OnUpdateListenner> */

/** Optional<MidiMessagesAnalyzer> */

// MidiDevice

// MidiDevice

//MidiReaderListenner

// String

// PedalCompany

// String

// Cause

// Details

/** int */

/** String */

/** boolean */

/** List<Param> */

/** Optional<OnChangeListenner<Effect>> */

/** List<OnMultistompListenner> */

/** List<Patch> */

/** int */

/*************************************************/

/**
 * @return {PedalType}
 */

/** String */

/** int */

/** int */

/** int */

/** Pula de TANTO em TANTO */
/** int */

/** Optional<OnChangeListenner<Param>> */

/** int */

/** String */

/** List<Effect> */

/** Optional<OnChangeListenner<Patch>> */

// Causer

// Cause

// Details

// ChangeMessage<?>

/** TypeChange */

/** int */

// String

// Strnig

// int

// int

//int
//@Deprecated

//List<MessageDecoder>