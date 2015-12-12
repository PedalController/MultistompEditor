"use strict";

class MidiMessagesAnalyzer {
    constructor(pedalController, changes) {
        this.pedal = pedalController;
        this.pedal.connection.analyzer = Optional.of(this);

        this.started = false;
        this.messages = undefined;
        this.changes = changes;

        this.changes.init();
    }

    start() {
        this.started = true;
        this.messages = [];

        this.changes.start();
    }

    stop() {
        this.started = false;
    }

    analyze(message) {
        if (!this.started)
            return;

        this.messages.push(message);
    }

    report() {
        return new MessagesReport(this, this.changes);
    }
}
