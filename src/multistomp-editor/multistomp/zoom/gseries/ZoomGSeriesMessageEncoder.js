export class ZoomGSeriesMessageEncoder implements MessageEncoder {

	/**
	 * @param Messages messages
	 * @return MidiMessages
	 */
	//@Override
	encode(messages) {
		let generator = new MidiMessagesGenerator(messages, this);

		generator.forEachOfType(CommonCause.TO_PATCH)
				 .generate(this.toPatchMessages);

		generator.forEachOfType(CommonCause.ACTIVE_EFFECT)
				 .generate(this.statusEffectMessages);
		generator.forEachOfType(CommonCause.DISABLE_EFFECT)
				 .generate(this.statusEffectMessages);

		generator.forEachOfType(CommonCause.SET_PARAM)
				 .generate(this.setParamMessages);

		generator.forEachOfType(ZoomGSeriesCause.SET_EFFECT)
				 .generate(this.setEffectMessages);

		generator.forEachOfType(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER)
				 .generate(this.requestCurrentPatchNumberMessages);
		generator.forEachOfType(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS)
				 .generate(this.requestCurrentPatchDetailsMessages);
		generator.forEachOfType(ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS)
				 .generate(this.requestSpecificPatchDetailsMessages);

		generator.forEachOfType(ZoomGSeriesCause.LISSEN_ME)
				 .generate(this.lissenMeMessages);
		generator.forEachOfType(ZoomGSeriesCause.YOU_CAN_TALK)
				 .generate(this.youCanTalkMessages);

		return generator.generateMidiMessages();
	}

	toPatchMessages(message) {
		const SET_PATH = 0xc0;//ShortMessage.PROGRAM_CHANGE;
		let patch = message.details.patch;

		let toPatch = new MidiMessage(SET_PATH, patch);

		return new MidiMessages().add(toPatch);
	}

    /**
     * @param Message     message
     * @param CommonCause cause
     *
     * @return MidiMessages
     */
	statusEffectMessages(message, cause) {
		let effect = message.details.effect;

		let actived = cause == CommonCause.ACTIVE_EFFECT;
		let byteActived = actived ? 0x01 : 0x00;

		let manipuleEffect = this.manipuleEffectMessages(effect, ZoomGSeriesMessageEncoder.SET_STATUS, byteActived);

		return new MidiMessages()
				.concatWith(this.lissenMeMessages())
				.concatWith(manipuleEffect);
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	setParamMessages(message) {
		let effect = message.details.effect;
		let param  = message.details.param;
		let value  = message.details.value;

		return this.manipuleEffectMessages(effect, param + ZoomGSeriesMessageEncoder.PARAM_EFFECT, value);
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	setEffectMessages(message) {
		let effect = message.details.effect;
		let value  = message.details.value;

		return this.manipuleEffectMessages(effect, ZoomGSeriesMessageEncoder.CHANGE_EFFECT, value);
	}

	static SET_STATUS = 0;
	static CHANGE_EFFECT = 1;
	static PARAM_EFFECT = 2; // Base

    /**
     * @param int effect
     * @param int type
     * @param int value
     *
     * @return MidiMessage
     */
	manipuleEffectMessages(effect, type, value) {
		let value2 = (value/128)|0;
		value = value % 128;

		let manupuleEffect = new MidiMessage(
			0xF0,  0x52,   0x00,
			0x5A,  0x31, effect,
			type, value, value2,
			0xF7
		);

		return new MidiMessages().add(manupuleEffect);
	}


	///////////////////////////////////////
	// SPECIFIC ZOOM
	///////////////////////////////////////

	requestCurrentPatchNumberMessages(message) {
		let requestCurrentPatchNumber = new MidiMessage(
			0xF0, 0x52, 0x00,
			0x5A, 0x33, 0xF7
		);

		return new MidiMessages().add(requestCurrentPatchNumber);
	}

	requestCurrentPatchDetailsMessages(message) {
		let requestCurrentPatchDetails = new MidiMessage(
			0xF0, 0x52, 0x00,
			0x5A, 0x29, 0xF7
		);

		return new MidiMessages().add(requestCurrentPatchDetails);
	}

	requestSpecificPatchDetailsMessages(message) {
		let patch = message.details.patch;

		let requestSpecificPatchDetails = new MidiMessage(
			0xF0,  0x52, 0x00,
			0x5A,  0x09, 0x00,
			0x00, patch, 0xF7
		);

		return new MidiMessages().add(requestSpecificPatchDetails);
	}

	lissenMeMessages() {
		let lissenMe = new MidiMessage(
			0xF0, 0x52, 0x00,
			0x5A, 0x50, 0xF7
		);

		return new MidiMessages().add(lissenMe);
	}

	youCanTalkMessages() {
		let youCanTalk = new MidiMessage(
			0xF0, 0x52, 0x00,
			0x5A, 0x16, 0xF7
		);

		return new MidiMessages().add(youCanTalk);
	}
}
