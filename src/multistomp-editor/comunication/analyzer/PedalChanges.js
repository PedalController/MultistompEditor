"use strict";

// FIXME - Utilize *yeld generators...
export class PedalChanges {
    constructor(pedalController) {
        this.pedal = pedalController;
        this.messages = new Array();
    }

    @abstract init() {}

    @abstract start() {}
}
