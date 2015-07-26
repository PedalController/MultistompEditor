"use strict";

export class PedalControllerFactory {

	/**
	 * Search the pedal connected on PC
	 * @return PedalController
	 */
	static searchPedal() {
		for (let multistomp of PedalType.values)
			if (this.isConnected(multistomp))
				return this.getPedal(multistomp);

		return new PedalController(new NullMultistomp());
	}

    /**
     * @param PedalType multistomp
     * @return {Boolean}
     */
	static isConnected(multistomp) {
		return MidiTransmition.findDevices(multistomp).length != 0;
	}

    /**
     * @param PedalType pedalType
     * @return PedalController
     */
	static getPedal(pedalType) {
		let pedal;
		let company = pedalType.getCompany();

		if (company == PedalCompany.ZoomCorp)
			pedal = new ZoomMultistompFactory().generate(pedalType);

		else if (company == PedalCompany.Roland)
			pedal = new NullMultistomp();

		else if (company == PedalCompany.Line6)
			pedal = new NullMultistomp();

		else
			pedal = new NullMultistomp();

		return new PedalController(pedal);
	}
}
