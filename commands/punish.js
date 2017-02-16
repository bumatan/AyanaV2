const Command = require('./command');
const getVoiceChannel = require('../utils/index');

class Punish extends Command {
	constructor() {
		super('punish');
	}

	run(message) {
		const name = this.getArgs(message)[0];
		const voiceChannel = getVoiceChannel(message.guild);
		if (voiceChannel.members.has(name)) {
			const member = voiceChannel.members[name];
			let deafen = true;
			let counter = 0;
			let interval = setInterval(function(){
				if(counter == 6) {
					clearInterval(interval);
				}
				member.setDeaf(deafen);
				deafen = !deafen;
				counter++;
			}, 100);

			message.reply('This shall do for now...');
		}
		else {
			message.reply('No such filthy human is currently present');
		}
	}
}

module.exports = Punish;