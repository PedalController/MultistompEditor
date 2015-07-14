"use strict";

"use scrict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

/*
MidiConnection.OnUpdateListenner {
    /**
     * @param messages Messages
     * /
    update(messages);
}
*/