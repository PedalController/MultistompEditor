"use strict";
/**
 * Send the messages to real Multistomp
 */
class MidiTransmitionSender extends AbstractMidiTransmition {
    constructor(device) {
        super(device);
    }
    send(message) {
        this.device.send(message);
    }
}
//# sourceMappingURL=MidiTransmitionSender.js.map