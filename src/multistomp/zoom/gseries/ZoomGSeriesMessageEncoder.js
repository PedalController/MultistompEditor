"use strict";

export class ZoomGSeriesMessageEncoder implements MessageEncoder {

	/**
	 * @param Messages messages
	 * @return List<MidiMessage>
	 */
	//@Override
	encode(messages) {
		let retorno = new Array();

		messages.get(CommonCause.TO_PATCH).forEach(message => retorno.push(this.toPatch(message)));

		messages.get(CommonCause.ACTIVE_EFFECT).forEach(message => {
            let messages = this.statusEffect(message, CommonCause.ACTIVE_EFFECT);
            messages.forEach(message => retorno.push(message));
        });
		messages.get(CommonCause.DISABLE_EFFECT).forEach(message => {
            let messages = this.statusEffect(message, CommonCause.DISABLE_EFFECT);
            messages.forEach(message => retorno.push(message));
        });

		messages.get(CommonCause.SET_PARAM).forEach(message => retorno.push(this.setParam(message)));

		messages.get(ZoomGSeriesCause.SET_EFFECT).forEach(message => retorno.push(this.setEffect(message)));

		messages.get(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER).forEach(message => retorno.push(this.requestCurrentPatchNumber(message)));
		messages.get(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS).forEach(message => retorno.push(this.requestCurrentPatchDetails(message)));
		messages.get(ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS).forEach(message => retorno.push(this.requestSpecificPatchDetails(message)));

		messages.get(ZoomGSeriesCause.LISSEN_ME).forEach(message => retorno.push(this.lissenMe()));
		messages.get(ZoomGSeriesCause.YOU_CAN_TALK).forEach(message => retorno.push(this.youCanTalk()));

		return retorno;
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	toPatch(message) {
		const SET_PATH = 0xc0;//ShortMessage.PROGRAM_CHANGE;

		let patch = message.details.patch;

		try {
			return [SET_PATH, patch];
		} catch (e) {
			throw new Error(e);
		}
	}

    /**
     * @param Message     message
     * @param CommonCause cause
     *
     * @return List<MidiMessage>
     */
	statusEffect(message, cause) {
		let effect = message.details.effect;

		let actived = cause == CommonCause.ACTIVE_EFFECT;
		let byteActived = actived ? 0x01 : 0x00;

		return this.group(this.lissenMe(), this.manupuleEffect(effect, ZoomGSeriesMessageEncoder.SET_STATUS, byteActived));
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	setParam(message) {
		let effect = message.details.effect;
		let param  = message.details.param;
		let value  = message.details.value;

		return this.manupuleEffect(effect, param + ZoomGSeriesMessageEncoder.PARAM_EFFECT, value);
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	setEffect(message) {
		let effect = message.details.effect;
		let value  = message.details.value;

		return this.manupuleEffect(effect, ZoomGSeriesMessageEncoder.CHANGE_EFFECT, value);
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
	manupuleEffect(effect, type, value) {
		let value2 = (value/128)|0;
		value = value % 128;

		return this.customMessageFor([
			0xF0,  0x52,   0x00,
			0x5A,  0x31, effect,
			type, value, value2,
			0xF7
		]);
	}


	///////////////////////////////////////
	// SPECIFIC ZOOM
	///////////////////////////////////////

    /**
     * @param Message message
     * @return MidiMessage
     */
	requestCurrentPatchNumber(message) {
		return this.customMessageFor([
			0xF0, 0x52, 0x00,
			0x5A, 0x33, 0xF7
		]);
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	requestCurrentPatchDetails(message) {
		return this.customMessageFor([
			0xF0, 0x52, 0x00,
			0x5A, 0x29, 0xF7
		]);
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	requestSpecificPatchDetails(message) {
		let patch = message.details().patch;

		let CURRENT_PATCH = [
			0xF0,  0x52, 0x00,
			0x5A,  0x09, 0x00,
			0x00, patch, 0xF7
		];

		return this.customMessageFor(CURRENT_PATCH);
	}

    /**
     * @return MidiMessage
     */
	lissenMe() {
		return this.customMessageFor([
			0xF0, 0x52, 0x00,
			0x5A, 0x50, 0xF7
		]);
	}

    /**
     * @return MidiMessage
     */
	youCanTalk() {
		return this.customMessageFor([
			0xF0, 0x52, 0x00,
			0x5A, 0x16, 0xF7
		]);
	}

    /**
     * @param MidiMessage ... messages
     * @return List<MidiMessage>
     */
	group(... messages) {
		let mensagens = new Array();

		for (let midiMessage of messages)
			mensagens.push(midiMessage);

		return mensagens;
	}

    /**
     * @param byte[] message
     *
     * @return SysexMessage
     */
	customMessageFor(message) {
		try {
			return message;//new SysexMessage
		} catch (e) {
			throw new Error(e);
		}
	}
}
