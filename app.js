const discord = require('discord.js');
const commands = require('./commands');
const ytdl = require('ytdl-core');
const state = require('./utils/state');
const { getTextChannel } = require('./utils')

const bot = state.client = new discord.Client();

bot.on('ready', () => {
  	console.log('I am ready!');
});

bot.on('message', message => {
	for(const commandName of Object.keys(commands)) {
		const command = commands[commandName];
		if(command.shouldRun(message)) {
			command.run(message);
		}
	}
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
	if (oldMember.voiceChannel === undefined && newMember.voiceChannel) {
		let channel = getTextChannel(newMember.guild);
		if (channel) {
			channel.sendMessage(newMember.displayName + " has joined the channel!",{tts: true})
		}
	}
	else if(oldMember.voiceChannel && newMember.voiceChannel === undefined) {
		let channel = getTextChannel(oldMember.guild);
		if (channel) {
			channel.sendMessage(newMember.displayName + " has left the channel :(",{tts: true})
		}
	}
});

bot.login(require('./config.json').discordToken);