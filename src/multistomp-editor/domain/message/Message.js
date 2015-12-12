class Message {
    /**
     * Cause : static string constant
     */
    constructor(cause, details) {
        if (details === undefined)
            this.any(cause);
        else
            this.anyDetails(cause, details);
    }
    any(cause) {
        this.anyDetails(cause, new MessageDetails());
    }
    anyDetails(cause, details) {
        this.cause = cause;
        this.details = details;
    }
    is(cause) {
        return this.cause == cause;
    }
    toString() {
        let retorno = `${this.cause}: (${this.details})`;
        return retorno;
    }
}
//# sourceMappingURL=Message.js.map