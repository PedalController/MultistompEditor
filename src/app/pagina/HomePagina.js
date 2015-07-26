"use strict";

class HomePagina extends Pagina {
    constructor(router) {
        super(router);
        this.controller = new HomeController(this);
        this.pedal = null;
    }

    inicializar(parametros) {
        this.pedal = PedalControllerFactory.searchPedal();
        this.pedal.on();
        this.pedal.addListenner(this);

        this.pedal.send(ZoomGSeriesMessages.REQUEST_CURRENT_PATCH_NUMBER());
    }

    finalizar() {
        this.pedal.off();
    }

    ////////////////////////////////////////

    onChange(messages) {
        messages.get(CommonCause.ACTIVE_EFFECT).forEach(message => this.updateEffect(message, CommonCause.ACTIVE_EFFECT));
		messages.get(CommonCause.DISABLE_EFFECT).forEach(message => this.updateEffect(message, CommonCause.DISABLE_EFFECT));

		messages.get(CommonCause.TO_PATCH).forEach(message => this.setPatch(message));

		messages.get(CommonCause.SET_PARAM).forEach(message => console.log(pedal));

        messages.get(CommonCause.PATCH_NAME).forEach(message => {this.controller.setTitle(message.details.value)});
    }

    updateEffect(message, cause) {
		let patch  = message.details.patch;
		let effect = message.details.effect;

		if (patch != this.pedal.multistomp().getIdCurrentPatch())
			return;

		if (cause == CommonCause.ACTIVE_EFFECT)
			this.controller.active(effect);
		else
			this.controller.disable(effect);
	}

	setPatch(message) {
		let idPatch = message.details.patch;

		this.pedal.send(ZoomGSeriesMessages.REQUEST_SPECIFIC_PATCH_DETAILS(idPatch));
	}

	toogleEffectOf(effect) {
		this.pedal.toogleEffect(effect);
	}
}
