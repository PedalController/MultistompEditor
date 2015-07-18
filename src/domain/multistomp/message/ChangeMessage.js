"use strict";

export class ChangeMessage<Causer> {

    // Causer
	causer;
    // Cause
	cause;
    // Details
	details;

    // ChangeMessage<?>
	nextMessage = null;

    /**
     * @param Multistomp multistomp
     *
     * @return ChangeMessage<Multistomp>
     */
	static None(multistomp) {
		return new ChangeMessage<Multistomp>(MultistompCause.NONE, multistomp, Details.NONE());
	}

    /**
     * @param Multistomp multistomp
     * @param Details    details
     *
     * @return ChangeMessage<Multistomp>
     */
	static For(multistomp, details) {
		return new ChangeMessage<Multistomp>(MultistompCause.MULTISTOMP, multistomp, details);
	}

    /**
     * @param Multistomp multistomp
     * @param Patch      patch
     * @param Details    details
     */
	static For(multistomp, patch, details) {
		let patchMsg  = new ChangeMessage<Patch>(MultistompCause.PATCH, patch, details);
		let multistompMsg = new ChangeMessage<Multistomp>(MultistompCause.SUPER, multistomp, patchMsg);

		return multistompMsg;
	}

    /**
     * @param Multistomp multistomp
     * @param Patch      patch
     * @param Effect     effect
     * @param Details    details
     */
	static For(multistomp, patch, effect, details) {
		let effectMsg = new ChangeMessage<Effect>(MultistompCause.EFFECT, effect, details);
		let patchMsg  = new ChangeMessage<Patch>(MultistompCause.SUPER, patch, effectMsg);
		let multistompMsg = new ChangeMessage<Multistomp>(MultistompCause.SUPER, multistomp, patchMsg);

		return multistompMsg;
	}

    /**
     * @param Multistomp multistomp
     * @param Patch      patch
     * @param Effect     efeito
     * @param Param      param
     * @param Details    details
     */
	static For(multistomp, patch, efeito, param, details) {
		let paramMsg  = new ChangeMessage<Param>(MultistompCause.PARAM, param, details);
		let effectMsg = new ChangeMessage<Effect>(MultistompCause.SUPER, efeito, paramMsg);
		let patchMsg  = new ChangeMessage<Patch>(MultistompCause.SUPER, patch, effectMsg);
		let multistompMsg = new ChangeMessage<Multistomp>(MultistompCause.SUPER, multistomp, patchMsg);

		return multistompMsg;
	}

    constructor(cause, causer, what) {
        if (what instanceof ChangeMessage)
            this._constructorMessage(cause, causer, what);
        else
            this._constructorDetails(cause, causer, what);
    }

    /**
     * @param Cause            cause
     * @param Causer           causer
     * @param ChangeMessage<?> nextMessage
     */
    _constructorMessage(cause, causer, nextMessage) {
		this._ChangeMessageDetails(cause, causer, Details.NONE());
		this.nextMessage = nextMessage;
	}

    /**
     * @param Cause   cause
     * @param Causer  causer
     * @param Details details
     */
	_constructorDetails(cause, causer, details) {
		this.cause = cause;
		this.causer = causer;
		this.details = details;
	}

	/** Who shot
     * @return Causer
     */
	causer() {
		return this.causer;
	}

	/** What has changed
     * @return Cause
     */
	cause() {
		return cause;
	}

	/** Details of what has changed
     * @return Details
     */
	details() {
		return details;
	}

    /**
     * @return ChangeMessage<?>
     */
	nextMessage() {
		return nextMessage;
	}

    /**
     * @param Cause cause
     * @return {Boolean}
     */
	is(cause) {
		return cause.equals(this.realMessage().cause());
	}

    /**
     * @return {ChangeMessage<?>}
     */
	realMessage() {
		let message = this;

		while (message.cause() == MultistompCause.SUPER)
			message = message.nextMessage();

		return message;
	}

	/**
	 * @return String
	 */
	//@Override
	toString() {
		let returned = "";

		returned += this.causer.getClass().getSimpleName();

		if (this.cause == MultistompCause.SUPER)
			returned += " -> " + this.nextMessage.toString();
		else
			returned += " (" + this.cause.toString() + ")";

		return returned;
	}
}
