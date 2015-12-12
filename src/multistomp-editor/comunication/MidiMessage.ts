class MidiMessage {
    message;

    constructor(... bytes) {
        this.message = [];
        for (let byte of bytes)
            this.message.push(byte)
    }
}
