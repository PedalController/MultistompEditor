"use scrict";

class PedalController implements OnMultistompListenner, OnUpdateListenner {

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
