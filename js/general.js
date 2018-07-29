jQuery.validator.addMethod("iniciaComArroba", function(value, element) {
	if (value.indexOf("@") == 0) {
		return true
	}else {
		return false
	}
}, "Arroba no início é requerida.")


$(document).ready(function() {
	// MASK
	$("#cpfCnpj").keypress(function(){
		if ($(this).val().length <= 14) {
			$("#cpfCnpj").mask("000.000.000-009")
			$("#cpfCnpj").attr("name", "cpf")
		}else {
			$("#cpfCnpj").mask("00.000.000/0000-00")
			$("#cpfCnpj").attr("name", "cnpj")
		}	
    });

	$('#cpfCnpj').cpfcnpj({ 
		mask: false, 
		validate: 'cpfcnpj', 
		event: 'focusout', 
		handler: '#cpfCnpj', 
		ifValid: function(input) {
			input.removeClass("error");
			$("#cpfCnpjHelp").addClass("invisible");
		}, 
		ifInvalid: function(input) { 
			input.addClass("error");
			$("#cpfCnpjHelp").removeClass("invisible");
			input.focus();
		}
	});
	$("#celular").keyup(function(){
		var len = $(this).val().length
		if (len <= 14) {
			$(this).mask("(00) 0000-00009")
		}
		else if (len > 14) {
			$(this).mask("(00) 00000-0000")
		}
	});
	
	var Opt = {
		translation: {
			"U": {pattern: /[A-Z]/}, // U = Uppercase
			"L": {pattern: /[a-z]/}, // L = Lowercase
			"M": {pattern: /[a-zA-Z0-9]/} // M = MIX
		}
	}

	$("#codigo").mask("UM-LM-0M", Opt);

	// VALIDATE

	$("#cadastro").validate({
		rules: {
			nome: {
				required: true,
				maxlength: 100,
				minlength: 10
			},
			email: {
				required: true,
				email: true
			},
			data_nasc: {
				required: true,
			},
			instagran: {
				required: true,
				iniciaComArroba: true
			},
			cpf: {
				required: true,
				minlength: 14,
				maxlength:14
			},
			cnpj: {
				required: true,
				minlength: 18,
				maxlength:18
			},
			celular: {
				required: true,
				minlength: 14,
				maxlength: 15
			},
			codigo: {
				required: true,
				minlength: 8,
				maxlength: 8
			}
		},

	})
});