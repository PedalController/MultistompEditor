"use strict";

/**
 * Send the messages to real Multistomp
 */
class MidiTransmitionReader extends AbstractMidiTransmition {

	listener : MidiReaderListener;

	constructor(device : MidiDevice) {
		super(device);

		this.device.onmidimessage = (message) => this.send(message);
	}

	setListener(listener : MidiReaderListener) {
		this.listener = listener;
	}

	send(message : MidiMessage) {
		this.listener.onDataReceived(message.data);
	}
}
