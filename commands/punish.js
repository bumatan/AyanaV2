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
					if(counter == 30) {
						message.reply('This shall do for now...');
						return;
					}
					member.setDeaf(deafen).then(() => {
						deafen = !deafen;
						counter++;
						setTimeout(deafenIteration, 150);
					}, (err) => console.log(err));
				}
				deafenIteration();

				return;
			}
		}

		message.reply('No such filthy human is currently present');
	}
}

module.exports = Punish;