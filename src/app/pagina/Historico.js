class Historico {
    constructor() {
        this.pilha = new Pilha();
    }
    atual(novoAtual) {
        if (novoAtual)
            this.pilha.add(novoAtual);
        else
            return this.pilha.last();
    }
    anterior() {
        return this.pilha.last();
    }
    voltar() {
        return this.pilha.pop();
    }
    size() {
        return this.pilha.size();
    }
}
//# sourceMappingURL=Historico.js.map