import { ChannelType, Client, Events, GatewayIntentBits } from "discord.js";

import { commandsLookup } from "./commands";
import { Config, connectToDatabase, log, registerSlashCommands } from "./helpers";
import { Message, Reaction } from "./models";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions
	]
});

client.once(Events.ClientReady, async () => {
	try {
		await connectToDatabase();
		await registerSlashCommands(client);
		log.info(`Logged in as ${client.user.tag}!`);
	} catch (error) {
		log.error(error);
	}
});

client.on(Events.InteractionCreate, async interaction => {
	try {
		if (!interaction.isChatInputCommand()) return;
		const command = commandsLookup[interaction.commandName];
		if (command) return await command.handler(interaction);
		else throw "Command not supported yet! Check back soon.";
	} catch (error) {
		log.error(error);
		if (!interaction.isRepliable()) return;
		if (interaction.deferred || interaction.replied)
			await interaction.editReply(`Error: ${error}`);
		else await interaction.reply(`Error: ${error}`);
	}
});

client.on(Events.MessageCreate, async message => {
	try {
		if (message.channel.type === ChannelType.DM) return;
		if (message.author.bot) return;
		await Message.create({
			server_id: message.guild.id,
			server_name: message.guild.name,
			channel_id: message.channel.id,
			channel_name: message.channel.name,
			message_id: message.id,
			user_id: message.author.id,
			user_name: message.author.username
		});
	} catch (error) {
		log.error(error);
		await message.channel.send(`Error: ${error}`);
	}
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
	try {
		await Reaction.create({
			server_id: reaction.message.guild.id,
			server_name: reaction.message.guild.name,
			channel_id: reaction.message.channel.id,
			channel_name: reaction.message.channel.name,
			message_id: reaction.message.id,
			user_id: user.id,
			user_name: user.username,
			user_reacted_to_id: reaction.message.author.id,
			user_reacted_to_name: reaction.message.author.username,
			emoji: reaction.emoji.name,
			is_guild_emoji: !!reaction.emoji.id
		});
	} catch (error) {
		log.error(error);
		await reaction.message.channel.send(`Error: ${error}`);
	}
});

client.login(Config.BOT_TOKEN).catch(error => {
	log.error(error);
});