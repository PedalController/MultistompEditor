"use scrict";

export class PedalController implements OnMultistompListenner, OnUpdateListenner {

	// bolean
	started;
	// Multistomp
	pedal;
	// MidiConnection
	connection;

	notifyChangesToDevice = true;

	// List<OnMultistompListenner>
	controllerListenners = new Array();
	// List<OnMultistompListenner>
	realMultistompListenners = new Array();

	/**
	 * @param pedal Multistomp
	 */
	constructor(midiConnection, pedal) {
		this.started = false;

		this.pedal = pedal;

		this.connection = midiConnection;
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
	disableNotificationChangesToDevice() {
		this.notifyChangesToDevice = false;
	}

	activeNotificationChangesToDevice() {
		this.notifyChangesToDevice = true;
	}
	/*************************************************/

	toString() {
		let retorno = "State: ";
		retorno += started ? "On" : "Off";
		retorno += "\n";

		return retorno + this.pedal.toString();
	}

	/** Multistomp Change */
	onChange(messages) {
		if (!this.notifyChangesToDevice)
			return;

		this.connection.send(messages);
		this.notify(this.controllerListenners, messages);
	}

	update(messages) {
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

	//@Deprecated
	sendMessage(sysexMessage) {
		this.connection.send(sysexMessage);
	}

	send(messages) {
		this.connection.send(messages);
	}
}
