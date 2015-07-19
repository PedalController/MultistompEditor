"use strict";

describe("Param", function() {

    it("defaultValueTest()", function() {
        const DEFAULT_VALUE_1 = 0;
		const DEFAULT_VALUE_2 = 5;
		const DEFAULT_VALUE_3 = 10;

		let param1 = new Param("Volume", 0, 10, DEFAULT_VALUE_1, 1);
		let param2 = new Param("Volume", 0, 10, DEFAULT_VALUE_2, 1);
		let param3 = new Param("Volume", 0, 10, DEFAULT_VALUE_3, 1);

        expect(DEFAULT_VALUE_1).toBe(param1.getValue());
        expect(DEFAULT_VALUE_2).toBe(param2.getValue());
        expect(DEFAULT_VALUE_3).toBe(param3.getValue());
    });

    it("invalidDefaultValueMinusTest()", function() {
        const DEFAULT_VALUE_1 = -1;
        const MINUS_VALUE = 0;

        let param1 = new Param("Volume", MINUS_VALUE, 10, DEFAULT_VALUE_1, 1);

        expect(MINUS_VALUE).toBe(param1.getValue());
    });

    it("invalidDefaultValueTestPlus()", function() {
        const DEFAULT_VALUE_2 = 11;
		const MAX_VALUE = 10;

		let param2 = new Param("Volume", 0, MAX_VALUE, DEFAULT_VALUE_2, 1);

		expect(MAX_VALUE).toBe(param2.getValue());
    });

    it("addValueTest()", function() {
        const STEP_BY_STEP = 1;
		let param = new Param("Volume", 0, 5, 0, STEP_BY_STEP);

		param.addValue();
		expect(1).toBe(param.getValue());

		param.addValue();
		expect(2).toBe(param.getValue());

		param.addValue();
		expect(3).toBe(param.getValue());
    });

    it("addValueDontPassMaxTest()", function() {
        const STEP_BY_STEP = 1;
		const param = new Param("Volume", 0, 3, 0, STEP_BY_STEP);

		param.addValue();
		expect(1).toBe(param.getValue());

		param.addValue();
        expect(2).toBe(param.getValue());

		param.addValue();
        expect(3).toBe(param.getValue());

		param.addValue();
        expect(3).toBe(param.getValue());
    });

    it("addValueDontPassMaxStepTest()", function() {
        const STEP_BY_STEP = 2;
		const param = new Param("Volume", 0, 3, 0, STEP_BY_STEP);

		expect(0).toBe(param.getValue());

		param.addValue();
        expect(2).toBe(param.getValue());

		param.addValue();
        expect(2).toBe(param.getValue());
    });

    it("setValueTest(): Set value does not depend of STEP_BY_STEP", function() {
        const STEP_BY_STEP = 2;
        let param = new Param("Volume", 0, 10, 0, STEP_BY_STEP);

		param.setValue(5);
        expect(5).toBe(param.getValue());

		param.setValue(8);
        expect(8).toBe(param.getValue());

		param.setValue(2);
        expect(2).toBe(param.getValue());

		param.setValue(0);
        expect(0).toBe(param.getValue());

		param.setValue(10);
        expect(10).toBe(param.getValue());
    });

    it("setInvalidValueMinusTest()", function() {
        const STEP_BY_STEP = 2;
		const MINUS_VALUE = 0;
		let param = new Param("Volume", MINUS_VALUE, 10, 0, STEP_BY_STEP);

		param.setValue(-1);

        expect(MINUS_VALUE).toBe(param.getValue());
    });


    it("setInvalidValuePlusTest()", function() {
        const STEP_BY_STEP = 2;
        const PLUS_VALUE = 10;
        let param = new Param("Volume", 0, PLUS_VALUE, 0, STEP_BY_STEP);

        param.setValue(11);

        expect(PLUS_VALUE).toBe(param.getValue());
    });
});
