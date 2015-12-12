define(["require", "exports"], function (require, exports) {
    "use strict";
    class MidiTransmition {
        constructor(inputDevice, outputDevice) {
            this.sender = new MidiTransmitionSender(outputDevice);
            this.reader = new MidiTransmitionReader(inputDevice);
        }
        start() {
            this.sender.start();
            this.reader.start();
        }
        stop() {
            this.sender.stop();
            this.reader.stop();
        }
        setOnDataListenerReceived(listener) {
            this.reader.setListener(listener);
        }
        send(midiMessage) {
            this.sender.send(midiMessage);
        }
    }
    exports.MidiTransmition = MidiTransmition;
});
//# sourceMappingURL=MidiTransmition.js.map