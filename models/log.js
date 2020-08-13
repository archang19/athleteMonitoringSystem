var mongoose = require('mongoose'), Schema = mongoose.Schema;

var LogSchema = Schema({
	description: [String], 
	author: String,
	name: String,
	created: Date
});


module.exports = mongoose.model('Log', LogSchema);