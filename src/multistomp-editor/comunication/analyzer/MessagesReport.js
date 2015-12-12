export class MessagesReport {
    constructor(analyzer, changes) {
        this.analyzer = analyzer;
        this.changes = changes;
    }

    toString() {
        let messages = this.analyzer.messages;

        for (var i = 1; i < messages.length; i++) {
            // compare with previous
            let analyzer1 = new MessageAnalyzer(messages[i-1]);
            let analyzer2 = new MessageAnalyzer(messages[i]);

            let differetiator = analyzer1.compareWith(analyzer2);

            //console.log("Message "+(i-1)+": ", messages[i-1]);
            //console.log("Message "+i+": ", messages[i]);
            console.log("Message "+(i-1)+": ", this.changes.messages[i-1]);
            console.log("Message "+i+": ", this.changes.messages[i]);

            console.log("Diffs ");
            console.log(differetiator.differences);
            //this.messagePartEquivalentFor(differetiator.differences, i);
            console.log(differetiator.toString());
            console.log("\n");
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
