class PedalType {
    constructor(name, company, USBName) {
        this.name = name;
        this.company = company;
        this.USBName = USBName;
        PedalType.values.push(this);
    }
    /* FIXME - O que ser isto?
    getId() : number {
        return this.id;
    }*/
    toString() {
        return `${this.name} - ${this.company.toString()}`;
    }
}
PedalType.Null = new PedalType("Unknown Pedal", PedalCompany.NULL, "Pedal Unknown is unimplemented");
PedalType.G2Nu = new PedalType("Zoom G2Nu", PedalCompany.ZoomCorp, "G2Nu/G2.1Nu");
PedalType.G3 = new PedalType("Zoom G3v2.0", PedalCompany.ZoomCorp, "ZOOM G Series");
PedalType.values = new Array();
//# sourceMappingURL=PedalType.js.map