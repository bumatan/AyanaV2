const Command = require('./command');
const state = require('../utils/state')

class Leave extends Command {
	constructor() {
		super('leave');
	}

	run(message) {
		let connection = message.guild.voiceConnection;
		if (connection) {
			connection.disconnect();
			if(state.playing) {
				state.reset();
			}
		}
	}
}

module.exports = Leave;