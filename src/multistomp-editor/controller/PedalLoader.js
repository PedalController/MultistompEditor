"use strict";

/**
 * Load the real pedal patchs and generate the Pedal object
 */
export class PedalLoader {
    constructor(selectPedalPromise) {
        this.selectPedalPromise = selectPedalPromise;

        this.midiSystem = new MidiSystem();
    }

    load() {
        return this.midiSystem.start()
                .then(this.findPedals.bind(this))
                .then(this.selectPedal.bind(this))
                .then(this.findPedalDevices.bind(this))
                .then(this.generateConnection.bind(this))
                .then(this.generateMultistomp.bind(this));
    }

    findPedals() {
        let finder = new PedalsFinder(this.midiSystem);
        let pedalsFound = finder.find(PedalType.values);

        return new Promise((resolve) => resolve(pedalsFound));
    }

    selectPedal(pedalsFound) {
        return this.selectPedalPromise(pedalsFound);
    }

    findPedalDevices(pedalType) {
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
        let multistomp = generator.generateFor(pedalType);

        return new Promise((resolve) => resolve(multistomp));
    }
}
