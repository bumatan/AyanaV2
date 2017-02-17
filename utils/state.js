module.exports = {
	reset: () => {
		this.songs = [];
		this.stream.end();
		this.streamDispatcher.end();
		this.playing = false;
	},
	songs: [],
	playing: false
};