var mongoose = require('mongoose'),
	CreateUpdatedAt = require('mongoose-timestamp'),
	crypto = require('crypto'),
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

	// In the case of a local authentication strategy, we store a hashed
	// version of the user's password.
	hashed_password: {
		type: String,
		require: true
	},

	// Provider-related information
	twitter: {},
	facebook: {},

	tokens: []
});

UserSchema.plugin(CreateUpdatedAt);

UserSchema
	.virtual('password')
	.set(function(password) {
		console.log('in password#set');

		this.hashed_password = hashPassword(password);
	});

/*
 * Hashing functions
 */

function generateSalt() {
	return String(Math.round((new Date().valueOf() * Math.random())));
}

function hashPassword(password, salt) {
	return crypto.createHmac('sha1', generateSalt()).update(password).digest('hex');
}

module.exports = mongoose.model('User', UserSchema);
