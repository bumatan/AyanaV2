module.exports = {
	reset: function(){
		songs = [];
		stream.end();
		streamDispatcher.end();
		playing = false;
	},
	songs: [],
	playing: false
};