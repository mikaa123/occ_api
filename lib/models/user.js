var mongoose = require('mongoose'),
	CreateUpdatedAt = require('mongoose-timestamp'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({

	username: {
		type: String,
		require: true,
		unique: true
	},

	email: {
		type: String,
		require: false,		// Not all services provide email.
		lowercase: true
	},

	profilePicture: String,

	// Provider-related information
	twitter: {},
	facebook: {},

	tokens: []
});

UserSchema.plugin(CreateUpdatedAt);

module.exports = mongoose.model('User', UserSchema);
