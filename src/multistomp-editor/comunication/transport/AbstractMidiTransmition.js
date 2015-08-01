"use strict";

export class AbstractMidiTransmition {

    // MidiDevice
    device;

	constructor(device) {
        this.device = device;
	}

	start() {
		this.device.open();
	}

	stop() {
    	this.device.close();
    }
}
