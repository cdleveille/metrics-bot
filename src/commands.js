import { CommandNames, isModerator, sortObjectKeysByValue } from "./helpers";
import { Message, Reaction } from "./models";

export const reportCommand = {
	name: CommandNames.Report,
	description: "Show a report detailing the metrics collected for this server",
	handler: async interaction => {
		await interaction.deferReply();

		if (!isModerator(interaction.member)) throw "You must be a moderator to use this command";

		const { id: server_id, name: server_name } = interaction.guild;

		let output = `Moderator Activity in ${server_name}:\n`;

		const [messages, reactions] = await Promise.all([
			Message.find({ server_id }),
			Reaction.find({ server_id })
		]);

		const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

		const messageCountByModerator = messages.reduce(
			(acc, message) => {
				if (!message.is_moderator) return acc;

				if (message.created_at > thirtyDaysAgo) {
					if (!acc.last30[message.user_id]) acc.last30[message.user_id] = 0;
					acc.last30[message.user_id]++;
				}

				if (!acc.allTime[message.user_id]) acc.allTime[message.user_id] = 0;
				acc.allTime[message.user_id]++;

				return acc;
			},
			{ last30: {}, allTime: {} }
		);

		const messageCountByModeratorLast30KeysSortedDesc = sortObjectKeysByValue(
			messageCountByModerator.last30
		);

		const messageCountByModeratorAllTimeKeysSortedDesc = sortObjectKeysByValue(
			messageCountByModerator.allTime
		);

		output += "\nMessages (Last 30 Days):\n";
		for (const user_id of messageCountByModeratorLast30KeysSortedDesc) {
			output += `<@${user_id}>: ${messageCountByModerator.last30[user_id]}\n`;
		}

		output += "\nMessages (All Time):\n";
		for (const user_id of messageCountByModeratorAllTimeKeysSortedDesc) {
			output += `<@${user_id}>: ${messageCountByModerator.allTime[user_id]}\n`;
		}

		const reactionCountByModerator = reactions.reduce(
			(acc, reaction) => {
				if (!reaction.is_moderator) return acc;

				if (reaction.created_at > thirtyDaysAgo) {
					if (!acc.last30[reaction.user_id]) acc.last30[reaction.user_id] = 0;
					acc.last30[reaction.user_id]++;
				}

				if (!acc.allTime[reaction.user_id]) acc.allTime[reaction.user_id] = 0;
				acc.allTime[reaction.user_id]++;

				return acc;
			},
			{ last30: {}, allTime: {} }
		);

		const reactionCountByModeratorLast30KeysSortedDesc = sortObjectKeysByValue(
			reactionCountByModerator.last30
		);

		const reactionCountByModeratorAllTimeKeysSortedDesc = sortObjectKeysByValue(
			reactionCountByModerator.allTime
		);

		output += "\nReactions (Last 30 Days):\n";
		for (const user_id of reactionCountByModeratorLast30KeysSortedDesc) {
			output += `<@${user_id}>: ${reactionCountByModerator.last30[user_id]}\n`;
		}

		output += "\nReactions (All Time):\n";
		for (const user_id of reactionCountByModeratorAllTimeKeysSortedDesc) {
			output += `<@${user_id}>: ${reactionCountByModerator.allTime[user_id]}\n`;
		}

		await interaction.editReply(output);
	}
};

export const commands = [reportCommand];

export const commandsLookup = commands.reduce((acc, command) => {
	acc[command.name] = command;
	return acc;
}, {});
