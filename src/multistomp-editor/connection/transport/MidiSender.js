"use strict";

/**
 * Send the messages to real Multistomp
 */
export class MidiSender extends MidiTransmition {

    /**
     * @param PedalType pedalType
     */
	constructor(pedalType) {
		super(pedalType);
	}

	/**
	 * @param MidiDevice device
	 * @return {Boolean}
	 */
	//@Override
	isThis(device) {
		return device.type == this.deviceType();
	}

	/**
	 * @return {String}
	 */
	//@Override
	deviceType() {
		return "output";
	}

    /**
     * @param MidiMessage message
     */
	send(message) {
		this.device.send(message);
	}
}
