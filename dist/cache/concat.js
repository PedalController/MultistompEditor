"use strict";

class HomeController {
    constructor(presenter) {
        this.presenter = presenter;

        this.patchDetails = null;
        this.pedalboard = null;

        this.inicializarComponentes();
    }

    inicializarComponentes() {
        this.patchDetails = new PatchDetailsComponent("patchDetails");
        this.pedalboard = new PedalboardComponent("pedalboard", this);
    }

    setPatchTitle(title) {
        this.patchDetails.setName(title);
    }

    setPatchNumber(number) {
        this.patchDetails.setNumber(number);
    }

    active(effect) {
        this.pedalboard.pedals[effect].active();
    }

    disable(effect) {
        this.pedalboard.pedals[effect].disable();
    }

    toogleEffectOf(index) {
        this.presenter.toogleEffectOf(index);
    }
}

class PatchDetailsComponent {
    constructor(patchDetailsId) {
        let patchDetails = document.getElementById(patchDetailsId);

        this.nameElement = patchDetails.querySelector("#patchName");
        this.numberElement = patchDetails.querySelector("#patchNumber");
    }

    setName(name) {
        this.nameElement.innerHTML = name;
    }

    setNumber(number) {
        if (number < 10)
            number = "0" + number;
        this.numberElement.innerHTML = number;
    }
}

class PedalboardComponent {
    constructor(pedalboardId, controller) {
        this.pedals = document.getElementById(pedalboardId).querySelectorAll("guitar-pedal");

        for (let i=0; i<this.pedals.length; i++) {
            let pedal = this.pedals[i];
            pedal.click = () => controller.toogleEffectOf(i);
        }
    }
}

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

"use strict";

class HomePagina extends Pagina {
    constructor(router) {
        super(router);
        this.controller = new HomeController(this);
        this.pedal = null;
    }

    inicializar(parametros) {
        let selectPedalPromise = (pedals) => {
            return new Promise((resolve, reject) => resolve(pedals[0]));
        };
        let showPedalController = (pedalController) => {
            console.log(pedalController);

            this.pedal = pedalController;

            this.pedal.on();
            this.pedal.addListenner(this);
            this.pedal.send(ZoomGSeriesMessages.REQUEST_CURRENT_PATCH_NUMBER());
        };

        let pedalLoader = new PedalLoader(selectPedalPromise);

        pedalLoader.load().then(showPedalController);
    }

    finalizar() {
        this.pedal.off();
    }

    ////////////////////////////////////////

    onChange(messages) {
        messages.getBy(CommonCause.ACTIVE_EFFECT).forEach(message => this.updateEffect(message, CommonCause.ACTIVE_EFFECT));
		messages.getBy(CommonCause.DISABLE_EFFECT).forEach(message => this.updateEffect(message, CommonCause.DISABLE_EFFECT));

		messages.getBy(CommonCause.TO_PATCH).forEach(message => this.setPatch(message));

		messages.getBy(CommonCause.SET_PARAM).forEach(message => console.log(this.pedal));

        messages.getBy(CommonCause.PATCH_NAME).forEach(message => {this.controller.setPatchTitle(message.details.value)});
        messages.getBy(CommonCause.PATCH_NUMBER).forEach(message => {this.controller.setPatchNumber(message.details.value)});
    }

    updateEffect(message, cause) {
		let patch  = message.details.patch;
		let effect = message.details.effect;

		if (patch != this.pedal.multistomp().getIdCurrentPatch())
			return;

		if (cause == CommonCause.ACTIVE_EFFECT)
			this.controller.active(effect);
		else
			this.controller.disable(effect);
	}

	setPatch(message) {
		let idPatch = message.details.patch;

		this.pedal.send(ZoomGSeriesMessages.REQUEST_SPECIFIC_PATCH_DETAILS(idPatch));
        this.controller.setPatchNumber(idPatch);
	}

	toogleEffectOf(effect) {
		this.pedal.toogleEffect(effect);
	}
}

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

"use strict";

class PedalGerador {
    constructor() {
        this.pedals = this.getContentOf("src/app/template/pedal/zoom-g3v2.html");

        console.log(this.pedals);
    }

    getContentOf(href) {
        return document.querySelector('link[rel="import"][href^="'+href+'"]');
    }

    generateFor(name) {
        let knobsTemplate = this.knobsTemplateOf(name);

        let guitarPedal = document.createElement("guitar-pedal");
        let knobs = document.importNode(knobsTemplate.content, true);
        guitarPedal.addKnobs(knobs);
        guitarPedal.name = name;

        return guitarPedal;
    }

    knobsTemplateOf(pedalName) {
        return this.pedals.import.querySelector('template[data-name="'+pedalName+'"]');
    }

    pedalsNames() {
        let pedalsNames = [];
        let pedals = this.pedals.import.querySelectorAll('template');

        for (let i=0; i<pedals.length; i++) {
            let pedal = pedals[i];
            pedalsNames.push(pedal.getAttribute("data-name"));
        }

        return pedalsNames;
    }
}

class ErrorClass extends Error {
    constructor (message) {
        super();

        if (Error.hasOwnProperty('captureStackTrace'))
            Error.captureStackTrace(this, this.constructor);
        else
            Object.defineProperty(this, 'stack', {
                value: (new Error()).stack
            });

        Object.defineProperty(this, 'message', {
            value: message
        });
    }
}

"use strict"

export class ImplemetationError extends ErrorClass {
}

"use strict"

export class DeviceNotFoundError extends ErrorClass {
}

class AbstractClassError extends ErrorClass {
    constructor(classe) {
        super(`The "${classe.constructor.name}" class is abstract`);
    }
}

class AbstractMethodError extends ErrorClass {
    constructor(message) {
        super(message);
    }
}

function abstract(target, name, descriptor) {
    let isMethod = descriptor !== undefined && descriptor.value !== undefined;

    if (isMethod)
        descriptor.value = function() {
            if (this.constructor.name == target.constructor.name)
                throw new AbstractMethodError(`The method "${name}" of "${target.constructor.name}" is abstract`);
            else
                throw new AbstractMethodError(`The method "${name}" of "${this.constructor.name}" is a "${target.constructor.name}" abstract method. It must be implemented`);
        };

    return descriptor;
}

"use strict";

export class BinarioUtil {
    /**
     * @param byte[] a
     * @return String
     */
	static byteArrayToHex(bytes) {
		let returned = " ";
		for (let byte of bytes)
			returned += byte.toString(16).toUpperCase() + " ";

		return `[${returned}]`;
	}
}

//@abstract
class MessagesCollection {
	messages = new Array();

	add(message) {
		this.messages.push(message);

		return this;
	}

	concatWith(messages) {
		messages.forEach(message => this.add(message));

		return this;
	}

	/**
	 * @return Iterator<Message>
	 */
	[Symbol.iterator]() {
		return this.messages[Symbol.iterator]();
	}


	forEach(funcao) {
		this.messages.forEach(funcao);
	}

	/**
     * @return String
     */
	//@Override
	toString() {
		let returned = "";

		for (let message of this.messages)
			returned += message.toString();

		return returned;
	}
}

"use strict";

export class MidiMessageTester {

    // TestsResults
	tests;

    // MidiMessage
	message;

    /**
     * @param MidiMessage message
     */
	constructor(message) {
		this.message = message;
	}

    /**
     * @return MidiMessageTester
     */
	init() {
		this.tests = new Tests();

		return this;
	}

    /**
     * @return boolean
     */
	test() {
		return this.tests.finalResult();
	}

    /**
     * @param byte[] bytes
     * @return {Boolean}
     */
	isLessThen(bytes) {
		this.tests.add(this.message.length < bytes.length);

		return this;
	}

    /**
     * @param byte[] bytes
     * @return MidiMessageTester
     */
	startingWith(bytes) {
		if (!(bytes.length <= this.message.length)) {
			this.tests.add(false);

			return this;
		}

		for (let i=0; i < bytes.length; i++)
			if (bytes[i] != this.message[i])
				this.tests.add(false);

		this.tests.add(true);

		return this;
	}

    /**
     * @param int size
     * @return MidiMessageTester
     */
	sizeIs(size) {
		this.tests.add(this.message.length == size);

		return this;
	}

    /**
     * @param byte[] bytes
     * @return MidiMessageTester
     */
	endingWith(bytes) {
		if (!(bytes.length <= this.message.length)) {
			this.tests.add(false);

			return this;
		}

		for (let i=1; i<=bytes.length; i++)
			if (bytes[bytes.length-i] != this.message[this.message.length-i])
				this.tests.add(false);

		this.tests.add(true);

		return this;
	}
}

