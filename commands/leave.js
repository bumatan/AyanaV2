const Command = require('./command');

class LeaveCommand extends Command {
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