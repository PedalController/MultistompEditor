"use strict";

describe("Effect", function() {

    it("activeTest()", function() {
        let effect = new Effect(0, "Chorus");

        effect.active();
        expect(true).toBe(effect.hasActived());

        effect.active();
        expect(true).toBe(effect.hasActived());
    });

    it("disableTest()", function() {
        let effect = new Effect(0, "Chorus");

        expect(false).toBe(effect.hasActived());

        effect.active();
        expect(true).toBe(effect.hasActived());

        effect.disable();
        expect(false).toBe(effect.hasActived());
    });

    it("toggleTest()", function() {
        let effect = new Effect(0, "Chorus");

        expect(false).toBe(effect.hasActived());

        effect.toggle();
        expect(true).toBe(effect.hasActived());

        effect.toggle();
        expect(false).toBe(effect.hasActived());
    });
});
