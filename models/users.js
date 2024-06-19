const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	pwd: {
		type: String,
		required: true,
	},
	roles: {
		user: {
			type: Number,
			default: 2001,
		},
		admin: Number,
		editor: Number,
	},
	refreshToken: {
		type: String,
		default: ''
	}
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;