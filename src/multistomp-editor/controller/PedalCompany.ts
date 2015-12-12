class PedalCompany {

	public static NULL     = new PedalCompany("Unknown Company");
	public static ZoomCorp = new PedalCompany("Zoom Corporation");
	public static Line6    = new PedalCompany("Line 6");
	public static Roland   = new PedalCompany("Roland Corporation");

	public name : string;

	constructor(name : string) {
		this.name = name;
	}

	toString() : String {
		return this.name;
	}
}