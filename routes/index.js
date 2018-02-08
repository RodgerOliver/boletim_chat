var express		= require("express"),
	Bimestre	= require("../models/bimestre"),
	materias	= require("../models/materias"),
	router		= express.Router();

router.get("/", function(req, res) {
	res.redirect("/home");
});

router.get("/home", function(req, res) {
	res.render("home", {materias: materias});
});

router.get("/boletim", function(req, res) {

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

router.post("/salvar", function(req, res) {

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

module.exports = router;