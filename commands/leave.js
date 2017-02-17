const Command = require('./command');

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