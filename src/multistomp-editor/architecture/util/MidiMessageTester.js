"use strict";

export class MidiMessageTester {

    // TestsResults
	tests;

    // MidiMessage
	message;

    /**
     * @param MidiMessage message
     */
	constructor(message) {
		this.message = message;
	}

    /**
     * @return MidiMessageTester
     */
	init() {
		this.tests = new Tests();

		return this;
	}

    /**
     * @return boolean
     */
	test() {
		return this.tests.finalResult();
	}

    /**
     * @param byte[] bytes
     * @return {Boolean}
     */
	isLessThen(bytes) {
		this.tests.add(this.message.length < bytes.length);

		return this;
	}

    /**
     * @param byte[] bytes
     * @return MidiMessageTester
     */
	startingWith(bytes) {
		if (!(bytes.length <= this.message.length)) {
			this.tests.add(false);

			return this;
		}

		for (let i=0; i < bytes.length; i++)
			if (bytes[i] != this.message[i])
				this.tests.add(false);

		this.tests.add(true);

		return this;
	}

    /**
     * @param int size
     * @return MidiMessageTester
     */
	sizeIs(size) {
		this.tests.add(this.message.length == size);

		return this;
	}

    /**
     * @param byte[] bytes
     * @return MidiMessageTester
     */
	endingWith(bytes) {
		if (!(bytes.length <= this.message.length)) {
			this.tests.add(false);

			return this;
		}

		for (let i=1; i<=bytes.length; i++)
			if (bytes[bytes.length-i] != this.message[this.message.length-i])
				this.tests.add(false);

		this.tests.add(true);

		return this;
	}
}

export class Tests {

    result = true;

    /**
     * @param boolean result
     */
    add(result) {
        if (this.result == false)
            return;
        this.result = result;
    }

    finalResult() {
        return this.result;
    }
}
