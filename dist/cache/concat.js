"use strict"

export class ImplemetationError extends Error {
}

"use strict"

export class DeviceNotFoundError extends Error {
}

"use strict";

export class BinarioUtil {
    /**
     * @param byte[] a
     * @return String
     */
	static byteArrayToHex(bytes) {
		let returned = " ";
		for (let byte of bytes)
			returned += byte.toString(16).toUpperCase() + " ";

		return `[${returned}]`;
	}
}

"use strict";

export class MidiMessageTester {

    // TestsResults
	tests;

    // MidiMessage
	message;

    /**
     * @param MidiMessage message
     */
	constructor(message) {
		this.message = message;
	}

    /**
     * @return MidiMessageTester
     */
	init() {
		this.tests = new Tests();

		return this;
	}

    /**
     * @return boolean
     */
	test() {
		return this.tests.finalResult();
	}

    /**
     * @param byte[] bytes
     * @return {Boolean}
     */
	isLessThen(bytes) {
		this.tests.add(this.message.length < bytes.length);

		return this;
	}

    /**
     * @param byte[] bytes
     * @return MidiMessageTester
     */
	startingWith(bytes) {
		if (!(bytes.length <= this.message.length)) {
			this.tests.add(false);

			return this;
		}

		for (let i=0; i < bytes.length; i++)
			if (bytes[i] != this.message[i])
				this.tests.add(false);

		this.tests.add(true);

		return this;
	}

    /**
     * @param int size
     * @return MidiMessageTester
     */
	sizeIs(size) {
		this.tests.add(this.message.length == size);

		return this;
	}

    /**
     * @param byte[] bytes
     * @return MidiMessageTester
     */
	endingWith(bytes) {
		if (!(bytes.length <= this.message.length)) {
			this.tests.add(false);

			return this;
		}

		for (let i=1; i<=bytes.length; i++)
			if (bytes[bytes.length-i] != this.message[this.message.length-i])
				this.tests.add(false);

		this.tests.add(true);

		return this;
	}
}

export class Tests {

    result = true;

    /**
     * @param boolean result
     */
    add(result) {
        if (this.result == false)
            return;
        this.result = result;
    }

    finalResult() {
        return this.result;
    }
}

"use strict";

export class Optional {
    constructor(content) {
        this.content = content;
    }

    static of(content) {
        return new Optional(content);
    }

    static empty() {
        return new Optional(null);
    }

    isPresent() {
        return this.content !== null;
    }

    get() {
        if (!this.isPresent())
            throw new Error("NullPointerException");

        return this.content;
    }
}

"use strict";

// FIXME - Fazer SimpleInterface utilizar também um genérico deste
export class MultistompChanger {

    // PedalController
	controller;

    /**
     * @param PedalController controller
     * @return
     */
	constructor(controller) {
		this.controller = controller;
	}

    /**
     * @param Message message
     */
	attempt(message) {
        console.log(message);
		if (message.is(CommonCause.TO_PATCH))
			this.controller.toPatch(message.details.patch);

		else if (message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch == Details.NULL)
			this.controller.activeEffect(message.details.effect);

		else if (message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch != Details.NULL)
			this.controller.multistomp().patchs().get(message.details.patch).effects().get(message.details.effect).active();

		else if (message.is(CommonCause.DISABLE_EFFECT) && message.details.patch == Details.NULL)
			this.controller.disableEffect(message.details.effect);

		else if (message.is(CommonCause.DISABLE_EFFECT) && message.details.patch != Details.NULL)
			this.controller.multistomp().patchs().get(message.details.patch).effects().get(message.details.effect).disable();

		else if (message.is(CommonCause.SET_PARAM)) {
			let idEffect = message.details.effect;
			let idParam  = message.details.param;
			let newValue = message.details.value;

			this.controller.setEffectParam(idEffect, idParam, newValue);
		}
	}
}

"use strict";

export class PedalCompany {

    // String
	name;

    /**
     * @param String name
     */
	constructor(name) {
		this.name = name;
	}


	getName() {
		return this.name;
	}

    /**
     * @return String
     */
    //@Override
	toString() {
		return this.name;
	}
}

PedalCompany.NULL     = new PedalCompany("Unknown Company"),
PedalCompany.ZoomCorp = new PedalCompany("Zoom Corporation"),
PedalCompany.Line6    = new PedalCompany("Line 6"),
PedalCompany.Roland   = new PedalCompany("Roland Corporation");

"use scrict";

export class PedalController implements OnMultistompListenner, OnUpdateListenner {

	// bolean
	started;
	// Multistomp
	pedal;
	// MidiConnection
	connection;

	// List<OnMultistompListenner>
	controllerListenners = new Array();
	// List<OnMultistompListenner>
	realMultistompListenners = new Array();

	/**
	 * @param pedal Multistomp
	 */
	constructor(pedal) {
		this.started = false;

		this.pedal = pedal;

		this.connection = new MidiConnection(pedal, pedal.getPedalType());
		this.connection.setListenner(this);

		this.pedal.addListenner(this);

		this.controllerListenners.push(new Log("Controller"));
		this.realMultistompListenners.push(new Log("Real Multistomp"));
	}

	/*************************************************/

	/** Turn on and inicialize the pedal
	 */
	on() {
		if (this.started)
			return;

		this.started = true;
		this.connection.start();

		this.connection.send(this.pedal.start());
		this.realChange = false; // FIXME - GAMBIARRA
	}

	/** Close connection and turn off the pedal
	 */
	off() {
		if (!this.started)
			return;

		this.started = false;
		this.connection.stop();
	}

	/*************************************************/

	hasStarted() {
		return this.started;
	}

	multistomp() {
		return this.pedal;
	}


	/*************************************************/

	nextPatch() {
		this.pedal.nextPatch();
	}

	beforePatch() {
		this.pedal.beforePatch();
	}

	toPatch(index) {
		this.pedal.toPatch(index);
	}


	/*************************************************/

	/**
	 * @param idEffect int
	 */
	toogleEffect(idEffect) {
		this.pedal.currentPatch().effects[idEffect].toggle();
	}

	/**
	 * @param idEffect int
	 */
	hasActived(idEffect) {
		return this.pedal.currentPatch().effects[idEffect].hasActived();
	}

	/**
	 * @param idEffect int
	 */
	activeEffect(idEffect) {
		this.pedal.currentPatch().effects[idEffect].active();
	}

	/**
	 * @param idEffect int
	 */
	disableEffect(idEffect) {
		this.pedal.currentPatch().effects[idEffect].disable();
	}

	/**
	 * @param int idEffect
	 * @param int idParam
	 * @param int value
	 */
	setEffectParam(idEffect, idParam, value) {
		this.pedal.currentPatch().effects[idEffect].params[idParam].setValue(value);
	}

