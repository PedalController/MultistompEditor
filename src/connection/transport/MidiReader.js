"use strict";

/**
 * Send the messages to real Multistomp
 */
export class MidiReader extends MidiTransmition {

	//MidiReaderListenner
	listenner;

    /**
     * @param PedalType pedalType
     */
	constructor(pedalType) {
		super(pedalType);

		this.device.onmidimessage = (message) => this.send(message);
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
		return "input";
	}

	/*************************************************/
	/**
	 * @param MidiReaderListenner listenner
	 */
	setListenner(listenner) {
		this.listenner = listenner;
	}

    /**
     * @param MidiMessage message
     */
	send(message) {
		this.listenner.onDataReceived(message.data);
	}
}
