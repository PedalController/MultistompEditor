"use strict";

class HomePagina extends Pagina {
    constructor(router) {
        super(router);
        this.controller = new HomeController(this);
        this.pedal = null;
    }

    inicializar(parametros) {
        let selectPedalPromise = (pedals) => {
            return new Promise((resolve, reject) => resolve(pedals[0]));
        };
        let showPedalController = (pedalController) => {
            console.log(pedalController);

            this.pedal = pedalController;

            this.pedal.on();
            this.pedal.addListenner(this);
            this.pedal.send(ZoomGSeriesMessages.REQUEST_CURRENT_PATCH_NUMBER());
        };

        let pedalLoader = new PedalLoader(selectPedalPromise);

        pedalLoader.load().then(showPedalController);
    }

    finalizar() {
        this.pedal.off();
    }

    ////////////////////////////////////////

    onChange(messages) {
        messages.getBy(CommonCause.ACTIVE_EFFECT).forEach(message => this.updateEffect(message, CommonCause.ACTIVE_EFFECT));
		messages.getBy(CommonCause.DISABLE_EFFECT).forEach(message => this.updateEffect(message, CommonCause.DISABLE_EFFECT));

		messages.getBy(CommonCause.TO_PATCH).forEach(message => this.setPatch(message));

		messages.getBy(CommonCause.SET_PARAM).forEach(message => console.log(this.pedal));

        messages.getBy(CommonCause.PATCH_NAME).forEach(message => {this.controller.setPatchTitle(message.details.value)});
        messages.getBy(CommonCause.PATCH_NUMBER).forEach(message => {this.controller.setPatchNumber(message.details.value)});
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
        this.controller.setPatchNumber(idPatch);
	}

	toogleEffectOf(effect) {
		this.pedal.toogleEffect(effect);
	}
}
