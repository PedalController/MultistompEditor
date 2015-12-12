class ZoomGSeriesMessages {

	static REQUEST_CURRENT_PATCH_NUMBER() : Messages {
		return <Messages> new Messages().add(new Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER));
	}

	static REQUEST_CURRENT_PATCH_DETAILS() : Messages{
		return <Messages>  new Messages().add(new Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS));
	}

    /**
     * @param int idPatch
     */
	static REQUEST_SPECIFIC_PATCH_DETAILS(idPatch : number) : Messages {
		let details = new MessageDetails();
		details.patch = idPatch;

		return <Messages>  new Messages().add(new Message(ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS, details));
	}

	static LISSEN_ME() : Messages {
		return <Messages> new Messages().add(new Message(ZoomGSeriesCause.LISSEN_ME));
	}

	static YOU_CAN_TALK() : Messages {
		return <Messages> new Messages().add(new Message(ZoomGSeriesCause.YOU_CAN_TALK));
	}

	static SET_EFFECT(effectPos : number, newEffect : number) : Messages {
		let details = new MessageDetails()
		details.effect = effectPos;
		details.value  = newEffect;

		return <Messages> new Messages().add(new Message(ZoomGSeriesCause.SET_EFFECT, details));
	}
}
