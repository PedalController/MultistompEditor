"use strict";

export class ZoomGSeriesNameDecoder implements MessageDecoder {

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

	/**
	 * @param MidiMessage message
	 * @param Multistomp  multistomp
	 * @return Messages
	 */
	//@Override
	decode(message, multistomp) {
		let details = new Messages.Details();

        let firstChar = ZoomGSeriesNameDecoder.FIRST_LETTER;
        let lastChar  = ZoomGSeriesNameDecoder.LAST_LETTER;

        let name = "";
        for (let i=firstChar; i<lastChar; i++) {
            let char = message[i];
            name += String.fromCharCode(char);
        }

        details.value = name;

		return Messages.For(new Messages.Message(CommonCause.PATCH_NAME, details));
	}
}
