class PatchDetailsComponent {
    nameElement : HTMLElement;
    numberElement : HTMLElement;

    constructor(patchDetailsId : string) {
        let patchDetails = document.getElementById(patchDetailsId);

        this.nameElement = <HTMLElement> patchDetails.querySelector("#patchName");
        this.numberElement = <HTMLElement> patchDetails.querySelector("#patchNumber");
    }

    setName(name : string) {
        this.nameElement.innerHTML = name;
    }

    setNumber(numero : Number) {
        let representation : string = numero < 10 ? "0" + numero : "" + numero;

        this.numberElement.innerHTML = representation;
    }
}
