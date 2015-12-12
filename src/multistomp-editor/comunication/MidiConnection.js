class MidiConnection {
    constructor(pedalType, pedalDevices) {
        /** Optional<OnUpdateListenner> */
        this.listener = Optional.empty();
        /** Optional<MidiMessagesAnalyzer> */
        this.analyzer = Optional.empty();
        this.listener = Optional.empty();
        if (!pedalDevices.input.isPresent() ||
            !pedalDevices.output.isPresent())
            throw new DeviceNotFoundError("Midi device(s) not found for: " + pedalType + " (" + pedalType.getUSBName() + ")");
        this.transmition = new MidiTransmition(pedalDevices.input.get(), pedalDevices.output.get());
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
    send(messages) {
        for (let midiMessage of this.generateMidiMessages(messages))
            this.sendMidiMessage(midiMessage);
    }
    generateMidiMessages(messages) {
        return this.codification.encode(messages);
    }
    sendMidiMessage(message) {
        console.log("PASSAR PARA ANALIZER");
        console.log("MIDI sended: ");
        console.log(" " + BinarioUtil.byteArrayToHex(message.message));
        this.transmition.send(message.message);
    }
    /*************************************************/
    /**
     * @param listenner OnUpdateListener
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
//# sourceMappingURL=MidiConnection.js.map