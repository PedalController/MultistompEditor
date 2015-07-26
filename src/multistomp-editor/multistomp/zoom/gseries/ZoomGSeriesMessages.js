"use strict";

export class ZoomGSeriesMessages {

    /**
     * @return Messages
     */
	static REQUEST_CURRENT_PATCH_NUMBER() {
		return Messages.For(new Messages.Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER));
	}

    /**
     * @return Messages
     */
	static REQUEST_CURRENT_PATCH_DETAILS() {
		return Messages.For(new Messages.Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS));
	}

    /**
     * @param int idPatch
     * @return Messages
     */
	static REQUEST_SPECIFIC_PATCH_DETAILS(idPatch) {
		let details = new Messages.Details();
		details.patch = idPatch;

		return Messages.For(new Messages.Message(ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS, details));
	}

    /**
     * @return Messages
     */
	static LISSEN_ME() {
		return Messages.For(new Messages.Message(ZoomGSeriesCause.LISSEN_ME));
	}

    /**
     * @return Messages
     */
	static YOU_CAN_TALK() {
		return Messages.For(new Messages.Message(ZoomGSeriesCause.YOU_CAN_TALK));
	}

    /**
     * @param int effectPos
     * @param int newEffect
     *
     * @return Messages
     */
	static SET_EFFECT(effectPos, newEffect) {
		let details = new Messages.Details()
		details.effect = effectPos;
		details.value  = newEffect;

		return Messages.For(new Messages.Message(ZoomGSeriesCause.SET_EFFECT, details));
	}
}