	/** @return Amount of effects that the current patch has
	 */
	getAmountEffects() {
		return this.pedal.currentPatch().effects.length;
	}

	/** @return listenner OnMultistompListenner
	 */
	addListenner(listenner) {
		this.pedal.addListenner(listenner);
	}

	/*************************************************/
	toString() {
		let retorno = "State: ";
		retorno += started ? "On" : "Off";
		retorno += "\n";

		return retorno + this.pedal.toString();
	}

	/** Multistomp Change */
	/**
	 * @param messages Messages
	 */
	onChange(messages) {
		if (this.realChange) {
			this.realChange = false;
			return;
		}

		this.connection.send(messages);
		this.notify(this.controllerListenners, messages);
	}

	// boolean
	realChange = false;

	/** Real multistomp Change */
	/**
	 * @param messages Messages
	 */
	update(messages) {
		this.realChange = true;

		let changer = new MultistompChanger(this);
		messages.forEach((message) => changer.attempt(message));

		this.notify(this.realMultistompListenners, messages);
	}

	/**
	 * @param listenners []
	 * @param messages Messages
	 */
	notify(listenners, messages) {
		for (let listenner of listenners)
			listenner.onChange(messages);
	}

	/**
	 * @param SysexMessage
	 */
	//@Deprecated
	sendMessage(sysexMessage) {
		this.connection.send(sysexMessage);
	}

	/**
	 * @param messages Messages
	 */
	send(messages) {
		this.connection.send(messages);
		this.realChange = true;
	}
}

"use strict";

export class PedalControllerFactory {

	/**
	 * Search the pedal connected on PC
	 * @return PedalController
	 */
	static searchPedal() {
		for (let multistomp of PedalType.values)
			if (this.isConnected(multistomp))
				return this.getPedal(multistomp);

		return new PedalController(new NullMultistomp());
	}

    /**
     * @param PedalType multistomp
     * @return {Boolean}
     */
	static isConnected(multistomp) {
		return MidiTransmition.findDevices(multistomp).length != 0;
	}

    /**
     * @param PedalType pedalType
     * @return PedalController
     */
	static getPedal(pedalType) {
		let pedal;
		let company = pedalType.getCompany();

		if (company == PedalCompany.ZoomCorp)
			pedal = new ZoomMultistompFactory().generate(pedalType);

		else if (company == PedalCompany.Roland)
			pedal = new NullMultistomp();

		else if (company == PedalCompany.Line6)
			pedal = new NullMultistomp();

		else
			pedal = new NullMultistomp();

		return new PedalController(pedal);
	}
}

"use scrict";


export class MidiConnection implements MidiReaderListenner {

    /** Multistomp */
	multistomp;

    /** MidiSender */
	sender;
    /** MidiReader */
	reader;

    /** MessageEncoder */
	encoder;
    /** MessageDecoder */
	decoder;

    /** Optional<OnUpdateListenner> */
	listenner = Optional.empty();

    /**
	 * @param Multistomp multistomp
     * @param PedalType pedalType
	 */
	constructor(multistomp, pedalType) {
		this.multistomp = multistomp;

		this.sender = new MidiSender(pedalType);
		this.reader = new MidiReader(pedalType);
		this.reader.setListenner(this);

		this.encoder = MessageEncoderFactory.For(pedalType);
		this.decoder = MessageDecoderFactory.For(pedalType);
	}

	/*************************************************/

	start() {
		this.sender.start();
		this.reader.start();
	}

	stop() {
		this.sender.stop();
		this.reader.stop();
	}

	/*************************************************/

    /**
	 * @param messages Messages
	 */
	send(messages) {
		for (let midiMessage of this.generateMidiMessages(messages))
			this.sendMidiMessage(midiMessage);
	}

    /**
	 * @param messages Messages
     *
     * @return List<MidiMessage>
	 */
	generateMidiMessages(messages) {
		return this.encoder.encode(messages);
	}

    /**
     * @param MidiMessage message
     */
	sendMidiMessage(message) {
		console.log("MIDI sended: ");
		//console.log(message);
		console.log(" " + BinarioUtil.byteArrayToHex(message));

		this.sender.send(message);
	}

	/*************************************************/

    /**
     * @param listenner OnUpdateListenner
     */
	setListenner(listenner) {
		this.listenner = Optional.of(listenner);
	}

    /**
     * @param message MidiMessage
     */
	//@Override
	onDataReceived(message) {
		console.log("MIDI received: ");
    	console.log(" " + BinarioUtil.byteArrayToHex(message));

		if (!this.decoder.isForThis(message)) {
			console.log(" unknown ");
			return;
		}

		let messagesDecoded = this.decoder.decode(message, this.multistomp);

    	if (this.listenner.isPresent())
			this.listenner.get().update(messagesDecoded);
	}
}

MidiConnection.OnUpdateListenner = class OnUpdateListenner {
    /**
     * @param messages Messages
     */
    update(messages) {}
}

"use strict";

export class MessageDecoderFactory {
    /**
     * @param PedalType pedalType
     * @return MessageEncoder
     */
	static For(pedalType) {
		if (PedalType.G3 == pedalType)
			return new ZoomGSeriesMessageDecoder();

		throw new Error("MessageDecoder not found for: " + pedalType);
	}
}

"use strict";

export class MessageEncoderFactory {
    /**
     * @param PedalType pedalType
     * @return MessageEncoder
     */
	static For(pedalType) {
		if (PedalType.G3 == pedalType)
			return new ZoomGSeriesMessageEncoder();

        throw new Error("MessageEncoder not found for: " + pedalType);
	}
}

"use strict";

export class MidiTransmition {

    // MidiDevice
    device;

    /**
     * @param PedalType pedalType
     */
	constructor(pedalType) {
		let devices = MidiTransmition.findDevices(pedalType);

		let device = this.locateDeviceIn(devices);

		if (!device.isPresent()) {
            console.log("Midi "+this.deviceType()+" device not found for: " + pedalType + " ("+pedalType.getUSBName()+")");
			throw new DeviceNotFoundError("Midi "+this.deviceType()+" device not found for: " + pedalType + " ("+pedalType.getUSBName()+")");
		}else
			this.device = device.get();
	}

    /**
     * @param List<Info> devices
     * @return Optional<MidiDevice>
     */
	locateDeviceIn(devices) {
		for (let device of devices)
			if (this.isThis(device))
				return Optional.of(device);

		return Optional.empty();
	}

    /**
     * @param MidiDevice device
     * @return {Boolean}
     */
	isThis(device) {}

    /**
     * @return String
     */
	deviceType() {}

	start() {
		this.device.open();
	}

