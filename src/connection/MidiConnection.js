"use scrict";


export class MidiConnection implements MidiReaderListenner {

    /** Multistomp */
	multistomp;

    /** MidiSender */
	sender;
    /** MidiReader */
	reader;

    /** MessageEncoder */
	encoder;
    /** MessageDecoder */
	decoder;

    /** Optional<OnUpdateListenner> */
	listenner = Optional.empty();

    /**
	 * @param multistomp Multistomp
     * @param pedalType PedalType
	 */
	constructor(multistomp, pedalType) {
		this.multistomp = multistomp;

		this.sender = new MidiSender(pedalType);
		this.reader = new MidiReader(pedalType);
		this.reader.setListenner(this);

		this.encoder = MessageEncoderFactory.For(pedalType);
		this.decoder = MessageDecoderFactory.For(pedalType);
	}

	/*************************************************/

	start() {
		this.sender.start();
		this.reader.start();
	}

	stop() {
		this.sender.stop();
		this.reader.stop();
	}

	/*************************************************/

    /**
	 * @param messages Messages
	 */
	send(messages) {
		for (midiMessage of this.generateMidiMessages(messages))
			this.send(midiMessage);
	}

    /**
	 * @param messages Messages
     *
     * @return List<MidiMessage>
	 */
	generateMidiMessages(messages) {
		return encoder.encode(messages);
	}

    /**
     * @param message MidiMessage
     */
	send(message) {
		console.log("MIDI sended: ");
		console.log(" " + BinarioUtil.byteArrayToHex(message.getMessage()));

		this.sender.send(message);
	}

	/*************************************************/

    /**
     * @param listenner OnUpdateListenner
     */
	setListenner(listenner) {
		this.listenner = Optional.of(listenner);
	}

    /**
     * @param message MidiMessage
     */
	// @Override
	onDataReceived(message) {
		console.log("MIDI received: ");
    	console.log(" " + BinarioUtil.byteArrayToHex(message.getMessage()));

		if (!this.decoder.isForThis(message)) {
			console.log(" unknown ");
			return;
		}

		messagesDecoded = this.decoder.decode(message, this.multistomp);

    	if (this.listenner.isPresent())
			this.listenner.get().update(messagesDecoded);
	}
}
/*
MidiConnection.OnUpdateListenner {
    /**
     * @param messages Messages
     * /
    update(messages);
}
*/
