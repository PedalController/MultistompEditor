class MidiConnection implements MidiReaderListener {

	transmition : MidiTransmition;
	codification;

    /** Optional<OnUpdateListenner> */
	listener = Optional.empty();

	/** Optional<MidiMessagesAnalyzer> */
	analyzer = Optional.empty();

	constructor(pedalType, pedalDevices) {
		this.listener = Optional.empty();

		if (!pedalDevices.input.isPresent() ||
            !pedalDevices.output.isPresent())
            throw new DeviceNotFoundError("Midi device(s) not found for: " + pedalType + " ("+pedalType.getUSBName()+")");

		this.transmition = new MidiTransmition(pedalDevices.input.get(), pedalDevices.output.get());
		this.transmition.setOnDataListenerReceived(this);

		this.codification = MessageCodificationFactory.For(pedalType);
	}

	/*************************************************/

	start() : void {
		this.transmition.start();
	}

	stop() : void {
		this.transmition.stop();
	}

	/*************************************************/

	send(messages : Messages) {
		for (let midiMessage of this.generateMidiMessages(messages))
			this.sendMidiMessage(midiMessage);
	}

	generateMidiMessages(messages : Messages) : Array<MidiMessage> {
		return this.codification.encode(messages);
	}

	sendMidiMessage(message : MidiMessage) {
		console.log("PASSAR PARA ANALIZER");
		console.log("MIDI sended: ");
		console.log(" " + BinarioUtil.byteArrayToHex(message.message));

		this.transmition.send(message.message);
	}

	/*************************************************/

    /**
     * @param listenner OnUpdateListener
     */
	setListenner(listener : OnUpdateListener) {
		this.listener = Optional.of(listener);
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

    	if (this.listener.isPresent())
			this.listener.get().update(messagesDecoded);
	}
}
