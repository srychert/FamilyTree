const { Schema, model } = require("mongoose");

// auto generate "_id"
const messageSchema = new Schema({
	content: {
		type: String,
		required: true,
	},
	dateSend: {
		type: Date,
		required: true,
	},
	from: {
		type: String,
		required: true,
	},
	to: {
		type: String,
		required: true,
	},
});

module.exports = model("Message", messageSchema);
