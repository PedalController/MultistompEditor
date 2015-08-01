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
