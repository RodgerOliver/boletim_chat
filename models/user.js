var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	password: String,
	username: String,
	surname: String,
	email: String,
	bimestres: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bimestre"
		}
	]
}, {usePushEach: true});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);