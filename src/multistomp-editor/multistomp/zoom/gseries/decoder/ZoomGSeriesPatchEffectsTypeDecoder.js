export class ZoomGSeriesPatchEffectsTypeDecoder {

	//@Override
	isForThis(message) {
        return true;
	}

	/**
	 * @param MidiMessage message
	 * @return Messages
	 */
	//@Override
	decode(midiMessage) {
        console.log("Pedals type:");
        console.log("First :", midiMessage[11] >> 1);
        console.log("First :", ZoomG3V2Pedals[midiMessage[11] >> 1]);

		let messages = new Messages();

		return messages;
	}
}

/*
Effect 1 Param 1
Changes:
1: 57
2:
 */
