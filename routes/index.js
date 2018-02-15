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
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			User.findOne({_id: req.user._id}, function(err, foundUser) {
				Bimestre.create({ordem: 1}, function(err, newBimestre) {
					foundUser.bimestres.push(newBimestre);
					Bimestre.create({ordem: 2}, function(err, newBimestre) {
						foundUser.bimestres.push(newBimestre);
						Bimestre.create({ordem: 3}, function(err, newBimestre) {
							foundUser.bimestres.push(newBimestre);
							Bimestre.create({ordem: 4}, function(err, newBimestre) {
								foundUser.bimestres.push(newBimestre);
								foundUser.save(function(err, data) {
									if(err) {
										return res.redirect("/redirect");
									}
									res.redirect("/home");
								});
							});
						});
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
	failureRedirect: "/login",
	successFlash: true,
	failureFlash: true
}), function(req, res) {
});

router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

router.get("/home", isLoggedIn, function(req, res) {
	User.findById(req.user._id, function(err, user) {
		if(err) {
			req.logout();
			req.flash("error", "Usuário não encontrado, tente mais tarde.");
			return res.redirect("/login");
		}
		var bimestreId = user.bimestres[0];
		Bimestre.findById(bimestreId, function(err, bimestre) {
			if(err) {
				req.flash("error", "Não foi possível encontrar seus dados, tente mais tarde.");
				return res.render("home");
			}
			var valorMaterias = bimestre.materias;
			res.render("home", {materias: valorMaterias, dicionario: materias});
		});
	});
});

router.get("/bimestres.json", isLoggedIn, function(req, res) {
	if (Number(req.query.bim) > 0 && Number(req.query.bim) < 5) {
		var index = Number(req.query.bim)-1;
		var bimestreId = req.user.bimestres[index];
		Bimestre.findOne({_id: bimestreId, ordem: req.query.bim}, function(err, bimestre) {
			if (err) {
				return res.send("");
			}
			res.send(bimestre.materias);
		});
	} else {
		res.send("");
	}
});

router.post("/salvar", isLoggedIn, function(req, res) {

	var updateBimestre = {materias: {}};
	var ordem = Number(req.body.ordem);

	for(var materia in materias) {
		for(var input in req.body) {
			if(materia === input) {
				updateBimestre["materias"][materia] = req.body[materia];
			}
		}
	}
	if(ordem > 1 && ordem < 5) {
		updateBimestre["ordem"] = ordem;
	} else {
		updateBimestre["ordem"] = 1;
	}

	User.findOne({_id: req.user._id}, function(err, user) {
		if(err) {
			req.flash("error", "Usuario não encontrado, tente mais tarde.");
			return res.redirect("back");
		}
		var bimestreId = user.bimestres[ordem-1];
		Bimestre.findByIdAndUpdate(bimestreId, updateBimestre, function(err, data) {
			if(err) {
				req.flash("error", "Não foi possivel atualizar seus dados, tente mais tarde.");
				return res.redirect("/home");
			}
			res.redirect("/home");
		});
	});
});

router.get("/boletim", isLoggedIn, function(req, res) {

	var media = {};
	var num = 0;
	User.findById(req.user._id).populate("bimestres").exec(function(err, data) {
		if(err) {
			req.flash("error", "Usuário não encontrado, tente mais tarde.");
			return res.redirect("/home");
		}
		data.bimestres.forEach(function(bimestre) {
			num++;
			media[num] = {};
			for(var materia in materias) {
				for(var key in bimestre.materias) {
					if (key === materia) {
						var names = bimestre.materias[materia];
						var soma = 0;
						var result = 0;
						if(typeof names === "object") {
							var length = Number(Object.keys(names).length);
						} else {
							return;
						}
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
						media[num][key] = result;
					}
				}
			}
		});
		res.render("boletim", {media: media, materias: materias});
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;