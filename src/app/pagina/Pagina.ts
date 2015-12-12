abstract class Pagina {
    router : PaginaRouter;

    constructor(router : PaginaRouter) {
        this.router = router;
    }

    /*barra() : HTMLElement {
        return this.router.barra;
    }*/

    /** Realiza as ações de inicialização
     * quando a tela é chamada
     */
    abstract inicializar(parametros? : any);

    /** Realiza as ações de encerramento
     */
    abstract finalizar();
}
