var mongoose = require('mongoose'),
	CreateUpdatedAt = require('mongoose-timestamp'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({

	username: {
		type: String,
		require: true
	},

	email: {
		type: String,
		unique: true,
		require: true,
		lowercase: true
	},

	profilePicture: String,

	// Provider-related information
	twitter: {},
	facebook: {}
});

UserSchema.plugin(CreateUpdatedAt);

module.exports = mongoose.model('User', UserSchema);