export class Tests {

    result = true;

    /**
     * @param boolean result
     */
    add(result) {
        if (this.result == false)
            return;
        this.result = result;
    }

    finalResult() {
        return this.result;
    }
}

"use strict";

export class Optional {
    constructor(content) {
        this.content = content;
    }

    static of(content) {
        return new Optional(content);
    }

    static empty() {
        return new Optional(null);
    }

    isPresent() {
        return this.content !== null;
    }

    get() {
        if (!this.isPresent())
            throw new Error("NullPointerException");

        return this.content;
    }
}

"use strict";

// FIXME - Fazer SimpleInterface utilizar também um genérico deste
export class MultistompChanger {

    // PedalController
	controller;

    /**
     * @param PedalController controller
     * @return
     */
	constructor(controller) {
		this.controller = controller;
	}

    /**
     * @param Message message
     */
	attempt(message) {
		if (message.is(CommonCause.TO_PATCH))
			this.controller.toPatch(message.details.patch);

		else if (this.isActiveEffectCurrentPatch(message))
			this.controller.activeEffect(message.details.effect);

		else if (this.isActiveEffectSpecificPatch(message))
			this.controller.multistomp().patchs[message.details.patch].effects[message.details.effect].active();

		else if (this.isDisableEffectCurrentPatch(message))
			this.controller.disableEffect(message.details.effect);

		else if (this.isDisableEffectSpecificPatch(message))
			this.controller.multistomp().patchs[message.details.patch].effects[message.details.effect].disable();

		else if (message.is(CommonCause.SET_PARAM)) {
			let idEffect = message.details.effect;
			let idParam  = message.details.param;
			let newValue = message.details.value;

			this.controller.setEffectParam(idEffect, idParam, newValue);

		} else if (message.is(CommonCause.PATCH_NAME))
			this.controller.multistomp().currentPatch().name = message.details.value;

	}

	isActiveEffectCurrentPatch(message) {
		return message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch == Messages.Details.NULL;
	}

	isDisableEffectCurrentPatch(message) {
		return message.is(CommonCause.DISABLE_EFFECT) && message.details.patch == Messages.Details.NULL;
	}

	isActiveEffectSpecificPatch(message) {
		message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch != Details.NULL
	}

	isDisableEffectSpecificPatch(message) {
		message.is(CommonCause.ACTIVE_EFFECT) && message.details.patch != Details.NULL
	}
}

"use strict";

export class PedalCompany {

    // String
	name;

    /**
     * @param String name
     */
	constructor(name) {
		this.name = name;
	}


	getName() {
		return this.name;
	}

    /**
     * @return String
     */
    //@Override
	toString() {
		return this.name;
	}
}

PedalCompany.NULL     = new PedalCompany("Unknown Company"),
PedalCompany.ZoomCorp = new PedalCompany("Zoom Corporation"),
PedalCompany.Line6    = new PedalCompany("Line 6"),
PedalCompany.Roland   = new PedalCompany("Roland Corporation");

"use scrict";

export class PedalController implements OnMultistompListenner, OnUpdateListenner {

	// bolean
	started;
	// Multistomp
	pedal;
	// MidiConnection
	connection;

	// List<OnMultistompListenner>
	controllerListenners = new Array();
	// List<OnMultistompListenner>
	realMultistompListenners = new Array();

	/**
	 * @param pedal Multistomp
	 */
	constructor(midiConnection, pedal) {
		this.started = false;

		this.pedal = pedal;

		this.connection = midiConnection;
		this.connection.setListenner(this);

		this.pedal.addListenner(this);

		this.controllerListenners.push(new Log("Controller"));
		this.realMultistompListenners.push(new Log("Real Multistomp"));
	}

	/*************************************************/

	/** Turn on and inicialize the pedal
	 */
	on() {
		if (this.started)
			return;

		this.started = true;
		this.connection.start();

		this.connection.send(this.pedal.start());
		this.realChange = false; // FIXME - GAMBIARRA
	}

	/** Close connection and turn off the pedal
	 */
	off() {
		if (!this.started)
			return;

		this.started = false;
		this.connection.stop();
	}

	/*************************************************/

	hasStarted() {
		return this.started;
	}

	multistomp() {
		return this.pedal;
	}


	/*************************************************/

	nextPatch() {
		this.pedal.nextPatch();
	}

	beforePatch() {
		this.pedal.beforePatch();
	}

	toPatch(index) {
		this.pedal.toPatch(index);
	}


	/*************************************************/

	/**
	 * @param idEffect int
	 */
	toogleEffect(idEffect) {
		this.pedal.currentPatch().effects[idEffect].toggle();
	}

	/**
	 * @param idEffect int
	 */
	hasActived(idEffect) {
		return this.pedal.currentPatch().effects[idEffect].hasActived();
	}

	/**
	 * @param idEffect int
	 */
	activeEffect(idEffect) {
		this.pedal.currentPatch().effects[idEffect].active();
	}

	/**
	 * @param idEffect int
	 */
	disableEffect(idEffect) {
		this.pedal.currentPatch().effects[idEffect].disable();
	}

	/**
	 * @param int idEffect
	 * @param int idParam
	 * @param int value
	 */
	setEffectParam(idEffect, idParam, value) {
		this.pedal.currentPatch().effects[idEffect].params[idParam].setValue(value);
	}

	/** @return Amount of effects that the current patch has
	 */
	getAmountEffects() {
		return this.pedal.currentPatch().effects.length;
	}

	/** @return listenner OnMultistompListenner
	 */
	addListenner(listenner) {
		this.pedal.addListenner(listenner);
	}

	/*************************************************/
	toString() {
		let retorno = "State: ";
		retorno += started ? "On" : "Off";
		retorno += "\n";

		return retorno + this.pedal.toString();
	}

	/** Multistomp Change */
	/**
	 * @param messages Messages
	 */
	onChange(messages) {
		if (this.realChange) {
			this.realChange = false;
			return;
		}

		this.connection.send(messages);
		this.notify(this.controllerListenners, messages);
	}

	// boolean
	realChange = false;

	/** Real multistomp Change */
	/**
	 * @param messages Messages
	 */
	update(messages) {
		this.realChange = true;

		let changer = new MultistompChanger(this);
		messages.forEach((message) => changer.attempt(message));

		this.notify(this.realMultistompListenners, messages);
	}

	/**
	 * @param listenners []
	 * @param messages Messages
	 */
	notify(listenners, messages) {
		for (let listenner of listenners)
			listenner.onChange(messages);
	}

	/**
	 * @param SysexMessage
	 */
	//@Deprecated
	sendMessage(sysexMessage) {
		this.connection.send(sysexMessage);
	}

	/**
	 * @param messages Messages
	 */
	send(messages) {
		this.connection.send(messages);
		this.realChange = true;
	}
}


"use strict";

class PedalGenerator {
    constructor(midiConnection) {
        this.midiConnection = midiConnection;
    }

    generateFor(pedalType) {
		let pedal = MultistompFactory.For(pedalType);

		return new PedalController(this.midiConnection, pedal);
    }
}

"use strict";

/**
 * Load the real pedal patchs and generate the Pedal object
 */
export class PedalLoader {
    constructor(selectPedalPromise) {
        this.selectPedalPromise = selectPedalPromise;

        this.midiSystem = new MidiSystem();
    }

    load() {
        return this.midiSystem.start()
                .then(this.findPedals.bind(this))
                .then(this.selectPedal.bind(this))
                .then(this.findPedalDevices.bind(this))
                .then(this.generateConnection.bind(this))
                .then(this.generateMultistomp.bind(this));
    }

    findPedals() {
        let finder = new PedalsFinder(this.midiSystem);
        let pedalsFound = finder.find(PedalType.values);

        return new Promise((resolve) => resolve(pedalsFound));
    }

    selectPedal(pedalsFound) {
        return this.selectPedalPromise(pedalsFound);
    }

    findPedalDevices(pedalType) {
        let pedalDevices = this.midiSystem.devicesOf(pedalType);

        return new Promise((resolve) => {
            resolve({pedalType:pedalType, pedalDevices:pedalDevices});
        });
    }

    generateConnection(pedal) {
        let pedalType = pedal.pedalType;
        let pedalDevices = pedal.pedalDevices;

        let connection = new MidiConnection(pedalType, pedalDevices);

        return new Promise((resolve) => {
            resolve({connection:connection, pedalType:pedalType});
        });
    }

