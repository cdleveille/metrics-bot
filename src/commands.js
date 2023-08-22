import { CommandNames } from "./helpers";

export const reportCommand = {
	name: CommandNames.Report,
	description: "Show a report detailing the metrics collected for this server",
	handler: async interaction => {
		await interaction.deferReply();
		const serverId = interaction.guildId;

		// go to db

		await interaction.editReply(`Here is the report for server \`${serverId}\`!`);
	}
};

export const commands = [reportCommand];

export const commandsLookup = commands.reduce((acc, command) => {
	acc[command.name] = command;
	return acc;
}, {});