	stop() {
    	this.device.close();
    }

	///////////////////////////////////////////////////

	/**
	 * @param PedalType type
	 * @return List<Info> all devices that corresponding the PedalType
	 */
	static findDevices(type) {
		let devices = new Array();

		let device;

		for (device of midiSystem.midiDevices)
			if (device.name.includes(type.USBName))
				devices.push(device);

		return devices;
	}
}

class MidiSystem {
    midiInputs;
    midiOutputs;

    onStart(midiAccess) {
        this.midiInputs  = midiAccess.inputs;
        this.midiOutputs = midiAccess.outputs;

        console.log("Connected");
    }

    onError(midiAccess) {
        console.log(midiAccess);
        console.log("Deu pau :/");
    }

    get midiDevices() {
        let devices = [];

        for (let input of this.midiInputs.values())
            devices.push(input);
        for (let output of this.midiOutputs.values())
            devices.push(output);

        return devices;
    }
}

let midiSystem = new MidiSystem();

window.addEventListener("load", function() {
    navigator.requestMIDIAccess({ sysex: true }).then(
        midiSystem.onStart.bind(midiSystem),
        midiSystem.onError.bind(midiSystem)
    );
});

"use strict";

/**
 * Send the messages to real Multistomp
 */
export class MidiReader extends MidiTransmition {

	//MidiReaderListenner
	listenner;

    /**
     * @param PedalType pedalType
     */
	constructor(pedalType) {
		super(pedalType);

		this.device.onmidimessage = (message) => this.send(message);
	}

	/**
	 * @param MidiDevice device
	 * @return {Boolean}
	 */
	//@Override
	isThis(device) {
		return device.type == this.deviceType();
	}

	/**
	 * @return {String}
	 */
	//@Override
	deviceType() {
		return "input";
	}

	/*************************************************/
	/**
	 * @param MidiReaderListenner listenner
	 */
	setListenner(listenner) {
		this.listenner = listenner;
	}

    /**
     * @param MidiMessage message
     */
	send(message) {
		this.listenner.onDataReceived(message.data);
	}
}

"use strict";

/**
 * Send the messages to real Multistomp
 */
export class MidiSender extends MidiTransmition {

    /**
     * @param PedalType pedalType
     */
	constructor(pedalType) {
		super(pedalType);
	}

	/**
	 * @param MidiDevice device
	 * @return {Boolean}
	 */
	//@Override
	isThis(device) {
		return device.type == this.deviceType();
	}

	/**
	 * @return {String}
	 */
	//@Override
	deviceType() {
		return "output";
	}

    /**
     * @param MidiMessage message
     */
	send(message) {
		this.device.send(message);
	}
}

"use strict";

export class PedalType {

    static values = new Array();

    // String
    name;
    // PedalCompany
    company;
    // String
	USBName;

    /**
     * @param String       name
     * @param PedalCompany company
     * @param String       USBName
     */
    constructor(name, company, USBName) {
    	this.name = name;
    	this.company = company;
    	this.USBName = USBName;

        PedalType.values.push(this)
    }

    /**
     * @return int
     */
    getId() {
    	return this.id;
    }

    /**
     * @return PedalCompany
     */
	getCompany() {
		return this.company;
	}

    /**
     * @return String
     */
    //@Override
	toString() {
		return this.name + " - " + this.company.toString();
	}

	/**
	 * @return String
	 *
	 * The name will be used to find out which is the USB which is connected to the PC
	 * that is corresponding Pedal
	 */
	getUSBName() {
		return this.USBName;
	}
}

PedalType.Null = new PedalType("Unknown Pedal", PedalCompany.NULL, "Pedal Unknown is unimplemented"),
PedalType.G2Nu = new PedalType("Zoom G2Nu",     PedalCompany.ZoomCorp, "G2Nu/G2.1Nu"),
PedalType.G3   = new PedalType("Zoom G3v2.0",   PedalCompany.ZoomCorp, "ZOOM G Series");

"use strict";

export class CommonCause {};

CommonCause.TO_PATCH ="TO_PATCH";
CommonCause.GENERAL_VOLUME = "GENERAL_VOLUME";

// Patch
CommonCause.PATCH_VOLUME = "PATCH_VOLUME";
// Effect
CommonCause.ACTIVE_EFFECT = "ACTIVE_EFFECT";
CommonCause.DISABLE_EFFECT = "DISABLE_EFFECT";
// Param
CommonCause.SET_PARAM = "SET_PARAM";

"use strict";

export class Messages implements Iterable<Messages.Message> {

    // List<Message>
	messages = new Array();

    /**
     * @return Messages
     */
	static Empty() {
		return new Messages();
	}

    /**
     * @param Message ... messages
     *
     * @return Messages
     */
	static For(... messages) {
		let returned = new Messages();

		for (let message of messages)
			returned.addMessage(message);

		return returned;
	}

	constructor() {}

    /**
     * @param Cause cause
     */
	addCause(cause) {
		this.addCause(cause, new Details());
	}

    /**
     * @param Cause   cause
     * @param Details details
     */
	addCauseDetails(cause, details) {
		this.addMessage(new Message(cause, details));
	}

    /**
     * @param Message message
     */
	addMessage(message) {
		this.messages.push(message);
	}

    /**
     * @param Messages messages
     */
	concatWith(messages) {
		messages.forEach(message => this.addMessage(message));
	}

	/**
	 * @return Iterator<Message>
	 */
	//@Override
	//iterator() {
	[Symbol.iterator]() {
		return this.messages[Symbol.iterator]();
	}

	forEach(funcao) {
		this.messages.forEach(funcao);
	}

    /**
     * @param Cause cause
     * @return Messages
     */
	get(cause) {
		let returned = new Messages();

		for (let message of this)
			if (message.is(cause))
				returned.addMessage(message);

		return returned;
	}

    /**
     * @return String
     */
	//@Override
	toString() {
		let returned = "";

		for (let message of this.messages)
			returned += message.toString();

		return returned;
	}
}

Messages.Details = class Details {
    // int
    static NULL = -1;

    patch  = Details.NULL;
    effect = Details.NULL;
    param  = Details.NULL;
    value  = Details.NULL;

    /**
     * @return String
     */
    //@Override
    toString() {
        let retorno = "";
        if (this.patch != Details.NULL)
            retorno += " patch=" + this.patch;
        if (this.effect != Details.NULL)
            retorno += " effect=" + this.effect;
        if (this.param != Details.NULL)
            retorno += " param=" + this.param;
        if (this.value != Details.NULL)
            retorno += " value=" + this.value;

        return retorno;
    }
}