    generateMultistomp(params) {
        let connection = params.connection;
        let pedalType = params.pedalType;

        let generator = new PedalGenerator(connection);
        let multistomp = generator.generateFor(pedalType);

        return new Promise((resolve) => resolve(multistomp));
    }
}

"use strict";

class PedalsFinder {
    constructor(midiSystem) {
        this.midiSystem = midiSystem;
    }

    find(pedalsType) {
        let pedals = new Array();

        for (let multistomp of pedalsType)
            if (this.isConnected(multistomp))
                pedals.push(multistomp);

        return pedals;
    }

    isConnected(multistomp) {
        return this.findDevicesFor(multistomp).length != 0;
    }

    /**
     * @param PedalType type
     * @return List<Info> all devices that corresponding the PedalType
     */
    findDevicesFor(type) {
        let devices = new Array();

        let device;

        for (device of this.midiSystem.midiDevices)
            if (device.name.includes(type.USBName))
                devices.push(device);

        return devices;
    }
}

export class MidiMessage {
    message;

    constructor(... bytes) {
        this.message = [];
        for (let byte of bytes)
            this.message.push(byte)
    }
}

class MidiMessages extends MessagesCollection {

}

"use strict";

class MidiSystem {
    midiInputs;
    midiOutputs;

    start() {
        return navigator.requestMIDIAccess({ sysex: true }).then(
            this.onStartPromised.bind(this),
            this.onError.bind(this)
        );
    }

    onStartPromised(midiAccess) {
        this.onStart(midiAccess);

        return new Promise((resolve) => resolve());
    }

    onStart(midiAccess) {
        this.midiInputs  = midiAccess.inputs;
        this.midiOutputs = midiAccess.outputs;

        console.log("Connected");
    }

    onError(midiAccess) {
        console.log(midiAccess);
        console.log("Deu pau :/");
    }

    get midiDevices() {
        let devices = [];

        for (let input of this.midiInputs.values())
            devices.push(input);
        for (let output of this.midiOutputs.values())
            devices.push(output);

        return devices;
    }


    devicesOf(pedalType) {
        return {
            "input":  this.inputMidiDeviceOf(pedalType),
            "output": this.outputMidiDeviceOf(pedalType)
        }
    }

    inputMidiDeviceOf(pedalType) {
        return this.midiDeviceOfType(pedalType, this.midiInputs);
    }

    outputMidiDeviceOf(pedalType) {
        return this.midiDeviceOfType(pedalType, this.midiOutputs);
    }

    midiDeviceOfType(pedalType, listDevices) {
		for (let device of listDevices.values())
			if (device.name.includes(pedalType.USBName))
				return Optional.of(device);

		return Optional.empty();
    }
}

export class MidiConnection implements MidiReaderListenner {

	transmition;
	codification;

    /** Optional<OnUpdateListenner> */
	listenner = Optional.empty();

	/** Optional<MidiMessagesAnalyzer> */
	analyzer = Optional.empty();

	constructor(pedalType, pedalDevices) {
		this.transmition = new MidiTransmition(pedalDevices);
		this.transmition.setOnDataListenerReceived(this);

		this.codification = MessageCodificationFactory.For(pedalType);
	}

	/*************************************************/

	start() {
		this.transmition.start();
	}

	stop() {
		this.transmition.stop();
	}

	/*************************************************/

    /**
	 * @param messages Messages
	 */
	send(messages) {
		for (let midiMessage of this.generateMidiMessages(messages))
			this.sendMidiMessage(midiMessage);
	}

    /**
	 * @param messages Messages
     *
     * @return List<MidiMessage>
	 */
	generateMidiMessages(messages) {
		return this.codification.encode(messages);
	}

    /**
     * @param MidiMessage message
     */
	sendMidiMessage(message) {
		console.log("PASSAR PARA ANALIZER");
		console.log("MIDI sended: ");
		console.log(" " + BinarioUtil.byteArrayToHex(message.message));

		this.transmition.send(message.message);
	}

	/*************************************************/

    /**
     * @param listenner OnUpdateListenner
     */
	setListenner(listenner) {
		this.listenner = Optional.of(listenner);
	}

    /**
     * @param message MidiMessage
     */
	//@override
	onDataReceived(message) {
		console.log("PASSAR PARA ANALIZER");
		console.log("MIDI received: ");
    	console.log(" " + BinarioUtil.byteArrayToHex(message));

		if (this.analyzer.isPresent())
			this.analyzer.get().analyze(message);

		if (!this.codification.isForThis(message)) {
			console.log(" unknown ");
			return;
		}

		let messagesDecoded = this.codification.decode(message);

    	if (this.listenner.isPresent())
			this.listenner.get().update(messagesDecoded);
	}
}

MidiConnection.OnUpdateListenner = class OnUpdateListenner {
    /**
     * @param messages Messages
     */
    update(messages) {}
}

"use strict";

class MidiMessagesAnalyzer {
    constructor(pedalController, changes) {
        this.pedal = pedalController;
        this.pedal.connection.analyzer = Optional.of(this);

        this.started = false;
        this.messages = undefined;
        this.changes = changes;
    }

    start() {
        this.started = true;
        this.messages = [];

        while (this.changes.hasNext())
            this.changes.next();
    }

    stop() {
        this.started = false;
    }

    analyze(message) {
        if (!this.started)
            return;

        this.messages.push(message);
    }
}

"use strict";

// FIXME - Utilize *yeld generators...
export class PedalChanges {
    constructor(pedalController, totalChanges) {
        this.totalChanges = totalChanges;
        this.currentChange = 0;

        this.pedal = pedalController;
    }

    init() {}

    hasNext() {
        return this.currentChange < this.totalChanges;
    }

    next() {
        this.currentChange++;
        this.nextImp();
    }

    nextImp() {}
}

export class ZoomGSeriesDetectPedalChanges extends PedalChanges {
    constructor(pedalController) {
        super(pedalController, 25);
    }

    init() {
        this.pedal.toPatch(8);
        this.zeroParams(0);

        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(1, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(2, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(3, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(4, 117))
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(5, 117))
    }

    zeroParams(idPedal) {
        this.pedal.setEffectParam(idPedal, 0, 0);
        this.pedal.setEffectParam(idPedal, 1, 0);
        this.pedal.setEffectParam(idPedal, 2, 0);
        this.pedal.setEffectParam(idPedal, 3, 0);
        this.pedal.setEffectParam(idPedal, 4, 0);
        this.pedal.setEffectParam(idPedal, 5, 0);
        this.pedal.setEffectParam(idPedal, 6, 0);
        this.pedal.setEffectParam(idPedal, 7, 0);
        this.pedal.setEffectParam(idPedal, 8, 0);
    }

    nextImp() {
        this.pedal.send(ZoomGSeriesMessages.SET_EFFECT(1, this.currentPatch));
        this.zeroParams(0);
    }
}

"use strict"

export class MessageCodification {
    constructor(encoder, decoder) {
        this.encoder = encoder;
        this.decoder = decoder;
    }

    encode(message) {
        return this.encoder.encode(message);
    }

    decode(message) {
        return this.decoder.decode(message);
    }

    isForThis(message) {
        return this.decoder.isForThis(message);
    }
}

"use strict";

export class MessageCodificationFactory {
    /**
     * @param PedalType pedalType
     * @return MessageEncoder
     */
	static For(pedalType) {
		if (PedalType.G3 == pedalType)
			return new MessageCodification(
				new ZoomGSeriesMessageEncoder(),
				new ZoomGSeriesMessageDecoder()
			);

		throw new Error("MessageCodification not found for: " + pedalType);
	}
}

"use strict";

export class MidiTransmition {

    // MidiDevice
    sender;

    receiver;
    device;

    /**
     * @param PedalType pedalType
     */
	constructor(midiDevices) {
        if (!midiDevices.input.isPresent() ||
            !midiDevices.output.isPresent())
            throw new DeviceNotFoundError("Midi device(s) not found for: " + pedalType + " ("+pedalType.getUSBName()+")");

        this.sender = new MidiTransmitionSender(midiDevices.output.get());
        this.reader = new MidiTransmitionReader(midiDevices.input.get());
	}

    start() {
        this.sender.start();
        this.reader.start();
    }

    stop() {
        this.sender.stop();
        this.reader.stop();
	}

    setOnDataListenerReceived(listener) {
        this.reader.setListenner(listener);
    }

