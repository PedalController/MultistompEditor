"use strict"

class MessageCodification {
    encoder : MessageEncoder;
    decoder : MessageDecoder;

    constructor(encoder : MessageEncoder, decoder : MessageDecoder) {
        this.encoder = encoder;
        this.decoder = decoder;
    }

    encode(messages : Messages) {
        return this.encoder.encode(messages);
    }

    decode(message : MidiMessage) {
        return this.decoder.decode(message);
    }

    isForThis(message : MidiMessage) {
        return this.decoder.isForThis(message);
    }
}
