class HomeController {
    constructor(presenter) {
        this.presenter = presenter;
        this.initializateComponents();
    }
    initializateComponents() {
        this.patchDetails = new PatchDetailsComponent("patchDetails");
        this.pedalboard = new PedalboardComponent("pedalboard", this);
    }
    setPatchTitle(title) {
        this.patchDetails.setName(title);
    }
    setPatchNumber(number) {
        this.patchDetails.setNumber(number);
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
    setEffectParam(effect, param, value) {
        console.log("TERMINAR");
        console.log(effect, param, value);
        let pedal = document.querySelector("#pedalboard > guitar-pedal");
        pedal.knobs[param].value = value;
    }
}
//# sourceMappingURL=HomeController.js.map