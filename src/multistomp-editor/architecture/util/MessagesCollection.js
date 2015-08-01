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
