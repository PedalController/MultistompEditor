"use strict";

class PedalsFinder {
    constructor(midiSystem) {
        this.midiSystem = midiSystem;
    }

    find(pedalsType) {
        let pedals = new Array();

        for (let multistomp of pedalsType)
            if (this.isConnected(multistomp))
                pedals.push(multistomp);

        return pedals;
    }

    isConnected(multistomp) {
        return this.findDevicesFor(multistomp).length != 0;
    }

    /**
     * @param PedalType type
     * @return List<Info> all devices that corresponding the PedalType
     */
    findDevicesFor(type) {
        let devices = new Array();

        let device;

        for (device of this.midiSystem.midiDevices)
            if (device.name.includes(type.USBName))
                devices.push(device);

        return devices;
    }
}
