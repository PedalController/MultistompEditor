class Messages extends MessagesCollection {

	getBy(cause : Cause) : Messages {
		let returned = new Messages();

		for (let message of this)
			if (message.is(cause))
				returned.add(message);

		return returned;
	}
}
