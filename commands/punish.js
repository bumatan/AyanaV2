const Command = require('./command');
const { getVoiceChannel } = require('../utils');

class Punish extends Command {
	constructor() {
		super('punish');
	}

	run(message) {
		const name = this.getArgs(message)[0];
		const voiceChannel = getVoiceChannel(message.guild);
		for (let member of voiceChannel.members.values()) {
			if(member.displayName === name) {
				const member = voiceChannel.members.get(name);
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
				return;
			}
		}

		message.reply('No such filthy human is currently present');
	}
}

module.exports = Punish;