    send(midiMessage) {
        this.sender.send(midiMessage);
    }
}

"use strict";

export class AbstractMidiTransmition {

    // MidiDevice
    device;

	constructor(device) {
        this.device = device;
	}

	start() {
		this.device.open();
	}

	stop() {
    	this.device.close();
    }
}

"use strict";

/**
 * Send the messages to real Multistomp
 */
export class MidiTransmitionReader extends AbstractMidiTransmition {

	//MidiReaderListenner
	listenner;

	constructor(device) {
		super(device);

		this.device.onmidimessage = (message) => this.send(message);
	}

	/**
	 * @param MidiReaderListenner listenner
	 */
	setListenner(listenner) {
		this.listenner = listenner;
	}

    /**
     * @param MidiMessage message
     */
	send(message) {
		this.listenner.onDataReceived(message.data);
	}
}

"use strict";

/**
 * Send the messages to real Multistomp
 */
export class MidiTransmitionSender extends AbstractMidiTransmition {

	constructor(device) {
		super(device);
	}

    /**
     * @param MidiMessage message
     */
	send(message) {
		this.device.send(message);
	}
}

class MidiMessagesGenerator {
	constructor(messages, encoder) {
		this.messages = messages;
		this.encoder = encoder;

		this.messagesGenerated = new MidiMessages();
	}

	forEachOfType(cause) {
		let generate = (method) => {
			let messages = this._generateMessages(method, cause);
			this.messagesGenerated.concatWith(messages);
		};

		return {
			generate: generate
		}
	}

	generateMidiMessages() {
		return this.messagesGenerated;
	}

	_generateMessages(method, cause) {
		method = this._bind(method);

		let messages = new MidiMessages();
		let messagesOfCause = this.messages.getBy(cause);

		messagesOfCause.forEach((message) => {
			messages.concatWith(method(message, cause));
		});

		return messages;
	}

	_bind(method) {
		return method.bind(this.encoder);
	}
}

"use strict";

export class PedalType {

    static values = new Array();

    // String
    name;
    // PedalCompany
    company;
    // String
	USBName;

    /**
     * @param String       name
     * @param PedalCompany company
     * @param String       USBName
     */
    constructor(name, company, USBName) {
    	this.name = name;
    	this.company = company;
    	this.USBName = USBName;

        PedalType.values.push(this)
    }

    /**
     * @return int
     */
    getId() {
    	return this.id;
    }

    /**
     * @return PedalCompany
     */
	getCompany() {
		return this.company;
	}

    /**
     * @return String
     */
    //@Override
	toString() {
		return this.name + " - " + this.company.toString();
	}

	/**
	 * @return String
	 *
	 * The name will be used to find out which is the USB which is connected to the PC
	 * that is corresponding Pedal
	 */
	getUSBName() {
		return this.USBName;
	}
}

PedalType.Null = new PedalType("Unknown Pedal", PedalCompany.NULL, "Pedal Unknown is unimplemented"),
PedalType.G2Nu = new PedalType("Zoom G2Nu",     PedalCompany.ZoomCorp, "G2Nu/G2.1Nu"),
PedalType.G3   = new PedalType("Zoom G3v2.0",   PedalCompany.ZoomCorp, "ZOOM G Series");

"use strict";

export class CommonCause {};

CommonCause.TO_PATCH ="TO_PATCH";
CommonCause.GENERAL_VOLUME = "GENERAL_VOLUME";

// Patch
CommonCause.PATCH_NUMBER = "PATCH_NUMBER";
CommonCause.PATCH_VOLUME = "PATCH_VOLUME";
CommonCause.PATCH_NAME =  "PATCH_NAME";

// Effect
CommonCause.ACTIVE_EFFECT = "ACTIVE_EFFECT";
CommonCause.DISABLE_EFFECT = "DISABLE_EFFECT";
// Param
CommonCause.SET_PARAM = "SET_PARAM";

export class Messages extends MessagesCollection {

    /**
     * @param Cause cause
     * @return Messages
     */
	getBy(cause) {
		let returned = new Messages();

		for (let message of this)
			if (message.is(cause))
				returned.add(message);

		return returned;
	}
}

Messages.Details = class Details {
    // int
    static NULL = -1;

    patch  = Details.NULL;
    effect = Details.NULL;
    param  = Details.NULL;
    value  = Details.NULL;

    /**
     * @return String
     */
    //@Override
    toString() {
        let retorno = "";
        if (this.patch != Details.NULL)
            retorno += " patch=" + this.patch;
        if (this.effect != Details.NULL)
            retorno += " effect=" + this.effect;
        if (this.param != Details.NULL)
            retorno += " param=" + this.param;
        if (this.value != Details.NULL)
            retorno += " value=" + this.value;

        return retorno;
    }
}

Messages.Message = class Message {
    // Cause
    cause;
    // Details
    details;

    /**
     * @param Cause cause
     */
    constructor(cause, details) {
        if (details === undefined)
            this._MessageCause(cause);
        else
            this._MessageCauseDetails(cause, details);
    }

    _MessageCause(cause) {
        this._MessageCauseDetails(cause, new Messages.Details());
    }

    /**
     * @param Cause   cause
     * @param Details details
     */
    _MessageCauseDetails(cause, details) {
        this.cause = cause;
        this.details = details;
    }

    /**
     * @return Details
     */
    details() {
        return this.details;
    }

    /**
     * @param Cause cause
     * @return {Boolean}
     */
    is(cause) {
        return this.cause == cause;
    }

    /**
     * @return String
     */
    //@Override
    toString() {
        let retorno = `${this.cause}: (${this.details})`;

        return retorno;
    }
}

"use strict";

export class Effect implements OnChangeListenner<Param> {

    /** int */
	midiId;
    /** String */
	name;
    /** boolean */
	state = false;

    /** List<Param> */
	params = new Array();

    /** Optional<OnChangeListenner<Effect>> */
	listenner = Optional.empty();

    /**
     * @param int    midiId
     * @param String name
     */
	constructor(midiId, name) {
		this.midiId = midiId;
		this.name = name;
	}

	/**
	 * Midi Id for send message
     * @return int
     */
	getMidiId() {
		return this.midiId;
	}

    /**
     * @return String
     */
	getName() {
		return this.name;
	}

	active() {
		this.setState(true);
	}

	disable() {
		this.setState(false);
	}

	toggle() {
		if (this.hasActived())
			this.disable();
		else
			this.active();
	}

    /**
     * @param boolean state
     */
	setState(state) {
		this.state = state;

		let details = new Details(Details.TypeChange.PEDAL_STATUS, state ? 1 : 0);

		let message = new ChangeMessage(MultistompCause.EFFECT, this, details);
		this.notify(message);
	}

    /**
     * @return {Boolean}
     */
	hasActived() {
		return this.state;
	}

    /**
     * @param Param param
     */
	addParam(param) {
		this.params.push(param);
		param.setListenner(this);
	}

    /**
     * @return {String}
     */
	toString() {
		let builder = `${this.name}: ${this.midiId} ${Effect.name} - `;
		builder += this.state ? "Actived" : "Disabled";

		for (let param of this.params)
			builder += param.toString();
		builder += ")";

		return builder;
	}

	/*************************************************/

    /**
     * @param OnChangeListenner<Effect> listenner
     */
	setListenner(listenner) {
		this.listenner = Optional.of(listenner);
	}

	/**
	 * @param ChangeMessage<Param> message
	 */
	//@Override
	onChange(message) {
		let newMessage = new ChangeMessage(MultistompCause.SUPER, this, message);
		this.notify(newMessage);
	}

    /**
     * @param ChangeMessage<Effect> message
     */
	notify(message) {
		if (!this.listenner.isPresent())
			return;

		this.listenner.get().onChange(message);
	}
}

"use strict";

export class Multistomp implements OnChangeListenner<Patch> {

    /** List<OnMultistompListenner> */
	listenners = new Array();

    /** List<Patch> */
	patchs = new Array();

    /** int */
	idCurrentPatch = 0;

	/*************************************************/

	/**
	 * @return {PedalType}
	 */
	@abstract getPedalType() {}

	/*************************************************/

    /**
     * @param {Patch} patch
     */
	addPatch(patch) {
		this.patchs.push(patch);
		patch.setListenner(this);
	}

    /**
     * @return Patch
     */
	currentPatch() {
		try {
			return this.patchs[this.idCurrentPatch];
		} catch (e) {
			throw new ImplemetationError("This multistomp havent any Patch. \nAdd the Patchs in the Pedal Construtor: " + this.name);
		}
	}

