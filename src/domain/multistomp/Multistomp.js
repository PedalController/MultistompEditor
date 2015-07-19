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
