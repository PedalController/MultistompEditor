export class ZoomGSeriesPatchEffectsDecoder {

	//@Override
	isForThis(message) {
        return true;
	}

	/**
	 * @param MidiMessage message
	 * @return Messages
	 */
	//@Override
	decode(message) {
		let messages = new Messages();

		let effectsStatus = new ZoomGSeriesPatchEffectsStatusDecoder();
		//let typeEffects   = new ZoomGSeriesPatchEffectsTypeDecoder();

		messages.concatWith(effectsStatus.decode(message))
		//		.concatWith(typeEffects.decode(message));

		return messages;
	}
}
