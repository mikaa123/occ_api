var mongoose = require('mongoose'),
	CreateUpdatedAt = require('mongoose-timestamp'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({

	username: {
		type: String,
		required: true,
		unique: true
	},

	email: {
		type: String,
		required: true,
		lowercase: true
	},

	profilePicture: String,

	// In the case of a local authentication strategy, we store a hashed
	// version of the user's password.
	hashed_password: {
		type: String,
		require: true,
		required: 'Password is required'
	},
	salt: {
		type: String
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
		this.salt = generateSalt();
		this.hashed_password = hashPassword(password, this.salt);
	});

/*
 * Methods
 */

UserSchema.methods = {
	isPasswordValid: function (pwd) {
		return hashPassword(pwd, this.salt) === this.hashed_password;
	}
};

/*
 * Hashing functions
 */

function generateSalt() {
	return String(Math.round((new Date().valueOf() * Math.random())));
}

function hashPassword(password, salt) {
	return crypto.createHmac('sha1', salt).update(password).digest('hex');
}

/*
 * Validations
 */

UserSchema.path('username')
	.validate(function (username) {
		return username && username.length && username.length > 4;
	}, 'Username is too short (minimum is 5 characters)');

UserSchema.path('hashed_password')
	.validate(function (hashPassword) {
		return hashPassword && hashPassword.length;
	}, 'Password cannot be blank.');


module.exports = mongoose.model('User', UserSchema);
