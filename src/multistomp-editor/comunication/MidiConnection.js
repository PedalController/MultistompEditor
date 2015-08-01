export class MidiConnection implements MidiReaderListenner {

	transmition;
	codification;

    /** Optional<OnUpdateListenner> */
	listenner = Optional.empty();

	/** Optional<MidiMessagesAnalyzer> */
	analyzer = Optional.empty();

	constructor(pedalType, pedalDevices) {
		this.transmition = new MidiTransmition(pedalDevices);
		this.transmition.setOnDataListenerReceived(this);

		this.codification = MessageCodificationFactory.For(pedalType);
	}

	/*************************************************/

	start() {
		this.transmition.start();
	}

	stop() {
		this.transmition.stop();
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
		return this.codification.encode(messages);
	}

    /**
     * @param MidiMessage message
     */
	sendMidiMessage(message) {
		console.log("PASSAR PARA ANALIZER");
		console.log("MIDI sended: ");
		console.log(" " + BinarioUtil.byteArrayToHex(message.message));

		this.transmition.send(message.message);
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
	//@override
	onDataReceived(message) {
		console.log("PASSAR PARA ANALIZER");
		console.log("MIDI received: ");
    	console.log(" " + BinarioUtil.byteArrayToHex(message));

		if (this.analyzer.isPresent())
			this.analyzer.get().analyze(message);

		if (!this.codification.isForThis(message)) {
			console.log(" unknown ");
			return;
		}

		let messagesDecoded = this.codification.decode(message);

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
