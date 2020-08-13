var mongoose = require('mongoose'), Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var WorkoutSchema = Schema({
	block: Number,
	wk: Number,
	day: Number,
	coach: String,
	athlete: String,
	slots: [
		{
			type:  mongoose.Schema.Types.ObjectId,
			ref: "Slot"
		}
	]
});
module.exports = mongoose.model('Workout', WorkoutSchema);