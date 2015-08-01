
"use strict";

class PedalGenerator {
    constructor(midiConnection) {
        this.midiConnection = midiConnection;
    }

    generateFor(pedalType) {
		let pedal = MultistompFactory.For(pedalType);

		return new PedalController(this.midiConnection, pedal);
    }
}
