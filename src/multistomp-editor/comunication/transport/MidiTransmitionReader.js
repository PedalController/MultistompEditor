"use strict";
/**
 * Send the messages to real Multistomp
 */
class MidiTransmitionReader extends AbstractMidiTransmition {
    constructor(device) {
        super(device);
        this.device.onmidimessage = (message) => this.send(message);
    }
    setListener(listener) {
        this.listener = listener;
    }
    send(message) {
        this.listener.onDataReceived(message.data);
    }
}
//# sourceMappingURL=MidiTransmitionReader.js.map