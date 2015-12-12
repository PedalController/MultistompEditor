class CommonCause implements Cause {
	name : string;

	constructor(name : string) {
		this.name = name;
	}

	static TO_PATCH = new CommonCause("TO_PATCH");
	static GENERAL_VOLUME = new CommonCause("GENERAL_VOLUME");

	// Patch
	static PATCH_NUMBER = new CommonCause("PATCH_NUMBER");
	static PATCH_VOLUME = new CommonCause("PATCH_VOLUME");
	static PATCH_NAME =  new CommonCause("PATCH_NAME");
	
	// Effect
	static ACTIVE_EFFECT = new CommonCause("ACTIVE_EFFECT");
	static DISABLE_EFFECT = new CommonCause("DISABLE_EFFECT");

	// Param
	static SET_PARAM = new CommonCause("SET_PARAM");	
}
