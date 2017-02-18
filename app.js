const discord = require('discord.js');
const commands = require('./commands');
const ytdl = require('ytdl-core');
const state = require('./utils/state');
const { getVoiceChannel, getTextChannel, isAfk, tts } = require('./utils');

const bot = state.client = new discord.Client();

//TODO: extract event handles to a seperate file

//event handlers
function handleTTS(guild, message) {
	//if not connected to a channel
	const channel = getVoiceChannel(guild);
	(bot.voiceConnections.get(guild.id) ? new Promise(resolve => resolve()) : channel.join()).then(connection => {
		tts(guild, message);
	}, error => {
		console.log(`Error in joining the voice channel. Error: ${error}`);
	}).catch((e) => {
		console.log(`Exception in tts. Exception: ${e}`);
	});
}

function memberJoinedChannel(guild, member) {
	let message = `${member.displayName} has joined the channel!`;
	handleTTS(guild, message);
}

function memberLeftChannel(guild, member) {
	let message = `${member.displayName} has left the channel :(`;
	handleTTS(guild, message);
}

function memberAfk(guild, member) {
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
	if (newMember.displayName === "AyanaV2") return;
	let guild = newMember.guild;
	let channel = getTextChannel(guild);
	
	if (oldMember.voiceChannel === undefined && newMember.voiceChannel) {
		memberJoinedChannel(guild, newMember);
	}
	else if (oldMember.voiceChannel && newMember.voiceChannel === undefined) {
		memberLeftChannel(guild, oldMember);
	}
	else if (!isAfk(guild, oldMember) && isAfk(guild, newMember)) {
		memberLeftChannel(guild, oldMember);
	}
	else if (!isAfk(guild, newMember) && isAfk(guild, oldMember)) {
		memberJoinedChannel(guild, newMember);
	}
});

bot.login(require('./config.json').discordToken);