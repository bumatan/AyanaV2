const Command = require('./command');

class Leave extends Command {
	constructor() {
		super('leave');
	}

	run(message) {
		let connection = message.guild.voiceConnection;
		console.log(connection);
		if (connection) {
			connection.disconnect();
		}
	}
}

module.exports = Leave;