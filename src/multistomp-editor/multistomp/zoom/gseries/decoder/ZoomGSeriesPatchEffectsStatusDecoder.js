export class ZoomGSeriesPatchEffectsStatusDecoder {

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
        const PATCHES = [6+5, 19+5, 33+5, 47+5, 60+5, 74+5];

		let messages = new Messages();
		for (let idPedal = 0; idPedal < PATCHES.length; idPedal++) {
			let patch = PATCHES[idPedal];

			let actived = this.hasActived(message, patch);
			messages.add(this.generateMessageFor(idPedal, actived));
		}

		return messages;
	}

	hasActived(midiMessage, position) {
		const LSB = 0x01; // Least Significant Bit

		let actived = midiMessage[position] & LSB;

		return actived == 1;
	}

    /**
     * @param int     effect
     * @param boolean actived
     * @return Messages.Message
     */
    generateMessageFor(effect, actived) {
        let cause = actived ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

        let message = new Messages.Message(cause);
        message.details.effect = effect;

        return message;
    }
}
