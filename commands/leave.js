const Command = require('./command');

class Leave extends Command {
	constructor() {
		super('leave');
	}

	run(message) {
		let connection = message.guild.voiceConnection;
		console.log(message.guild);
		if (connection) {
			connection.disconnect();
		}
	}
}

module.exports = Leave;