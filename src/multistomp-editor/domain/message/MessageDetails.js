class MessageDetails {
    constructor() {
        this.patch = MessageDetails.NULL;
        this.effect = MessageDetails.NULL;
        this.param = MessageDetails.NULL;
        this.value = MessageDetails.NULL;
    }
    toString() {
        let retorno = "";
        if (this.patch != MessageDetails.NULL)
            retorno += " patch=" + this.patch;
        if (this.effect != MessageDetails.NULL)
            retorno += " effect=" + this.effect;
        if (this.param != MessageDetails.NULL)
            retorno += " param=" + this.param;
        if (this.value != MessageDetails.NULL)
            retorno += " value=" + this.value;
        return retorno;
    }
}
// int
MessageDetails.NULL = -1;
//# sourceMappingURL=MessageDetails.js.map