"use strict";

export class Patch implements OnChangeListenner<Effect> {
    /** int */
	id;

    /** String */
	patchName = "";

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

	get name() {
		return this.patchName;
	}

	set name(name) {
		this.patchName = name;

		let details = new Details(Details.TypeChange.PATCH_NAME, this.patchName);

		let newMessage = new ChangeMessage(MultistompCause.PATCH, this, details);
		this.notify(newMessage);
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
