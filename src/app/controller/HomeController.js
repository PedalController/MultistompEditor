"use strict";

class HomeController {
    constructor(presenter) {
        this.presenter = presenter;

        this.patchDetails = null;
        this.pedalboard = null;

        this.inicializarComponentes();
    }

    inicializarComponentes() {
        this.patchDetails = new PatchDetailsComponent("patchDetails");
        this.pedalboard = new PedalboardComponent("pedalboard", this);
    }

    setTitle(title) {
        this.patchDetails.setName(title);
    }

    active(effect) {
        this.pedalboard.pedals[effect].active();
    }

    disable(effect) {
        this.pedalboard.pedals[effect].disable();
    }

    toogleEffectOf(index) {
        this.presenter.toogleEffectOf(index);
    }
}

class PatchDetailsComponent {
    constructor(patchDetailsId) {
        let patchDetails = document.getElementById(patchDetailsId);

        this.nameElement = patchDetails.querySelector("#patchName");
        this.numberElement = patchDetails.querySelector("#patchNumber");
    }

    setName(name) {
        this.nameElement.innerHTML = name;
    }

    setNumber(number) {
        this.numberElement.innerHTML = number;
    }
}

class PedalboardComponent {
    constructor(pedalboardId, controller) {
        this.pedals = document.getElementById(pedalboardId).querySelectorAll("guitar-pedal");

        for (let i=0; i<this.pedals.length; i++) {
            let pedal = this.pedals[i];
            pedal.click = () => controller.toogleEffectOf(i);
        }
    }
}
