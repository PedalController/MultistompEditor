"use strict";

class MidiTransmition {

    // MidiDevice
    sender : MidiTransmitionSender;
    reader : MidiTransmitionReader;

    device : MidiDevice;

	constructor(inputDevice : MidiDevice, outputDevice : MidiDevice) {
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

    setOnDataListenerReceived(listener : MidiReaderListener) {
        this.reader.setListener(listener);
    }

    send(midiMessage : MidiMessage) {
        this.sender.send(midiMessage);
    }
}
