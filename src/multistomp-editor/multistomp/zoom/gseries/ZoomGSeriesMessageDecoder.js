"use strict";

export class ZoomGSeriesMessageDecoder implements MessageDecoder {

    //List<MessageDecoder>
	decoders;

	constructor() {
		this.decoders = new Array();

		this.decoders.push(new ZoomGSeriesNameDecoder());
		this.decoders.push(new ZoomGSeriesPatchDecoder());
		//this.decoders.push(new ZoomGSeriesActiveEffectDecoder());
		//this.decoders.push(new ZoomGSeriesDisableEffectDecoder());
		this.decoders.push(new ZoomGSeriesSelectPatchDecoder());
		//this.decoders.push(new ZoomGSeriesSetValueParamDecoder());
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
	decode(message, multistomp) {
		let decoders = this.decodesFor(message);

		let messages = Messages.Empty();

		decoders.forEach((decoder) => messages.concatWith(decoder.decode(message, multistomp)));

		if (decoders.length == 0)
			throw new Error("The message isn't for this implementation");
		else
			return messages;
	}

    /**
     * @param MidiMessage message
     * @return Optional<MessageDecoder>
     */
	decodesFor(message) {
		let decoders = new Array();
		for (let decoder of this.decoders)
			if (decoder.isForThis(message))
				decoders.push(decoder);

		return decoders;
	}
}
