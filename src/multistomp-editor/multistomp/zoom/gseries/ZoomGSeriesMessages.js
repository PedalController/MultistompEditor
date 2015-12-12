class ZoomGSeriesMessages {
    static REQUEST_CURRENT_PATCH_NUMBER() {
        return new Messages().add(new Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER));
    }
    static REQUEST_CURRENT_PATCH_DETAILS() {
        return new Messages().add(new Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS));
    }
    /**
     * @param int idPatch
     */
    static REQUEST_SPECIFIC_PATCH_DETAILS(idPatch) {
        let details = new MessageDetails();
        details.patch = idPatch;
        return new Messages().add(new Message(ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS, details));
    }
    static LISSEN_ME() {
        return new Messages().add(new Message(ZoomGSeriesCause.LISSEN_ME));
    }
    static YOU_CAN_TALK() {
        return new Messages().add(new Message(ZoomGSeriesCause.YOU_CAN_TALK));
    }
    static SET_EFFECT(effectPos, newEffect) {
        let details = new MessageDetails();
        details.effect = effectPos;
        details.value = newEffect;
        return new Messages().add(new Message(ZoomGSeriesCause.SET_EFFECT, details));
    }
}
//# sourceMappingURL=ZoomGSeriesMessages.js.map