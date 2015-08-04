export class ZoomGSeriesActiveEffectDecoder extends AbstractZoomGSeriesPatchDecoder {

	//@Override
	messageSize() {
		return 110;
	}

	//@Override
	patches() {
		return [6, 19, 33, 47, 60, 74];
	}
}
