"use strict";

export class MessageCodificationFactory {
    /**
     * @param PedalType pedalType
     * @return MessageEncoder
     */
	static For(pedalType) {
		if (PedalType.G3 == pedalType)
			return new MessageCodification(
				new ZoomGSeriesMessageEncoder(),
				new ZoomGSeriesMessageDecoder()
			);

		throw new Error("MessageCodification not found for: " + pedalType);
	}
}
