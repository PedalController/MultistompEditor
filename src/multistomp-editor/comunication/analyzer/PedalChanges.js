"use strict";

// FIXME - Utilize *yeld generators...
export class PedalChanges {
    constructor(pedalController, totalChanges) {
        this.totalChanges = totalChanges;
        this.currentChange = 0;

        this.pedal = pedalController;
    }

    @abstract init() {}

    hasNext() {
        return this.currentChange < this.totalChanges;
    }

    next() {
        this.currentChange++;
        this.nextImp();
    }

    @abstract nextImp() {}
}

export class ZoomGSeriesDetectPedalChanges extends PedalChanges {
    constructor(pedalController) {
        super(pedalController, 1);
    }

    init() {
        this.pedal.toPatch(8);
        this.zeroParams(0);

        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(1, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(2, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(3, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(4, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(5, 117))
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

    nextImp() {
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(0, 0));
        this.pedal.send(ZoomGSeriesMessages.REQUEST_CURRENT_PATCH_DETAILS())
        //this.zeroParams(0);
    }
}
