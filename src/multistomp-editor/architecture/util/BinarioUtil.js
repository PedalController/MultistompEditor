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

	/**
	 * http://stackoverflow.com/a/3076308/1524997
	 * @param String bytes
	 * @return boolean[]
	 */
	static bytesForBits(bytes) {
		let retorno = new Array();

		let numOfBits = 8;
		let i=0;
		for (let byte of bytes) {
			for (let j=0; j<numOfBits; j++) {
				let value = parseInt(byte, 16);

		        retorno[i] = (value & 1 << j) != 0;
		        i++;
			}
		}

		return retorno;
	}

	/**
	 * @param boolean[] message
	 */
	static toString(message) {
		let builder = "";

		for (let indexWord = 0; indexWord < message.length/8; indexWord++) {
			let byteIndividual = "";

			for (let idLetter = indexWord*8; idLetter < (indexWord+1)*8; idLetter++) {
				let b = message[idLetter];
				byteIndividual += b ? '1' : '0';
			}

			builder += StringUtil.reverse(byteIndividual);
			builder += ' ';
		}

		// Remover o espaço sobrando do fim
		StringUtil.deleteCharAt(builder, builder.length-1);

		return builder;
	}
}

class StringUtil {
	static reverse(string) {
    	return string.split("").reverse().join("");
	}

	static deleteCharAt(string, index, chr) {
		return StringUtil.setCharAt(string, index, '');
	}

	static setCharAt(string, index, chr) {
        if (index > string.length - 1) return string;
        return string.substr(0, index) + chr + string.substr(index + 1);
    }
}
