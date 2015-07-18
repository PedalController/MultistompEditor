"use strict"

export class ImplemetationError extends Error {
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
        return this.content == null;
    }
}

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

		this.controllerListenners.add(new Log("Controller"));
		this.realMultistompListenners.add(new Log("Real Multistomp"));
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
		//onChange(message)
		//this.connection.send(message)
		//notify(realMultistompListenners, message)
		//sleep();
	}

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
	off() {
		if (!this,started)
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
		this.pedal.currentPatch().effects().get(idEffect).toggle();
	}

	/**
	 * @param idEffect int
	 */
	hasActived(idEffect) {
		return this.pedal.currentPatch().effects().get(idEffect).hasActived();
	}

	/**
	 * @param idEffect int
	 */
	activeEffect(idEffect) {
		this.pedal.currentPatch().effects().get(idEffect).active();
	}

	/**
	 * @param idEffect int
	 */
	disableEffect(idEffect) {
		this.pedal.currentPatch().effects().get(idEffect).disable();
	}

	/**
	 * @param idEffect int
	 * @param idParam int
	 * @param value int
	 */
	setEffectParam(idEffect, idParam, value) {
		this.pedal.currentPatch().effects().get(idEffect).params().get(idParam).setValue(value);
	}

	/** @return Amount of effects that the current patch has
	 */
	getAmountEffects() {
		return this.pedal.currentPatch().effects().size();
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
		messages.forEach(message => changer.attempt(message));

		this.notify(realMultistompListenners, messages);
	}

	/**
	 * @param listenners []
	 * @param messages Messages
	 */
	notify(listenners, messages) {
		for (listenner of listenners)
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
	 * @param multistomp Multistomp
     * @param pedalType PedalType
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
		for (midiMessage of this.generateMidiMessages(messages))
			this.send(midiMessage);
	}

    /**
	 * @param messages Messages
     *
     * @return List<MidiMessage>
	 */
	generateMidiMessages(messages) {
		return encoder.encode(messages);
	}

    /**
     * @param message MidiMessage
     */
	send(message) {
		console.log("MIDI sended: ");
		console.log(" " + BinarioUtil.byteArrayToHex(message.getMessage()));

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
	// @Override
	onDataReceived(message) {
		console.log("MIDI received: ");
    	console.log(" " + BinarioUtil.byteArrayToHex(message.getMessage()));

		if (!this.decoder.isForThis(message)) {
			console.log(" unknown ");
			return;
		}

		messagesDecoded = this.decoder.decode(message, this.multistomp);

    	if (this.listenner.isPresent())
			this.listenner.get().update(messagesDecoded);
	}
}
/*
MidiConnection.OnUpdateListenner {
    /**
     * @param messages Messages
     * /
    update(messages);
}
*/

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

		let details = new Details(TypeChange.PEDAL_STATUS, state ? 1 : 0);

		let message = new ChangeMessage(MultistompCause.EFFECT, this, details);
		this.notify(message);
	}

    /**
     * @return {Boolean}
     */
	hasActived() {
		return state;
	}

    /**
     * @param Param param
     */
	addParam(param) {
		this.params.push(param);
		param.setListenner(this);
	}

    /**
     * @return {List<Param>}
     */
	params() {
		return this.params;
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
		newMessage = new ChangeMessage(MultistompCause.SUPER, this, message);
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
		//this.notify(newMessage);
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
		let details = Messages.Details();

		if (message.is(MultistompCause.MULTISTOMP))
			msg = convertToPatch(message, details);

		else if (message.is(MultistompCause.EFFECT))
			msg = convertStatusEffect(message, details);

		else if (message.is(MultistompCause.PATCH))
			msg = convertSetParam(message, details);


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
		details.patch = message.causer().getIdCurrentPatch();

		return new Message(CommonCause.TO_PATCH, details);
	}

    /**
     * @param  ChangeMessage<Multistomp> message
     * @param  Details                   details
     *
     * @return Message
     */
	static convertStatusEffect(message, details) {
		let patch = message.nextMessage().causer();
		details.patch = message.causer().patchs().indexOf(patch);

		let effect = message.realMessage().causer();
		let idEffect = patch.effects().indexOf(effect);

		details.effect = idEffect;
		let cause = effect.hasActived() ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

		return new Message(cause, details);
	}

    /**
     * @param ChangeMessage<Multistomp> message
     * @param Details                   details
     *
     * @return Message
     */
	static convertSetParam(message, details) {
		let patch = message.nextMessage().causer();
		let effect = message.nextMessage().nextMessage().causer();
		let idEffect = patch.effects().indexOf(effect);

		details.effect = idEffect;
		details.param = effect.params().indexOf(message.realMessage().causer());
		details.value = message.realMessage().causer().getValue();

		return new Message(CommonCause.SET_PARAM, details);
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

		//let details = new Details(TypeChange.PARAM, currentValue);

		//let message = new ChangeMessage(MultistompCause.PATCH, this, details);
		//this.notify(message);
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
		return currentValue;
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
		this._ChangeMessageDetails(cause, causer, Details.NONE());
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

	/** Who shot
     * @return Causer
     */
	causer() {
		return this.causer;
	}

	/** What has changed
     * @return Cause
     */
	cause() {
		return cause;
	}

	/** Details of what has changed
     * @return Details
     */
	details() {
		return details;
	}

    /**
     * @return ChangeMessage<?>
     */
	nextMessage() {
		return nextMessage;
	}

    /**
     * @param Cause cause
     * @return {Boolean}
     */
	is(cause) {
		return cause.equals(this.realMessage().cause());
	}

    /**
     * @return {ChangeMessage<?>}
     */
	realMessage() {
		let message = this;

		while (message.cause() == MultistompCause.SUPER)
			message = message.nextMessage();

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
	NONE() {
		return new Details(TypeChange.NONE, 0);
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
		return `({this.type} {this.newValue})`;
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
