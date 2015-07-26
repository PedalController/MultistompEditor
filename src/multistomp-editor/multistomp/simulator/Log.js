"use strict";

export class Log implements OnMultistompListenner {

    // String
	type;

    /**
     * @param String type
     */
	constructor(type) {
		this.type = type;
	}

	/**
	 * @param Messages messages
	 */
	//@Override
	onChange(messages) {
		for (let message of messages) {
			console.info("LOG:: " + this.type);
			console.log("LOG:: " + message.toString());
		}
	}
}
