"use strict";

class MessageCodificationFactory {

	static For(pedalType : PedalType) : MessageCodification {
		if (PedalType.G3 == pedalType)
			return new MessageCodification(
				new ZoomGSeriesMessageEncoder(),
				new ZoomGSeriesMessageDecoder()
			);

		throw new Error("MessageCodification not found for: " + pedalType);
	}
}
