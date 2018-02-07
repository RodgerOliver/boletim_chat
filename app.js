// requires
var express		= require("express"),
	mongoose	= require("mongoose"),
	bodyParser	= require("body-parser"),
	app			= express();

// require routes
var indexRoutes = require("./routes/index");

// config
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
//mongoose.connect("mongodb://localhost/boleChat");

// routes
app.use(indexRoutes);

// server
var server = app.listen(process.env.PORT || 3000, process.env.IP, function() {
	var port = server.address().port;
	console.log("Working on port " + port);
});