var mongoose = require('mongoose'), Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = Schema({
	username: String,
	password: String,
	firstName: String,
	lastName: String,
	coaches: [String],
	athletes: [String],
	log: [
	{
		type: Schema.Types.ObjectId,
		ref: "Log"
	}
	], 
	sheet: String,
	setSheet: Boolean
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);