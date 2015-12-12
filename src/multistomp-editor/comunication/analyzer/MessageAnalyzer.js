export class MessageAnalyzer {
	//boolean[]
	content = new Array();

	constructor(content) {
		this.content = BinarioUtil.bytesForBits(content);
	}

	compareWith(messageAnalyzer) {
		return new MessagesDifferentiator(this, messageAnalyzer);
	}

	toString() {
		return BinarioUtil.toString(this.content);
	}
}

export class MessagesDifferentiator {
	message1;
	message2;

	constructor(message1, message2) {
		this.message1 = message1;
		this.message2 = message2;
	}

	/**
	 * @return Set<Integer>
	 */
	get differences() {
		let differences = new Set();

		for (let i=0; i < this.message1.content.length; i++)
			if (this.message1.content[i] !== this.message2.content[i])
				differences.add(i);

		return differences;
	}

	toString() {
		return MessagesDifferentiatorFormaterView.sinalize(this);
	}
}

/**
 * Format the mensagem for easy visualization
 */
class MessagesDifferentiatorFormaterView {
	static sinalize(messagesDiff) {
		let differencesOrdered = this.order(messagesDiff.differences);

		let builder = messagesDiff.message1.toString();
		builder += "\n";

		let currentPos = 0;
		for (let position of differencesOrdered) {
			while (currentPos < position) {
				builder += ' ';
				currentPos++;

				if (this.isDivisoria(currentPos))
					builder += '-';
			}

			builder += '^';
			currentPos++;
		}

		return builder.toString();
	}

	static isDivisoria(currentPos) {
		return currentPos%8 == 0;
	}

	/**
	 * @return SortedSet<Integer>
	 */
	static order(differences) {
		let differencesOrdered = new Array();

		differences.forEach((e) => differencesOrdered.push(e));

		return differencesOrdered.sort();
	}
}
