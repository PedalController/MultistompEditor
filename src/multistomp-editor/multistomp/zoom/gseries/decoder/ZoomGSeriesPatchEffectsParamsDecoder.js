/**
 * Message 110
 *
 * 0000 0000
 *      ^^^              0 a 5 -> Menos significativo
 * ^^^^    + (0 a 9) * 5       -> Mais significativo
 *           -----------------
 *                     0 a 49
 *
 * Message 120
 *
 * 0000 0000 | ... | 0000 000_
 *                   ^^^^ ^^^  0 a 128 (2 em 2) => real 0 a 63
 *   ^
 */
export class ZoomGSeriesPatchEffectsParamsDecoder {

	//@Override
	isForThis(message) {
        return true;
	}

	/**
	 * @param MidiMessage message
	 * @return Messages
	 */
	//@Override
	decode(midiMessage) {
		// First Pedal - First Param
        let maisSignificativo = midiMessage[10];
        let menosSignificativo = midiMessage[12];

        console.log(maisSignificativo, menosSignificativo);

        let value = (maisSignificativo >> 5) * 64 + (menosSignificativo >> 1)

        console.log("VALUE OF FIRST PEDAL: " + value);

		return new Messages();
	}
}

/*
Effect 1 Param 1
Changes:
1: 57
2:
 */
