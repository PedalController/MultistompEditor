"use scrict";

export class PedalController implements OnMultistompListener, OnUpdateListener {

	started : boolean;
	pedal : Multistomp;
	connection : MidiConnection;

	notifyChangesToDevice : boolean = true;

	controllerListenners = new Array<OnMultistompListener>();
	realMultistompListenners = new Array<OnMultistompListener>();

	constructor(midiConnection, pedal : Multistomp) {
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

	hasStarted() : boolean {
		return this.started;
	}

	multistomp() : boolean {
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

	toogleEffect(idEffect : number) {
		this.pedal.currentPatch().effects[idEffect].toggle();
	}

	hasActived(idEffect : number ) {
		return this.pedal.currentPatch().effects[idEffect].hasActived();
	}

	activeEffect(idEffect : number) {
		this.pedal.currentPatch().effects[idEffect].active();
	}

	disableEffect(idEffect : number) {
		this.pedal.currentPatch().effects[idEffect].disable();
	}

	setEffectParam(idEffect : number, idParam : number, value : number) {
		this.pedal.currentPatch().effects[idEffect].params[idParam].setValue(value);
	}

	/** @return Amount of effects that the current patch has
	 */
	getAmountEffects() {
		return this.pedal.currentPatch().effects.length;
	}

	addListenner(listenner : OnMultistompListener) {
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

	toString() : string {
		let retorno = "State: ";
		retorno += this.started ? "On" : "Off";
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
	notify(listenners : Array<any>, messages) {
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