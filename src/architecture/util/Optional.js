"use strict";

export class Optional {
    constructor(content) {
        this.content = content;
    }

    static of(content) {
        return new Optional(content);
    }

    static empty() {
        return new Optional(null);
    }

    isPresent() {
        return this.content == null;
    }
}
