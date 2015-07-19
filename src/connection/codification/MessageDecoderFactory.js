"use strict";

export class MessageDecoderFactory {
    /**
     * @param PedalType pedalType
     * @return MessageEncoder
     */
	static For(pedalType) {
		//if (PedalType.G3 == pedalType)
		//	return new ZoomGSeriesMessageDecoder();

		//throw new Error("MessageDecoder not found for: " + pedalType);
		return null;
	}
}