Messages.Message = class Message {
    // Cause
    cause;
    // Details
    details;

    /**
     * @param Cause cause
     */
    constructor(cause, details) {
        if (details === undefined)
            this._MessageCause(cause);
        else
            this._MessageCauseDetails(cause, details);
    }

    _MessageCause(cause) {
        this._MessageCauseDetails(cause, new Details());
    }

    /**
     * @param Cause   cause
     * @param Details details
     */
    _MessageCauseDetails(cause, details) {
        this.cause = cause;
        this.details = details;
    }

    /**
     * @return Details
     */
    details() {
        return this.details;
    }

    /**
     * @param Cause cause
     * @return {Boolean}
     */
    is(cause) {
        return this.cause == cause;
    }

    /**
     * @return String
     */
    //@Override
    toString() {
        let retorno = `${this.cause}: (${this.details})`;

        return retorno;
    }
}

"use strict";

export class Effect implements OnChangeListenner<Param> {

    /** int */
	midiId;
    /** String */
	name;
    /** boolean */
	state = false;

    /** List<Param> */
	params = new Array();

    /** Optional<OnChangeListenner<Effect>> */
	listenner = Optional.empty();

    /**
     * @param int    midiId
     * @param String name
     */
	constructor(midiId, name) {
		this.midiId = midiId;
		this.name = name;
	}

	/**
	 * Midi Id for send message
     * @return int
     */
	getMidiId() {
		return this.midiId;
	}

    /**
     * @return String
     */
	getName() {
		return this.name;
	}

	active() {
		this.setState(true);
	}

	disable() {
		this.setState(false);
	}

	toggle() {
		if (this.hasActived())
			this.disable();
		else
			this.active();
	}

    /**
     * @param boolean state
     */
	setState(state) {
		this.state = state;

		let details = new Details(Details.TypeChange.PEDAL_STATUS, state ? 1 : 0);

		let message = new ChangeMessage(MultistompCause.EFFECT, this, details);
		this.notify(message);
	}

    /**
     * @return {Boolean}
     */
	hasActived() {
		return this.state;
	}

    /**
     * @param Param param
     */
	addParam(param) {
		this.params.push(param);
		param.setListenner(this);
	}

    /**
     * @return {String}
     */
	toString() {
		let builder = `${this.name}: ${this.midiId} ${Effect.name} - `;
		builder += this.state ? "Actived" : "Disabled";

		for (let param of this.params)
			builder += param.toString();
		builder += ")";

		return builder;
	}

	/*************************************************/

    /**
     * @param OnChangeListenner<Effect> listenner
     */
	setListenner(listenner) {
		this.listenner = Optional.of(listenner);
	}

	/**
	 * @param ChangeMessage<Param> message
	 */
	//@Override
	onChange(message) {
		let newMessage = new ChangeMessage(MultistompCause.SUPER, this, message);
		this.notify(newMessage);
	}

    /**
     * @param ChangeMessage<Effect> message
     */
	notify(message) {
		if (!this.listenner.isPresent())
			return;

		this.listenner.get().onChange(message);
	}
}

"use strict";

export class Multistomp implements OnChangeListenner<Patch> {

    /** List<OnMultistompListenner> */
	listenners = new Array();

    /** List<Patch> */
	patchs = new Array();

    /** int */
	idCurrentPatch = 0;

	/*************************************************/

	/**
	 * @return {PedalType} [description]
	 */
	getPedalType() {}

	/*************************************************/

    /**
     * @param {Patch} patch
     */
	addPatch(patch) {
		this.patchs.push(patch);
		patch.setListenner(this);
	}

    /**
     * @return Patch
     */
	currentPatch() {
		try {
			return this.patchs[this.idCurrentPatch];
		} catch (e) {
			throw new ImplemetationError("This multistomp havent any Patch. \nAdd the Patchs in the Pedal Construtor: " + this.name);
		}
	}

    /**
     * @return {int}
     */
	getIdCurrentPatch() {
		return this.idCurrentPatch;
	}

    nextPatch() {
		this.toPatch(this.idCurrentPatch+1);
	}

	beforePatch() {
		this.toPatch(this.idCurrentPatch-1);
	}

    /**
     * @param  {int}
     */
	toPatch(index) {
		if (index >= this.patchs.length)
			index = 0;

		else if (index < 0)
			index = this.patchs.length-1;

		this.idCurrentPatch = index;

		let details = new Details(Details.TypeChange.PATCH_NUMBER, this.idCurrentPatch);

		let newMessage = new ChangeMessage(MultistompCause.MULTISTOMP, this, details);
		this.notify(newMessage);
	}

    /**
     * @return {List<Patch>}
     */
	patchs() {
		return patchs;
	}

	/*************************************************/

    /**
     * @return {String}
     */
	//@Override
	toString() {
		let retorno = "";
		retorno += "Multistomp: "  + Multistomp.name + "\n";
		retorno += " - Current Patch: " + this.currentPatch().toString() + "\n";
		retorno += " - Effects: \n";

		for (let effect of this.currentPatch().effects)
			retorno  += "  |- " + effect.toString() + "\n";

		return retorno;
	}


	/*************************************************/

    /**
     * @param {OnMultistompListenner} listenner
     */
	addListenner(listenner) {
		this.listenners.push(listenner);
	}

    /**
     * @return {List<OnMultistompListenner>}
     */
	listenners() {
		return this.listenners;
	}

    /**
     * @param  {ChangeMessage<Patch>} message
     */
    //@Override
	onChange(message) {
		let newMessage = new ChangeMessage(MultistompCause.SUPER, this, message);
		this.notify(newMessage);
	}

    /**
     * @param  {ChangeMessage<Multistomp>} ChangeMessage<Multistomp> message
     */
	notify(message) {
		let messages = MultistompMessagesConverter.convert(message);

		this.listenners.forEach(listenner => listenner.onChange(messages));
	}

	/*************************************************/

    /**
     * @return {Messages}
     */
	start() {}
}

"use strict";

export class MultistompMessagesConverter {

    /**
     * @param ChangeMessage<Multistomp> message
     * @return Messages
     */
	static convert(message) {
		let msg = null;
		let details = new Messages.Details();

		if (message.is(MultistompCause.MULTISTOMP))
			msg = this.convertToPatch(message, details);

		else if (message.is(MultistompCause.EFFECT))
			msg = this.convertStatusEffect(message, details);

		else if (message.is(MultistompCause.PATCH))
			msg = this.convertSetParam(message, details);

		if (msg != null)
			return Messages.For(msg);
		else
			return Messages.For();
	}

    /**
     * @param  ChangeMessage<Multistomp> message
     * @param  Details                   details
     *
     * @return Message
     */
	static convertToPatch(message, details) {
		details.patch = message.causer.getIdCurrentPatch();

		return new Messages.Message(CommonCause.TO_PATCH, details);
	}

