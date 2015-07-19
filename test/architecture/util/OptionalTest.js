"use strict";

describe("Optional", function() {

    it("empty()", function() {
        let empty = Optional.empty();

        expect(false).toBe(empty.isPresent());
    });

    it("of()", function() {
        let notEmpty = Optional.of("Teste");

        expect(true).toBe(notEmpty.isPresent());
    });

    it("get() Contains", function() {
        const NAME = "Tobby";
        let optional = Optional.of(NAME);

        expect(NAME).toBe(optional.get());
    });

    it("get() Not contains", function() {
        let optional = Optional.empty();
        let getTest = function() {optional.get();};

        expect(getTest).toThrowError(Error);
    });
});
