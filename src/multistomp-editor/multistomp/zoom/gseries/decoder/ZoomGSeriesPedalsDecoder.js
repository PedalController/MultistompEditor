"use strict";

// TODO - Agregar este dentro de PatchDecoder - Pode fazer um esquema de composição interna
export class ZoomGSeriesPedalsDecoder implements MessageDecoder {

    static PEDALS_INDEX = [8, 24, 38, 52, 65, 79];

    /**
     * @param MidiMessage message
     * @return {Boolean}
     */
	//@Override
	isForThis(message) {
		let tester = new MidiMessageTester(message);

        let patchInfo = tester.init().sizeIs(120).test();
        let changePedal = false;//tester.init().sizeIs(120).test();

		return patchInfo || changePedal;
	}

    /**
	 * @param MidiMessage message
	 * @param Multistomp  multistomp
	 * @return Messages
	 */
	//@Override
	decode(message, multistomp) {
		let details = new Messages.Details();

		for (let index of ZoomGSeriesPedalsDecoder.PEDALS_INDEX) {
            let actived = this.hasActived(message, index);

			console.log(message[index] - 1, actived, actived ? message[index] - 1 : message[index]);
        }

		return new Messages();
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