    /**
     * @param  ChangeMessage<Multistomp> message
     * @param  Details                   details
     *
     * @return Message
     */
	static convertStatusEffect(message, details) {
		let patch = message.nextMessage.causer;
		details.patch = message.causer.patchs.indexOf(patch);

		let effect = message.realMessage().causer;
		let idEffect = patch.effects.indexOf(effect);

		details.effect = idEffect;
		let cause = effect.hasActived() ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

		return new Messages.Message(cause, details);
	}

    /**
     * @param ChangeMessage<Multistomp> message
     * @param Details                   details
     *
     * @return Message
     */
	static convertSetParam(message, details) {
		let patch = message.nextMessage.causer;
		let effect = message.nextMessage.nextMessage.causer;
		let idEffect = patch.effects.indexOf(effect);

		details.effect = idEffect;
		details.param = effect.params.indexOf(message.realMessage().causer);
		details.value = message.realMessage().causer.getValue();

		return new Messages.Message(CommonCause.SET_PARAM, details);
	}
}

"use strict";

export class Param {

    /** String */
	name;

    /** int */
	minValue;
    /** int */
	maxValue;
    /** int */
	currentValue;

	/** Pula de TANTO em TANTO */
    /** int */
	stepByStep = 1;

    /** Optional<OnChangeListenner<Param>> */
	listenner = Optional.empty();

    /**
     * @param String name
     * @param int    minValue
     * @param int    maxValue
     * @param int    defaultValue
     * @param int    stepByStep
     */
	constructor(name, minValue, maxValue, defaultValue, stepByStep) {
		this.name = name;

		this.minValue = minValue;
		this.maxValue = maxValue;

		this.setCurrentValue(defaultValue);
		this.stepByStep = stepByStep;
	}

    /**
     * @param int newValue
     */
	setCurrentValue(newValue) {
		if (!this.isValidValue(newValue)) {
			if (newValue > this.maxValue)
				newValue = this.maxValue;
			else
				newValue = this.minValue;
		}

		this.currentValue = newValue;

		let details = new Details(Details.TypeChange.PARAM, this.currentValue);

		let message = new ChangeMessage(MultistompCause.PATCH, this, details);
		this.notify(message);
	}

    /**
     * @param int value
     * @return {Boolean}
     */
     isValidValue(value) {
		return !(value < this.minValue || value > this.maxValue);
	}

    /**
     * @param ChangeMessage<Param> message
     */
	notify(message) {
		if (!this.listenner.isPresent())
			return;

		this.listenner.get().onChange(message);
	}

    /**
     * @return String
     */
	getName() {
		return this.name;
	}

    /**
     * @return int
     */
	getValue() {
		return this.currentValue;
	}

    /**
     * @param int
     */
	setValue(value) {
		this.setCurrentValue(value);
	}

	addValue() {
		let newValue = this.currentValue + this.stepByStep;

		if (!this.isValidValue(newValue))
			// Don't change current value
			return;

		this.setValue(newValue);
	}

    /**
     * @return int
     */
	getMinValue() {
		return this.minValue;
	}

    /**
     * @return int
     */
	getMaxValue() {
		return this.maxValue;
	}

	/*************************************************/

    /**
     * @param OnChangeListenner<Param> listenner
     */
	setListenner(listenner) {
		this.listenner = Optional.of(listenner);
	}

	/**
	 * @return String
	 */
	//@Override
	toString() {
		return `${this.name} = ${this.currentValue} [${this.minValue} - ${this.maxValue}]`;
	}
}

"use strict";

export class Patch implements OnChangeListenner<Effect> {
    /** int */
	id;

    /** String */
	name = "";

    /** List<Effect> */
	effects = new Array();

    /** Optional<OnChangeListenner<Patch>> */
	listenner = Optional.empty();

    /**
     * @param int id
     */
	constructor(id) {
		this.id = id;
	}

    /**
     * @return {id}
     */
	getId() {
		return id;
	}

    /**
     * @param {Effect} effect
     */
	addEffect(effect) {
		this.effects.push(effect);
		effect.setListenner(this);
	}

	/*************************************************/

    /**
     * @param {OnChangeListenner<Patch>} listenner
     */
	setListenner(listenner) {
		this.listenner = Optional.of(listenner);
	}

	/**
	 * @param ChangeMessage<Effect> message
	 */
	//@Override
	onChange(message) {
		let newMessage = new ChangeMessage(MultistompCause.SUPER, this, message);
		this.notify(newMessage);
	}

    /**
     * @param ChangeMessage<Patch> message
     */
	notify(message) {
		if (!this.listenner.isPresent())
			return;

		this.listenner.get().onChange(message);
	}

	/*************************************************/

	/**
	 * @return String
	 */
	//@Override
	toString() {
		return `Patch ${this.id} - ${this.name} (${this.effects.length}) Effect(s))`;
	}
}

"use strict";

export class ChangeMessage<Causer> {

    // Causer
	causer;
    // Cause
	cause;
    // Details
	details;

    // ChangeMessage<?>
	nextMessage = null;

    /**
     * @param Multistomp multistomp
     *
     * @return ChangeMessage<Multistomp>
     */
	static None(multistomp) {
		return new ChangeMessage<Multistomp>(MultistompCause.NONE, multistomp, Details.NONE());
	}

    /**
     * @param Multistomp multistomp
     * @param Details    details
     *
     * @return ChangeMessage<Multistomp>
     */
	static For(multistomp, details) {
		return new ChangeMessage<Multistomp>(MultistompCause.MULTISTOMP, multistomp, details);
	}

    /**
     * @param Multistomp multistomp
     * @param Patch      patch
     * @param Details    details
     */
	static For(multistomp, patch, details) {
		let patchMsg  = new ChangeMessage<Patch>(MultistompCause.PATCH, patch, details);
		let multistompMsg = new ChangeMessage<Multistomp>(MultistompCause.SUPER, multistomp, patchMsg);

		return multistompMsg;
	}

    /**
     * @param Multistomp multistomp
     * @param Patch      patch
     * @param Effect     effect
     * @param Details    details
     */
	static For(multistomp, patch, effect, details) {
		let effectMsg = new ChangeMessage<Effect>(MultistompCause.EFFECT, effect, details);
		let patchMsg  = new ChangeMessage<Patch>(MultistompCause.SUPER, patch, effectMsg);
		let multistompMsg = new ChangeMessage<Multistomp>(MultistompCause.SUPER, multistomp, patchMsg);

		return multistompMsg;
	}

