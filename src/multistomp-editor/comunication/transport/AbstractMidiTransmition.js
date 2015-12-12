"use strict";
class AbstractMidiTransmition {
    constructor(device) {
        this.device = device;
    }
    start() {
        this.device.open();
    }
    stop() {
        this.device.close();
    }
}
//# sourceMappingURL=AbstractMidiTransmition.js.map