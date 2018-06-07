/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2017, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.0.0
 * ---------------------------------------------------------------------------- */

window.FrontendBookApi = window.FrontendBookApi || {};

/**
 * Frontend Book API
 *
 * This module serves as the API consumer for the booking wizard of the app.
 *
 * @module FrontendBookApi
 */
(function(exports) {

    'use strict';

    var unavailableDatesBackup;
    var selectedDateStringBackup;
    var processingUnavailabilities = false;

    /**
     * Get Available Hours
     *
     * This function makes an AJAX call and returns the available hours for the selected service,
     * provider and date.
     *
     * @param {String} selDate The selected date of which the available hours we need to receive.
     */
    exports.getAvailableHours = function(selDate) {

        // Find the selected service duration (it is going to be send within the "postData" object).
        var selServiceDuration = 15; // Default value of duration (in minutes).
        $.each(GlobalVariables.availableServices, function(index, service) {
            if (service['id'] == $('#select-service').val()) {
                selServiceDuration = service['duration'];
            }
        });

        // If the manage mode is true then the appointment's start date should return as available too.
        var appointmentId = FrontendBook.manageMode ? GlobalVariables.appointmentData['id'] : undefined;

        // Make ajax post request and get the available hours.
        var postUrl = GlobalVariables.baseUrl + '/index.php/appointments/ajax_get_available_hours';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            service_id: $('#select-service').val(),
            provider_id: $('#select-provider').val(),
            selected_date: selDate,
            service_duration: selServiceDuration,
            manage_mode: FrontendBook.manageMode,
            appointment_id: appointmentId
        };

        $.post(postUrl, postData, function(response) {
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
 
			$(".ui-datepicker").css("opacity", "1");
			$("#wait").css("display", "none");
			
			var time_format;
			time_format = GlobalVariables.timeFormat;
            // The response contains the available hours for the selected provider and
            // service. Fill the available hours div with response data.
            if (response.length > 0) {
                var currColumn = 1;
				//AM/PM Time Change Mod 1 Craig Tucker start
				if (time_format == '24HR') {
					$('#available-hours').html('<div style="width:50px; display: inline-block; vertical-align:top;"></div>');
				}else{
					$('#available-hours').html('<div style="width:80px; display: inline-block; vertical-align:top;"></div>');
				}
				//AM/PM Time Change Mod 1 Craig Tucker end

                $.each(response, function(index, availableHour) {
                    if ((currColumn * 10) < (index + 1)) {
                        currColumn++;
						//AM/PM Time Change Mod 2 Craig Tucker start
						if (time_format == '24HR') {
                        	$('#available-hours').append('<div style="width:50px; display: inline-block; vertical-align:top;"></div>');
						}else{
							$('#available-hours').append('<div style="width:80px; display: inline-block; vertical-align:top;"></div>');
						}
						//AM/PM Time Change Mod 2 Craig Tucker end
                    }

                    $('#available-hours div:eq(' + (currColumn - 1) + ')').append(
                            '<span class="available-hour">' + availableHour + '</span><br/>');
                });

                if (FrontendBook.manageMode) {
                    // Set the appointment's start time as the default selection.
                    $('.available-hour').removeClass('selected-hour');
                    $('.available-hour').filter(function() {
                        return $(this).text() === Date.parseExact(
                                GlobalVariables.appointmentData['start_datetime'],
                                'yyyy-MM-dd HH:mm:ss').toString('HH:mm');
                    }).addClass('selected-hour');
                } else {
                    // Set the first available hour as the default selection.
                    $('.available-hour:eq(0)').addClass('selected-hour');
                }

                FrontendBook.updateConfirmFrame();

            } else {
                $('#available-hours').text(EALang['no_available_hours']);
            }
        }, 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };

    /**
     * Register an appointment to the database.
     *
     * This method will make an ajax call to the appointments controller that will register
     * the appointment to the database.
     */
    exports.registerAppointment = function() {
        var $captchaText = $('.captcha-text');

        if ($captchaText.length > 0) {
            $captchaText.css('border', '');
            if ($captchaText.val() === '') {
                $captchaText.css('border', '1px solid #dc3b40');
                return;
            }
        }

        var formData = jQuery.parseJSON($('input[name="post_data"]').val());
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            post_data: formData
        };

        if ($captchaText.length > 0) {
            postData.captcha = $captchaText.val();
        }

        if (GlobalVariables.manageMode) {
            postData.exclude_appointment_id = GlobalVariables.appointmentData.id;
        }

        var postUrl = GlobalVariables.baseUrl + '/index.php/appointments/ajax_register_appointment';
        var $layer = $('<div/>');

        $.ajax({
            url: postUrl,
            method: 'post',
            data: postData,
            dataType: 'json',
            beforeSend: function(jqxhr, settings) {
                $layer
                    .appendTo('body')
                    .css({
                        background: 'white',
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        height: '100vh',
                        width: '100vw',
                        opacity: '0.5'
                    });
            }
        })
            .done(function(response) {
                if (!GeneralFunctions.handleAjaxExceptions(response)) {
                    $('.captcha-title small').trigger('click');
                    return false;
                }

                if (response.captcha_verification === false) {
                    $('#captcha-hint')
                        .text(EALang['captcha_is_wrong'] + '(' + response.expected_phrase + ')')
                        .fadeTo(400, 1);

                    setTimeout(function() {
                        $('#captcha-hint').fadeTo(400, 0);
                    }, 3000);

                    $('.captcha-title small').trigger('click');

                    $captchaText.css('border', '1px solid #dc3b40');

                    return false;
                }
				
				if (( GlobalVariables.wpInvoice ==='yes' ) && (!GlobalVariables.manageMode)){
					var selServiceId = $('#select-service').val();
					$('.frame-container').hide(); //Paypal modification C. Tucker
					$('.command-buttons').hide(); 
					$("#paypalprocessing").show();
					
					function wpDir(the_url)
					{
						var the_arr = the_url.split('/');
						the_arr.pop();
						return( the_arr.join('/') );
					}

					var newdir = wpDir(GlobalVariables.baseUrl) + '/processingpayment/';
					window.location.replace(newdir);
					
				} else {
					window.location.replace(GlobalVariables.baseUrl
						+ '/index.php/appointments/book_success/' + response.appointment_id);
				} 
            })
            .fail(function(jqxhr, textStatus, errorThrown) {
                $('.captcha-title small').trigger('click');
                GeneralFunctions.ajaxFailureHandler(jqxhr, textStatus, errorThrown);
            })
            .always(function() {
                $layer.remove();
            });
    };
	
	//Waiting list post Craig Tucker start
    exports.registerWaiting = function() {
		
		var postWaiting = new Object();
		var note = '';
		var lang = '';
		

		if($('#cell-carrier2').val() !== "" && $('#phone-number2').val() !== ""){
			lang = EALang['user_lang'];
			note = $('#email2').val()  + ";" + $('#phone-number2').val().replace(/[^\d\+]/g,"") + $('#cell-carrier2').val() + ";";
		} else {
			lang = EALang['user_lang'];
			note = $('#email2').val() + ";";
		}
		
		postWaiting['appointment'] = {
		'id_users_provider': $('#select-provider').val(),
		'id_services': $('#select-service').val(),
		'notes': note,
		'lang': lang,
		};
		
		$('input[name="csrfToken"]').val(GlobalVariables.csrfToken);
		$('input[name="post_waiting"]').val(JSON.stringify(postWaiting));		
		
		var formData = jQuery.parseJSON($('input[name="post_waiting"]').val());

		var postData = {
			'csrfToken': GlobalVariables.csrfToken,
			'post_data': formData,
		};

		var postUrl = GlobalVariables.baseUrl + '/index.php/appointments/ajax_register_waiting'; 
		var $layer = $('<div/>');

		$.ajax({
			url: postUrl,
			method: 'post',
			data: postData,
			beforeSend: function(jqxhr, settings) {
				$layer
					.appendTo('body')
					.css({
						'background': 'white',
						'position': 'fixed',
						'top': '0',
						'left': '0',
						'height': '100vh',
						'width': '100vw',
						'opacity': '0.5'
					});
			}
		})
		.done(function(response) {
			if (!GeneralFunctions.handleAjaxExceptions(response)) {
				return false;
			}
			window.location.replace(GlobalVariables.baseUrl
				+ '/index.php/appointments/book_waiting');
		})
		.fail(function(jqxhr, textStatus, errorThrown) {
			GeneralFunctions.ajaxFailureHandler(jqxhr, textStatus, errorThrown);
		})
		.always(function() {
			$layer.remove();
		})
	};
	//Waiting list post Craig Tucker end
	
	
    /**
     * Get the unavailable dates of a provider.
     *
     * This method will fetch the unavailable dates of the selected provider and service and then it will
     * select the first available date (if any). It uses the "FrontendBookApi.getAvailableHours" method to
     * fetch the appointment* hours of the selected date.
     *
     * @param {Number} providerId The selected provider ID.
     * @param {Number} serviceId The selected service ID.
     * @param {String} selectedDateString Y-m-d value of the selected date.
     */
    exports.getUnavailableDates = function(providerId, serviceId, selectedDateString) {
        if (processingUnavailabilities) {
            return;
        }
		$('#available-hours').empty();
		$("#wait").css("display", "block");
		$(".ui-datepicker").css("opacity", ".2");
		
		var max_date;
		max_date = GlobalVariables.maxDate; //MaxDate mod Craig Tucker 1

        var url = GlobalVariables.baseUrl + '/index.php/appointments/ajax_get_unavailable_dates';
        var data = {
			max_date: max_date, /*MaxDate mod Craig Tucker*/		
            provider_id: providerId,
            service_id: serviceId,
            selected_date: encodeURIComponent(selectedDateString),
            csrfToken: GlobalVariables.csrfToken
        };

        $.ajax({
            url: url,
            type: 'GET',
            data: data,
            dataType: 'json'
        })
            .done(function(response) {
                unavailableDatesBackup = response;
                selectedDateStringBackup = selectedDateString;
                _applyUnavailableDates(response, selectedDateString, true);
				
            })

			.fail(GeneralFunctions.ajaxFailureHandler);
			
    };
    exports.applyPreviousUnavailableDates = function() {
        _applyUnavailableDates(unavailableDatesBackup, selectedDateStringBackup);
    };

    function _applyUnavailableDates(unavailableDates, selectedDateString, setDate) {
        setDate = setDate || false;

        processingUnavailabilities = true;

        // Select first enabled date.
        var selectedDate = Date.parse(selectedDateString);
        var numberOfDays = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

        if (setDate) {
            for (var i=1; i<=numberOfDays; i++) {
                var currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
                if (unavailableDates.indexOf(currentDate.toString('yyyy-MM-dd')) === -1) {
                    $('#select-date').datepicker('setDate', currentDate);
                    FrontendBookApi.getAvailableHours(currentDate.toString('yyyy-MM-dd'));
                    break;
                }
            }
        }

        // If all the days are unavailable then hide the appointments hours.
        if (unavailableDates.length === numberOfDays) {
            $('#available-hours').text(EALang['no_available_hours']);
			$(".ui-datepicker").css("opacity", "1");
			$("#wait").css("display", "none");
        }

        // Grey out unavailable dates.
        $('#select-date .ui-datepicker-calendar td:not(.ui-datepicker-other-month)').each(function(index, td) {
            selectedDate.set({day: index + 1});
            if ($.inArray(selectedDate.toString('yyyy-MM-dd'), unavailableDates) != -1) {
                $(td).addClass('ui-datepicker-unselectable ui-state-disabled');
            }
        });

        processingUnavailabilities = false;
    }
})(window.FrontendBookApi);