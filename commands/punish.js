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
				let deafen = true;
				let counter = 0;
				function deafenIteration(){
					if(counter == 6) {
						return;
					}
					member.setDeaf(deafen).then(() => {
						deafen = !deafen;
						counter++;
						setTimeout(deafenIteration, 500);
					}, (err) => console.log(err));
				}
				deafenIteration();

				message.reply('This shall do for now...');
				return;
			}
		}

		message.reply('No such filthy human is currently present');
	}
}

module.exports = Punish;