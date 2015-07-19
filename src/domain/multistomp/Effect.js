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
