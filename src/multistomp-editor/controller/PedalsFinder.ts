"use strict";

class PedalsFinder {
    private midiSystem : MidiSystem;

    constructor(midiSystem : MidiSystem) {
        this.midiSystem = midiSystem;
    }

    find(pedalsType : Array<PedalType>) {
        let pedals = new Array();

        let multistomp : PedalType;
        for (let multistomp of pedalsType)
            if (this.isConnected(multistomp))
                pedals.push(multistomp);

        return pedals;
    }

    isConnected(multistomp : PedalType) {
        return this.findDevicesFor(multistomp).length != 0;
    }

    /**
     * @return List<Info> all devices that corresponding the PedalType
     */
    findDevicesFor(type : PedalType) : Array<any> {
        let devices = new Array();

        let device;

        for (device of this.midiSystem.midiDevices)
            if (device.name.includes(type.USBName))
                devices.push(device);

        return devices;
    }
}
