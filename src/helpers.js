import "dotenv/config";
import { EmbedBuilder, REST, Routes } from "discord.js";
import mongoose from "mongoose";

import { commands } from "./commands";

/**
 * To set environment variables locally, create a .env file in the root of the project
 *
 * MONGO_URI: optional, defaults to local Docker container if not provided
 * BOT_TOKEN: required, the token for your Discord bot found on the developer portal
 */
export const Config = {
	IS_PROD: process.env.NODE_ENV === "production",
	MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/metrics-bot",
	BOT_TOKEN: process.env.BOT_TOKEN
};
if (!Config.BOT_TOKEN) throw Error("BOT_TOKEN must be provided in .env file");

export const log = {
	info: message => console.info(message),
	error: error => console.error({ error })
};

export const DiscordApi = new REST({ version: "10" }).setToken(Config.BOT_TOKEN);

export const connectToDatabase = async () => {
	try {
		log.info(`Connecting to database on ${Config.MONGO_URI}...`);
		await mongoose.connect(Config.MONGO_URI);
		log.info("Connected to database.");
	} catch (error) {
		log.error(`Error connecting to database: ${error}`);
	}
};

export const registerSlashCommands = async client => {
	try {
		await DiscordApi.put(Routes.applicationCommands(client.user.id), {
			body: commands
		});
	} catch (error) {
		throw `Error registering slash commands: ${error}`;
	}
};

export const CommandNames = {
	Report: "report"
};

export const ModeratorRoleIDs = [
	"1143560919465611334", // bit buster mod
	"910043404707176448", // kolony admin
	"1072803992712785940" // kolony mod
];

export const isModerator = member =>
	member.roles.cache.some(role => ModeratorRoleIDs.includes(role.id));

export const sortObjectKeysByValue = (obj, asc) => {
	return Object.keys(obj).sort((a, b) => (asc ? obj[a] - obj[b] : obj[b] - obj[a]));
};

export class Embed {
	static success = ({ title, description }) => {
		const embed = new EmbedBuilder().setColor("#00e64d");
		title && embed.setTitle(title);
		description && embed.setDescription(description);
		return embed;
	};
	static error = ({ title, description }) => {
		const embed = new EmbedBuilder().setColor("#ff6666");
		embed.setTitle(title || "Error");
		description && embed.setDescription(description);
		return embed;
	};
}
