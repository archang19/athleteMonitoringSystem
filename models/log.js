var mongoose = require('mongoose'), Schema = mongoose.Schema;

var LogSchema = Schema({
	description: String, 
	details: String,
	tabularDetails: [[]],
	author: String,
	name: String,
	created: Date,
	completed: Date
});

module.exports = mongoose.model('Log', LogSchema);