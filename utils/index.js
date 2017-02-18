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
	const textToWAV = spawn('dd', ['if=/home/deploy/s.wav', 'of=/home/deploy/b.wav']);
	textToWAV.stdout.on('data', () => console.log('stdout here'));
	textToWAV.stderr.on('data', () => console.log('stderr here'));
	const WAVToMP3 = spawn('lame', ['-V2', '-', '-']);

	textToWAV.stdout.pipe(WAVToMP3.stdin);
	connection.playStream(WAVToMP3.stdout, { seek: 0, volume: 1 });
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