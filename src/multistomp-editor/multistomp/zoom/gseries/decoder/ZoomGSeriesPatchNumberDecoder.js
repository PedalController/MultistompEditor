export class ZoomGSeriesPatchNumberDecoder {

	//@Override
    isForThis(midiMessage) {
		let tester = new MidiMessageTester(midiMessage);

		return tester.init().sizeIs(120).test();
	}

	//@Override
    decode(midiMessage) {
		const patchNumber = this.getPatchNumber(midiMessage);

        return new Messages().add(this.generateMessageFor(patchNumber));
    }

	getPatchNumber(midiMessage) {
		const PATCH_INFO = 7;

		return midiMessage[PATCH_INFO];
	}

    generateMessageFor(patchNumber) {
        let message = new Messages.Message(CommonCause.PATCH_NUMBER);
		message.details.patch = patchNumber;

		return message;
	}
}
