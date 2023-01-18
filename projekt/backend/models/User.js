const { Schema, model } = require("mongoose");

// auto generate "_id"
const userSchema = new Schema({
	login: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	registrationDate: {
		type: Date,
		required: true,
	},
	role: {
		type: String,
		required: true,
		enum: ["ADMIN", "USER"],
	},
});

module.exports = model("User", userSchema);
