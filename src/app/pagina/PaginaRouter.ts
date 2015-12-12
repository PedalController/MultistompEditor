class PaginaRouter {
    historico : Historico;
    private paginas : {[id:string] : Pagina};

    constructor() {
        this.historico = new Historico();

        this.paginas = {};
        this.adicionarPaginasEm(this.paginas);
    }

    private adicionarPaginasEm(dicionario) {
        dicionario["home"] = new HomePagina(this);
    }

    private irParaPagina(pagina : string, parametros? : any) {
        let paginaAtual = this.historico.atual();

        if (paginaAtual)
            paginaAtual.pagina.finalizar();

        paginaAtual = new PaginaHistorico(this.paginas[pagina], parametros);
        this.historico.atual(paginaAtual);

        paginaAtual.pagina.inicializar(parametros);
    }

    irParaPaginaHome() {
        this.irParaPagina("home");
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

class PaginaHistorico {
    pagina : Pagina;
    parametros : any;

    constructor(pagina : Pagina, parametros : any) {
        this.pagina = pagina;
        this.parametros = parametros;
    }
}
