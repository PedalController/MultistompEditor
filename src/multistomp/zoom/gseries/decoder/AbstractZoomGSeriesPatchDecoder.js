"use strict";

export class AbstractZoomGSeriesPatchDecoder implements MessageDecoder {

	//@Override
	/**
	 * @param MidiMessage message
	 * @return {Boolean}
	 */
	isForThis(message) {
		let tester = new MidiMessageTester(message);

		return tester.init().sizeIs(this.size()).test();
	}

    /**
     * @return {[type]}
     */
	size() {}

	//@Override
	/**
	 * @param MidiMessage message
	 * @param Multistomp multistomp
	 * @return Messages
	 */
	decode(message, multistomp) {
		const PATCHES = this.patches();

		let effects = multistomp.currentPatch().effects();

		let messages = Messages.Empty();
		for (let i = 0; i < PATCHES.length; i++) {
			let patch = PATCHES[i];

			let actived = this.hasActived(message, patch);
			if (this.refressAll() || (actived && !effects.get(i).hasActived()))
				messages.add(this.generateMessageFor(actived, i));
		}

		return messages;
	}

    /**
     * @return {Boolean}
     */
	refressAll() {}

    /**
     * @return int[]
     */
	patches() {}

    /**
     * @param boolean actived
     * @param int     effect
     * @return Messages.Message
     */
	generateMessageFor(actived, effect) {
		let cause = actived ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

		let details = new Details();
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

		let actived = message.getMessage()[position] & LSB;

		return actived == 1;
	}
}
