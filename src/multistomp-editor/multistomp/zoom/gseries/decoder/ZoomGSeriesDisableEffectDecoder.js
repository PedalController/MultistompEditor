export class ZoomGSeriesDisableEffectDecoder extends AbstractZoomGSeriesEffectParamDecoder {

	//@Override
	isForThis(message) {
		return super.isForThis(message) &&
			   message[AbstractZoomGSeriesEffectParamDecoder.PARAM] == 0;
	}

	//@Override
	decodeThe(details) {
		details.param = Messages.Details.NULL;
		details.value = Messages.Details.NULL;

        let disable = new Messages.Message(CommonCause.DISABLE_EFFECT, details);
		return new Messages().add(disable);
	}
}
