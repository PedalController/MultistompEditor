class PaginaRouter {
    constructor() {
        this.historico = new Historico();
        this.paginas = {};
        this.adicionarPaginasEm(this.paginas);
    }
    adicionarPaginasEm(dicionario) {
        dicionario["home"] = new HomePagina(this);
    }
    irParaPagina(pagina, parametros) {
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
    constructor(pagina, parametros) {
        this.pagina = pagina;
        this.parametros = parametros;
    }
}
//# sourceMappingURL=PaginaRouter.js.map