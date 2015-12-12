class MidiSystem {
    start() {
        return navigator.requestMIDIAccess({ sysex: true }).then(this.onStartPromised.bind(this), this.onError.bind(this));
    }
    onStartPromised(midiAccess) {
        this.onStart(midiAccess);
        return new Promise((resolve) => resolve());
    }
    onStart(midiAccess) {
        this.midiInputs = midiAccess.inputs;
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
    devicesOf(pedalType) {
        return {
            "input": this.inputMidiDeviceOf(pedalType),
            "output": this.outputMidiDeviceOf(pedalType)
        };
    }
    inputMidiDeviceOf(pedalType) {
        return this.midiDeviceOfType(pedalType, this.midiInputs);
    }
    outputMidiDeviceOf(pedalType) {
        return this.midiDeviceOfType(pedalType, this.midiOutputs);
    }
    midiDeviceOfType(pedalType, listDevices) {
        for (let device of listDevices.values())
            if (device.name.includes(pedalType.USBName))
                return Optional.of(device);
        return Optional.empty();
    }
}
//# sourceMappingURL=MidiSystem.js.map