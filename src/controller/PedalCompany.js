"use strict";

export class PedalCompany {

    // String
	name;

    /**
     * @param String name
     */
	constructor(name) {
		this.name = name;
	}


	getName() {
		return this.name;
	}

    /**
     * @return String
     */
    //@Override
	toString() {
		return this.name;
	}
}

PedalCompany.NULL     = new PedalCompany("Unknown Company"),
PedalCompany.ZoomCorp = new PedalCompany("Zoom Corporation"),
PedalCompany.Line6    = new PedalCompany("Line 6"),
PedalCompany.Roland   = new PedalCompany("Roland Corporation");
