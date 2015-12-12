class ZoomGSeriesCause implements Cause {
	name : string;
	constructor(name : string) {
		this.name = name;
	}

	static REQUEST_CURRENT_PATCH_NUMBER   = new ZoomGSeriesCause("REQUEST_CURRENT_PATCH_NUMBER");
	static REQUEST_CURRENT_PATCH_DETAILS  = new ZoomGSeriesCause("REQUEST_CURRENT_PATCH_DETAILS");
	static REQUEST_SPECIFIC_PATCH_DETAILS = new ZoomGSeriesCause("REQUEST_SPECIFIC_PATCH_DETAILS");
	
	static LISSEN_ME    = new ZoomGSeriesCause("LISSEN_ME");
	static YOU_CAN_TALK = new ZoomGSeriesCause("YOU_CAN_TALK");
	
	static SET_EFFECT = new ZoomGSeriesCause("SET_EFFECT");
}