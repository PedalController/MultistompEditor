class PedalboardComponent {
    pedals : NodeListOf<GuitarPedalElement>;

    constructor(pedalboardId : string, controller : HomeController) {
        this.pedals = <NodeListOf<GuitarPedalElement>> document.getElementById(pedalboardId).querySelectorAll("guitar-pedal");

        let i = 0;
        for (let pedal of this.pedals) {
            pedal.click = () => controller.toogleEffectOf(i);
            i++;
        }
    }
}