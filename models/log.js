var mongoose = require('mongoose'), Schema = mongoose.Schema;

var LogSchema = Schema({
	description: String, 
	block: String,
	week: String,
	day: String,
	tabularDetails: [[]],
	author: String,
	created: Date,
	completed: Date
});

module.exports = mongoose.model('Log', LogSchema);