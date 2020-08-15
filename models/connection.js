var mongoose = require('mongoose'), Schema = mongoose.Schema;

var ConnectionSchema = Schema({
	coach: String,
	athlete: String
});

module.exports = mongoose.model('Connection', ConnectionSchema);