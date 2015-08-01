"use strict";

/**
 * Send the messages to real Multistomp
 */
export class MidiTransmitionSender extends AbstractMidiTransmition {

	constructor(device) {
		super(device);
	}

    /**
     * @param MidiMessage message
     */
	send(message) {
		this.device.send(message);
	}
}
