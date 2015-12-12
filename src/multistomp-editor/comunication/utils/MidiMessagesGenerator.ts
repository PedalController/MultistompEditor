class MidiMessagesGenerator {
	private messagesGenerated : MidiMessages;
	private messages : Messages;

	private encoder : MessageEncoder;

	constructor(messages : Messages, encoder : MessageEncoder) {
		this.messages = messages;
		this.encoder = encoder;

		this.messagesGenerated = new MidiMessages();
	}

	forEachOfType(cause : Cause) {
		let generate = (method) => {
			let messages = this.generateMessages(method, cause);
			this.messagesGenerated.concatWith(messages);
		};

		return {
			generate: generate
		}
	}

	generateMidiMessages() : MidiMessages {
		return this.messagesGenerated;
	}

	private generateMessages(method : any, cause : Cause) : MidiMessages {
		method = this._bind(method);

		let messages = new MidiMessages();
		let messagesOfCause = this.messages.getBy(cause);

		messagesOfCause.forEach((message) => {
			messages.concatWith(method(message, cause));
		});

		return messages;
	}

	private _bind(method) {
		return method.bind(this.encoder);
	}
}