    /**
     * @param Multistomp multistomp
     * @param Patch      patch
     * @param Effect     efeito
     * @param Param      param
     * @param Details    details
     */
	static For(multistomp, patch, efeito, param, details) {
		let paramMsg  = new ChangeMessage<Param>(MultistompCause.PARAM, param, details);
		let effectMsg = new ChangeMessage<Effect>(MultistompCause.SUPER, efeito, paramMsg);
		let patchMsg  = new ChangeMessage<Patch>(MultistompCause.SUPER, patch, effectMsg);
		let multistompMsg = new ChangeMessage<Multistomp>(MultistompCause.SUPER, multistomp, patchMsg);

		return multistompMsg;
	}

    constructor(cause, causer, what) {
        if (what instanceof ChangeMessage)
            this._constructorMessage(cause, causer, what);
        else
            this._constructorDetails(cause, causer, what);
    }

    /**
     * @param Cause            cause
     * @param Causer           causer
     * @param ChangeMessage<?> nextMessage
     */
    _constructorMessage(cause, causer, nextMessage) {
		this._constructorDetails(cause, causer, Details.NONE());
		this.nextMessage = nextMessage;
	}

    /**
     * @param Cause   cause
     * @param Causer  causer
     * @param Details details
     */
	_constructorDetails(cause, causer, details) {
		this.cause = cause;
		this.causer = causer;
		this.details = details;
	}

	/** Details of what has changed
     * @return Details
     */
	details() {
		return details;
	}

    /**
     * @param Cause cause
     * @return {Boolean}
     */
	is(cause) {
		return cause === this.realMessage().cause;
	}

    /**
     * @return {ChangeMessage<?>}
     */
	realMessage() {
		let message = this;

		while (message.cause == MultistompCause.SUPER)
			message = message.nextMessage;

		return message;
	}

	/**
	 * @return String
	 */
	//@Override
	toString() {
		let returned = "";

		returned += this.causer.getClass().getSimpleName();

		if (this.cause == MultistompCause.SUPER)
			returned += " -> " + this.nextMessage.toString();
		else
			returned += " (" + this.cause.toString() + ")";

		return returned;
	}
}

"use strict";

export class Details implements Cause {
    /** TypeChange */
	type;
    /** int */
	newValue;

    /**
     * @return Details
     */
	static NONE() {
		return new Details(Details.TypeChange.NONE, 0);
	}

    /**
     * @param TypeChange type
     * @param int        newValue
     */
	constructor(type, newValue) {
		this.type = type;
		this.newValue = newValue;
	}

    /**
     * @return int
     */
	newValue() {
		return this.newValue;
	}

    /**
     * @return TypeChange
     */
	type() {
		return this.type;
	}

    /**
     * @return String
     */
	//@Override
	toString() {
		return `(${this.type} ${this.newValue})`;
	}
}

Details.TypeChange  = {
    NONE:"NONE",
    PEDAL_STATUS: "PEDAL_STATUS",
    PARAM:"PARAM",
    PATCH_NUMBER:"PATCH_NUMBER"
}

"use strict";

export class MultistompCause implements Cause {}

MultistompCause.SUPER = "SUPER";
/** None change detected */
MultistompCause.NONE = "NONE";

MultistompCause.MULTISTOMP = "MULTISTOMP";
MultistompCause.PATCH = "PATCH";
MultistompCause.EFFECT = "EFFECT";
MultistompCause.PARAM = "PARAM";

"use strict";

export class Log implements OnMultistompListenner {

    // String
	type;

    /**
     * @param String type
     */
	constructor(type) {
		this.type = type;
	}

	/**
	 * @param Messages messages
	 */
	//@Override
	onChange(messages) {
		for (let message of messages) {
			console.info("LOG:: " + this.type);
			console.log("LOG:: " + message.toString());
		}
	}
}

"use strict";

export class MultistompSimulator extends Multistomp {

    /**
     * @param {int} int totalPatch
     */
	constructor(totalPatch) {
        super();
		for (let i = 0; i < totalPatch; i++) {
			let patch = new Patch(i);
			for (let effect of this.genEffects())
				patch.addEffect(effect);

			this.addPatch(patch);
		}
	}

    /**
     * @return {List<Effect>} [description]
     */
	genEffects() {
		let effects = new Array();

		effects.push(this.genEffect(0, "Overdrive"));
		effects.push(this.genEffect(1, "Reverb"));
		effects.push(this.genEffect(2, "Chorus"));

		return effects;
	}

    /**
     * @param  {int}    id
     * @param  {String} name
     * @return {Effect}
     */
	genEffect(id, name) {
		let effect = new Effect(id, name);
		effect.addParam(new Param("Gain", 0, 50, 0, 1));
		effect.addParam(new Param("Volume", 0, 25, 0, 1));

		return effect;
	}

    /**
     * @return {Messages}
     */
    //@Override
	start() {
		return Messages.Empty();
	}


    /**
     * @return {PedalType}
     */
    //@Override
	getPedalType() {
		return PedalType.Null;
	}
}

"use strict";

export class NullMultistomp extends Multistomp {

    // Strnig
	MSG_ERROR = "Pedal Unknown is unimplemented";

	constructor() {
        super();
		this.addPatch(new Patch(0));
		console.log(this.MSG_ERROR);
	}

	/**
	 * @return PedalType
	 */
	//@Override
	getPedalType() {
		return PedalType.Null;
	}

	/**
	 * @return Messages
	 */
	//@Override
	start() {
		return Messages.Empty();
	}
}

"use strict";

export class ZoomMultistompFactory implements MultistompFactory {

	/**
	 * @param PedalType type
	 * @return Multistomp
	 */
	//@Override
	generate(type) {
		if (type == PedalType.G2Nu)
			return new ZoomG2Nu();
		else if (type == PedalType.G3)
			return new ZoomGSeries(100, 6, 8);
		else
			return new ZoomGSeries(0, 5, 9);
	}
}

"use strict";

/** For:
 *  - Zoom G3
 *  - Zoom G5
 *  - Zoom Ms-50G
 *  - Zoom Ms-70cd
 *  - Zoom MS-200bt
 *  - Zoom MS-50B
 */
export class ZoomGSeries extends Multistomp {

    // int
	TOTAL_PATCHS;
    // int
	TOTAL_EFFECTS;
    //int
	//@Deprecated
	SIZE_PARAMS;

	/**
	 * @param int         totalPatchs     Max Patches that Pedal may have
	 * @param int         totalEffects    Max Effects that Patches may have
	 * @param @Deprecated int totalParams
	 */
	constructor(totalPatchs, totalEffects, totalParams) {
        super();
		this.TOTAL_PATCHS = totalPatchs;
		this.TOTAL_EFFECTS = totalEffects;
		this.SIZE_PARAMS = totalParams;

		let patchs = this.createPatchs(this.TOTAL_PATCHS);

		for (let patch of patchs)
			this.addPatch(patch);
	}

