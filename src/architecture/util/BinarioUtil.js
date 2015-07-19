"use strict";

export class BinarioUtil {
    /**
     * @param byte[] a
     * @return String
     */
	static byteArrayToHex(bytes) {
		let returned = " ";
		for (let byte of bytes)
			returned += byte.toString(16).toUpperCase() + " ";

		return `[${returned}]`;
	}
}
