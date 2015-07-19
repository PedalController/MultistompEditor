"use strict";

export class ZoomGSeriesEffect implements ZoomEffect {
	static COMP = new (class COMP {
		/**
		 * @return Effect
		 */
		//@Override
		generate() {
			let effect = new Effect(0, this.constructor.name);

			effect.addParam(new Param("Sense", 0,  10,   6, 1));
			effect.addParam(new Param("Tone",  0,  10,   6, 1));
			effect.addParam(new Param("Level", 0, 150, 100, 1));
			effect.addParam(new Param("ATTCK", 0,   1,   0, 1));

			return effect;
		}
	});
}
