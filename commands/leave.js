const Command = require('./command');

class Leave extends Command {
	constructor() {
		super('leave');
	}

	run(message) {
		let connection = message.guild.voiceConnection;
		if (channel) {
			connection.disconnect();
		}
	}
}

module.exports = Leave;