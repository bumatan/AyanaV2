const discord = require('discord.js');
const state = require('./state');
const ytdl = require('ytdl-core');
const { spawn, spawnSync } = require('child_process');
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
	const fileName = '/tmp/' + Date.now() + '.wav';
	const textToWAV = spawnSync('pico2wave', ['-w', fileName, message]);
	const WAVToMP3 = spawn('sox', [fileName, '-t', 'mp3', '-', 'vol', '-10dB']);

	WAVToMP3.on('close', () => fs.unlinkSync(fileName));
	connection.playStream(WAVToMP3.stdout, { seek: 0, volume: 6 });
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