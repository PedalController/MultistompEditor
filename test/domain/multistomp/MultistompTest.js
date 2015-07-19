"use strict";

describe("Multistomp", function() {
    var pedaleira;

    beforeEach(function() {
        //pedaleira = new MultistompSimulator(5);
        pedaleira = new MultistompSimulator(5);
        pedaleira.addListenner(new Log("Test"));
    });

    it("nextPatchTest()", function() {
        //let pedaleira = new MultistompSimulator(5);

        expect(0).toBe(pedaleira.getIdCurrentPatch());
        pedaleira.nextPatch();

        expect(1).toBe(pedaleira.getIdCurrentPatch());
    });

    it("nextPatchLimitTest()", function() {
        //let pedaleira = new MultistompSimulator(5);

        expect(0).toBe(pedaleira.getIdCurrentPatch());
        pedaleira.toPatch(4);
        expect(4).toBe(pedaleira.getIdCurrentPatch());

        pedaleira.nextPatch();
        expect(0).toBe(pedaleira.getIdCurrentPatch());
    });

    it("toPatchTest()", function() {
        //let pedaleira = new MultistompSimulator(5);

        expect(0).toBe(pedaleira.getIdCurrentPatch());

        pedaleira.toPatch(3);
        expect(3).toBe(pedaleira.getIdCurrentPatch());
    });


    it("toPatchLimitsTest()", function() {
        //let pedaleira = new MultistompSimulator(5);

        expect(0).toBe(pedaleira.getIdCurrentPatch());

        pedaleira.toPatch(-1);
        expect(4).toBe(pedaleira.getIdCurrentPatch());

        pedaleira.toPatch(-50);
        expect(4).toBe(pedaleira.getIdCurrentPatch());

        pedaleira.toPatch(5);
        expect(0).toBe(pedaleira.getIdCurrentPatch());

        pedaleira.toPatch(50);
        expect(0).toBe(pedaleira.getIdCurrentPatch());
    });

    it("beforePatchTest()", function() {
        //let pedaleira = new MultistompSimulator(5);

        expect(0).toBe(pedaleira.getIdCurrentPatch());

        pedaleira.nextPatch();
        expect(1).toBe(pedaleira.getIdCurrentPatch());

        pedaleira.beforePatch();
        expect(0).toBe(pedaleira.getIdCurrentPatch());

        pedaleira.beforePatch();
        expect(4).toBe(pedaleira.getIdCurrentPatch());
    });

    it("beforePatchLimitTest()", function() {
        //let pedaleira = new MultistompSimulator(5);

        expect(0).toBe(pedaleira.getIdCurrentPatch());

        pedaleira.beforePatch();
        expect(4).toBe(pedaleira.getIdCurrentPatch());
    });
});
