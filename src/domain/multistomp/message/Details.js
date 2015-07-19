"use strict";

export class Details implements Cause {
    /** TypeChange */
	type;
    /** int */
	newValue;

    /**
     * @return Details
     */
	static NONE() {
		return new Details(Details.TypeChange.NONE, 0);
	}

    /**
     * @param TypeChange type
     * @param int        newValue
     */
	constructor(type, newValue) {
		this.type = type;
		this.newValue = newValue;
	}

    /**
     * @return int
     */
	newValue() {
		return this.newValue;
	}

    /**
     * @return TypeChange
     */
	type() {
		return this.type;
	}

    /**
     * @return String
     */
	//@Override
	toString() {
		return `({this.type} {this.newValue})`;
	}
}

Details.TypeChange  = {
    NONE:"NONE",
    PEDAL_STATUS: "PEDAL_STATUS",
    PARAM:"PARAM",
    PATCH_NUMBER:"PATCH_NUMBER"
}
