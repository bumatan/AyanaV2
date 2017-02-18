module.exports = {
	reset: () => {
		songs = [];
		stream.end();
		streamDispatcher.end();
		playing = false;
	},
	songs: [],
	playing: false
};