export class ZoomGSeriesPatchNameDecoder implements MessageDecoder {

	static FIRST_LETTER = 102;
    static LAST_LETTER  = 102 + 11;

    /**
     * @param MidiMessage message
     * @return {Boolean}
     */
	//@Override
	isForThis(message) {
		let tester = new MidiMessageTester(message);

        let patchInfo = tester.init().sizeIs(120).test();
        let changeName = false;//tester.init().sizeIs(120).test();

		return patchInfo || changeName;
	}

	//@Override
	decode(midiMessage) {
		let message = new Messages.Message(CommonCause.PATCH_NAME);
        message.details.value = this.getNameBy(midiMessage);

		return new Messages().add(message);
	}

	getNameBy(midiMessage) {
		let firstChar = ZoomGSeriesPatchNameDecoder.FIRST_LETTER;
        let lastChar  = ZoomGSeriesPatchNameDecoder.LAST_LETTER;

        let name = "";
        for (let i=firstChar; i<lastChar; i++) {
            let char = midiMessage[i];
            name += String.fromCharCode(char);
        }

		return name;
	}
}
