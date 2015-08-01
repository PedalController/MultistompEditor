"use strict";

export class MultistompFactory {

    /**
     * @param PedalType pedalType
     * @return PedalController
     */
	static For(pedalType) {
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

		return pedal;
	}
}
