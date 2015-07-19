"use strict";

export class Param {

    /** String */
	name;

    /** int */
	minValue;
    /** int */
	maxValue;
    /** int */
	currentValue;

	/** Pula de TANTO em TANTO */
    /** int */
	stepByStep = 1;

    /** Optional<OnChangeListenner<Param>> */
	listenner = Optional.empty();

    /**
     * @param String name
     * @param int    minValue
     * @param int    maxValue
     * @param int    defaultValue
     * @param int    stepByStep
     */
	constructor(name, minValue, maxValue, defaultValue, stepByStep) {
		this.name = name;

		this.minValue = minValue;
		this.maxValue = maxValue;

		this.setCurrentValue(defaultValue);
		this.stepByStep = stepByStep;
	}

    /**
     * @param int newValue
     */
	setCurrentValue(newValue) {
		if (!this.isValidValue(newValue)) {
			if (newValue > this.maxValue)
				newValue = this.maxValue;
			else
				newValue = this.minValue;
		}

		this.currentValue = newValue;

		let details = new Details(Details.TypeChange.PARAM, this.currentValue);

		let message = new ChangeMessage(MultistompCause.PATCH, this, details);
		this.notify(message);
	}

    /**
     * @param int value
     * @return {Boolean}
     */
     isValidValue(value) {
		return !(value < this.minValue || value > this.maxValue);
	}

    /**
     * @param ChangeMessage<Param> message
     */
	notify(message) {
		if (!this.listenner.isPresent())
			return;

		this.listenner.get().onChange(message);
	}

    /**
     * @return String
     */
	getName() {
		return this.name;
	}

    /**
     * @return int
     */
	getValue() {
		return this.currentValue;
	}

    /**
     * @param int
     */
	setValue(value) {
		this.setCurrentValue(value);
	}

	addValue() {
		let newValue = this.currentValue + this.stepByStep;

		if (!this.isValidValue(newValue))
			// Don't change current value
			return;

		this.setValue(newValue);
	}

    /**
     * @return int
     */
	getMinValue() {
		return this.minValue;
	}

    /**
     * @return int
     */
	getMaxValue() {
		return this.maxValue;
	}

	/*************************************************/

    /**
     * @param OnChangeListenner<Param> listenner
     */
	setListenner(listenner) {
		this.listenner = Optional.of(listenner);
	}

	/**
	 * @return String
	 */
	//@Override
	toString() {
		return `${this.name} = ${this.currentValue} [${this.minValue} - ${this.maxValue}]`;
	}
}