    /**
     * @param int totalPatch
     * @return List<Patch>
     */
	createPatchs(totalPatch) {
		let patchs = new Array();

		for (let i=0; i<totalPatch; i++) {
			let patch = new Patch(i);
			for (let effect of this.createEffects(this.TOTAL_EFFECTS))
				patch.addEffect(effect);

			patchs.push(patch);
		}

		return patchs;
	}

    /**
     * @param int totalEffects
     * @return List<Effect>
     */
	createEffects(totalEffects) {
		let effects = new Array();

		for (let i=0; i < totalEffects; i++)
			//effects.push(new ZoomGenericEffect(i, "Position "+i, SIZE_PARAMS));
			effects.push(ZoomGSeriesEffect.COMP.generate());

		return effects;
	}

    /**
     * @return Messages
     */
	//@Override
	start() {
		let messages = Messages.Empty();
		messages.concatWith(ZoomGSeriesMessages.LISSEN_ME());
		messages.concatWith(ZoomGSeriesMessages.YOU_CAN_TALK());

		return messages;
	}

	/**
	 * @return PedalType
	 */
	//@Override
	getPedalType() {
		return PedalType.G3; // FIXME
	}
}

"use strict";

export class ZoomGSeriesCause extends CommonCause {}

ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER   = "REQUEST_CURRENT_PATCH_NUMBER";
ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS  = "REQUEST_CURRENT_PATCH_DETAILS";
ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS = "REQUEST_SPECIFIC_PATCH_DETAILS";

ZoomGSeriesCause.LISSEN_ME    = "LISSEN_ME";
ZoomGSeriesCause.YOU_CAN_TALK = "YOU_CAN_TALK"

ZoomGSeriesCause.SET_EFFECT = "SET_EFFECT";

"use strict";

export class ZoomGSeriesEffect implements ZoomEffect {
	static COMP = new (class COMP {
		/**
		 * @return Effect
		 */
		//@Override
		generate() {
			let effect = new Effect(0, this.constructor.name);

			effect.addParam(new Param("Sense", 0,  10,   6, 1));
			effect.addParam(new Param("Tone",  0,  10,   6, 1));
			effect.addParam(new Param("Level", 0, 150, 100, 1));
			effect.addParam(new Param("ATTCK", 0,   1,   0, 1));

			return effect;
		}
	});
}

"use strict";

export class ZoomGSeriesMessageDecoder implements MessageDecoder {

    //List<MessageDecoder>
	decoders;

	constructor() {
		this.decoders = new Array();

		this.decoders.push(new ZoomGSeriesPatchDecoder());
		//this.decoders.push(new ZoomGSeriesActiveEffectDecoder());
		//this.decoders.push(new ZoomGSeriesDisableEffectDecoder());
		this.decoders.push(new ZoomGSeriesSelectPatchDecoder());
		//this.decoders.push(new ZoomGSeriesSetValueParamDecoder());
	}

	/**
	 * @param MidiMessage message
	 * @return {Boolean}
	 */
	//@Override
	isForThis(message) {
		return this.decodeFor(message).isPresent();
	}

	/**
	 * @param MidiMessage message
	 * @param Multistomp  multistomp
	 * @return Messages
	 */
	decode(message, multistomp) {
		let decoder = this.decodeFor(message);

		if (decoder.isPresent())
			return decoder.get().decode(message, multistomp);

		throw new Error("The message isn't for this implementation");
	}

    /**
     * @param MidiMessage message
     * @return Optional<MessageDecoder>
     */
	decodeFor(message) {
		for (let decoder of this.decoders)
			if (decoder.isForThis(message))
				return Optional.of(decoder);

		return Optional.empty();
	}
}

"use strict";

export class ZoomGSeriesMessageEncoder implements MessageEncoder {

