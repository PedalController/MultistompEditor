"use strict";

/**
 * Load the real pedal patchs and generate the Pedal object
 */
class PedalLoader {
    private selectPedalPromise : Promise;
    private midiSystem : MidiSystem;

    constructor(selectPedalPromise : Promise) {
        this.selectPedalPromise = selectPedalPromise;

        this.midiSystem = new MidiSystem();
    }

    load() {
        return this.midiSystem.start()
                .then(() => this.findPedals)
                .then((pedalsFound) => this.selectPedal(pedalsFound))
                .then((pedalType : PedalType) => this.findPedalDevices(pedalType))
                .then(() => this.generateConnection)
                .then(() => this.generateMultistomp)
                .then(() => this.loadMultistompEffects);
    }

    findPedals() {
        let finder = new PedalsFinder(this.midiSystem);
        let pedalsFound = finder.find(PedalType.values);

        return new Promise((resolve) => resolve(pedalsFound));
    }

    selectPedal(pedalsFound) : Promise<PedalType> {
        return this.selectPedalPromise(pedalsFound);
    }

    findPedalDevices(pedalType : PedalType) {
        let pedalDevices = this.midiSystem.devicesOf(pedalType);

        return new Promise((resolve) => {
            resolve({pedalType:pedalType, pedalDevices:pedalDevices});
        });
    }

    generateConnection(pedal) {
        let pedalType = pedal.pedalType;
        let pedalDevices = pedal.pedalDevices;

        let connection = new MidiConnection(pedalType, pedalDevices);

        return new Promise((resolve) => {
            resolve({connection:connection, pedalType:pedalType});
        });
    }

    generateMultistomp(params) {
        let connection = params.connection;
        let pedalType = params.pedalType;

        let generator = new PedalGenerator(connection);
        let pedal = generator.generateFor(pedalType);

        return new Promise((resolve) => resolve(pedal));
    }

    loadMultistompEffects(pedal) {
        let loader = new MultistompLoader(pedal);
        loader.load();

        return new Promise((resolve) => resolve(pedal));
    }
}