    /**
     * @return {int}
     */
	getIdCurrentPatch() {
		return this.idCurrentPatch;
	}

    nextPatch() {
		this.toPatch(this.idCurrentPatch+1);
	}

	beforePatch() {
		this.toPatch(this.idCurrentPatch-1);
	}

    /**
     * @param  {int}
     */
	toPatch(index) {
		if (index >= this.patchs.length)
			index = 0;

		else if (index < 0)
			index = this.patchs.length-1;

		this.idCurrentPatch = index;

		let details = new Details(Details.TypeChange.PATCH_NUMBER, this.idCurrentPatch);

		let newMessage = new ChangeMessage(MultistompCause.MULTISTOMP, this, details);
		this.notify(newMessage);
	}

    /**
     * @return {List<Patch>}
     */
	patchs() {
		return patchs;
	}

	/*************************************************/

    /**
     * @return {String}
     */
	//@Override
	toString() {
		let retorno = "";
		retorno += "Multistomp: "  + Multistomp.name + "\n";
		retorno += " - Current Patch: " + this.currentPatch().toString() + "\n";
		retorno += " - Effects: \n";

		for (let effect of this.currentPatch().effects)
			retorno  += "  |- " + effect.toString() + "\n";

		return retorno;
	}


	/*************************************************/

    /**
     * @param {OnMultistompListenner} listenner
     */
	addListenner(listenner) {
		this.listenners.push(listenner);
	}

    /**
     * @return {List<OnMultistompListenner>}
     */
	listenners() {
		return this.listenners;
	}

    /**
     * @param  {ChangeMessage<Patch>} message
     */
    //@Override
	onChange(message) {
		let newMessage = new ChangeMessage(MultistompCause.SUPER, this, message);
		this.notify(newMessage);
	}

    /**
     * @param  {ChangeMessage<Multistomp>} ChangeMessage<Multistomp> message
     */
	notify(message) {
		let messages = MultistompMessagesConverter.convert(message);

		this.listenners.forEach(listenner => listenner.onChange(messages));
	}

	/*************************************************/

    /**
     * @return {Messages}
     */
	start() {}
}

"use strict";

export class MultistompMessagesConverter {

    /**
     * @param ChangeMessage<Multistomp> message
     * @return Messages
     */
	static convert(message) {
		let msg = null;
		let details = new Messages.Details();

		if (message.is(MultistompCause.MULTISTOMP))
			msg = this.convertToPatch(message, details);

		else if (message.is(MultistompCause.PATCH))
			msg = this.convertPatch(message, details);

		else if (message.is(MultistompCause.EFFECT))
			msg = this.convertStatusEffect(message, details);

		else if (message.is(MultistompCause.PARAM))
			msg = this.convertSetParam(message, details);

		if (msg != null)
			return new Messages().add(msg);
		else
			return new Messages();
	}

    /**
     * @param  ChangeMessage<Multistomp> message
     * @param  Details                   details
     *
     * @return Message
     */
	static convertToPatch(message, details) {
		details.patch = message.causer.getIdCurrentPatch();

		return new Messages.Message(CommonCause.TO_PATCH, details);
	}

	static convertPatch(message, details) {
		if (!details.type == Details.TypeChange.PATCH_NAME)
			return new Messages();

		details.value = message.realMessage().details.newValue;

		return new Messages.Message(CommonCause.PATCH_NAME, details);
	}

    /**
     * @param  ChangeMessage<Multistomp> message
     * @param  Details                   details
     *
     * @return Message
     */
	static convertStatusEffect(message, details) {
		let patch = message.nextMessage.causer;
		details.patch = message.causer.patchs.indexOf(patch);

		let effect = message.realMessage().causer;
		let idEffect = patch.effects.indexOf(effect);

		details.effect = idEffect;
		let cause = effect.hasActived() ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

		return new Messages.Message(cause, details);
	}

    /**
     * @param ChangeMessage<Multistomp> message
     * @param Details                   details
     *
     * @return Message
     */
	static convertSetParam(message, details) {
		let patch = message.nextMessage.causer;
		let effect = message.nextMessage.nextMessage.causer;
		let idEffect = patch.effects.indexOf(effect);

		details.effect = idEffect;
		details.param = effect.params.indexOf(message.realMessage().causer);
		details.value = message.realMessage().causer.getValue();

		return new Messages.Message(CommonCause.SET_PARAM, details);
	}
}

"use strict";

export class Param {

    /** String */
	name;

    /** int */
	minValue;
    /** int */
	maxValue;
    /** int */
	currentValue;

	/** Pula de TANTO em TANTO */
    /** int */
	stepByStep = 1;

    /** Optional<OnChangeListenner<Param>> */
	listenner = Optional.empty();

    /**
     * @param String name
     * @param int    minValue
     * @param int    maxValue
     * @param int    defaultValue
     * @param int    stepByStep
     */
	constructor(name, minValue, maxValue, defaultValue, stepByStep) {
		this.name = name;

		this.minValue = minValue;
		this.maxValue = maxValue;

		this.setCurrentValue(defaultValue);
		this.stepByStep = stepByStep;
	}

    /**
     * @param int newValue
     */
	setCurrentValue(newValue) {
		if (!this.isValidValue(newValue)) {
			if (newValue > this.maxValue)
				newValue = this.maxValue;
			else
				newValue = this.minValue;
		}

		this.currentValue = newValue;

		let details = new Details(Details.TypeChange.PARAM, this.currentValue);

		let message = new ChangeMessage(MultistompCause.PARAM, this, details);
		this.notify(message);
	}

    /**
     * @param int value
     * @return {Boolean}
     */
     isValidValue(value) {
		return !(value < this.minValue || value > this.maxValue);
	}

    /**
     * @param ChangeMessage<Param> message
     */
	notify(message) {
		if (!this.listenner.isPresent())
			return;

		this.listenner.get().onChange(message);
	}

    /**
     * @return String
     */
	getName() {
		return this.name;
	}

    /**
     * @return int
     */
	getValue() {
		return this.currentValue;
	}

    /**
     * @param int
     */
	setValue(value) {
		this.setCurrentValue(value);
	}

	addValue() {
		let newValue = this.currentValue + this.stepByStep;

		if (!this.isValidValue(newValue))
			// Don't change current value
			return;

		this.setValue(newValue);
	}

    /**
     * @return int
     */
	getMinValue() {
		return this.minValue;
	}

    /**
     * @return int
     */
	getMaxValue() {
		return this.maxValue;
	}

	/*************************************************/

    /**
     * @param OnChangeListenner<Param> listenner
     */
	setListenner(listenner) {
		this.listenner = Optional.of(listenner);
	}

	/**
	 * @return String
	 */
	//@Override
	toString() {
		return `${this.name} = ${this.currentValue} [${this.minValue} - ${this.maxValue}]`;
	}
}

"use strict";

export class Patch implements OnChangeListenner<Effect> {
    /** int */
	id;

    /** String */
	patchName = "";

    /** List<Effect> */
	effects = new Array();

    /** Optional<OnChangeListenner<Patch>> */
	listenner = Optional.empty();

    /**
     * @param int id
     */
	constructor(id) {
		this.id = id;
	}

    /**
     * @return {id}
     */
	getId() {
		return id;
	}

    /**
     * @param {Effect} effect
     */
	addEffect(effect) {
		this.effects.push(effect);
		effect.setListenner(this);
	}

	/*************************************************/

	get name() {
		return this.patchName;
	}

	set name(name) {
		this.patchName = name;

		let details = new Details(Details.TypeChange.PATCH_NAME, this.patchName);

		let newMessage = new ChangeMessage(MultistompCause.PATCH, this, details);
		this.notify(newMessage);
	}

	/*************************************************/

    /**
     * @param {OnChangeListenner<Patch>} listenner
     */
	setListenner(listenner) {
		this.listenner = Optional.of(listenner);
	}

	/**
	 * @param ChangeMessage<Effect> message
	 */
	//@Override
	onChange(message) {
		let newMessage = new ChangeMessage(MultistompCause.SUPER, this, message);
		this.notify(newMessage);
	}

    /**
     * @param ChangeMessage<Patch> message
     */
	notify(message) {
		if (!this.listenner.isPresent())
			return;

		this.listenner.get().onChange(message);
	}

	/*************************************************/

