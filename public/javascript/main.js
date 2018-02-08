$("input[type=number]").each(function() {

	// do this to start the page with the results
	mudarCor.call($(this));
	calcNotas.call($(this));
	// on change do that thing above again
	$(this).on("keyup change", mudarCor);
	$(this).on("keyup change", calcNotas);

});

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

function calcNotas() {

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
					result = result.toFixed(1);
					$("td#" + inputClass + "-result").text(result);
				}
		});

	} else {
		$("td#" + inputClass + "-result").text("Inválido");
		$(this).removeClass("low");
		$(this).removeClass("high");
	}
}