const discord = require('discord.js');
const commands = require('./commands');
const ytdl = require('ytdl-core');
const state = require('./utils/state');
const { getVoiceChannel, getTextChannel, isAfk } = require('./utils');

const bot = state.client = new discord.Client();

//TODO: extract event handles to a seperate file

//event handlers
function handleTTS(guild, message) {
	//if not connected to a channel
	if(bot.voiceConnections.get(guild) === undefined)
	{
		let channel = getVoiceChannel(guild);
		channel.join().then(connection => {
			if(!tryTTS(message)) {
				console.log("failed to tts")
			}	
		});
	}
	else {
		if(!tryTTS(message)) {
			console.log("failed to tts")
		}
	}
}

function memberJoinedChannel(member) {
	let message = `${member.displayName} has joined the channel!`;
	handleTTS(guild, message);
}

function memberLeftChannel(member) {
	let message = `${member.displayName} has left the channel :(`;
	handleTTS(guild, message);
}

function memberAfk(member) {
	let message = `${member.displayName} is afk.`;
	handleTTS(guild, message);
}

//event registration
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
	let guild = newMember.guild;
	let channel = getTextChannel(guild);
	
	if (oldMember.voiceChannel === undefined && newMember.voiceChannel) {
		memberJoinedChannel(guild, newMember);
	}
	else if (oldMember.voiceChannel && newMember.voiceChannel === undefined) {
		memberLeftChannel(guild, oldMember);
	}
	else if (!isAfk(oldMember) && isAfk(newMember)) {
		memberLeftChannel(guild, oldMember);
	}
	else if (!isAfk(newMember) && isAfk(oldMember)) {
		memberJoinedChannel(guild, newMember);
	}
});

bot.login(require('./config.json').discordToken);