var mongoose = require('mongoose'),
	CreateUpdatedAt = require('mongoose-timestamp'),
	crypto = require('crypto'),
	validation = require('./validation'),
	Schema = mongoose.Schema;


var UserSchema = new Schema({

	username: {
		type: String,
		required: true,
		unique: true,
		validate: [
			validation.isAlphanumeric(),
			validation.isLength(6, 12)
		]
	},

	email: {
		type: String,
		required: true,
		lowercase: true,
		validate: [
			validation.isEmail()
		]
	},

	profilePicture: String,

	// In the case of a local authentication strategy, we store a hashed
	// version of the user's password.
	hashed_password: {
		type: String,
		required: 'Required'
	},
	salt: {
		type: String
	}
});

UserSchema.plugin(CreateUpdatedAt);

UserSchema
	.virtual('password')
	.set(function(password) {
		this._password = password;
		this.salt = generateSalt();
		this.hashed_password = hashPassword(password, this.salt);
	})
	.get(function (password) {
		return this._password;
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

UserSchema.path('hashed_password')
	.validate(function (hashPassword) {
		return this._password && this._password.length;
	}, 'Password cannot be blank');

UserSchema.path('hashed_password')
	.validate(function (hashPassword) {
		return this._password && this._password.length && this._password.length > 6 && this._password.length < 8;
	}, 'Must be between 6 and 8 characters');

UserSchema.path('username')
	.validate(function (username, cb) {
		module.exports.findOne({ username: username }, function (err, user) {
			cb(!user);
		});
	}, 'User already exists');

UserSchema.path('email')
	.validate(function (email, cb) {
		module.exports.findOne({ email: email }, function (err, email) {
			cb(!email);
		});
	}, 'Email already exists');


module.exports = mongoose.model('User', UserSchema);