	/**
	 * @return String
	 */
	//@Override
	toString() {
		return `Patch ${this.id} - ${this.name} (${this.effects.length}) Effect(s))`;
	}
}

"use strict";

export class ChangeMessage<Causer> {

    // Causer
	causer;
    // Cause
	cause;
    // Details
	details;

    // ChangeMessage<?>
	nextMessage = null;

    /**
     * @param Multistomp multistomp
     *
     * @return ChangeMessage<Multistomp>
     */
	static None(multistomp) {
		return new ChangeMessage<Multistomp>(MultistompCause.NONE, multistomp, Details.NONE());
	}

    /**
     * @param Multistomp multistomp
     * @param Details    details
     *
     * @return ChangeMessage<Multistomp>
     */
	static For(multistomp, details) {
		return new ChangeMessage<Multistomp>(MultistompCause.MULTISTOMP, multistomp, details);
	}

    /**
     * @param Multistomp multistomp
     * @param Patch      patch
     * @param Details    details
     */
	static For(multistomp, patch, details) {
		let patchMsg  = new ChangeMessage<Patch>(MultistompCause.PATCH, patch, details);
		let multistompMsg = new ChangeMessage<Multistomp>(MultistompCause.SUPER, multistomp, patchMsg);

		return multistompMsg;
	}

    /**
     * @param Multistomp multistomp
     * @param Patch      patch
     * @param Effect     effect
     * @param Details    details
     */
	static For(multistomp, patch, effect, details) {
		let effectMsg = new ChangeMessage<Effect>(MultistompCause.EFFECT, effect, details);
		let patchMsg  = new ChangeMessage<Patch>(MultistompCause.SUPER, patch, effectMsg);
		let multistompMsg = new ChangeMessage<Multistomp>(MultistompCause.SUPER, multistomp, patchMsg);

		return multistompMsg;
	}

    /**
     * @param Multistomp multistomp
     * @param Patch      patch
     * @param Effect     efeito
     * @param Param      param
     * @param Details    details
     */
	static For(multistomp, patch, efeito, param, details) {
		let paramMsg  = new ChangeMessage<Param>(MultistompCause.PARAM, param, details);
		let effectMsg = new ChangeMessage<Effect>(MultistompCause.SUPER, efeito, paramMsg);
		let patchMsg  = new ChangeMessage<Patch>(MultistompCause.SUPER, patch, effectMsg);
		let multistompMsg = new ChangeMessage<Multistomp>(MultistompCause.SUPER, multistomp, patchMsg);

		return multistompMsg;
	}

    constructor(cause, causer, what) {
        if (what instanceof ChangeMessage)
            this._constructorMessage(cause, causer, what);
        else
            this._constructorDetails(cause, causer, what);
    }

    /**
     * @param Cause            cause
     * @param Causer           causer
     * @param ChangeMessage<?> nextMessage
     */
    _constructorMessage(cause, causer, nextMessage) {
		this._constructorDetails(cause, causer, Details.NONE());
		this.nextMessage = nextMessage;
	}

    /**
     * @param Cause   cause
     * @param Causer  causer
     * @param Details details
     */
	_constructorDetails(cause, causer, details) {
		this.cause = cause;
		this.causer = causer;
		this.details = details;
	}

	/** Details of what has changed
     * @return Details
     */
	details() {
		return details;
	}

    /**
     * @param Cause cause
     * @return {Boolean}
     */
	is(cause) {
		return cause === this.realMessage().cause;
	}

    /**
     * @return {ChangeMessage<?>}
     */
	realMessage() {
		let message = this;

		while (message.cause == MultistompCause.SUPER)
			message = message.nextMessage;

		return message;
	}

	/**
	 * @return String
	 */
	//@Override
	toString() {
		let returned = "";

		returned += this.causer.getClass().getSimpleName();

		if (this.cause == MultistompCause.SUPER)
			returned += " -> " + this.nextMessage.toString();
		else
			returned += " (" + this.cause.toString() + ")";

		return returned;
	}
}

"use strict";

export class Details implements Cause {
    /** TypeChange */
	type;
    /** int */
	newValue;

    /**
     * @return Details
     */
	static NONE() {
		return new Details(Details.TypeChange.NONE, 0);
	}

    /**
     * @param TypeChange type
     * @param int        newValue
     */
	constructor(type, newValue) {
		this.type = type;
		this.newValue = newValue;
	}

    /**
     * @return int
     */
	newValue() {
		return this.newValue;
	}

    /**
     * @return TypeChange
     */
	type() {
		return this.type;
	}

    /**
     * @return String
     */
	//@Override
	toString() {
		return `(${this.type} ${this.newValue})`;
	}
}

Details.TypeChange  = {
    NONE:"NONE",
    PEDAL_STATUS: "PEDAL_STATUS",
    PARAM:"PARAM",
    PATCH_NUMBER:"PATCH_NUMBER",
	PATCH_NAME:"PATCH_NAME"
}

"use strict";

export class MultistompCause implements Cause {}

MultistompCause.SUPER = "SUPER";
/** None change detected */
MultistompCause.NONE = "NONE";

MultistompCause.MULTISTOMP = "MULTISTOMP";
MultistompCause.PATCH = "PATCH";
MultistompCause.EFFECT = "EFFECT";
MultistompCause.PARAM = "PARAM";

"use strict";

export class MultistompFactory {

    /**
     * @param PedalType pedalType
     * @return PedalController
     */
	static For(pedalType) {
		let pedal;
		let company = pedalType.getCompany();

		if (company == PedalCompany.ZoomCorp)
			pedal = new ZoomMultistompFactory().generate(pedalType);

		else if (company == PedalCompany.Roland)
			pedal = new NullMultistomp();

		else if (company == PedalCompany.Line6)
			pedal = new NullMultistomp();

		else
			pedal = new NullMultistomp();

		return pedal;
	}
}

"use strict";

export class Log implements OnMultistompListenner {

    // String
	type;

    /**
     * @param String type
     */
	constructor(type) {
		this.type = type;
	}

	/**
	 * @param Messages messages
	 */
	//@Override
	onChange(messages) {
		for (let message of messages) {
			console.info("LOG:: " + this.type);
			console.log("LOG:: " + message.toString());
		}
	}
}

"use strict";

export class MultistompSimulator extends Multistomp {

    /**
     * @param {int} int totalPatch
     */
	constructor(totalPatch) {
        super();
		for (let i = 0; i < totalPatch; i++) {
			let patch = new Patch(i);
			for (let effect of this.genEffects())
				patch.addEffect(effect);

			this.addPatch(patch);
		}
	}

    /**
     * @return {List<Effect>} [description]
     */
	genEffects() {
		let effects = new Array();

		effects.push(this.genEffect(0, "Overdrive"));
		effects.push(this.genEffect(1, "Reverb"));
		effects.push(this.genEffect(2, "Chorus"));

		return effects;
	}

    /**
     * @param  {int}    id
     * @param  {String} name
     * @return {Effect}
     */
	genEffect(id, name) {
		let effect = new Effect(id, name);
		effect.addParam(new Param("Gain", 0, 50, 0, 1));
		effect.addParam(new Param("Volume", 0, 25, 0, 1));

		return effect;
	}

    /**
     * @return {Messages}
     */
    //@Override
	start() {
		return new Messages();
	}


    /**
     * @return {PedalType}
     */
    //@Override
	getPedalType() {
		return PedalType.Null;
	}
}

"use strict";

export class NullMultistomp extends Multistomp {

    // Strnig
	MSG_ERROR = "Pedal Unknown is unimplemented";

	constructor() {
        super();
		this.addPatch(new Patch(0));
		console.log(this.MSG_ERROR);
	}

	/**
	 * @return PedalType
	 */
	//@Override
	getPedalType() {
		return PedalType.Null;
	}

	/**
	 * @return Messages
	 */
	//@Override
	start() {
		return new Messages();
	}
}

"use strict";

export class ZoomMultistompFactory implements MultistompFactory {

	/**
	 * @param PedalType type
	 * @return Multistomp
	 */
	//@Override
	generate(type) {
		if (type == PedalType.G2Nu)
			return new ZoomG2Nu();
		else if (type == PedalType.G3)
			return new ZoomGSeries(100, 6, 8);
		else
			return new ZoomGSeries(0, 5, 9);
	}
}

"use strict";

/** For:
 *  - Zoom G3
 *  - Zoom G5
 *  - Zoom Ms-50G
 *  - Zoom Ms-70cd
 *  - Zoom MS-200bt
 *  - Zoom MS-50B
 */
export class ZoomGSeries extends Multistomp {

