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
	res.render("boletim");
});

router.post("/salvar", function(req, res) {
	res.send(req.body);
});

module.exports = router;