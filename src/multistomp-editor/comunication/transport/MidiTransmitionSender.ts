"use strict";

/**
 * Send the messages to real Multistomp
 */
class MidiTransmitionSender extends AbstractMidiTransmition {

	constructor(device : MidiDevice) {
		super(device);
	}

	send(message : MidiMessage) {
		this.device.send(message);
	}
}
