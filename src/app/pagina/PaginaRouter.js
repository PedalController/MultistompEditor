"use strict";

class PaginaRouter {
    constructor() {
        this.historico = new Historico();

        this["paginas"] = {};
        this._adicionarPaginasEm(this["paginas"]);
    }

    _adicionarPaginasEm(dicionario) {
        dicionario["home"] = new HomePagina(this);
    }

    _irParaPagina(pagina, parametros) {
        let paginaAtual = this.historico.atual();

        if (paginaAtual)
            paginaAtual.pagina.finalizar();

        paginaAtual = new PaginaHistorico(this["paginas"][pagina], parametros);
        this.historico.atual(paginaAtual);

        paginaAtual.pagina.inicializar(parametros);
    }

    irParaPaginaHome() {
        this._irParaPagina("home");
    }

    irParaPaginaAnterior() {
        if (this.historico.size() <= 1)
            return;

        let paginaAtual = this.historico.voltar();
        paginaAtual.pagina.finalizar();

        paginaAtual = this.historico.atual();
        paginaAtual.pagina.inicializar(paginaAtual.parametros);
    }
}

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

class Pilha {
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

class PaginaHistorico {
    constructor(pagina, parametros) {
        this.pagina = pagina;
        this.parametros = parametros;
    }
}
