"use strict";

export class MidiTransmition {

    // MidiDevice
    sender;

    receiver;
    device;

    /**
     * @param PedalType pedalType
     */
	constructor(midiDevices) {
        if (!midiDevices.input.isPresent() ||
            !midiDevices.output.isPresent())
            throw new DeviceNotFoundError("Midi device(s) not found for: " + pedalType + " ("+pedalType.getUSBName()+")");

        this.sender = new MidiTransmitionSender(midiDevices.output.get());
        this.reader = new MidiTransmitionReader(midiDevices.input.get());
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
