"use strict";

class AbstractMidiTransmition {

    // MidiDevice
    device : MidiDevice;

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
