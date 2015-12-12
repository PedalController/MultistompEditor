class Optional {
    private content : any;

    constructor(content) {
        this.content = content;
    }

    static of(content) : Optional {
        return new Optional(content);
    }

    static empty() : Optional {
        return new Optional(null);
    }

    isPresent() : boolean {
        return this.content !== null;
    }

    get() : any {
        if (!this.isPresent())
            throw new Error("NullPointerException");

        return this.content;
    }
}
