"use strict";

// FIXME - Fazer SimpleInterface utilizar também um genérico deste
export class MultistompChanger {

    // PedalController
	controller;

    /**
     * @param PedalController controller
     * @return
     */
	constructor(controller) {
		this.controller = controller;
	}

    /**
     * @param Message message
     */
	attempt(message) {
		if (message.is(CommonCause.TO_PATCH))
			this.controller.toPatch(message.details.patch);

		else if (this.isActiveEffectCurrentPatch(message))
			this.controller.activeEffect(message.details.effect);

		else if (this.isActiveEffectSpecificPatch(message))
			this.controller.multistomp().patchs[message.details.patch].effects[message.details.effect].active();

		else if (this.isDisableEffectCurrentPatch(message))
			this.controller.disableEffect(message.details.effect);

		else if (this.isDisableEffectSpecificPatch(message))
			this.controller.multistomp().patchs[message.details.patch].effects[message.details.effect].disable();

		else if (message.is(CommonCause.SET_PARAM)) {
			let idEffect = message.details.effect;
			let idParam  = message.details.param;
			let newValue = message.details.value;

			this.controller.setEffectParam(idEffect, idParam, newValue);

		} else if (message.is(CommonCause.PATCH_NAME))
			this.controller.multistomp().currentPatch().name = message.details.value;

	}

	isActiveEffectCurrentPatch(message) {
		return message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch == Messages.Details.NULL;
	}

	isDisableEffectCurrentPatch(message) {
		return message.is(CommonCause.DISABLE_EFFECT) && message.details.patch == Messages.Details.NULL;
	}

	isActiveEffectSpecificPatch(message) {
		message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch != Details.NULL
	}

	isDisableEffectSpecificPatch(message) {
		message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch != Details.NULL
	}
}
