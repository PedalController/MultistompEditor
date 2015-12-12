"use strict";

class SimpleMidiSystem {
    midiInputs;
    midiOutputs;

    start() {
        return navigator.requestMIDIAccess({ sysex: true }).then(
            ::this.onStartPromised,
            ::this.onError
        );
    }

    onStartPromised(midiAccess) {
        this.onStart(midiAccess);

        return new Promise((resolve) => resolve(this));
    }

    onStart(midiAccess) {
        this.midiInputs  = [];
        this.midiOutputs = [];

        for (let input of midiAccess.inputs.values())
            this.midiInputs.push(input);

        for (let output of midiAccess.outputs.values())
            this.midiOutputs.push(output);

        console.log("Connected");
    }

    onError(midiAccess) {
        console.log(midiAccess);
        console.log("Deu pau :/");
    }
}

class SimpleMidiConnection {
    init(midiSystem) {
        this.input = midiSystem.midiInputs[0];
        this.output = midiSystem.midiOutputs[0];

        return new Promise((resolve) => resolve(this));
    }

    send(message) {
        this.output.send(message);
    }
}

class Registrador {
    constructor() {
        this.registros = [];
    }

    init(midiConnection) {
        this.instrucoes = new Instrucoes(midiConnection);
        this.instrucoes.init();

        midiConnection.input.onmidimessage = (msg) => {
            if (msg.data.length == 15)
                this.proximoPasso();
            else
                this.registrarMensagem(msg);
        };

        this.proximoPasso();

        const lissenMe = [
            0xF0, 0x52, 0x00,
            0x5A, 0x50, 0xF7
        ];

        midiConnection.send(lissenMe);
    }

    registrarMensagem(msg) {
        this.registros.push(msg.data);
    }

    proximoPasso() {
        if (this.instrucoes.hasNext()) {
            this.instrucoes.next();
            return;
        }

        console.log("Finalizou");
        for (let registro of this.registros)
            console.log(BinarioUtil.byteArrayToHex(registro));

        console.log("Gerar relatório");
        let result = new SimpleReport(this.registros[0], this.registros).report();

        for (let i=0; i<this.instrucoes.passos.length; i++) {
            console.log("Passo: ", i-1);
            console.log(this.instrucoes.passos[i-1]);
            console.log(result[i]);
        }
    }
}

class Instrucoes {
    constructor(midiConnection) {
        this.midiConnection = midiConnection;
    }

    init() {
        this.patch = 8;

        let effect = 0;
        let param = 2;

        // effect param value
        this.passos = [
            //[effect, param, 1],
            //[effect, param, 2],
            //[effect, param, 3],
            //[effect, param, 4],
            [effect, param, 8],
            [effect, param, 16],
            [effect, param, 32],
            //[effect, param, 64],
            //[effect, param, 65],
            //[effect, param, 66],
            //[effect, param, 67],
            //[effect, param, 70],
            //[effect, param, 80],
            //[effect, param, 90],
            //[effect, param, 100],
            [effect, param, 0] //Estado inicial
        ];

        this.passoAtual = 0;
    }

    hasNext() {
        return this.passoAtual < this.passos.length;
    }

    next() {
        let passoAtual = this.passos[this.passoAtual];
        console.log("Passo atual", this.passoAtual);
        console.log("Passo atual", passoAtual);

        let effect = passoAtual[0];
        let param = passoAtual[1];
        let value = passoAtual[2];

        this.midiConnection.send(
            this.requestSpecificPatchDetailsMessages(this.patch)
        );
        this.midiConnection.send(
            this.setParamMessages(effect, param, value)
        );

        this.passoAtual++;
    }

    requestSpecificPatchDetailsMessages(patch) {
		return [
			0xF0,  0x52, 0x00,
			0x5A,  0x09, 0x00,
			0x00, patch, 0xF7
		];
	}

    setParamMessages(effect, param, value) {
        const PARAM_EFFECT = 2;
        return this.manipuleEffectMessages(effect, param + PARAM_EFFECT, value);
    }

    manipuleEffectMessages(effect, type, value) {
		let value2 = (value/128)|0;
		value = value % 128;

		return [
			0xF0,  0x52,   0x00,
			0x5A,  0x31, effect,
			type, value, value2,
			0xF7
		];
	}
}

export class SimpleReport {
    constructor(messageBase, messages) {
        this.messageBase = messageBase;
        this.messages = messages;
    }

    report() {
        let retorno = [];

        let messageBase = new MessageAnalyzer(this.messageBase);

        for (let mensagem of this.messages) {
            let analyzer = new MessageAnalyzer(mensagem);
            let differetiator = analyzer.compareWith(messageBase);

            retorno.push(differetiator.differences);
        }

        return retorno;
    }

    toString() {
        let messageBase = new MessageAnalyzer(this.messageBase);

        let i = 0;
        for (let mensagem of this.messages) {
            let analyzer = new MessageAnalyzer(mensagem);

            let differetiator = analyzer.compareWith(messageBase);

            console.log("Message "+i+": ", BinarioUtil.byteArrayToHex(mensagem));

            console.log("Diffs ");
            console.log(differetiator.differences);
            //console.log(differetiator.toString());
            console.log("\n");

            //this.messagePartEquivalentFor(differetiator.differences, i);
            i++;
        }
    }

    messagePartEquivalentFor(differences, i) {
        differences = this.setToArray(differences);

        let startByte = Math.floor(differences[0]/8);
        let endByte   = Math.floor(differences[differences.length-1]/8) + 1;

        let message1 = this.analyzer.messages[i-1];
        let message2 = this.analyzer.messages[i];

        console.log(message1);
        console.log(message2);

        let byteMessage1 = message1.subarray(startByte, endByte);
        let byteMessage2 = message2.subarray(startByte, endByte);

        console.log(byteMessage1);
        console.log(byteMessage2);
    }

    setToArray(set) {
        let array = [];
        for (let e of set)
            array.push(e);

        return array;
    }
}


window.addEventListener("load", function() {
    let system = new SimpleMidiSystem();
    let connection = new SimpleMidiConnection();
    let registrador = new Registrador();

    system.start()
        .then(::connection.init)
        .then(::registrador.init);
})
