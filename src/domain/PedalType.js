"use strict";

export class PedalType {

    static values = new Array();

    // String
    name;
    // PedalCompany
    company;
    // String
	USBName;

    /**
     * @param String       name
     * @param PedalCompany company
     * @param String       USBName
     */
    constructor(name, company, USBName) {
    	this.name = name;
    	this.company = company;
    	this.USBName = USBName;

        PedalType.values.push(this)
    }

    /**
     * @return int
     */
    getId() {
    	return this.id;
    }

    /**
     * @return PedalCompany
     */
	getCompany() {
		return this.company;
	}

    /**
     * @return String
     */
    //@Override
	toString() {
		return this.name + " - " + this.company.toString();
	}

	/**
	 * @return String
	 *
	 * The name will be used to find out which is the USB which is connected to the PC
	 * that is corresponding Pedal
	 */
	getUSBName() {
		return this.USBName;
	}
}

PedalType.Null = new PedalType("Unknown Pedal", PedalCompany.NULL, "Pedal Unknown is unimplemented"),
PedalType.G2Nu = new PedalType("Zoom G2Nu",     PedalCompany.ZoomCorp, "G2Nu/G2.1Nu"),
PedalType.G3   = new PedalType("Zoom G3v2.0",   PedalCompany.ZoomCorp, "ZOOM G Series");
