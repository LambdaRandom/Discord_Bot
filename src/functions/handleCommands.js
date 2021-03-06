const fs = require('fs');
const config = require('../../config');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = (client) => {
	const clientId = config.general.clientid;
	const guildId = config.general.guildid;
	client.handleCommands = async (commandFolders, path) => {
		client.commandArray = [];
		for (folder of commandFolders) {
			const commandFiles = fs
				.readdirSync(`${path}/${folder}`)
				.filter((file) => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../commands/${folder}/${file}`);
				client.commands.set(command.data.name, command);
				client.commandArray.push(command.data.toJSON());
			}
		}

		const rest = new REST({ version: '9' }).setToken(process.env.SECRET);

		(async () => {
			try {
				console.log('Started refreshing application (/) commands.'.blue);

				await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
					body: client.commandArray,
				});

				console.log('Successfully reloaded application (/) commands.'.green.bold);
			} catch (error) {
				console.log(`${error}`);
			}
		})();
	};
};

/*

> Coded by Lorne#0211
> https://discord.gg/bUMcVASrJM
> https://twitter.com/Lorne_Booker
> https://github.com/lornebookerr

*/