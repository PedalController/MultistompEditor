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
        console.log(message);
		if (message.is(CommonCause.TO_PATCH))
			this.controller.toPatch(message.details.patch);

		else if (message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch == Details.NULL)
			this.controller.activeEffect(message.details.effect);

		else if (message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch != Details.NULL)
			this.controller.multistomp().patchs().get(message.details.patch).effects().get(message.details.effect).active();

		else if (message.is(CommonCause.DISABLE_EFFECT) && message.details.patch == Details.NULL)
			this.controller.disableEffect(message.details.effect);

		else if (message.is(CommonCause.DISABLE_EFFECT) && message.details.patch != Details.NULL)
			this.controller.multistomp().patchs().get(message.details.patch).effects().get(message.details.effect).disable();

		else if (message.is(CommonCause.SET_PARAM)) {
			let idEffect = message.details.effect;
			let idParam  = message.details.param;
			let newValue = message.details.value;

			this.controller.setEffectParam(idEffect, idParam, newValue);
		}
	}
}
