class MultistompLoader {
    constructor(pedal) {
        this.pedal = pedal;
    }

    load() {
        this.pedal.send(ZoomGSeriesMessages.LISSEN_ME());

        for (var i = 0; i < 100; i++)
            this.pedal.send(ZoomGSeriesMessages.REQUEST_SPECIFIC_PATCH_DETAILS(i));
    }
}
