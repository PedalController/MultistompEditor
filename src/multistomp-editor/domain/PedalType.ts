class PedalType {

    public static Null = new PedalType("Unknown Pedal", PedalCompany.NULL, "Pedal Unknown is unimplemented");
    public static G2Nu = new PedalType("Zoom G2Nu",     PedalCompany.ZoomCorp, "G2Nu/G2.1Nu");
    public static G3   = new PedalType("Zoom G3v2.0",   PedalCompany.ZoomCorp, "ZOOM G Series");

    public static values = new Array<PedalType>();

    public name : string;
    public company : PedalCompany;
    
    /**
	 * The name will be used to find out which is the USB which is connected to the PC
	 * that is corresponding Pedal
	 */
    public USBName : string;

    constructor(name : string, company : PedalCompany, USBName : string) {
    	this.name = name;
    	this.company = company;
    	this.USBName = USBName;

        PedalType.values.push(this)
    }

    /* FIXME - O que ser isto?
    getId() : number {
    	return this.id;
    }*/

	toString() : string {
		return `${this.name} - ${this.company.toString()}`;
	}
}
