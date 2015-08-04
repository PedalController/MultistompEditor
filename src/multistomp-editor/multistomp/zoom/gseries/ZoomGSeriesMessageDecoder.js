"use strict";

export class ZoomGSeriesMessageDecoder implements MessageDecoder {

    //List<MessageDecoder>
	decoders;

	constructor() {
		this.decoders = new Array();

		this.decoders.push(new ZoomGSeriesPatchDecoder());

		this.decoders.push(new ZoomGSeriesSelectPatchDecoder());
		this.decoders.push(new ZoomGSeriesActiveEffectDecoder());
		this.decoders.push(new ZoomGSeriesDisableEffectDecoder());
		this.decoders.push(new ZoomGSeriesSetValueParamDecoder());
	}

	/**
	 * @param MidiMessage message
	 * @return {Boolean}
	 */
	//@Override
	isForThis(message) {
		return this.decodesFor(message).length > 0;
	}

	/**
	 * @param MidiMessage message
	 * @param Multistomp  multistomp
	 * @return Messages
	 */
	decode(midiMessage, multistomp) {
		let decoders = this.decodesFor(midiMessage);

		let messages = new Messages();

		decoders.forEach((decoder) => messages.concatWith(decoder.decode(midiMessage, multistomp)));

		return messages;
	}

	decodesFor(midiMessage) {
		let decoders = new Array();
		for (let decoder of this.decoders)
			if (decoder.isForThis(midiMessage))
				decoders.push(decoder);

		return decoders;
	}
}
