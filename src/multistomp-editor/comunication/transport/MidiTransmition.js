"use strict";

export class MidiTransmition {

    // MidiDevice
    sender;

    receiver;
    device;

    /**
     * @param PedalType pedalType
     */
	constructor(inputDevice, outputDevice) {
        this.sender = new MidiTransmitionSender(outputDevice);
        this.reader = new MidiTransmitionReader(inputDevice);
	}

    start() {
        this.sender.start();
        this.reader.start();
    }

    stop() {
        this.sender.stop();
        this.reader.stop();
	}

    setOnDataListenerReceived(listener) {
        this.reader.setListenner(listener);
    }

    send(midiMessage) {
        this.sender.send(midiMessage);
    }
}
