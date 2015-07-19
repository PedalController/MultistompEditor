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
	 * @param Multistomp multistomp
     * @param PedalType pedalType
	 */
	constructor(multistomp, pedalType) {
		this.multistomp = multistomp;

		this.sender = new MidiSender(pedalType);
		this.reader = {start:() => {}, stop:() => {}, setListenner:() => {}};//new MidiReader(pedalType);
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
		for (let midiMessage of this.generateMidiMessages(messages))
			this.sendMidiMessage(midiMessage);
	}

    /**
	 * @param messages Messages
     *
     * @return List<MidiMessage>
	 */
	generateMidiMessages(messages) {
		return this.encoder.encode(messages);
	}

    /**
     * @param MidiMessage message
     */
	sendMidiMessage(message) {
		console.log("MIDI sended: ");
		//console.log(message);
		console.log(" " + BinarioUtil.byteArrayToHex(message));

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
	//@Override
	onDataReceived(message) {
		console.log("MIDI received: ");
    	console.log(" " + BinarioUtil.byteArrayToHex(message));

		if (!this.decoder.isForThis(message)) {
			console.log(" unknown ");
			return;
		}

		messagesDecoded = this.decoder.decode(message, this.multistomp);

    	if (this.listenner.isPresent())
			this.listenner.get().update(messagesDecoded);
	}
}

MidiConnection.OnUpdateListenner = class OnUpdateListenner {
    /**
     * @param messages Messages
     */
    update(messages) {}
}
