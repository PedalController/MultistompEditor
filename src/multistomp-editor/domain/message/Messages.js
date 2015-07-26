"use strict";

export class Messages implements Iterable<Messages.Message> {

    // List<Message>
	messages = new Array();

    /**
     * @return Messages
     */
	static Empty() {
		return new Messages();
	}

    /**
     * @param Message ... messages
     *
     * @return Messages
     */
	static For(... messages) {
		let returned = new Messages();

		for (let message of messages)
			returned.addMessage(message);

		return returned;
	}

	constructor() {}

    /**
     * @param Cause cause
     */
	addCause(cause) {
		this.addCause(cause, new Details());
	}

    /**
     * @param Cause   cause
     * @param Details details
     */
	addCauseDetails(cause, details) {
		this.addMessage(new Message(cause, details));
	}

    /**
     * @param Message message
     */
	addMessage(message) {
		this.messages.push(message);
	}

    /**
     * @param Messages messages
     */
	concatWith(messages) {
		messages.forEach(message => this.addMessage(message));
	}

	/**
	 * @return Iterator<Message>
	 */
	//@Override
	//iterator() {
	[Symbol.iterator]() {
		return this.messages[Symbol.iterator]();
	}

	forEach(funcao) {
		this.messages.forEach(funcao);
	}

    /**
     * @param Cause cause
     * @return Messages
     */
	get(cause) {
		let returned = new Messages();

		for (let message of this)
			if (message.is(cause))
				returned.addMessage(message);

		return returned;
	}

    /**
     * @return String
     */
	//@Override
	toString() {
		let returned = "";

		for (let message of this.messages)
			returned += message.toString();

		return returned;
	}
}

Messages.Details = class Details {
    // int
    static NULL = -1;

    patch  = Details.NULL;
    effect = Details.NULL;
    param  = Details.NULL;
    value  = Details.NULL;

    /**
     * @return String
     */
    //@Override
    toString() {
        let retorno = "";
        if (this.patch != Details.NULL)
            retorno += " patch=" + this.patch;
        if (this.effect != Details.NULL)
            retorno += " effect=" + this.effect;
        if (this.param != Details.NULL)
            retorno += " param=" + this.param;
        if (this.value != Details.NULL)
            retorno += " value=" + this.value;

        return retorno;
    }
}

Messages.Message = class Message {
    // Cause
    cause;
    // Details
    details;

    /**
     * @param Cause cause
     */
    constructor(cause, details) {
        if (details === undefined)
            this._MessageCause(cause);
        else
            this._MessageCauseDetails(cause, details);
    }

    _MessageCause(cause) {
        this._MessageCauseDetails(cause, new Details());
    }

    /**
     * @param Cause   cause
     * @param Details details
     */
    _MessageCauseDetails(cause, details) {
        this.cause = cause;
        this.details = details;
    }

    /**
     * @return Details
     */
    details() {
        return this.details;
    }

    /**
     * @param Cause cause
     * @return {Boolean}
     */
    is(cause) {
        return this.cause == cause;
    }

    /**
     * @return String
     */
    //@Override
    toString() {
        let retorno = `${this.cause}: (${this.details})`;

        return retorno;
    }
}
