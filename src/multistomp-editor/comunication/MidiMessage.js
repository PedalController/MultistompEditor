class MidiMessage {
    constructor(...bytes) {
        this.message = [];
        for (let byte of bytes)
            this.message.push(byte);
    }
}
//# sourceMappingURL=MidiMessage.js.map