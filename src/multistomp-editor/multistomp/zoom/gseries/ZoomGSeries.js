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
		let messages = new Messages();
		messages.concatWith(ZoomGSeriesMessages.LISSEN_ME())
				.concatWith(ZoomGSeriesMessages.YOU_CAN_TALK());

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
