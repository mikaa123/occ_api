#!/usr/bin/env node
var mongoFixtures = require('mongo_fixtures'),
	ObjectId = require('mongoose').Types.ObjectId;

mongoFixtures('mongodb://localhost/occ', {
	'User': [
		{
			'_id': '5395c5e6a8cac63681117607',
			'username': "userfoo",
			'email': "foo@bar.com",
			'hashed_password': "83f6953ca87e0fe43c9c0ea517ec1dfe926bde88",
			'salt' : "972512995865"
		},
		{
			'username': "bar",
		}
	],
	'Issue': [
		{
			_id: "5396fe86c362ffb556d23c3b",
			title: "OCC #4",
			talks: [
				{
					_id: new ObjectId("5396fab1aefa6e35542cc68e"),
					speaker: "mika",
					summary: "FP programming made simple"
				}
			]
		}
	]
}, function () {
	console.log('done');
	process.exit(0);
});
