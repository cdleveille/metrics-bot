import { CommandNames, Embed, isModerator, sortObjectKeysByValue } from "./helpers";
import { Message, Reaction } from "./models";

export const reportCommand = {
	name: CommandNames.Report,
	description: "Show a report detailing the moderator activity in the server.",
	handler: async interaction => {
		await interaction.deferReply();

		if (!isModerator(interaction.member)) {
			return await interaction.editReply({
				embeds: [
					Embed.error({ description: "You must be a moderator to use this command!" })
				]
			});
		}

		const { id: server_id, name: server_name } = interaction.guild;

		const title = `Moderator Activity in ${server_name}:\n`;

		const [messages, reactions] = await Promise.all([
			Message.find({ server_id }),
			Reaction.find({ server_id })
		]);

		const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

		const messageCountByModerator = messages.reduce(
			(acc, { user_id, is_moderator, created_at }) => {
				if (!is_moderator) return acc;

				if (created_at > thirtyDaysAgo) {
					if (!acc.last30[user_id]) acc.last30[user_id] = 0;
					acc.last30[user_id]++;
				}

				if (!acc.allTime[user_id]) acc.allTime[user_id] = 0;
				acc.allTime[user_id]++;

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

		let description = "\nMessages (Last 30 Days):\n";
		for (const user_id of messageCountByModeratorLast30KeysSortedDesc) {
			description += `<@${user_id}>: ${messageCountByModerator.last30[user_id]}\n`;
		}

		description += "\nMessages (All Time):\n";
		for (const user_id of messageCountByModeratorAllTimeKeysSortedDesc) {
			description += `<@${user_id}>: ${messageCountByModerator.allTime[user_id]}\n`;
		}

		const reactionCountByModerator = reactions.reduce(
			(acc, { user_id, is_moderator, created_at }) => {
				if (!is_moderator) return acc;

				if (created_at > thirtyDaysAgo) {
					if (!acc.last30[user_id]) acc.last30[user_id] = 0;
					acc.last30[user_id]++;
				}

				if (!acc.allTime[user_id]) acc.allTime[user_id] = 0;
				acc.allTime[user_id]++;

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

		description += "\nReactions (Last 30 Days):\n";
		for (const user_id of reactionCountByModeratorLast30KeysSortedDesc) {
			description += `<@${user_id}>: ${reactionCountByModerator.last30[user_id]}\n`;
		}

		description += "\nReactions (All Time):\n";
		for (const user_id of reactionCountByModeratorAllTimeKeysSortedDesc) {
			description += `<@${user_id}>: ${reactionCountByModerator.allTime[user_id]}\n`;
		}

		await interaction.editReply({ embeds: [Embed.success({ title, description })] });
	}
};

export const commands = [reportCommand];

export const commandsLookup = commands.reduce((acc, command) => {
	acc[command.name] = command;
	return acc;
}, {});
