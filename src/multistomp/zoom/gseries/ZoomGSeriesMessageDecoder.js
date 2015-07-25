"use strict";

export class ZoomGSeriesMessageDecoder implements MessageDecoder {

    //List<MessageDecoder>
	decoders;

	constructor() {
		this.decoders = new Array();

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
		return this.decodeFor(message).isPresent();
	}

	/**
	 * @param MidiMessage message
	 * @param Multistomp  multistomp
	 * @return Messages
	 */
	decode(message, multistomp) {
		let decoder = this.decodeFor(message);

		if (decoder.isPresent())
			return decoder.get().decode(message, multistomp);

		throw new Error("The message isn't for this implementation");
	}

    /**
     * @param MidiMessage message
     * @return Optional<MessageDecoder>
     */
	decodeFor(message) {
		for (let decoder of this.decoders)
			if (decoder.isForThis(message))
				return Optional.of(decoder);

		return Optional.empty();
	}
}
