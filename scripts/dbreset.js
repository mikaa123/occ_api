#!/usr/bin/env node
var mongoFixtures = require('mongo_fixtures'),
	ObjectId = require('mongoose').Types.ObjectId;

mongoFixtures('mongodb://localhost/occ', {
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
