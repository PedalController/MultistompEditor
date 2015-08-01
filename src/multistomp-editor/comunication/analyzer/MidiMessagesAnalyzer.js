"use strict";

class MidiMessagesAnalyzer {
    constructor(pedalController, changes) {
        this.pedal = pedalController;
        this.pedal.connection.analyzer = Optional.of(this);

        this.started = false;
        this.messages = undefined;
        this.changes = changes;
    }

    start() {
        this.started = true;
        this.messages = [];

        while (this.changes.hasNext())
            this.changes.next();
    }

    stop() {
        this.started = false;
    }

    analyze(message) {
        if (!this.started)
            return;

        this.messages.push(message);
    }
}
