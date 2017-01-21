const Command = require('./command');

class HelpCommand extends Command {
	constructor() {
		super('help');
	}

	run(message) {
		message.reply('help is for the weak');
	}
}

module.exports = HelpCommand;