export class ZoomGSeriesSetValueParamDecoder extends AbstractZoomGSeriesEffectParamDecoder {

	//@Override
	isForThis(message) {
		return super.isForThis(message) &&
			   message[AbstractZoomGSeriesEffectParamDecoder.PARAM] >= 2;
	}

	//@Override
	decodeThe(details) {
        let setParam = new Messages.Message(CommonCause.SET_PARAM, details);
		return new Messages().add(setParam);
	}
}
