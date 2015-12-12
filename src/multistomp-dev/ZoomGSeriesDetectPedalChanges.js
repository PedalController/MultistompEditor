export class ZoomGSeriesDetectPedalChanges extends PedalChanges {
    constructor(pedalController) {
        super(pedalController, 1);
    }

    init() {
        /*
        this.pedal.toPatch(8);
        this.zeroParams(0);

        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(1, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(2, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(3, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(4, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(5, 117))
        */
    }

    zeroParams(idPedal) {
        this.pedal.setEffectParam(idPedal, 0, 0);
        this.pedal.setEffectParam(idPedal, 1, 0);
        this.pedal.setEffectParam(idPedal, 2, 0);
        this.pedal.setEffectParam(idPedal, 3, 0);
        /*this.pedal.setEffectParam(idPedal, 4, 0);
        this.pedal.setEffectParam(idPedal, 5, 0);
        this.pedal.setEffectParam(idPedal, 6, 0);
        this.pedal.setEffectParam(idPedal, 7, 0);
        this.pedal.setEffectParam(idPedal, 8, 0);*/
    }

    start() {
        /*
        let idPedal = 0;

        this.messages.push("Set first effect to type n° 0");
        this.pedal.send(ZoomGSeriesMessages.LISSEN_ME());
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(idPedal, 0));
        this.pedal.send(ZoomGSeriesMessages.REQUEST_SPECIFIC_PATCH_DETAILS(8))

        this.setEffectParam(idPedal, 0, 1);
        this.setEffectParam(idPedal, 0, 2);
        this.setEffectParam(idPedal, 0, 3);
        //this.setEffectParam(idPedal, 0, 4);

        //this.setEffectParam(idPedal, 0, 5);
        //this.setEffectParam(idPedal, 0, 6);
        //this.setEffectParam(idPedal, 0, 7);
        //this.setEffectParam(idPedal, 0, 8);
        //this.setEffectParam(idPedal, 0, 9);

        //this.setEffectParam(idPedal, 0, 10);
        //this.setEffectParam(idPedal, 0, 16);
        //this.setEffectParam(idPedal, 0, 32);
        this.setEffectParam(idPedal, 0, 45);
        this.setEffectParam(idPedal, 0, 50);
        this.setEffectParam(idPedal, 0, 58);
        this.setEffectParam(idPedal, 0, 64);
        this.setEffectParam(idPedal, 0, 128);
        this.setEffectParam(idPedal, 0, 256);
        */
    }

    setEffectParam(idPedal, idParam, value) {
        this.messages.push("First Param: 0");
        this.pedal.setEffectParam(idPedal, 0, 0);
        //this.pedal.send(ZoomGSeriesMessages.REQUEST_CURRENT_PATCH_DETAILS())
        this.pedal.send(ZoomGSeriesMessages.LISSEN_ME());
        this.pedal.send(ZoomGSeriesMessages.REQUEST_SPECIFIC_PATCH_DETAILS(8))

        this.messages.push("First Param: " + value);
        this.pedal.setEffectParam(idPedal, 0, value);
        //this.pedal.send(ZoomGSeriesMessages.REQUEST_CURRENT_PATCH_DETAILS())
        this.pedal.send(ZoomGSeriesMessages.LISSEN_ME());
        this.pedal.send(ZoomGSeriesMessages.REQUEST_SPECIFIC_PATCH_DETAILS(8))

    }
}
