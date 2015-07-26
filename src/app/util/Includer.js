"use strict";

class Includer {
    constructor(href) {
        let content = document.querySelector('link[rel="import"][href^="'+href+'"]');
        this.template = content.import.querySelector('template');
    }

    gerarEm(tag) {
        let content = document.importNode(this.template.content, true);
        tag.appendChild(content);
    }
}
