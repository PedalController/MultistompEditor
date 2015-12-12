class PedalGerador {
    private pedals : Element;

    constructor() {
        this.pedals = this.getContentOf("src/app/template/pedal/zoom-g3v2.html");
    }

    getContentOf(href) : Element {
        return document.querySelector('link[rel="import"][href^="'+href+'"]');
    }

    generateFor(name) : GuitarPedalElement {
        let knobsTemplate = this.knobsTemplateOf(name);

        let guitarPedal = <GuitarPedalElement> document.createElement("guitar-pedal");
        let knobs = document.importNode(knobsTemplate.content, true);
        guitarPedal.addKnobs(knobs);
        guitarPedal.name = name;

        return guitarPedal;
    }

    knobsTemplateOf(pedalName) {
        return this.pedals.import.querySelector('template[data-name="'+pedalName+'"]');
    }

    pedalsNames() {
        let pedalsNames = [];
        let pedals = this.pedals.import.querySelectorAll('template');

        for (let i=0; i<pedals.length; i++) {
            let pedal = pedals[i];
            pedalsNames.push(pedal.getAttribute("data-name"));
        }

        return pedalsNames;
    }
}
