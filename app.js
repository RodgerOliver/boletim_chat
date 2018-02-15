// requires
var	passportLocalMongoose	= require("passport-local-mongoose"),
	expressSession			= require("express-session"),
	localStrategy			= require("passport-local"),
	User					= require("./models/user"),
	flash					= require("connect-flash"),
	bodyParser				= require("body-parser"),
	mongoose				= require("mongoose"),
	passport				= require("passport"),
	express					= require("express"),
	app						= express();

// require routes
var indexRoutes = require("./routes/index");

// config
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
var url = process.env.DATABASEURL || "mongodb://localhost/boleChat";
mongoose.connect(url);
// ExpressSession Setup
app.use(expressSession({
	secret: "Parkour is the best sport ever",
	resave: false,
	saveUninitialized: false
}));
// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Flash Setup
app.use(flash());

app.use(function(req, res, next) {
	res.locals.flashError = req.flash("error");
	res.locals.flashSuccess = req.flash("success");
	next();
});

// routes
app.use(indexRoutes);

// server
var server = app.listen(process.env.PORT || 3000, process.env.IP, function() {
	var port = server.address().port;
	console.log("Working on port " + port);
});