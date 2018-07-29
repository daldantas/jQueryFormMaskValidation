/*!
 * jQuery CPF/CNPJ Validator Plugin v1.1.2
 * Developed by: Guilherme Gomes (gmgomess@gmail.com)
 * Date: 2018-06-04
 */
(function ($) {
    var type = null;

    $.fn.cpfcnpj = function (options) {
        // Default settings
        var settings = $.extend({
            mask: false,
            validate: 'cpfcnpj',
            event: 'focusout',
            handler: $(this),
            ifValid: null,
            ifInvalid: null
        }, options);

        if (settings.mask) {
            if (jQuery().mask == null) {
                settings.mask = false;
                console.log("jQuery mask not found.");
            }
            else {
                var ctrl = $(this);
                if (settings.validate == 'cpf') {
                    ctrl.mask('000.000.000-00');
                }
                else if (settings.validate == 'cnpj') {
                    ctrl.mask('00.000.000/0000-00');
                }
                else {
                    var msk = '000.000.000-009';
                    var opt = {
                        onKeyPress: function (field) {
                            var masks = ['000.000.000-009', '00.000.000/0000-00'];
                            msk = (field.length > 14) ? masks[1] : masks[0];
                            ctrl.mask(msk, opt);
                        }
                    };
                    ctrl.mask(msk, opt);
                }
            }
        }

        return this.each(function () {
            var valid = null;
            var control = $(this);

            $(document).on(settings.event, settings.handler,
               function () {
                   if (control.val().length == 14 || control.val().length == 18) {
                       if (settings.validate == 'cpf') {
                           valid = validate_cpf(control.val());
                       }
                       else if (settings.validate == 'cnpj') {
                           valid = validate_cnpj(control.val())
                       }
                       else if (settings.validate == 'cpfcnpj') {
                           if (validate_cpf(control.val())) {
                               valid = true;
                               type = 'cpf';
                           }
                           else if (validate_cnpj(control.val())) {
                               valid = true;
                               type = 'cnpj';
                           }
                           else valid = false;
                       }
                   }
                   else valid = false;

                   if ($.isFunction(settings.ifValid)) {
                       if (valid != null && valid) {
                           if ($.isFunction(settings.ifValid)) {
                               var callbacks = $.Callbacks();
                               callbacks.add(settings.ifValid);
                               callbacks.fire(control);
                           }
                       }
                       else if ($.isFunction(settings.ifInvalid)) {
                           settings.ifInvalid(control);
                       }
                   }
               });
        });
    }

    function validate_cnpj(val) {

        if (val.match(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/) != null) {
            var val1 = val.substring(0, 2);
            var val2 = val.substring(3, 6);
            var val3 = val.substring(7, 10);
            var val4 = val.substring(11, 15);
            var val5 = val.substring(16, 18);

            var i;
            var number;
            var result = true;

            number = (val1 + val2 + val3 + val4 + val5);

            s = number;

            c = s.substr(0, 12);
            var dv = s.substr(12, 2);
            var d1 = 0;

            for (i = 0; i < 12; i++)
                d1 += c.charAt(11 - i) * (2 + (i % 8));

            if (d1 == 0)
                result = false;

            d1 = 11 - (d1 % 11);

            if (d1 > 9) d1 = 0;

            if (dv.charAt(0) != d1)
                result = false;

            d1 *= 2;
            for (i = 0; i < 12; i++) {
                d1 += c.charAt(11 - i) * (2 + ((i + 1) % 8));
            }

            d1 = 11 - (d1 % 11);
            if (d1 > 9) d1 = 0;

            if (dv.charAt(1) != d1)
                result = false;

            return result;
        }
        return false;
    }

    function validate_cpf(val) {
        if (val.match(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/) != null) {
            //check all same numbers
            if (val.match(/\b(.+).*(\1.*){10,}\b/g) != null)
                return false;

            var strCPF = val.replace(/\D/g,'');
            var sum;
            var rest;
            sum = 0;
            
            for (i=1; i<=9; i++) 
                sum = sum + parseInt(strCPF.substring(i-1, i)) * (11 - i);
            
            rest = (sum * 10) % 11;
            
            if ((rest == 10) || (rest == 11))
                rest = 0;
            
            if (rest != parseInt(strCPF.substring(9, 10)) )
                return false;
            
            sum = 0;
            for (i = 1; i <= 10; i++) 
                sum = sum + parseInt(strCPF.substring(i-1, i)) * (12 - i);
            
            rest = (sum * 10) % 11;
            
            if ((rest == 10) || (rest == 11))
                rest = 0;
            if (rest != parseInt(strCPF.substring(10, 11) ) )
                return false;
            
            return true;
        }

        return false;
    }
}(jQuery));