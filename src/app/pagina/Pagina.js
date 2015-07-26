"use strict";

class Pagina {
    constructor(router) {
        this["router"] = router;
    }

    barra() {
        return this["router"].barra;
    }
    
    router() {
        return this["router"];
    }

    /** Realiza as ações de inicialização
     * quando a tela é chamada
     */
    inicializar() {
        
    }
    
    /** Realiza as ações de encerramento
     */
    finalizar() {
        
    }
}