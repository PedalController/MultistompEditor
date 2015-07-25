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