    // int
	TOTAL_PATCHS;
    // int
	TOTAL_EFFECTS;
    //int
	//@Deprecated
	SIZE_PARAMS;

	/**
	 * @param int         totalPatchs     Max Patches that Pedal may have
	 * @param int         totalEffects    Max Effects that Patches may have
	 * @param @Deprecated int totalParams
	 */
	constructor(totalPatchs, totalEffects, totalParams) {
        super();
		this.TOTAL_PATCHS = totalPatchs;
		this.TOTAL_EFFECTS = totalEffects;
		this.SIZE_PARAMS = totalParams;

		let patchs = this.createPatchs(this.TOTAL_PATCHS);

		for (let patch of patchs)
			this.addPatch(patch);
	}

    /**
     * @param int totalPatch
     * @return List<Patch>
     */
	createPatchs(totalPatch) {
		let patchs = new Array();

		for (let i=0; i<totalPatch; i++) {
			let patch = new Patch(i);
			for (let effect of this.createEffects(this.TOTAL_EFFECTS))
				patch.addEffect(effect);

			patchs.push(patch);
		}

		return patchs;
	}

    /**
     * @param int totalEffects
     * @return List<Effect>
     */
	createEffects(totalEffects) {
		let effects = new Array();

		for (let i=0; i < totalEffects; i++)
			//effects.push(new ZoomGenericEffect(i, "Position "+i, SIZE_PARAMS));
			effects.push(ZoomGSeriesEffect.COMP.generate());

		return effects;
	}

    /**
     * @return Messages
     */
	//@Override
	start() {
		let messages = new Messages();
		messages.concatWith(ZoomGSeriesMessages.LISSEN_ME())
				.concatWith(ZoomGSeriesMessages.YOU_CAN_TALK());

		return messages;
	}

	/**
	 * @return PedalType
	 */
	//@Override
	getPedalType() {
		return PedalType.G3; // FIXME
	}
}

"use strict";

export class ZoomGSeriesCause extends CommonCause {}

ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER   = "REQUEST_CURRENT_PATCH_NUMBER";
ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS  = "REQUEST_CURRENT_PATCH_DETAILS";
ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS = "REQUEST_SPECIFIC_PATCH_DETAILS";

ZoomGSeriesCause.LISSEN_ME    = "LISSEN_ME";
ZoomGSeriesCause.YOU_CAN_TALK = "YOU_CAN_TALK"

ZoomGSeriesCause.SET_EFFECT = "SET_EFFECT";

"use strict";

export class ZoomGSeriesEffect implements ZoomEffect {
	static COMP = new (class COMP {
		/**
		 * @return Effect
		 */
		//@Override
		generate() {
			let effect = new Effect(0, this.constructor.name);

			effect.addParam(new Param("Sense", 0,  10,   6, 1));
			effect.addParam(new Param("Tone",  0,  10,   6, 1));
			effect.addParam(new Param("Level", 0, 150, 100, 1));
			effect.addParam(new Param("ATTCK", 0,   1,   0, 1));

			return effect;
		}
	});
}

"use strict";

export class ZoomGSeriesMessageDecoder implements MessageDecoder {

    //List<MessageDecoder>
	decoders;

	constructor() {
		this.decoders = new Array();

		this.decoders.push(new ZoomGSeriesPatchDecoder());

		this.decoders.push(new ZoomGSeriesSelectPatchDecoder());
		//this.decoders.push(new ZoomGSeriesActiveEffectDecoder());
		//this.decoders.push(new ZoomGSeriesDisableEffectDecoder());
		//this.decoders.push(new ZoomGSeriesSetValueParamDecoder());
	}

	/**
	 * @param MidiMessage message
	 * @return {Boolean}
	 */
	//@Override
	isForThis(message) {
		return this.decodesFor(message).length > 0;
	}

	/**
	 * @param MidiMessage message
	 * @param Multistomp  multistomp
	 * @return Messages
	 */
	decode(midiMessage, multistomp) {
		let decoders = this.decodesFor(midiMessage);

		let messages = new Messages();

		decoders.forEach((decoder) => messages.concatWith(decoder.decode(midiMessage, multistomp)));

		return messages;
	}

	decodesFor(midiMessage) {
		let decoders = new Array();
		for (let decoder of this.decoders)
			if (decoder.isForThis(midiMessage))
				decoders.push(decoder);

		return decoders;
	}
}

export class ZoomGSeriesMessageEncoder implements MessageEncoder {

	/**
	 * @param Messages messages
	 * @return MidiMessages
	 */
	//@Override
	encode(messages) {
		let generator = new MidiMessagesGenerator(messages, this);

		generator.forEachOfType(CommonCause.TO_PATCH)
				 .generate(this.toPatchMessages);

		generator.forEachOfType(CommonCause.ACTIVE_EFFECT)
				 .generate(this.statusEffectMessages);
		generator.forEachOfType(CommonCause.DISABLE_EFFECT)
				 .generate(this.statusEffectMessages);

		generator.forEachOfType(CommonCause.SET_PARAM)
				 .generate(this.setParamMessages);

		generator.forEachOfType(ZoomGSeriesCause.SET_EFFECT)
				 .generate(this.setEffectMessages);

		generator.forEachOfType(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER)
				 .generate(this.requestCurrentPatchNumberMessages);
		generator.forEachOfType(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS)
				 .generate(this.requestCurrentPatchDetailsMessages);
		generator.forEachOfType(ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS)
				 .generate(this.requestSpecificPatchDetailsMessages);

		generator.forEachOfType(ZoomGSeriesCause.LISSEN_ME)
				 .generate(this.lissenMeMessages);
		generator.forEachOfType(ZoomGSeriesCause.YOU_CAN_TALK)
				 .generate(this.youCanTalkMessages);

		return generator.generateMidiMessages();
	}

	toPatchMessages(message) {
		const SET_PATH = 0xc0;//ShortMessage.PROGRAM_CHANGE;
		let patch = message.details.patch;

		let toPatch = new MidiMessage(SET_PATH, patch);

		return new MidiMessages().add(toPatch);
	}

    /**
     * @param Message     message
     * @param CommonCause cause
     *
     * @return MidiMessages
     */
	statusEffectMessages(message, cause) {
		let effect = message.details.effect;

		let actived = cause == CommonCause.ACTIVE_EFFECT;
		let byteActived = actived ? 0x01 : 0x00;

		let manipuleEffect = this.manipuleEffectMessages(effect, ZoomGSeriesMessageEncoder.SET_STATUS, byteActived);

		return new MidiMessages()
				.concatWith(this.lissenMeMessages())
				.concatWith(manipuleEffect);
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	setParamMessages(message) {
		let effect = message.details.effect;
		let param  = message.details.param;
		let value  = message.details.value;

		return this.manipuleEffectMessages(effect, param + ZoomGSeriesMessageEncoder.PARAM_EFFECT, value);
	}

    /**
     * @param Message message
     * @return MidiMessage
     */
	setEffectMessages(message) {
		let effect = message.details.effect;
		let value  = message.details.value;

		return this.manipuleEffectMessages(effect, ZoomGSeriesMessageEncoder.CHANGE_EFFECT, value);
	}

	static SET_STATUS = 0;
	static CHANGE_EFFECT = 1;
	static PARAM_EFFECT = 2; // Base

    /**
     * @param int effect
     * @param int type
     * @param int value
     *
     * @return MidiMessage
     */
	manipuleEffectMessages(effect, type, value) {
		let value2 = (value/128)|0;
		value = value % 128;

		let manupuleEffect = new MidiMessage(
			0xF0,  0x52,   0x00,
			0x5A,  0x31, effect,
			type, value, value2,
			0xF7
		);

		return new MidiMessages().add(manupuleEffect);
	}


	///////////////////////////////////////
	// SPECIFIC ZOOM
	///////////////////////////////////////

	requestCurrentPatchNumberMessages(message) {
		let requestCurrentPatchNumber = new MidiMessage(
			0xF0, 0x52, 0x00,
			0x5A, 0x33, 0xF7
		);

		return new MidiMessages().add(requestCurrentPatchNumber);
	}

	requestCurrentPatchDetailsMessages(message) {
		let requestCurrentPatchDetails = new MidiMessage(
			0xF0, 0x52, 0x00,
			0x5A, 0x29, 0xF7
		);

		return new MidiMessages().add(requestCurrentPatchDetails);
	}

	requestSpecificPatchDetailsMessages(message) {
		let patch = message.details.patch;

		let requestSpecificPatchDetails = new MidiMessage(
			0xF0,  0x52, 0x00,
			0x5A,  0x09, 0x00,
			0x00, patch, 0xF7
		);

		return new MidiMessages().add(requestSpecificPatchDetails);
	}

	lissenMeMessages() {
		let lissenMe = new MidiMessage(
			0xF0, 0x52, 0x00,
			0x5A, 0x50, 0xF7
		);

		return new MidiMessages().add(lissenMe);
	}

	youCanTalkMessages() {
		let youCanTalk = new MidiMessage(
			0xF0, 0x52, 0x00,
			0x5A, 0x16, 0xF7
		);

		return new MidiMessages().add(youCanTalk);
	}
}

"use strict";

export class ZoomGSeriesMessages {

