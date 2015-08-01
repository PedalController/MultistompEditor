"use strict";

/**
 * c0 PATCH
 */
export class ZoomGSeriesSelectPatchDecoder implements MessageDecoder {

	static PATCH = 1;

    /**
     * @param MidiMessage message
     * @return {Boolean}
     */
	//@Override
	isForThis(message) {
		let begin = [0xc0];

		let tester = new MidiMessageTester(message);

		return tester.init()
					 .sizeIs(2)
				     .startingWith(begin)
				     .test();
	}

	//@Override
	decode(midiMessage) {
		let message = new Messages.Message(CommonCause.TO_PATCH);
		message.details.patch = midiMessage[ZoomGSeriesSelectPatchDecoder.PATCH];

		return new Messages().add(message);
	}
}
