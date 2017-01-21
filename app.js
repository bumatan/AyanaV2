const discord = require('discord.js');
const commands = require('./commands');
const ytdl = require('ytdl-core');
const state = require('./utils/state');

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

bot.login(require('./config.json').discordToken);