    /**
     * @return Messages
     */
	static REQUEST_CURRENT_PATCH_NUMBER() {
		return new Messages().add(new Messages.Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_NUMBER));
	}

    /**
     * @return Messages
     */
	static REQUEST_CURRENT_PATCH_DETAILS() {
		return new Messages().add(new Messages.Message(ZoomGSeriesCause.REQUEST_CURRENT_PATCH_DETAILS));
	}

    /**
     * @param int idPatch
     * @return Messages
     */
	static REQUEST_SPECIFIC_PATCH_DETAILS(idPatch) {
		let details = new Messages.Details();
		details.patch = idPatch;

		return new Messages().add(new Messages.Message(ZoomGSeriesCause.REQUEST_SPECIFIC_PATCH_DETAILS, details));
	}

    /**
     * @return Messages
     */
	static LISSEN_ME() {
		return new Messages().add(new Messages.Message(ZoomGSeriesCause.LISSEN_ME));
	}

    /**
     * @return Messages
     */
	static YOU_CAN_TALK() {
		return new Messages().add(new Messages.Message(ZoomGSeriesCause.YOU_CAN_TALK));
	}

    /**
     * @param int effectPos
     * @param int newEffect
     *
     * @return Messages
     */
	static SET_EFFECT(effectPos, newEffect) {
		let details = new Messages.Details()
		details.effect = effectPos;
		details.value  = newEffect;

		return new Messages().add(new Messages.Message(ZoomGSeriesCause.SET_EFFECT, details));
	}
}

export class ZoomGSeriesPatchDecoder {

	//@Override
	isForThis(message) {
		const MESSAGE_SIZE = 120;

		let tester = new MidiMessageTester(message);

		return tester.init().sizeIs(MESSAGE_SIZE).test();
	}

	/**
	 * @param MidiMessage message
	 * @return Messages
	 */
	//@Override
	decode(message) {
		let messages = new Messages();

		let patchName    = new ZoomGSeriesPatchNameDecoder();
		let patchNumber  = new ZoomGSeriesPatchNumberDecoder();
		let effects      = new ZoomGSeriesPatchEffectsDecoder();

		messages.concatWith(patchName.decode(message))
				.concatWith(patchNumber.decode(message))
				.concatWith(effects.decode(message));

		return messages;
	}
}

export class ZoomGSeriesPatchEffectsDecoder {

	//@Override
	isForThis(message) {
        return true;
	}

	/**
	 * @param MidiMessage message
	 * @return Messages
	 */
	//@Override
	decode(message) {
		let messages = new Messages();

		let effectsStatus = new ZoomGSeriesPatchEffectsStatusDecoder();
		//let typeEffects   = new ZoomGSeriesPatchEffectsTypeDecoder();

		messages.concatWith(effectsStatus.decode(message))
		//		.concatWith(typeEffects.decode(message));

		return messages;
	}
}

export class ZoomGSeriesPatchEffectsStatusDecoder {

	//@Override
	isForThis(message) {
        return true;
	}

	/**
	 * @param MidiMessage message
	 * @return Messages
	 */
	//@Override
	decode(message) {
        const PATCHES = [6+5, 19+5, 33+5, 47+5, 60+5, 74+5];

		let messages = new Messages();
		for (let idPedal = 0; idPedal < PATCHES.length; idPedal++) {
			let patch = PATCHES[idPedal];

			let actived = this.hasActived(message, patch);
			messages.add(this.generateMessageFor(idPedal, actived));
		}

		return messages;
	}

	hasActived(midiMessage, position) {
		const LSB = 0x01; // Least Significant Bit

		let actived = midiMessage[position] & LSB;

		return actived == 1;
	}

    /**
     * @param int     effect
     * @param boolean actived
     * @return Messages.Message
     */
    generateMessageFor(effect, actived) {
        let cause = actived ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

        let message = new Messages.Message(cause);
        message.details.effect = effect;

        return message;
    }
}

export class ZoomGSeriesPatchNameDecoder implements MessageDecoder {

	static FIRST_LETTER = 102;
    static LAST_LETTER  = 102 + 11;

    /**
     * @param MidiMessage message
     * @return {Boolean}
     */
	//@Override
	isForThis(message) {
		let tester = new MidiMessageTester(message);

        let patchInfo = tester.init().sizeIs(120).test();
        let changeName = false;//tester.init().sizeIs(120).test();

		return patchInfo || changeName;
	}

	//@Override
	decode(midiMessage) {
		let message = new Messages.Message(CommonCause.PATCH_NAME);
        message.details.value = this.getNameBy(midiMessage);

		return new Messages().add(message);
	}

	getNameBy(midiMessage) {
		let firstChar = ZoomGSeriesPatchNameDecoder.FIRST_LETTER;
        let lastChar  = ZoomGSeriesPatchNameDecoder.LAST_LETTER;

        let name = "";
        for (let i=firstChar; i<lastChar; i++) {
            let char = midiMessage[i];
            name += String.fromCharCode(char);
        }

		return name;
	}
}

export class ZoomGSeriesPatchNumberDecoder {

	//@Override
    isForThis(midiMessage) {
		let tester = new MidiMessageTester(midiMessage);

		return tester.init().sizeIs(120).test();
	}

	//@Override
    decode(midiMessage) {
		const patchNumber = this.getPatchNumber(midiMessage);

        return new Messages().add(this.generateMessageFor(patchNumber));
    }

	getPatchNumber(midiMessage) {
		const PATCH_INFO = 7;

		return midiMessage[PATCH_INFO];
	}

    generateMessageFor(patchNumber) {
        let message = new Messages.Message(CommonCause.PATCH_NUMBER);
		message.details.patch = patchNumber;

		return message;
	}
}

"use strict";

// TODO - Agregar este dentro de PatchDecoder - Pode fazer um esquema de composição interna
export class ZoomGSeriesPedalsDecoder implements MessageDecoder {

    static PEDALS_INDEX = [8, 24, 38, 52, 65, 79];

    /**
     * @param MidiMessage message
     * @return {Boolean}
     */
	//@Override
	isForThis(message) {
		let tester = new MidiMessageTester(message);

        let patchInfo = tester.init().sizeIs(120).test();
        let changePedal = false;//tester.init().sizeIs(120).test();

		return patchInfo || changePedal;
	}

    /**
	 * @param MidiMessage message
	 * @param Multistomp  multistomp
	 * @return Messages
	 */
	//@Override
	decode(message, multistomp) {
		let details = new Messages.Details();

		for (let index of ZoomGSeriesPedalsDecoder.PEDALS_INDEX) {
            let actived = this.hasActived(message, index);

			console.log(message[index] - 1, actived, actived ? message[index] - 1 : message[index]);
        }

		return new Messages();
	}

    /**
     * @param MidiMessage message
     * @param int         position
     * @return {Boolean}
     */
	hasActived(message, position) {
		const LSB = 0x01; // Least Significant Bit

		let actived = message[position] & LSB;

		return actived == 1;
	}
}

"use strict";

/**
 * c0 PATCH
 */
export class ZoomGSeriesSelectPatchDecoder implements MessageDecoder {

	static PATCH = 1;

    /**
     * @param MidiMessage message
     * @return {Boolean}
     */
	//@Override
	isForThis(message) {
		let begin = [0xc0];

		let tester = new MidiMessageTester(message);

		return tester.init()
					 .sizeIs(2)
				     .startingWith(begin)
				     .test();
	}

	//@Override
	decode(midiMessage) {
		let message = new Messages.Message(CommonCause.TO_PATCH);
		message.details.patch = midiMessage[ZoomGSeriesSelectPatchDecoder.PATCH];

		return new Messages().add(message);
	}
}
