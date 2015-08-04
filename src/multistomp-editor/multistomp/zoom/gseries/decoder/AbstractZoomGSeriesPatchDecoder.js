"use strict";

export class AbstractZoomGSeriesPatchDecoder implements MessageDecoder {

	/**
	 * @param MidiMessage message
	 * @return {Boolean}
	 */
	//@Override
	isForThis(message) {
		let tester = new MidiMessageTester(message);

		return tester.init().sizeIs(this.messageSize()).test();
	}

    /**
     * @return {[type]}
     */
	@abstract messageSize() {}

	/**
	 * @param MidiMessage message
	 * @param Multistomp multistomp
	 * @return Messages
	 */
	//@Override
	decode(message) {
		const PATCHES = this.patches();

		let messages = new Messages();
		for (let idPedal = 0; idPedal < PATCHES.length; idPedal++) {
			let patch = PATCHES[idPedal];

			let actived = this.hasActived(message, patch);
			messages.add(this.generateMessageFor(idPedal, actived));
		}

		return messages;
	}

    /**
     * @return int[]
     */
	@abstract patches() {}

    /**
     * @param boolean actived
     * @param int     effect
     * @return Messages.Message
     */
	generateMessageFor(effect, actived) {
		let cause = actived ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

		let details = new Messages.Details();
		details.effect = effect;

		return new Messages.Message(cause, details);
	}

    /**
     * @param MidiMessage message
     * @param int         position
     * @return {Boolean}
     */
	hasActived(message, position) {
		const LSB = 0x01; // Least Significant Bit

		let actived = message[position] & LSB;

		return actived == 1;
	}
}
