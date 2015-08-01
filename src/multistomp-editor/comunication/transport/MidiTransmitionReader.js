"use strict";

/**
 * Send the messages to real Multistomp
 */
export class MidiTransmitionReader extends AbstractMidiTransmition {

	//MidiReaderListenner
	listenner;

	constructor(device) {
		super(device);

		this.device.onmidimessage = (message) => this.send(message);
	}

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
