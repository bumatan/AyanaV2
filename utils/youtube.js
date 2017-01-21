const google = require('googleapis');
const youtube = google.youtube('v3');
const few = require('few');
const API_TOKEN = require('../config.json').googleToken;

function parseDetails(details) {
	return details
		.sort((a, b) => new Date(a.contentDetails.videoPublishedAt) - Date(b.contentDetails.videoPublishedAt))
		.map(detail => `https://www.youtube.com/watch?v=${detail.contentDetails.videoId}`);
}

module.exports.getPlaylistSongs = function(url) {
	return new Promise((resolve, reject) => {
		const playlistIdMatch = /&list=(.*?)(&|$)/.exec(url);
		if(!playlistIdMatch) {
			return resolve([]);
		}

		const playlistId = playlistIdMatch[1];
		let details = [];
		function getNextPage(pageToken) {
			youtube.playlistItems.list({
				auth: API_TOKEN,
				part: 'contentDetails',
				maxResults: 50,
				pageToken,
				playlistId
			}, (err, detailsPage) => {
				if(err) {
					throw err;
				}

				details = details.concat(detailsPage.items);

				if(!detailsPage.nextPageToken) {
					return resolve(parseDetails(details));
				}

				getNextPage(detailsPage.nextPageToken);
			});
		}

		getNextPage();
	});
};