"use strict";

describe("PedalController", function() {
    var pedaleira;

    beforeEach(function() {
        let pedal = new MultistompSimulator(5);
        pedaleira = new PedalController(pedal)
    });

    it("on()", function() {
        expect(false).toBe(pedaleira.hasStarted());
        pedaleira.on();
        expect(true).toBe(pedaleira.hasStarted());
    });

    it("off()", function() {
        expect(false).toBe(pedaleira.hasStarted());
        pedaleira.on();
        expect(true).toBe(pedaleira.hasStarted());
        pedaleira.off();
        expect(false).toBe(pedaleira.hasStarted());
    });

    it("hasStarted()", function() {
        expect(false).toBe(pedaleira.hasStarted());
        pedaleira.on();
        expect(true).toBe(pedaleira.hasStarted());
    });

    it("multistomp()", function() {
        expect(true).toBe(pedaleira.multistomp() instanceof Multistomp);
    });

    it("nextPatch()", function() {
        pedaleira.nextPatch();

        expect(1).toBe(pedaleira.multistomp().idCurrentPatch);
    });

    it("beforePatch()", function() {
        pedaleira.beforePatch();

        expect(4).toBe(pedaleira.multistomp().idCurrentPatch);
    });

    it("toPatch()", function() {
        pedaleira.toPatch(3);

        expect(3).toBe(pedaleira.multistomp().idCurrentPatch);
    });

    it("toogleEffect()", function() {
        const PEDAL = 0;
        expect(false).toBe(pedaleira.hasActived(PEDAL));
        pedaleira.toogleEffect(PEDAL);
        expect(true).toBe(pedaleira.hasActived(PEDAL));
    });

    it("hasActived()", function() {
        const PEDAL = 0;
        expect(false).toBe(pedaleira.hasActived(PEDAL));
        pedaleira.toogleEffect(PEDAL);
        expect(true).toBe(pedaleira.hasActived(PEDAL));
    });

    it("activeEffect()", function() {
        const PEDAL = 2;

        expect(false).toBe(pedaleira.hasActived(PEDAL));
        pedaleira.activeEffect(PEDAL);
        expect(true).toBe(pedaleira.hasActived(PEDAL));
    });

    it("disableEffect()", function() {
        const PEDAL = 2;

        expect(false).toBe(pedaleira.hasActived(PEDAL));

        pedaleira.activeEffect(PEDAL);
        expect(true).toBe(pedaleira.hasActived(PEDAL));

        pedaleira.disableEffect(PEDAL);
        expect(false).toBe(pedaleira.hasActived(PEDAL));
    });

    it("setEffectParam()", function() {
        const EFFECT = 2;
        const PARAM  = 1;
        const VALUE  = 5;

        pedaleira.setEffectParam(EFFECT, PARAM, VALUE)
        expect(VALUE).toBe(pedaleira.multistomp().currentPatch().effects[EFFECT].params[PARAM].getValue());
    });

    it("getAmountEffects()", function() {
        expect(pedaleira.multistomp().currentPatch().effects.length).toBe(pedaleira.getAmountEffects());
    });
});
