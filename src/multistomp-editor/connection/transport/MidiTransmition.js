"use strict";

export class MidiTransmition {

    // MidiDevice
    device;

    /**
     * @param PedalType pedalType
     */
	constructor(pedalType) {
		let devices = MidiTransmition.findDevices(pedalType);

		let device = this.locateDeviceIn(devices);

		if (!device.isPresent()) {
            console.log("Midi "+this.deviceType()+" device not found for: " + pedalType + " ("+pedalType.getUSBName()+")");
			throw new DeviceNotFoundError("Midi "+this.deviceType()+" device not found for: " + pedalType + " ("+pedalType.getUSBName()+")");
		}else
			this.device = device.get();
	}

    /**
     * @param List<Info> devices
     * @return Optional<MidiDevice>
     */
	locateDeviceIn(devices) {
		for (let device of devices)
			if (this.isThis(device))
				return Optional.of(device);

		return Optional.empty();
	}

    /**
     * @param MidiDevice device
     * @return {Boolean}
     */
	isThis(device) {}

    /**
     * @return String
     */
	deviceType() {}

	start() {
		this.device.open();
	}

	stop() {
    	this.device.close();
    }

	///////////////////////////////////////////////////

	/**
	 * @param PedalType type
	 * @return List<Info> all devices that corresponding the PedalType
	 */
	static findDevices(type) {
		let devices = new Array();

		let device;

		for (device of midiSystem.midiDevices)
			if (device.name.includes(type.USBName))
				devices.push(device);

		return devices;
	}
}

class MidiSystem {
    midiInputs;
    midiOutputs;

    onStart(midiAccess) {
        this.midiInputs  = midiAccess.inputs;
        this.midiOutputs = midiAccess.outputs;

        console.log("Connected");
    }

    onError(midiAccess) {
        console.log(midiAccess);
        console.log("Deu pau :/");
    }

    get midiDevices() {
        let devices = [];

        for (let input of this.midiInputs.values())
            devices.push(input);
        for (let output of this.midiOutputs.values())
            devices.push(output);

        return devices;
    }
}

let midiSystem = new MidiSystem();

window.addEventListener("load", function() {
    navigator.requestMIDIAccess({ sysex: true }).then(
        midiSystem.onStart.bind(midiSystem),
        midiSystem.onError.bind(midiSystem)
    );
});
