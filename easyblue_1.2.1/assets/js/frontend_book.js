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

window.FrontendBook = window.FrontendBook || {};

/**
 * Frontend Book
 *
 * This module contains functions that implement the book appointment page functionality. Once the
 * initialize() method is called the page is fully functional and can serve the appointment booking
 * process.
 *
 * @module FrontendBook
 */
(function(exports) {

    'use strict';

    /**
     * Determines the functionality of the page.
     *
     * @type {Boolean}
     */
    exports.manageMode = false;
	
    /**
     * This method initializes the book appointment page.
     *
     * @param {Boolean} bindEventHandlers (OPTIONAL) Determines whether the default
     * event handlers will be bound to the dom elements.
     * @param {Boolean} manageMode (OPTIONAL) Determines whether the customer is going
     * to make  changes to an existing appointment rather than booking a new one.
     */
    exports.initialize = function(bindEventHandlers, manageMode) {
        bindEventHandlers = bindEventHandlers || true;
        manageMode = manageMode || false;

        if (window.console === undefined) {
            window.console = function() {}; // IE compatibility
        }

        FrontendBook.manageMode = manageMode;

        // Initialize page's components (tooltips, datepickers etc).
        $('.book-step').qtip({
            position: {
                my: 'top center',
                at: 'bottom center'
            },
            style: {
                classes: 'qtip-green qtip-shadow custom-qtip'
            }
        });
		
		var show_free_price_currency;
        show_free_price_currency = GlobalVariables.showFreePriceCurrency;
		
		//Notice that no appointments are available on the date selected Craig Tucker start
		$('#select-date').on('click', function(){ 
			$('#available-hours').text(EALang['no_available_hours']);
		});
		//Notice that no appointments are available on the date selected Craig Tucker end

		var max_date;
		max_date = GlobalVariables.maxDate; //MaxDate mod Craig Tucker 1
		
		var show_any_provider;
		show_any_provider = GlobalVariables.showAnyProvider;

		var fDaynum;
		var fDay = GlobalVariables.weekStartson;

		switch(fDay) {
			case "sunday":
				fDaynum = 0;
				break;
			case "monday":
				fDaynum = 1;
				break;
			case "tuesday":
				fDaynum = 2;
				break;
			case "wednesday":
				fDaynum = 3;
				break;
			case "thursday":
				fDaynum = 4;
				break;
			case "friday":
				fDaynum = 5;
				break;
			case "saturday":
				fDaynum = 6;
				break;
			default:
				fDaynum = 0;
				break;
		}
		console.log('NZ-frontend_book.js -> fDaynum ' + fDaynum + ' fDay ' + fDay + ' maxDate ' + max_date + ' ShowFreePriceCurrency ' + show_free_price_currency + ' ShowAnyProvider ' + show_any_provider);
        $('#select-date').datepicker({
            dateFormat: 'dd-mm-yy',
            firstDay: fDaynum, // Monday
            minDate: 0,
			maxDate: "+" + max_date + "d", //MaxDate mod Craig Tucker 2
            defaultDate: Date.today(),

            dayNames: [
                    EALang['sunday'], EALang['monday'], EALang['tuesday'], EALang['wednesday'],
                    EALang['thursday'], EALang['friday'], EALang['saturday']],
            dayNamesShort: [EALang['sunday'].substr(0,3), EALang['monday'].substr(0,3),
                    EALang['tuesday'].substr(0,3), EALang['wednesday'].substr(0,3),
                    EALang['thursday'].substr(0,3), EALang['friday'].substr(0,3),
                    EALang['saturday'].substr(0,3)],
            dayNamesMin: [EALang['sunday'].substr(0,2), EALang['monday'].substr(0,2),
                    EALang['tuesday'].substr(0,2), EALang['wednesday'].substr(0,2),
                    EALang['thursday'].substr(0,2), EALang['friday'].substr(0,2),
                    EALang['saturday'].substr(0,2)],
            monthNames: [EALang['january'], EALang['february'], EALang['march'], EALang['april'],
                    EALang['may'], EALang['june'], EALang['july'], EALang['august'], EALang['september'],
                    EALang['october'], EALang['november'], EALang['december']],
            prevText: EALang['previous'],
            nextText: EALang['next'],
            currentText: EALang['now'],
            closeText: EALang['close'],

            onSelect: function(dateText, instance) {
                FrontendBookApi.getAvailableHours(dateText);
                FrontendBook.updateConfirmFrame();
            },

            onChangeMonthYear: function(year, month, instance) {
                var currentDate = new Date(year, month - 1, 1);
				
                FrontendBookApi.getUnavailableDates($('#select-provider').val(), $('#select-service').val(),
                        currentDate.toString('yyyy-MM-dd'));
						
            }
        });

        // Bind the event handlers (might not be necessary every time we use this class).
        if (bindEventHandlers) {
            _bindEventHandlers();
        }

        // If the manage mode is true, the appointments data should be loaded by default.
        if (FrontendBook.manageMode) {
            _applyAppointmentData(GlobalVariables.appointmentData,
                    GlobalVariables.providerData, GlobalVariables.customerData);
        } else {
            var $selectProvider = $('#select-provider');
            var $selectService = $('#select-service'); 

            // Check if a specific service was selected (via URL parameter).
            var selectedServiceId = GeneralFunctions.getUrlParameter(location.href, 'service');

            if (selectedServiceId && $selectService.find('option[value="' + selectedServiceId + '"]').length > 0) {
                $selectService
                    .val(selectedServiceId)
                    .prop('disabled', true)
                    .css('opacity', '0.5');
            }

            $selectService.trigger('change'); // Load the available hours.

            // Check if a specific provider was selected. 
            var selectedProviderId = GeneralFunctions.getUrlParameter(location.href, 'provider');
            
            if (selectedProviderId && $selectProvider.find('option[value="' + selectedProviderId + '"]').length === 0) {
                // Select a service of this provider in order to make the provider available in the select box. 
                for (var index in GlobalVariables.availableProviders) {
                    var provider = GlobalVariables.availableProviders[index]; 

                    if (provider.id === selectedProviderId && provider.services.length > 0) {
                        $selectService
                            .val(provider.services[0])
                            .trigger('change');
                    }
                }
            }

            if (selectedProviderId && $selectProvider.find('option[value="' + selectedProviderId + '"]').length > 0) {
                $selectProvider
                    .val(selectedProviderId)
                    .prop('disabled', true)
                    .css('opacity', '0.5')
                    .trigger('change');
            }

        }
    };

    /**
     * This method binds the necessary event handlers for the book appointments page.
     */
    function _bindEventHandlers() {

        /**
         * Event: Selected Provider "Changed"
         *
         * Whenever the provider changes the available appointment date - time periods must be updated.
         */
        $('#select-provider').change(function() {
			FrontendBook.googleSync(); //Craig Tucker googleSync mod 1
            FrontendBookApi.getUnavailableDates($(this).val(), $('#select-service').val(),
                    $('#select-date').datepicker('getDate').toString('yyyy-MM-dd'));
            FrontendBook.updateConfirmFrame();
        });

        /**
         * Event: Selected Service "Changed"
         *
         * When the user clicks on a service, its available providers should
         * become visible.
         */
        $('#select-service').change(function() {
            var currServiceId = $('#select-service').val();
            $('#select-provider').empty();

            $.each(GlobalVariables.availableProviders, function(indexProvider, provider) {
                $.each(provider['services'], function(indexService, serviceId) {
                    // If the current provider is able to provide the selected service,
                    // add him to the listbox.
                    if (serviceId == currServiceId) {
                        var optionHtml = '<option value="' + provider['id'] + '">'
                                + provider['first_name']  + ' ' + provider['last_name']
                                + '</option>';
                        $('#select-provider').append(optionHtml);
                    }
                });
            });

            // Add the "Any Provider" entry.
			//Tucker  Changed to stop showing "Any Provider" set it back to 1 for default behavior
			var show_any_provider;
			show_any_provider = GlobalVariables.showAnyProvider;

			if (show_any_provider == 'yes'){
				if ($('#select-provider option').length >= 1) {
					$('#select-provider').append(new Option('- ' +EALang['any_provider'] + ' -', 'any-provider'));
				}	
            }

			FrontendBook.googleSync(); //Craig Tucker googleSync mod 2
            FrontendBookApi.getUnavailableDates($('#select-provider').val(), $(this).val(),
                    $('#select-date').datepicker('getDate').toString('yyyy-MM-dd'));
            FrontendBook.updateConfirmFrame();
             _updateServiceDescription($('#select-service').val(), $('#service-description'));
        });

		//Waiting List Functions start
		//Craig Tucker, craigtuckerlcsw@gmail.com
		function validateWaitinglistEmail() {
  			if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($('#email2').val()))  
			{  
				return (true)  
			}  
			    $('.alert').text(EALang['waiting_list_valid_email']);
                $('.alert').addClass('alert-danger');
                $('.alert').show();				
				//alert(EALang['waiting_list_valid_email'])  
				return (false)
		}

		function validateWaitinglistPhone() {
			if(($('#phone-number2').val() == "") || (/^[\(\)\s\-\+\d]{10,17}$/.test($('#phone-number2').val())))  
			{  
				return (true)
			} 
				$('.alert').text(EALang['waiting_list_valid_phone']);
                $('.alert').addClass('alert-danger');
                $('.alert').show();	
				//alert(EALang['waiting_list_valid_phone'])  
				return (false)  
		}  				

		function validateWaitinglistCarrier() {
			if($('#cell-carrier2').val() || $('#phone-number2').val() == "") 
			{  
				return (true)
			}
				$('.alert').text(EALang['waiting_list_valid_carrier']);
                $('.alert').addClass('alert-danger');
                $('.alert').show();			
				//alert(EALang['waiting_list_valid_carrier'])  
				return (false)  
		} 
		
		/**
         * Event: Waitinglist Button "Clicked"
         */
        $('#insert-waitinglist').click(function() {
            var $dialog = $('#manage-waitinglist');
            $dialog.modal('show');
        });
		
		/**
		 * Event: Waiting Save Button "Click"
		 * Stores the waiting list information.
		 */

		// process the form
		$('#save-waitinglist').click(function(event) { 
		if(validateWaitinglistEmail() && validateWaitinglistPhone() && validateWaitinglistCarrier()){
				
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

				FrontendBookApi.registerWaiting();

			}
		});
		//Waiting List Functions end

		/**
         * Event: Authorization Button "Clicked"
         */
		 
        $('#insert-authorization').click(function() {
			if (!_validateCustomerForm()) {
				return; // Validation failed, do not continue.
			} else {			
				var $dialog = $('#manage-authorization');
				$dialog.modal('show');
				$('.modal-content').css('display','block');
				
				var myVar = setInterval(myClassFunction, 300);

				function myClassFunction() {
					$('#conf-notice').hasClass('required');
				};
			}
        });
		
		
        /**
         * Event: Next Step Button "Clicked"
         *
         * This handler is triggered every time the user pressed the "next" button on the book wizard.
         * Some special tasks might be performed, depending the current wizard step.
         */
        $('.button-next').click(function() {
            // If we are on the first step and there is not provider selected do not continue
            // with the next step.
            if ($(this).attr('data-step_index') === '1' && $('#select-provider').val() == null) {
                return;
            }

            // If we are on the 2nd tab then the user should have an appointment hour
            // selected.
            if ($(this).attr('data-step_index') === '2') {
                if ($('.selected-hour').length == 0) {
                    if ($('#select-hour-prompt').length == 0) {
                        $('#available-hours').append('<br><br>'
                                + '<span id="select-hour-prompt" class="text-danger">'
                                + EALang['appointment_hour_missing']
                                + '</span>');
                    }
                    return;
                }
            }

            // If we are on the 3rd tab then we will need to validate the user's
            // input before proceeding to the next step.
            if ($(this).attr('data-step_index') === '3') {
                if (!_validateCustomerForm()) {
                    return; // Validation failed, do not continue.
                } else {
					var $dialog = $('#manage-authorization');
                    FrontendBook.updateConfirmFrame();
					$dialog.modal('hide');
					$("#wizard-frame-3").hide();
                }
            }


            // Display the next step tab (uses jquery animation effect).
            var nextTabIndex = parseInt($(this).attr('data-step_index')) + 1;

            $(this).parents().eq(1).hide('fade', function() {
                $('.active-step').removeClass('active-step');
                $('#step-' + nextTabIndex).addClass('active-step');
                $('#wizard-frame-' + nextTabIndex).show('fade');
            });
        });

        /**
         * Event: Back Step Button "Clicked"
         *
         * This handler is triggered every time the user pressed the "back" button on the
         * book wizard.
         */
        $('.button-back').click(function() {
            var prevTabIndex = parseInt($(this).attr('data-step_index')) - 1;

            $(this).parents().eq(1).hide('fade', function() {
                $('.active-step').removeClass('active-step');
                $('#step-' + prevTabIndex).addClass('active-step');
                $('#wizard-frame-' + prevTabIndex).show('fade');
            });
        });

        /**
         * Event: Available Hour "Click"
         *
         * Triggered whenever the user clicks on an available hour
         * for his appointment.
         */
        $('#available-hours').on('click', '.available-hour', function() {
            $('.selected-hour').removeClass('selected-hour');
            $(this).addClass('selected-hour');
            FrontendBook.updateConfirmFrame();
        });

		
        if (FrontendBook.manageMode) {
            /**
             * Event: Cancel Appointment Button "Click"
             *
             * When the user clicks the "Cancel" button this form is going to be submitted. We need
             * the user to confirm this action because once the appointment is cancelled, it will be
             * deleted from the database.
             *
             * @param {jQuery.Event} event
             */
			 
            $('#cancel-appointment').click(function(event) {
                var dialogButtons = {};
                dialogButtons['OK'] = function() {
                    if ($('#cancel-reason').val() === '') {
                        $('#cancel-reason').css('border', '2px solid red');
                        return;
                    }
                    $('#cancel-appointment-form textarea').val($('#cancel-reason').val());
                    $('#cancel-appointment-form').submit();
                };
				//Craig Tucker has removed the pop up for cacelation infavor of a landing page with options.
                // dialogButtons[EALang['cancel']] = function() {
                    // $('#message_box').dialog('close');
                // };

                // GeneralFunctions.displayMessageBox(EALang['cancel_appointment_title'],
                        // EALang['write_appointment_removal_reason'], dialogButtons);

                // $('#message_box').append('<textarea id="cancel-reason" rows="3"></textarea>');
                // $('#cancel-reason').css('width', '100%');
                // return false;
				// end craig tucker edit.
            });
			
			
			$("#selectNew").click(function (event) {
				FrontendBook.manageMode = false;
				
				document.getElementById('cancel-appointment-frame').style.display = 'none';

				FrontendBookApi.getAvailableHours($('#select-date').val());// Load the available hours.
					// Apply Customer's Data
					$('#last-name').val(GlobalVariables.customerData['last_name']);
					$('#first-name').val(GlobalVariables.customerData['first_name']);
					$('#lang').val(EALang['user_lang']);
					$('#email').val(GlobalVariables.customerData['email']);
					$('#phone-number').val(GlobalVariables.customerData['phone_number']);
					$('#cell-carrier').val(GlobalVariables.customerData['id_cellcarrier']); //Craig Tucker Mod
					$('#wp-id').val(GlobalVariables.customerData['wp_id']); //Craig Tucker Mod
					$('#address').val(GlobalVariables.customerData['address']);
					$('#city').val(GlobalVariables.customerData['city']);
					$('#zip-code').val(GlobalVariables.customerData['zip_code']);
					$('#conf-notice').val(GlobalVariables.customerData['notifications']); //Craig Tucker Mod

					
				FrontendBook.updateConfirmFrame();

				var nextTabIndex = 1;	
				$(this).parents().eq(1).hide('fade', function() {    
					$('.active-step').removeClass('active-step');
					$('#step-' + nextTabIndex).addClass('active-step');
					$('#wizard-frame-' + nextTabIndex).show('fade');
				});			
			});			
		}


			// Mod cancel bar to new/modify/delete - start
			//Craig Tucker, craigtuckerlcsw@gmail
			
			
		// Mod cancel bar to new/modify/delete - end

        /**
         * Event: Book Appointment Form "Submit"
         *
         * Before the form is submitted to the server we need to make sure that
         * in the meantime the selected appointment date/time wasn't reserved by
         * another customer or event.
         *
         * @param {jQuery.Event} event
         */
        $('#book-appointment-submit').click(function(event) {
            FrontendBookApi.registerAppointment();
						
        });

        /**
         * Event: Refresh captcha image.
         *
         * @param {jQuery.Event} event
         */
        $('.captcha-title small').click(function(event) {
            $('.captcha-image').attr('src', GlobalVariables.baseUrl + '/index.php/captcha?' + Date.now());
        });

        $('#select-date').on('mousedown', '.ui-datepicker-calendar td', function(event) {
            setTimeout(function() {
                FrontendBookApi.applyPreviousUnavailableDates(); // New jQuery UI version will replace the td elements.
            }, 300); // There is no draw event unfortunately.
        })
    };

	//Google sync prior to viewing the calendar C. Tucker --Start	
	exports.googleSync = function() {
		var getUrl = GlobalVariables.baseUrl + '/index.php/google/sync/' + $('#select-provider').val();
		jQuery.get(getUrl,console.log('Google sync successful'),'json');
	}
	//Google sync prior to viewing the calendar C. Tucker --End	


    /**
     * This function validates the customer's data input. The user cannot continue
     * without passing all the validation checks.
     *
     * @return {Boolean} Returns the validation result.
     */
    function _validateCustomerForm() {
        $('#wizard-frame-3 input').css('border', '');

        try {
            // Validate required fields.
            var missingRequiredField = false;
            $('.required').each(function() {
                if ($(this).val() == '') {
                    $(this).parents('.form-group').addClass('has-error');
                    // $(this).css('border', '2px solid red');
                    missingRequiredField = true;
                }
            });
            if (missingRequiredField) {
                throw EALang['fields_are_required'];
            }

            // Validate email address.
            if (!GeneralFunctions.validateEmail($('#email').val())) {
                $('#email').parents('.form-group').addClass('has-error');
                // $('#email').css('border', '2px solid red');
                throw EALang['invalid_email'];
            } else { 
				$('#email').parents('.form-group').removeClass('has-error');
			}

			// Validate phone
            if (!GeneralFunctions.validatePhone($('#phone-number').val())) {
                $('#phone-number').parents('.form-group').addClass('has-error');
                // $('#phone').css('border', '2px solid red');
                throw EALang['waiting_list_valid_phone'];
            } else { 
				$('#phone-number').parents('.form-group').removeClass('has-error');
			}

			
            return true;
        } catch(exc) {
            $('#form-message').text(exc);
            return false;
        }
    }

    /**
     * Every time this function is executed, it updates the confirmation page with the latest
     * customer settings and input for the appointment booking.
     */
    exports.updateConfirmFrame = function() {
        // Appointment Details
        var selectedDate = $('#select-date').datepicker('getDate');
		var notices = GeneralFunctions.escapeHtml($('#conf-notice option:selected').text()); //mod Craig Tucker
        if (selectedDate !== null) {
            selectedDate = GeneralFunctions.formatDate(selectedDate, GlobalVariables.dateFormat);
        }

        var selServiceId = $('#select-service option:selected').val();
        var servicePrice;
        var serviceCurrency;
		var show_free_price_currency;
        show_free_price_currency = GlobalVariables.showFreePriceCurrency;
		if (GeneralFunctions.show_minimal_details == 'no'){
			var html = $('#select-service option:selected').text();
			$('#appointment-service').html(html);
		}
		
        $.each(GlobalVariables.availableServices, function(index, service) {
            if (service.id == selServiceId) {
                if (service.price != '' && service.price != null && service.price != 0) {
                   	servicePrice = '<br>' + service.price;
					serviceCurrency = service.currency;
					return false; // break loop
                } else {
					if (show_free_price_currency == 'yes') {
						servicePrice = '<br>' + service.price;
						serviceCurrency = service.currency;
						return false; // break loop
					}else{
						servicePrice = '';
						serviceCurrency = ''
						return false; // break loop
					}
                }
            }
        });

        var html =
            '<h4>' + $('#select-service option:selected').text() + '</h4>' +
            '<p>'
                + '<strong class="text-primary">'
                    + $('#select-provider option:selected').text() + '<br>'
                    + selectedDate + ' ' +  $('.selected-hour').text()
                    + servicePrice + ' ' + serviceCurrency
                + '</strong>' +
            '</p>';

		$('#appointment-details').html(html);
	
        var html2 =
            '<h4>' + $('#select-service option:selected').text() + '</h4>' +
            '<p>'
                + '<strong class="text-primary">'
                    + $('#select-provider option:selected').text() + '<br>'
                    + selectedDate + ' ' +  $('.selected-hour').text()
                    + servicePrice + ' ' + serviceCurrency + '</strong><br/>'
					+ '<b>' + EALang['notice_auth'] 
					+ ':</b> "<i>' + notices + '</i>"' +
				'</p>';
			
        $('#appointment-details2').html(html2);
		

        // Customer Details
        var firstName = GeneralFunctions.escapeHtml($('#first-name').val());
        var lastName = GeneralFunctions.escapeHtml($('#last-name').val());
        var phoneNumber = GeneralFunctions.escapeHtml($('#phone-number').val());
        var sms = GeneralFunctions.escapeHtml($('#cell-carrier option:selected').text());  //mod Bullmoose20
		var email = GeneralFunctions.escapeHtml($('#email').val());
        var address = GeneralFunctions.escapeHtml($('#address').val());
        var city = GeneralFunctions.escapeHtml($('#city').val());
        var zipCode = GeneralFunctions.escapeHtml($('#zip-code').val());
		var lang = EALang['user_lang'];
		var notes = GeneralFunctions.escapeHtml($('#notes').val());

        html =
            '<h4>' + firstName + ' ' + lastName + '</h4>' +
            '<p>' +
                //EALang['preferred_language'] + ': ' + lang +
                //'<br/>' +
                EALang['phone'] + ': ' + phoneNumber +
                '<br/>' +
                EALang['sms'] + ': ' + sms +
                '<br/>' +
                EALang['email'] + ': ' + email +
				'<br/>'+
				EALang['address'] + ': ' + address +
                '<br/>' +
                EALang['city'] + ': ' + city + '<br/>' +
                EALang['zip_code'] + ': ' + zipCode + 
                '<br/>' +
                EALang['notes'] + ': ' + notes +
            '</p>';			
			
        $('#customer-details').html(html);

        // Update appointment form data for submission to server when the user confirms
        // the appointment.
        var postData = {};

        postData['customer'] = {
		    id_cellcarrier: $('#cell-carrier').val(), //Craig Tucker Cell Modification 1
			wp_id: $('#wp-id').val(), //WP mod Craig Tucker 1
			notifications: $('#conf-notice').val(),  //mod Craig Tucker
            last_name: $('#last-name').val(),
            first_name: $('#first-name').val(),
			lang: $('#lang').val(),
			//lang: EALang['user_lang'],
            email: $('#email').val(),
            phone_number: $('#phone-number').val(),
            address: $('#address').val(),
            city: $('#city').val(),
            zip_code: $('#zip-code').val()
        };

			if (( GlobalVariables.wpInvoice ==='yes' ) && (!GlobalVariables.manageMode)){
									
				var optionValue = $('#select-service').val();	
				var paypalcbfid = "[wpi_checkout item='" + optionValue + GlobalVariables.seeAt + "' title='" + GlobalVariables.sessionId + "' callback_function='ea_paypalcallback']";				
				
			} else {
				paypalcbfid = '';				
			}

			    

			
        postData['appointment'] = {
            start_datetime: $('#select-date').datepicker('getDate').toString('yyyy-MM-dd')
		//AM/PM Modification 1 start
			//ORIGINAL         + ' ' + $('.selected-hour').text() + ':00',
            + ' ' + Date.parse((($('.selected-hour').text()) ? $('.selected-hour').text() : '00:00')).toString('HH:mm') + ':00',									
		//AM/PM Modification 1 end
		    end_datetime: _calcEndDatetime(),
            notes: $('#notes').val(),
            is_unavailable: false,
            id_users_provider: $('#select-provider').val(),
            id_services: $('#select-service').val(),
			pending: paypalcbfid
			
        };

        postData['manage_mode'] = FrontendBook.manageMode;

        if (FrontendBook.manageMode) {
            postData['appointment']['id'] = GlobalVariables.appointmentData['id'];
            postData['customer']['id'] = GlobalVariables.customerData['id'];
        }
        $('input[name="csrfToken"]').val(GlobalVariables.csrfToken);
        $('input[name="post_data"]').val(JSON.stringify(postData));
    };

    /**
     * This method calculates the end datetime of the current appointment.
     * End datetime is depending on the service and start datetime fields.
     *
     * @return {String} Returns the end datetime in string format.
     */
    function _calcEndDatetime() {
        // Find selected service duration.
        var selServiceDuration = undefined;

        $.each(GlobalVariables.availableServices, function(index, service) {
            if (service.id == $('#select-service').val()) {
                selServiceDuration = service.duration;
                return false; // Stop searching ...
            }
        });

        // Add the duration to the start datetime.
        var startDatetime = $('#select-date').datepicker('getDate').toString('dd-MM-yyyy')
		
		//AM/PM Modification 2 start
        //ORIGINAL        + ' ' + $('.selected-hour').text();
		+ ' ' + Date.parse((($('.selected-hour').text()) ?$('.selected-hour').text() : '00:00')).toString('HH:mm'),
		//AM/PM Modification 2 end
		
        startDatetime = Date.parseExact(startDatetime, 'dd-MM-yyyy HH:mm');
        var endDatetime = undefined;

        if (selServiceDuration !== undefined && startDatetime !== null) {
            endDatetime = startDatetime.add({ 'minutes' : parseInt(selServiceDuration) });
        } else {
            endDatetime = new Date();
        }

        return endDatetime.toString('yyyy-MM-dd HH:mm:ss');
    }

    /**
     * This method applies the appointment's data to the wizard so
     * that the user can start making changes on an existing record.
     *
     * @param {Object} appointment Selected appointment's data.
     * @param {Object} provider Selected provider's data.
     * @param {Object} customer Selected customer's data.
     *
     * @return {Boolean} Returns the operation result.
     */
    function _applyAppointmentData(appointment, provider, customer) {
        try {
            // Select Service & Provider
            $('#select-service').val(appointment['id_services']).trigger('change');
            $('#select-provider').val(appointment['id_users_provider']);

            // Set Appointment Date
            $('#select-date').datepicker('setDate',
                    Date.parseExact(appointment['start_datetime'], 'yyyy-MM-dd HH:mm:ss'));
            FrontendBookApi.getAvailableHours($('#select-date').val());

            // Apply Customer's Data
            $('#cell-carrier').val(customer['id_cellcarrier']); //Craig Tucker Cell Modification 2
			$('#wp-id').val(customer.wp_id); //WP mod Craig Tucker 2
			$('#conf-notice').val(customer['notifications']); //Craig Tucker -- client notification option.
            $('#last-name').val(customer['last_name']);
            $('#first-name').val(customer['first_name']);
			$('#lang').val(EALang['user_lang']);
            $('#email').val(customer['email']);
            $('#phone-number').val(customer['phone_number']);
            $('#address').val(customer['address']);
            $('#city').val(customer['city']);
            $('#zip-code').val(customer['zip_code']);
            var appointmentNotes = (appointment['notes'] !== null)
                    ? appointment['notes'] : '';
            $('#notes').val(appointmentNotes);

            FrontendBook.updateConfirmFrame();

            return true;
        } catch(exc) {
            return false;
        }
    }

    /**
     * This method updates a div's html content with a brief description of the
     * user selected service (only if available in db). This is useful for the
     * customers upon selecting the correct service.
     *
     * @param {Number} serviceId The selected service record id.
     * @param {Object} $div The destination div jquery object (e.g. provide $('#div-id')
     * object as value).
     */
    function _updateServiceDescription(serviceId, $div) {
        var html = '';
		var show_free_price_currency;
        show_free_price_currency = GlobalVariables.showFreePriceCurrency;
		
        $.each(GlobalVariables.availableServices, function(index, service) {
            if (service.id == serviceId) { // Just found the service.
                html = '<strong>' + service.name + ' </strong>';

                if (service.description != '' && service.description != null) {
                    html += '<br>' + service.description + '<br>';
                }

                if (service.duration != '' && service.duration != null) {
                    html += '[' + EALang['duration'] + ' ' + service.duration
                            + ' ' + EALang['minutes'] + '] ';
                }

                if (service.price != '' && service.price != null && service.price != 0) {
                   html += '[' + EALang['price'] + ' ' + service.price + ' ' + service.currency  + ']';
                } else {
					if (show_free_price_currency == 'yes') {
						html += '[' + EALang['price'] + ' ' + service.price + ' ' + service.currency  + ']';
					}else{
						html += '';
					}
                }

                html += '<br>';

                return false;
            }
        });

        $div.html(html);

        if (html != '') {
            $div.show();
        } else {
            $div.hide();
        }
    }

})(window.FrontendBook);
