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
	
	let channel = getTextChannel(newMember.guild);
	
	function isAfk(member) {
		let guild = member.guild;
		return member.voiceChannelID === guild.afkChannelID;
	}

	function tryTTS(message) {
		if (channel) {
			channel.sendMessage(message,{tts: true});
			return true;
		}
		return false;
	}

	if (oldMember.voiceChannel === undefined && newMember.voiceChannel) {
		tryTTS(`${newMember.displayName} has joined the channel!`);
	}
	else if (oldMember.voiceChannel && newMember.voiceChannel === undefined) {
		tryTTS(`${newMember.displayName} has left the channel :(`);
	}
	else if (!isAfk(oldMember) && isAfk(newMember)) {
		tryTTS(`${newMember.displayName} is afk.`);
	}
	else if (!isAfk(newMember) && isAfk(oldMember)) {
		tryTTS(`${newMember.displayName} has joined the channel!`);
	}
});

bot.login(require('./config.json').discordToken);