class PedalboardComponent {
    constructor(pedalboardId, controller) {
        this.pedals = document.getElementById(pedalboardId).querySelectorAll("guitar-pedal");
        let i = 0;
        for (let pedal of this.pedals) {
            pedal.click = () => controller.toogleEffectOf(i);
            i++;
        }
    }
}
//# sourceMappingURL=PedalboardComponent.js.map