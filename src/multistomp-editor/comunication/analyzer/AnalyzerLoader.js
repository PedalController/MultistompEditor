export class AnalyzerLoader {
    connection;
    analyzer;

    load() {
        let pedalLoader = new PedalLoader(this.selectFirstPedal.bind(this));

        pedalLoader.load().then(this.initializate.bind(this));
    }

    selectFirstPedal(pedals) {
        return new Promise((resolve, reject) => resolve(pedals[0]));
    }

    initializate(controller) {
        this.controller = controller;
        this.controller.on();
    }

    analyze(pedalChangesClass) {
        let pedalChanges = new pedalChangesClass(this.controller);

        let analyzer = new MidiMessagesAnalyzer(this.controller, pedalChanges);
        analyzer.start();

        return analyzer;
    }
}
