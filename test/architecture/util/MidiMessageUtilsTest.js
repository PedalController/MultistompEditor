"use strict";

describe("MidiMessageUtils", function() {

    it("isSmallTest()", function() {
		let bytesMessage = [
            0xf0, 0x52, 0x00
        ];

		let tester = new MidiMessageTester(bytesMessage);

		let small = [
			0x00, 0x01
		];

		let sameSize = [
			0xff, 0x55, 0x55
		];

		let bigger = [
			0xff, 0x55, 0x55, 0x55,
			0x00, 0x01, 0x02, 0x03
		];

		expect(tester.init().isLessThen(small).test()).toBe(false);
		expect(tester.init().isLessThen(sameSize).test()).toBe(false);
		expect(tester.init().isLessThen(bigger).test()).toBe(true);
    });

	it("sizeIsTest()", function() {
		let bytesMessage = [
				0xf0, 0x52, 0x00
		];

		let tester = new MidiMessageTester(bytesMessage);

		expect(tester.init().sizeIs(2).test()).toBe(false);
		expect(tester.init().sizeIs(bytesMessage.length).test()).toBe(true);
		expect(tester.init().sizeIs(5).test()).toBe(false);
	});

	it("startingWithTest()", function() {
		let bytesMessage = [
			0xf0, 0x52, 0x00
		];

		let tester = new MidiMessageTester(bytesMessage);

		let same = bytesMessage;
		let big = bytesMessage.concat([0x37]);
		let small = [0xf0, 0x52];
		let diff = [0x00, 0x52, 0x37];
		let diff2 = [0xf0, 0x52, 0x37];

		expect(tester.init().startingWith(same).test()).toBe(true);
		expect(tester.init().startingWith(big).test()).toBe(false);
		expect(tester.init().startingWith(small).test()).toBe(true);
		expect(tester.init().startingWith(diff).test()).toBe(false);
		expect(tester.init().startingWith(diff2).test()).toBe(false);
	});


	it("endingWithTest()", function() {
		let bytesMessage = [
			0xf0, 0x52, 0x00
		];

		let tester = new MidiMessageTester(bytesMessage);

		let same = bytesMessage;
		let big = bytesMessage.concat([0x37]);
		let small = [0x52, 0x00];
		let diff = [0x00, 0x52];
		let diff2 = [0xf1, 0x52, 0x37];

		expect(tester.init().endingWith(same).test()).toBe(true);
		expect(tester.init().endingWith(big).test()).toBe(false);
		expect(tester.init().endingWith(small).test()).toBe(true);
		expect(tester.init().endingWith(diff).test()).toBe(false);
		expect(tester.init().endingWith(diff2).test()).toBe(false);
	});
});
