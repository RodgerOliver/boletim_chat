var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var bimestreSchema = new Schema({
	ordem: Number,
	materias: {
		edfisica: Object,
		matematica: Object,
		biologia: Object,
		fisica: Object,
		quimica: Object,
		historia: Object,
		geografia: Object,
		espanhol: Object,
		ingles: Object,
		filosofia: Object,
		sociologia: Object,
		pt: Object,
		religiao: Object,
		atualidades: Object,
		ov: Object,
		literatura: Object,
		gramatica: Object,
		redacao: Object
	}
});

module.exports = mongoose.model("Bimestre", bimestreSchema);