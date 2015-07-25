"use strict";

export class ZoomGSeriesPatchDecoder extends AbstractZoomGSeriesPatchDecoder {

	static PATCH = 7;

	/**
	 * @param MidiMessage message
	 * @param Multistomp  multistomp
	 * @return Messages
	 */
	//@Override
	decode(message, multistomp) {
		let returned = super.decode(message, multistomp);

		const patch = message.getMessage()[ZoomGSeriesPatchDecoder.PATCH];
		returned.forEach((messagem) => messagem.details().patch = patch);

		return returned;
	}

	/**
	 * @return int
	 */
	//@Override
	size() {
		return 120;
	}

	/**
	 * @return int[]
	 */
	//@Override
	patches() {
		return [6+5, 19+5, 33+5, 47+5, 60+5, 74+5];
	}

	/**
	 * @return Boolean
	 */
	//@Override
	refressAll() {
		return true;
	}
}
