"use strict";

export class ZoomMultistompFactory implements MultistompFactory {

	/**
	 * @param PedalType type
	 * @return Multistomp
	 */
	//@Override
	generate(type) {
		if (type == PedalType.G2Nu)
			return new ZoomG2Nu();
		else if (type == PedalType.G3)
			return new ZoomGSeries(100, 6, 8);
		else
			return new ZoomGSeries(0, 5, 9);
	}
}
