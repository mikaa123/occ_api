var validator = require('validator');

// Common validators for mongoose models.
// To use, add a `validate` key in your property description.
//
// var MySchema = new Schema({
// 	name: {
// 		type: String,
// 		validate: [
// 			validation.isAlphanumeric(),
// 			validation.isLength(6, 12)
// 		]
// 	}
// });

module.exports.isAlphanumeric = function () {
	return {
		validator: validator.isAlphanumeric,
		msg: 'Must contain only alphanumeric characters'
	};
};

module.exports.isLength = function (min, max) {
	return {
		validator: function (v) { return validator.isLength(v, min, max); },
		msg: max ? 'Must be between ' + min + ' and ' + max + ' characters' :
				'Must be at least ' + min + ' characters'
	};
};

module.exports.isEmail = function () {
	return {
		validator: validator.isEmail,
		msg: 'Wrong email format'
	};
};
