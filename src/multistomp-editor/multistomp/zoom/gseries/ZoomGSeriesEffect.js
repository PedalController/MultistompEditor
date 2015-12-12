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

	static MFILTER = new (class MFILTER {
		/**
		 * @return Effect
		 */
		//@Override
		generate() {
			let effect = new Effect(0, this.constructor.name);

			effect.addParam(new Param("Freq",  0, 100,   0, 1));
			effect.addParam(new Param("Sense", 0,  10,   0, 1));
			effect.addParam(new Param("Reso",  0,  10,   0, 1));
			effect.addParam(new Param("Type",  0,   3,   0, 1));
			effect.addParam(new Param("Chara", 0,   2,   0, 1));
			effect.addParam(new Param("VLCTY", 0,   2,   0, 1));
			effect.addParam(new Param("Bal",   0, 100,   0, 1));
			effect.addParam(new Param("Level", 0, 150,   0, 1));

			return effect;
		}
	});
}
