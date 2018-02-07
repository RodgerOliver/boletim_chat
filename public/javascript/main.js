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
	var control = true;

	if($(this).val() !== "" && control) {
		$("." + inputClass).each(function() {
			var value = Number($(this).val());

			if(value <= 10 || value === 0) {
				soma += value;
			} else {
				$("#" + inputClass + "-result").text("Inválido");
				control = false;
			}

			if(control) {
				var result = soma/$("." + inputClass).length;
				$("#" + inputClass + "-result").text(result);
			}
		});

	} else {
		$("#" + inputClass + "-result").text("Inválido");
		$(this).removeClass("low");
		$(this).removeClass("high");
	}
}