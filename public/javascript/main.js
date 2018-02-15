$("input[type=number]").each(function() {

	// do this to start the page with the results
	mudarCor.call($(this));
	calcMedia.call($(this));
	// on change do that thing above again
	$(this).on("keyup change ", mudarCor);
	$(this).on("keyup change ", calcMedia);

});
$("#bimestre").change(changeNotas);

function mudarCor() {
	// red below 6, green if 10
	var value = Number($(this).val());
	if(value < 6 || value === 0) {
		$(this).removeClass("high");
		$(this).addClass("low");
	} else if(value === 10) {
		$(this).removeClass("low");
		$(this).addClass("high");
	} else {
		$(this).removeClass("low");
		$(this).removeClass("high");
	}
}

function calcMedia() {

	var soma = 0;
	var inputClass = $(this).attr("class").replace(/\s.*/, "");
	var length = Number($("input." + inputClass).length);
	var inputKeyClicked = $(this).attr("name").match(/\[.*\]/)[0];

	if($(this).val() !== "" && Number($(this).val()) <= 10) {
		$("input." + inputClass).each(function() {
			var inputKey = $(this).attr("name").match(/\[.*\]/)[0];
			var value = Number($(this).val());
				if(inputKey === "[av1]" || inputKey === "[av2]") {
					var recInput = $("input." + inputClass + ".rec");
					if(Number(recInput.val()) > Number($(this).val())) {
						soma += Number(recInput.val());
					} else {
						soma += Number($(this).val());
					}
				} else {
					soma += Number($(this).val());
				}
				if(inputKey === "[rec]") {
					soma -= Number($(this).val());
					var result = soma/($("input." + inputClass).length - 1);
					result = Math.floor(result * 10)/10;
					result = result.toFixed(1);
					$("td#" + inputClass + "-result").text(result);
				}
		});

	} else {
		$("td#" + inputClass + "-result").text("-");
		$(this).removeClass("low");
		$(this).removeClass("high");
	}
}

function changeNotas() {
	$.ajax("/bimestres.json?bim=" + $("#bimestre").val()).done(function(bimestre) {
		if (Number(Object.keys(bimestre).length)){
			for(var materia in bimestre) {
				for(var nome in bimestre[materia]) {
					var input = $("td input." + materia + "[name='" + materia + "[" + nome + "]" + "']");
					var newVal = bimestre[materia][nome];
					input.val(newVal);
					$("input[type=number]").each(function() {
						mudarCor.call($(this));
						calcMedia.call($(this));
					});
				}
			}
		} else {
			$("input[type=number]").each(function() {
				$(this).val("");
				mudarCor.call($(this));
				calcMedia.call($(this));
			});		
		}
	});
}