	/**
	 * @param Messages messages
	 * @return List<MidiMessage>
	 */
	//@Override
	encode(messages) {
		let retorno = new Array();

		messages.get(CommonCause.TO_PATCH).forEach(message => retorno.push(this.toPatch(message)));

		messages.get(CommonCause.ACTIVE_EFFECT).forEach(message => {
            let messages = this.statusEffect(message, CommonCause.ACTIVE_EFFECT);
            messages.forEach(message => retorno.push(message));
        });
		messages.get(CommonCause.DISABLE_EFFECT).forEach(message => {
            let messages = this.statusEffect(message, CommonCause.DISABLE_EFFECT);
            messages.forEach(message => retorno.push(message));
        });

		messages.get(CommonCause.SET_PARAM).forEach(message => retorno.push(this.setParam(message)));

		messages.get(ZoomGSeriesCause.SET_EFFECT).forEach(message => retorno.push(this.setEffect(message)));

		messages.get(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER).forEach(message => retorno.push(this.requestCurrentPatchNumber(message)));
		messages.get(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS).forEach(message => retorno.push(this.requestCurrentPatchDetails(message)));
		messages.get(ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS).forEach(message => retorno.push(this.requestSpecificPatchDetails(message)));

		messages.get(ZoomGSeriesCause.LISSEN_ME).forEach(message => retorno.push(this.lissenMe()));
		messages.get(ZoomGSeriesCause.YOU_CAN_TALK).forEach(message => retorno.push(this.youCanTalk()));

		return retorno;
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	toPatch(message) {
		const SET_PATH = 0xc0;//ShortMessage.PROGRAM_CHANGE;

		let patch = message.details.patch;

		try {
			return [SET_PATH, patch];
		} catch (e) {
			throw new Error(e);
		}
	}

    /**
     * @param Message     message
     * @param CommonCause cause
     *
     * @return List<MidiMessage>
     */
	statusEffect(message, cause) {
		let effect = message.details.effect;

		let actived = cause == CommonCause.ACTIVE_EFFECT;
		let byteActived = actived ? 0x01 : 0x00;

		return this.group(this.lissenMe(), this.manupuleEffect(effect, ZoomGSeriesMessageEncoder.SET_STATUS, byteActived));
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	setParam(message) {
		let effect = message.details.effect;
		let param  = message.details.param;
		let value  = message.details.value;

		return this.manupuleEffect(effect, param + ZoomGSeriesMessageEncoder.PARAM_EFFECT, value);
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	setEffect(message) {
		let effect = message.details.effect;
		let value  = message.details.value;

		return this.manupuleEffect(effect, ZoomGSeriesMessageEncoder.CHANGE_EFFECT, value);
	}

	static SET_STATUS = 0;
	static CHANGE_EFFECT = 1;
	static PARAM_EFFECT = 2; // Base

    /**
     * @param int effect
     * @param int type
     * @param int value
     *
     * @return MidiMessage
     */
	manupuleEffect(effect, type, value) {
		let value2 = (value/128)|0;
		value = value % 128;

		return this.customMessageFor([
			0xF0,  0x52,   0x00,
			0x5A,  0x31, effect,
			type, value, value2,
			0xF7
		]);
	}


	///////////////////////////////////////
	// SPECIFIC ZOOM
	///////////////////////////////////////

    /**
     * @param Message message
     * @return MidiMessage
     */
	requestCurrentPatchNumber(message) {
		return this.customMessageFor([
			0xF0, 0x52, 0x00,
			0x5A, 0x33, 0xF7
		]);
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	requestCurrentPatchDetails(message) {
		return this.customMessageFor([
			0xF0, 0x52, 0x00,
			0x5A, 0x29, 0xF7
		]);
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	requestSpecificPatchDetails(message) {
		let patch = message.details().patch;

		let CURRENT_PATCH = [
			0xF0,  0x52, 0x00,
			0x5A,  0x09, 0x00,
			0x00, patch, 0xF7
		];

		return this.customMessageFor(CURRENT_PATCH);
	}

    /**
     * @return MidiMessage
     */
	lissenMe() {
		return this.customMessageFor([
			0xF0, 0x52, 0x00,
			0x5A, 0x50, 0xF7
		]);
	}

    /**
     * @return MidiMessage
     */
	youCanTalk() {
		return this.customMessageFor([
			0xF0, 0x52, 0x00,
			0x5A, 0x16, 0xF7
		]);
	}

    /**
     * @param MidiMessage ... messages
     * @return List<MidiMessage>
     */
	group(... messages) {
		let mensagens = new Array();

		for (let midiMessage of messages)
			mensagens.push(midiMessage);

		return mensagens;
	}

    /**
     * @param byte[] message
     *
     * @return SysexMessage
     */
	customMessageFor(message) {
		try {
			return message;//new SysexMessage
		} catch (e) {
			throw new Error(e);
		}
	}
}

"use strict";

export class ZoomGSeriesMessages {

    /**
     * @return Messages
     */
	static REQUEST_CURRENT_PATCH_NUMBER() {
		return Messages.For(new Messages.Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER));
	}

    /**
     * @return Messages
     */
	static REQUEST_CURRENT_PATCH_DETAILS() {
		return Messages.For(new Messages.Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS));
	}

    /**
     * @param int idPatch
     * @return Messages
     */
	static REQUEST_SPECIFIC_PATCH_DETAILS(idPatch) {
		let details = new Messages.Detals()
		details.patch = idPatch;

		return Messages.For(new Messages.Message(ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS, details));
	}

    /**
     * @return Messages
     */
	static LISSEN_ME() {
		return Messages.For(new Messages.Message(ZoomGSeriesCause.LISSEN_ME));
	}

    /**
     * @return Messages
     */
	static YOU_CAN_TALK() {
		return Messages.For(new Messages.Message(ZoomGSeriesCause.YOU_CAN_TALK));
	}

    /**
     * @param int effectPos
     * @param int newEffect
     *
     * @return Messages
     */
	static SET_EFFECT(effectPos, newEffect) {
		let details = new Messages.Detals()
		details.effect = effectPos;
		details.value  = newEffect;

		return Messages.For(new Messages.Message(ZoomGSeriesCause.SET_EFFECT, details));
	}
}

"use strict";

export class AbstractZoomGSeriesPatchDecoder implements MessageDecoder {

	//@Override
	/**
	 * @param MidiMessage message
	 * @return {Boolean}
	 */
	isForThis(message) {
		let tester = new MidiMessageTester(message);

		return tester.init().sizeIs(this.size()).test();
	}

    /**
     * @return {[type]}
     */
	size() {}

	//@Override
	/**
	 * @param MidiMessage message
	 * @param Multistomp multistomp
	 * @return Messages
	 */
	decode(message, multistomp) {
		const PATCHES = this.patches();

		let effects = multistomp.currentPatch().effects();

		let messages = Messages.Empty();
		for (let i = 0; i < PATCHES.length; i++) {
			let patch = PATCHES[i];

			let actived = this.hasActived(message, patch);
			if (this.refressAll() || (actived && !effects.get(i).hasActived()))
				messages.add(this.generateMessageFor(actived, i));
		}

		return messages;
	}

    /**
     * @return {Boolean}
     */
	refressAll() {}

    /**
     * @return int[]
     */
	patches() {}

    /**
     * @param boolean actived
     * @param int     effect
     * @return Messages.Message
     */
	generateMessageFor(actived, effect) {
		let cause = actived ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

		let details = new Details();
		details.effect = effect;

		return new Messages.Message(cause, details);
	}

    /**
     * @param MidiMessage message
     * @param int         position
     * @return {Boolean}
     */
	hasActived(message, position) {
		const LSB = 0x01; // Least Significant Bit

		let actived = message.getMessage()[position] & LSB;

		return actived == 1;
	}
}

"use strict";

export class ZoomGSeriesPatchDecoder extends AbstractZoomGSeriesPatchDecoder {

	static PATCH = 7;

	/**
	 * @param MidiMessage message
	 * @param Multistomp  multistomp
	 * @return Messages
	 */
	//@Override
	decode(message, multistomp) {
		let returned = super.decode(message, multistomp);

		const patch = message.getMessage()[ZoomGSeriesPatchDecoder.PATCH];
		returned.forEach((messagem) => messagem.details().patch = patch);

		return returned;
	}

	/**
	 * @return int
	 */
	//@Override
	size() {
		return 120;
	}

	/**
	 * @return int[]
	 */
	//@Override
	patches() {
		return [6+5, 19+5, 33+5, 47+5, 60+5, 74+5];
	}

	/**
	 * @return Boolean
	 */
	//@Override
	refressAll() {
		return true;
	}
}

"use strict";

/**
 * c0 PATCH
 */
export class ZoomGSeriesSelectPatchDecoder implements MessageDecoder {

	static PATCH = 1;

    /**
     * @param MidiMessage message
     * @return {Boolean}
     */
	//@Override
	isForThis(message) {
		let begin = [0xc0];

		let tester = new MidiMessageTester(message);

		return tester.init()
					 .sizeIs(2)
				     .startingWith(begin)
				     .test();
	}

	/**
	 * @param MidiMessage message
	 * @param Multistomp  multistomp
	 * @return Messages
	 */
	//@Override
	decode(message, multistomp) {
		let details = new Messages.Details();
		details.patch = message[ZoomGSeriesSelectPatchDecoder.PATCH];

		return Messages.For(new Messages.Message(CommonCause.TO_PATCH, details));
	}
}
