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

	/**
	 * @param MidiMessage message
	 * @param Multistomp  multistomp
	 * @return Messages
	 */
	//@Override
	decode(message, multistomp) {
		let details = new Messages.Details();
		details.patch = message[ZoomGSeriesSelectPatchDecoder.PATCH];

		return Messages.For(new Messages.Message(CommonCause.TO_PATCH, details));
	}
}
