class PatchDetailsComponent {
    constructor(patchDetailsId) {
        let patchDetails = document.getElementById(patchDetailsId);
        this.nameElement = patchDetails.querySelector("#patchName");
        this.numberElement = patchDetails.querySelector("#patchNumber");
    }
    setName(name) {
        this.nameElement.innerHTML = name;
    }
    setNumber(numero) {
        let representation = numero < 10 ? "0" + numero : "" + numero;
        this.numberElement.innerHTML = representation;
    }
}
//# sourceMappingURL=PatchDetailsComponent.js.map