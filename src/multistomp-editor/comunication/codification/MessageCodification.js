"use strict"

export class MessageCodification {
    constructor(encoder, decoder) {
        this.encoder = encoder;
        this.decoder = decoder;
    }

    encode(message) {
        return this.encoder.encode(message);
    }

    decode(message) {
        return this.decoder.decode(message);
    }

    isForThis(message) {
        return this.decoder.isForThis(message);
    }
}
