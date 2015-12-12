abstract class MessagesCollection<T> {
	messages : Array<T>;

	constructor() {
		this.messages = new Array();
	}

	add(message : T) : MessagesCollection<T> {
		this.messages.push(message);

		return this;
	}

	concatWith(messages : MessagesCollection<T>) : MessagesCollection<T> {
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
	toString() {
		let returned = "";

		for (let message of this.messages)
			returned += message.toString();

		return returned;
	}
}
