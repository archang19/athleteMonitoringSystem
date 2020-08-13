var mongoose = require('mongoose'), Schema = mongoose.Schema;

var SlotSchema = Schema({
	exercise: String,
	sets: Number,
	reps: Number,
	rpe: Number
});

module.exports = mongoose.model('Slot', SlotSchema);
