class Optional {
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
        return this.content !== null;
    }
    get() {
        if (!this.isPresent())
            throw new Error("NullPointerException");
        return this.content;
    }
}
//# sourceMappingURL=Optional.js.map