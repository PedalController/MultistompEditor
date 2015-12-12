class Pilha {
	lista : Array<any>;
    constructor() {
        this.lista = [];
    }

    add(elemento) {
        this.lista.push(elemento);
    }

    last() {
        return this.lista[this.lista.length-1];
    }

    pop() {
        return this.lista.pop();
    }

    size() {
        return this.lista.length;
    }
}
