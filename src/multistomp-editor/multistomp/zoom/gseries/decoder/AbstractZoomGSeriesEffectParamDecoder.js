/**
 * f0 52 00 5a 31   05    02   02   00 f7
 * f0 52 00 5a 31 Pedal Param Value 00 f7
 */
export class AbstractZoomGSeriesEffectParamDecoder implements MessageDecoder {
    static EFFECT = 5;
    static PARAM = 6;
    static VALUE = 7;

	//@Override
	isForThis(message) {
		const begin = [0xf0, 0x52, 0x00, 0x5a];
		const end   = [0xf7];

		let tester = new MidiMessageTester(message);

		return tester.init()
					 .sizeIs(10)
				     .startingWith(begin)
				     .endingWith(end)
				     .test();
	}

	//@Override
	decode(message) {
        const EFFECT = AbstractZoomGSeriesEffectParamDecoder.EFFECT;
        const PARAM = AbstractZoomGSeriesEffectParamDecoder.PARAM;
        const VALUE = AbstractZoomGSeriesEffectParamDecoder.VALUE;

		let details = new Messages.Details();

		details.effect = message[EFFECT];
		details.param = message[PARAM] - 2;
		details.value = 128 * message[VALUE + 1] + message[VALUE];

		return this.decodeThe(details);
	}

    @abstract decodeThe(details) {}
}
