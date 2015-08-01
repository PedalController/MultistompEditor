export class Messages extends MessagesCollection {

    /**
     * @param Cause cause
     * @return Messages
     */
	getBy(cause) {
		let returned = new Messages();

		for (let message of this)
			if (message.is(cause))
				returned.add(message);

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
        this._MessageCauseDetails(cause, new Messages.Details());
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
