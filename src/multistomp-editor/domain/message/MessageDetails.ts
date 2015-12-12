class MessageDetails {
    // int
    static NULL = -1;

    patch  = MessageDetails.NULL;
    effect = MessageDetails.NULL;
    param  = MessageDetails.NULL;
    value  = MessageDetails.NULL;

    toString() : string {
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