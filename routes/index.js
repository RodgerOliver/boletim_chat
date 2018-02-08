var	Bimestre	= require("../models/bimestre"),
	materias	= require("../models/materias"),
	User		= require("../models/user"),
	passport	= require("passport"),
	express		= require("express"),
	router		= express.Router();

router.get("/", isLoggedIn, function(req, res) {
	res.redirect("/home");
});

router.get("/register", function(req, res) {
	res.render("register");
});

router.post("/register", function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	User.register(new User({username: username}), password, function(err, newUser) {
		if(err) {
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			res.send(newUser);
		});
	});
});

router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}), function(req, res) {

});

router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

router.get("/secret", isLoggedIn, function(req, res) {
	res.send("Hi World!");
});

router.get("/home", isLoggedIn, function(req, res) {
	res.render("home", {materias: materias});
});

router.get("/boletim", isLoggedIn, function(req, res) {

	var media = {};
	// media[edfisica] => OUTPUT: 10
	Bimestre.find({}, function(err, data) {
		for(materia in materias) {
			for(key in data[0]) {
				if(materia === key) {
					var names = data[0][key]
					var soma = 0;
					var recCtrl = false;
					var result = 0;
					var length = Number(Object.keys(names).length);
					for(name in names) {
						if(name === "av1" || name === "av2") {
							if(Number(names["rec"]) > Number(names[name])) {
								soma += Number(names["rec"]);
							} else {
								soma += Number(names[name]);
							}
						} else {
							soma += Number(names[name]);
						}
					}

					soma -= Number(names["rec"]);
					result = soma/(length-1);
					result = (Math.round(result * 2) / 2).toFixed(1);
					media[key] = result;
				}
			}
		}
		res.render("boletim", {media: media, materias: materias});
	});
});

router.post("/salvar", isLoggedIn, function(req, res) {

	var updateBimestre = {};

	for(materia in materias) {
		for(input in req.body) {
			if(materia === input) {
				updateBimestre[input] = req.body[input];
			}
		}
	}

	// Bimestre.create(updateBimestre, function(err, data) {
	// 	res.send(data);
	// });
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;