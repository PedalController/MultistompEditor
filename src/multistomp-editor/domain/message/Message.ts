class Message {
    // Cause
    cause : string;
    details : MessageDetails;

    /**
     * Cause : static string constant
     */
    constructor(cause : string, details? : MessageDetails) {
        if (details === undefined)
            this.any(cause);
        else
            this.anyDetails(cause, details);
    }

    private any(cause : string) {
        this.anyDetails(cause, new MessageDetails());
    }

    private anyDetails(cause : string, details : MessageDetails) {
        this.cause = cause;
        this.details = details;
    }

    is(cause : string) : boolean {
        return this.cause == cause;
    }

    toString() : String {
        let retorno = `${this.cause}: (${this.details})`;

        return retorno;
    }
}
