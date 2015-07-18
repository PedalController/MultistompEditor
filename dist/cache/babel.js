"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var ImplemetationError = (function (_Error) {
	_inherits(ImplemetationError, _Error);

	function ImplemetationError() {
		_classCallCheck(this, ImplemetationError);

		_get(Object.getPrototypeOf(ImplemetationError.prototype), "constructor", this).apply(this, arguments);
	}

	return ImplemetationError;
})(Error);

"use strict";

var Optional = (function () {
	function Optional(content) {
		_classCallCheck(this, Optional);

		this.content = content;
	}

	_createClass(Optional, [{
		key: "isPresent",
		value: function isPresent() {
			return this.content == null;
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

"use scrict";

var PedalController = (function () {

	/**
  * @param pedal Multistomp
  */

	function PedalController(pedal) {
		_classCallCheck(this, PedalController);

		this.controllerListenners = new Array();
		this.realMultistompListenners = new Array();
		this.realChange = false;

		this.started = false;

		this.pedal = pedal;

		this.connection = new MidiConnection(pedal, pedal.getPedalType());
		this.connection.setListenner(this);

		this.pedal.addListenner(this);

		this.controllerListenners.add(new Log("Controller"));
		this.realMultistompListenners.add(new Log("Real Multistomp"));
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
			//onChange(message)
			//this.connection.send(message)
			//notify(realMultistompListenners, message)
			//sleep();
		}
	}, {
		key: "off",

		/*
  public void sleep() {
  	try {
  		Thread.sleep(50);
  	} catch (InterruptedException e) {
  		e.printStackTrace();
  	}
  }
  
  /** Close connection and turn off the pedal
   */
		value: function off() {
			if ((!this, started)) return;

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
			this.pedal.currentPatch().effects().get(idEffect).toggle();
		}
	}, {
		key: "hasActived",

		/**
   * @param idEffect int
   */
		value: function hasActived(idEffect) {
			return this.pedal.currentPatch().effects().get(idEffect).hasActived();
		}
	}, {
		key: "activeEffect",

		/**
   * @param idEffect int
   */
		value: function activeEffect(idEffect) {
			this.pedal.currentPatch().effects().get(idEffect).active();
		}
	}, {
		key: "disableEffect",

		/**
   * @param idEffect int
   */
		value: function disableEffect(idEffect) {
			this.pedal.currentPatch().effects().get(idEffect).disable();
		}
	}, {
		key: "setEffectParam",

		/**
   * @param idEffect int
   * @param idParam int
   * @param value int
   */
		value: function setEffectParam(idEffect, idParam, value) {
			this.pedal.currentPatch().effects().get(idEffect).params().get(idParam).setValue(value);
		}
	}, {
		key: "getAmountEffects",

		/** @return Amount of effects that the current patch has
   */
		value: function getAmountEffects() {
			return this.pedal.currentPatch().effects().size();
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

			this.notify(realMultistompListenners, messages);
		}
	}, {
		key: "notify",

		/**
   * @param listenners []
   * @param messages Messages
   */
		value: function notify(listenners, messages) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = listenners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					listenner = _step.value;

					listenner.onChange(messages);
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

"use scrict";

var MidiConnection = (function () {

	/**
 * @param multistomp Multistomp
  * @param pedalType PedalType
 */

	function MidiConnection(multistomp, pedalType) {
		_classCallCheck(this, MidiConnection);

		this.listenner = Optional.empty();

		this.multistomp = multistomp;

		this.sender = new MidiSender(pedalType);
		this.reader = new MidiReader(pedalType);
		this.reader.setListenner(this);

		this.encoder = MessageEncoderFactory.For(pedalType);
		this.decoder = MessageDecoderFactory.For(pedalType);
	}

	_createClass(MidiConnection, [{
		key: "start",

		/*************************************************/

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
		key: "send",

		/*************************************************/

		/**
  * @param messages Messages
  */
		value: function send(messages) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.generateMidiMessages(messages)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					midiMessage = _step2.value;

					this.send(midiMessage);
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
		}
	}, {
		key: "generateMidiMessages",

		/**
  * @param messages Messages
   *
   * @return List<MidiMessage>
  */
		value: function generateMidiMessages(messages) {
			return encoder.encode(messages);
		}
	}, {
		key: "send",

		/**
   * @param message MidiMessage
   */
		value: function send(message) {
			console.log("MIDI sended: ");
			console.log(" " + BinarioUtil.byteArrayToHex(message.getMessage()));

			this.sender.send(message);
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
		// @Override
		value: function onDataReceived(message) {
			console.log("MIDI received: ");
			console.log(" " + BinarioUtil.byteArrayToHex(message.getMessage()));

			if (!this.decoder.isForThis(message)) {
				console.log(" unknown ");
				return;
			}

			messagesDecoded = this.decoder.decode(message, this.multistomp);

			if (this.listenner.isPresent()) this.listenner.get().update(messagesDecoded);
		}
	}]);

	return MidiConnection;
})();

/*
MidiConnection.OnUpdateListenner {
    /**
     * @param messages Messages
     * /
    update(messages);
}
*/

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

			var details = new Details(TypeChange.PEDAL_STATUS, state ? 1 : 0);

			var message = new ChangeMessage(MultistompCause.EFFECT, this, details);
			this.notify(message);
		}
	}, {
		key: "hasActived",

		/**
   * @return {Boolean}
   */
		value: function hasActived() {
			return state;
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
		key: "params",

		/**
   * @return {List<Param>}
   */
		value: function params() {
			return this.params;
		}
	}, {
		key: "toString",

		/**
   * @return {String}
   */
		value: function toString() {
			var builder = this.name + ": " + this.midiId + " " + Effect.name + " - ";
			builder += this.state ? "Actived" : "Disabled";

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.params[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var param = _step3.value;

					builder += param.toString();
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
			newMessage = new ChangeMessage(MultistompCause.SUPER, this, message);
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

	_createClass(Multistomp, [{
		key: "getPedalType",

		/*************************************************/

		/**
   * @return {PedalType} [description]
   */
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
			//this.notify(newMessage);
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

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.currentPatch().effects[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var effect = _step4.value;

					retorno += "  |- " + effect.toString() + "\n";
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
			var details = Messages.Details();

			if (message.is(MultistompCause.MULTISTOMP)) msg = convertToPatch(message, details);else if (message.is(MultistompCause.EFFECT)) msg = convertStatusEffect(message, details);else if (message.is(MultistompCause.PATCH)) msg = convertSetParam(message, details);

			if (msg != null) return Messages.For(msg);else return Messages.For();
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
			details.patch = message.causer().getIdCurrentPatch();

			return new Message(CommonCause.TO_PATCH, details);
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
			var patch = message.nextMessage().causer();
			details.patch = message.causer().patchs().indexOf(patch);

			var effect = message.realMessage().causer();
			var idEffect = patch.effects().indexOf(effect);

			details.effect = idEffect;
			var cause = effect.hasActived() ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

			return new Message(cause, details);
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
			var patch = message.nextMessage().causer();
			var effect = message.nextMessage().nextMessage().causer();
			var idEffect = patch.effects().indexOf(effect);

			details.effect = idEffect;
			details.param = effect.params().indexOf(message.realMessage().causer());
			details.value = message.realMessage().causer().getValue();

			return new Message(CommonCause.SET_PARAM, details);
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

			//let details = new Details(TypeChange.PARAM, currentValue);

			//let message = new ChangeMessage(MultistompCause.PATCH, this, details);
			//this.notify(message);
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
			return currentValue;
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

		this.name = "";
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
			this._ChangeMessageDetails(cause, causer, Details.NONE());
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
		key: "causer",

		/** Who shot
      * @return Causer
      */
		value: function causer() {
			return this.causer;
		}
	}, {
		key: "cause",

		/** What has changed
      * @return Cause
      */
		value: (function (_cause) {
			function cause() {
				return _cause.apply(this, arguments);
			}

			cause.toString = function () {
				return _cause.toString();
			};

			return cause;
		})(function () {
			return cause;
		})
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
		key: "nextMessage",

		/**
   * @return ChangeMessage<?>
   */
		value: (function (_nextMessage) {
			function nextMessage() {
				return _nextMessage.apply(this, arguments);
			}

			nextMessage.toString = function () {
				return _nextMessage.toString();
			};

			return nextMessage;
		})(function () {
			return nextMessage;
		})
	}, {
		key: "is",

		/**
   * @param Cause cause
   * @return {Boolean}
   */
		value: function is(cause) {
			return cause.equals(this.realMessage().cause());
		}
	}, {
		key: "realMessage",

		/**
   * @return {ChangeMessage<?>}
   */
		value: function realMessage() {
			var message = this;

			while (message.cause() == MultistompCause.SUPER) message = message.nextMessage();

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
	_createClass(Details, [{
		key: "NONE",

		/**
   * @return Details
   */
		value: function NONE() {
			return new Details(TypeChange.NONE, 0);
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
			return "({this.type} {this.newValue})";
		}
	}]);

	return Details;
})();

Details.TypeChange = {
	NONE: "NONE",
	PEDAL_STATUS: "PEDAL_STATUS",
	PARAM: "PARAM",
	PATCH_NUMBER: "PATCH_NUMBER"
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
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.genEffects()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var effect = _step5.value;

					patch.addEffect(effect);
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
			return Messages.Empty();
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

// bolean

// Multistomp

// MidiConnection

// List<OnMultistompListenner>

// List<OnMultistompListenner>

// boolean

/** Multistomp */

/** MidiSender */

/** MidiReader */

/** MessageEncoder */

/** MessageDecoder */

/** Optional<OnUpdateListenner> */

/** int */

/** String */

/** boolean */

/** List<Param> */

/** Optional<OnChangeListenner<Effect>> */

/** List<OnMultistompListenner> */

/** List<Patch> */

/** int */

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