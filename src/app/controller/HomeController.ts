class HomeController implements Controller {
    presenter : HomePagina;
    patchDetails : PatchDetailsComponent;
    pedalboard : PedalboardComponent;

    constructor(presenter : HomePagina) {
        this.presenter = presenter;

        this.initializateComponents();
    }

    initializateComponents() {
        this.patchDetails = new PatchDetailsComponent("patchDetails");
        this.pedalboard = new PedalboardComponent("pedalboard", this);
    }

    setPatchTitle(title : string) {
        this.patchDetails.setName(title);
    }

    setPatchNumber(number : number) {
        this.patchDetails.setNumber(number);
    }

    active(effect : number) {
        this.pedalboard.pedals[effect].active();
    }

    disable(effect : number) {
        this.pedalboard.pedals[effect].disable();
    }

    toogleEffectOf(index) {
        this.presenter.toogleEffectOf(index);
    }

    setEffectParam(effect  : number, param, value) {
        console.log("TERMINAR")
        console.log(effect, param, value);

        let pedal = <GuitarPedalElement> document.querySelector("#pedalboard > guitar-pedal");
        pedal.knobs[param].value = value;
    }
}
