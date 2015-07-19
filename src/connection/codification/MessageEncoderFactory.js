"use strict";

export class MessageEncoderFactory {
    /**
     * @param PedalType pedalType
     * @return MessageEncoder
     */
	static For(pedalType) {
		if (PedalType.G3 == pedalType)
			return new ZoomGSeriesMessageEncoder();

        throw new Error("MessageEncoder not found for: " + pedalType);
	}
}
