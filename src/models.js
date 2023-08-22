import { model, Schema } from "mongoose";

export const BaseSchema = new Schema({
	created_at: {
		type: Date,
		default: () => Date.now(),
		immutable: true
	},
	updated_at: {
		type: Date,
		default: () => Date.now()
	}
});

const messageSchemaDefs = {
	server_id: {
		type: String,
		required: true
	},
	server_name: {
		type: String,
		required: true
	},
	channel_id: {
		type: String,
		required: true
	},
	channel_name: {
		type: String,
		required: true
	},
	message_id: {
		type: String,
		required: true
	},
	user_id: {
		type: String,
		required: true
	},
	user_name: {
		type: String,
		required: true
	},
	is_moderator: {
		type: Boolean,
		required: true
	}
};

const reactionSchemaDefs = {
	...messageSchemaDefs,
	user_reacted_to_id: {
		type: String,
		required: true
	},
	user_reacted_to_name: {
		type: String,
		required: true
	},
	emoji: {
		type: String,
		required: true
	},
	is_guild_emoji: {
		type: Boolean,
		required: true
	}
};

const MessageSchema = new Schema(messageSchemaDefs).add(BaseSchema);
export const Message = model("Message", MessageSchema);

const ReactionSchema = new Schema(reactionSchemaDefs).add(BaseSchema);
export const Reaction = model("Reaction", ReactionSchema);
