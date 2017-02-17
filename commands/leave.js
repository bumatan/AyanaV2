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
			message.reply('Whatever... Couldn\'t stand the smell anyways');
		}
	}
}

module.exports = Leave;