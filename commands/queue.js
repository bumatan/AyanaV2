const Command = require('./command');
const { getVoiceChannel, songLoop } = require('../utils');
const state = require('../utils/state');
const ytdl = require('ytdl-core');

class QueueCommand extends Command {
	constructor() {
		super('queue');
	}

	run(message) {
		const voiceChannel = getVoiceChannel(message.guild);
		const yt = this.getArgs(message)[0];
		voiceChannel.join().then(connection => {
			state.songs.push(yt);
			songLoop();
			message.reply('queuing, your human desires disgust me');
		}).catch((e) => {
			console.log(e);
			message.reply('failed to load your stupid noise');
		});
	}
}

module.exports = QueueCommand;