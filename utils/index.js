const discord = require('discord.js');
const state = require('./state');
const ytdl = require('ytdl-core');
const spawn = require('child_process').spawn;
const fs = require('fs');

function getVoiceChannel(guild) {
	for(const channel of guild.channels.array()) {
		if(channel instanceof discord.VoiceChannel) {
			return channel;
		}
	}

	return null;
}

function getTextChannel(guild) {
	for(const channel of guild.channels.array()) {
		if(channel instanceof discord.TextChannel) {
			return channel;
		}
	}		
}

function isAfk(guild, member) {
	return member.voiceChannelID === guild.afkChannelID;
}

function tts(guild, message) {
	const connection = getVoiceChannel(guild).connection;
	//const child = spawn('espeak', ['--stdout', message]);
	//child.stdout.on('data', () => console.log('hi im from stdout'));
	//child.stderr.on('data', () => console.log('hi im from stderr'));
	connection.playConvertedStream(fs.createReadStream('/home/deploy/AyanaV2/c.wav'), { seek: 0, volume: 1 });
}

function songLoop() {
	if(state.playing === undefined) {
		state.playing = false;
	}

	if(state.playing) {
		return;
	}

	if(state.songs.length === 0) {
		state.playing = false;
		return;
	}

	state.playing = true;
	const currentSong = state.songs.shift();
	const connection = state.client.voiceConnections.first();
	const stream = ytdl(currentSong, {filter : 'audioonly'});
	state.streamDispatcher = connection.playStream(stream, { seek: 0, volume: 1 });

	state.streamDispatcher.on('end', () => {
		state.playing = false;
		songLoop();
	});

	state.stream = stream;
}


module.exports = {
	getVoiceChannel,
	getTextChannel,
	isAfk,
	tts,
	songLoop
};