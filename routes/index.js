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
			var emptyMaterias = {};
			for(var materia in materias) {
				emptyMaterias[materia] = {};
				emptyMaterias[materia]["av1"] = "";
				emptyMaterias[materia]["av2"] = "";
				emptyMaterias[materia]["tr1"] = "";
				emptyMaterias[materia]["tr2"] = "";
				emptyMaterias[materia]["rec"] = "";
			}
			Bimestre.create({ordem: 1, materias: emptyMaterias}, function(err, newBimestre) {
				if(err) {
					return res.redirect(register);
				}
				User.findOne({_id: req.user._id}, function(err, foundUser) {
					foundUser.bimestres.push(newBimestre);
					foundUser.save(function(err, data) {
						if(err) {
							return res.redirect("/register");
						}
						res.redirect("/home");
					});
				});
			});
		});
	});
});

router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/home",
	failureRedirect: "/login"
}), function(req, res) {
});

router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

router.get("/home", isLoggedIn, function(req, res) {
	User.findOne({_id: req.user._id}, function(err, user) {
		if(err) {
			return res.send(err);
		}
		var bimestreId = user.bimestres[0];
		Bimestre.findOne(bimestreId, function(err, bimestre) {
			if (err) {
				return res.send(err);
			}
			var valorMaterias = bimestre.materias;
			res.render("home", {materias: valorMaterias, dicionario: materias});
		});
	});
});

router.post("/salvar", isLoggedIn, function(req, res) {

	var updateBimestre = {};

	for(var materia in materias) {
		for(var input in req.body) {
			if(materia === input) {
				updateBimestre[materia] = req.body[materia];
			}
		}
	}

	User.findOne({_id: req.user._id}, function(err, user) {
		if(err) {
			return res.redirect("back");
		}
		var bimestreId = user.bimestres[0];
		Bimestre.findByIdAndUpdate(bimestreId, {materias: updateBimestre}, function(err, data) {
			if (err) {
				return res.redirect("/home");
			}
			res.redirect("/home");
		});
	});
});

router.get("/boletim", isLoggedIn, function(req, res) {

	var media = {};
	// media[edfisica] => OUTPUT: 10
	User.findOne({_id: req.user._id}, function(err, user) {
		Bimestre.findOne({_id: user.bimestres[0]}, function(err, bimestre) {
			for(var materia in materias) {
				for(var key in bimestre["materias"]) {
					if(materia === key) {
						var names = bimestre["materias"][key]
						var soma = 0;
						var recCtrl = false;
						var result = 0;
						var length = Number(Object.keys(names).length);
						for(var name in names) {
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
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;