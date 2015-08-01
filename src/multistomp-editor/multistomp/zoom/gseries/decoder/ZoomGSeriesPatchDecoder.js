export class ZoomGSeriesPatchDecoder {

	//@Override
	isForThis(message) {
		const MESSAGE_SIZE = 120;

		let tester = new MidiMessageTester(message);

		return tester.init().sizeIs(MESSAGE_SIZE).test();
	}

	/**
	 * @param MidiMessage message
	 * @return Messages
	 */
	//@Override
	decode(message) {
		let messages = new Messages();

		let patchName    = new ZoomGSeriesPatchNameDecoder();
		let patchNumber  = new ZoomGSeriesPatchNumberDecoder();
		let effects      = new ZoomGSeriesPatchEffectsDecoder();

		messages.concatWith(patchName.decode(message))
				.concatWith(patchNumber.decode(message))
				.concatWith(effects.decode(message));

		return messages;
	}
}
