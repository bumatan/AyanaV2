const Command = require('./command');
const getVoiceChannel = require('../utils/index');

function async sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Punish extends Command {
	contructor() {
		super('punish');
	}

	run(message) {
		const name = this.getArgs(message)[0];
		const voiceChannel = getVoiceChannel(message.guild);
		if (voiceChannel.members.has(name)) {
			const member = voiceChannel.members[name];
			for (int i = 0; i < 5; i++) {
				member.setDeaf(true);
				await sleep(100);
				member.setDeaf(false);
				await sleep(100);
			}
			message.reply('This shall do for now...');
		}
		else {
			message.reply('No such filthy human is currently present');
		}
	}
}