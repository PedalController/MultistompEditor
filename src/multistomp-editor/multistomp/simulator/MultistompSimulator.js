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
		return new Messages();
	}


    /**
     * @return {PedalType}
     */
    //@Override
	getPedalType() {
		return PedalType.Null;
	}
}
