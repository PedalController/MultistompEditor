interface MidiDevice {
	open();
	close();
	onmidimessage : any;
	send(message : MidiMessage);
}