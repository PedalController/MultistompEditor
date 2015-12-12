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
		let typeEffects   = new ZoomGSeriesPatchEffectsTypeDecoder();
		let paramEffects  = new ZoomGSeriesPatchEffectsParamsDecoder();

		messages.concatWith(effectsStatus.decode(message))
				.concatWith(typeEffects.decode(message))
				.concatWith(paramEffects.decode(message));

		return messages;
	}
}

/*
Effect 1 Param 1
Changes:
1: 57
2:
 */
