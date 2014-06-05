var mongoose = require('mongoose'),
	CreateUpdatedAt = require('mongoose-timestamp'),
	validation = require('./validation'),
	Schema = mongoose.Schema;


var talkSchema = new Schema({
	speaker: {
		type: String,
		required: true,
		validate: [
			validation.isAlphanumeric(),
			validation.isLength(3)
		]
	},
	summary: {
		type: String,
		required: true,
		validate: [
			validation.isAlphanumeric(),
			validation.isLength(3)
		]
	},
});


var IssueSchema = new Schema({
	title: {
		type: String,
		required: true,
		validate: [
			validation.isAlphanumeric(),
			validation.isLength(3)
		]
	},
	talks: [talkSchema]
});

IssueSchema.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Issue', IssueSchema);
