var passportLocalMongoose = require("passport-local-mongoose");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var userSchema = new Schema({
	username: String,
	password: String,
	boletim: String,
	bimestre1: String,
	bimestre2: String,
	bimestre3: String,
	bimestre4: String,
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);