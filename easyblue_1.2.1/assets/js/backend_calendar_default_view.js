/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2017, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.2.0
 * ---------------------------------------------------------------------------- */

/**
 * Backend Calendar
 *
 * This module implements the default calendar view of backend.
 *
 * @module BackendCalendarDefaultView
 */
window.BackendCalendarDefaultView = window.BackendCalendarDefaultView || {};

(function(exports) {

    'use strict';

    // Constants
    var FILTER_TYPE_PROVIDER =  'provider';
    var FILTER_TYPE_SERVICE = 'service';

    // Variables
    var lastFocusedEventData; // Contains event data for later use.

    /**
     * Bind event handlers for the calendar view. 
     */
    function _bindEventHandlers() {
        var $calendarPage = $('#calendar-page'); 

        /**
         * Event: Reload Button "Click"
         *
         * When the user clicks the reload button an the calendar items need to be refreshed.
         */
        $('#reload-appointments').click(function() {
            $('#select-filter-item').trigger('change');
        });

        /**
         * Event: Popover Close Button "Click"
         *
         * Hides the open popover element.
         */
        $calendarPage.on('click', '.close-popover', function() {
            $(this).parents().eq(2).remove();
        });

        /**
         * Event: Popover Edit Button "Click"
         *
         * Enables the edit dialog of the selected calendar event.
         */
        $calendarPage.on('click', '.edit-popover', function() {
            $(this).parents().eq(2).remove(); // Hide the popover

            var $dialog;

            if (lastFocusedEventData.data.is_unavailable == false) {
                var appointment = lastFocusedEventData.data;
                $dialog = $('#manage-appointment');

                BackendCalendarAppointmentsModal.resetAppointmentDialog();

                // Apply appointment data and show modal dialog.
                $dialog.find('.modal-header h3').text(EALang['edit_appointment_title']);
                $dialog.find('#appointment-id').val(appointment['id']);
                $dialog.find('#select-service').val(appointment['id_services']).trigger('change');
                $dialog.find('#select-provider').val(appointment['id_users_provider']);

                // Set the start and end datetime of the appointment.
                var startDatetime = Date.parseExact(appointment['start_datetime'],
                        'yyyy-MM-dd HH:mm:ss');
                $dialog.find('#start-datetime').datetimepicker('setDate', startDatetime);

                var endDatetime = Date.parseExact(appointment['end_datetime'],
                        'yyyy-MM-dd HH:mm:ss');
                $dialog.find('#end-datetime').datetimepicker('setDate', endDatetime);

                var customer = appointment['customer'];
                $dialog.find('#customer-id').val(appointment['id_users_customer']);
                $dialog.find('#first-name').val(customer['first_name']);
                $dialog.find('#last-name').val(customer['last_name']);
                $dialog.find('#email').val(customer['email']);
                $dialog.find('#phone-number').val(customer['phone_number']);
                $dialog.find('#address').val(customer['address']);
                $dialog.find('#city').val(customer['city']);
                $dialog.find('#zip-code').val(customer['zip_code']);
                $dialog.find('#appointment-notes').val(appointment['notes']);
                $dialog.find('#customer-notes').val(customer['notes']);
            } else {
                var unavailable = lastFocusedEventData.data;

                // Replace string date values with actual date objects.
                unavailable.start_datetime = GeneralFunctions.clone(lastFocusedEventData.start);
                unavailable.end_datetime = GeneralFunctions.clone(lastFocusedEventData.end);

                $dialog = $('#manage-unavailable');
                BackendCalendarUnavailabilitiesModal.resetUnavailableDialog();

                // Apply unavailable data to dialog.
                $dialog.find('.modal-header h3').text('Edit Unavailable Period');
                $dialog.find('#unavailable-start').datetimepicker('setDate', unavailable.start_datetime);
                $dialog.find('#unavailable-id').val(unavailable.id);
                $dialog.find('#unavailable-provider').val(unavailable.id_users_provider);
                $dialog.find('#unavailable-end').datetimepicker('setDate', unavailable.end_datetime);
                $dialog.find('#unavailable-notes').val(unavailable.notes);
            }

            // :: DISPLAY EDIT DIALOG
            $dialog.modal('show');
        });

        /**
         * Event: Popover Delete Button "Click"
         *
         * Displays a prompt on whether the user wants the appointment to be deleted. If he confirms the
         * deletion then an ajax call is made to the server and deletes the appointment from the database.
         */
        $calendarPage.on('click', '.delete-popover', function() {
            $(this).parents().eq(2).remove(); // Hide the popover

            if (lastFocusedEventData.data.is_unavailable == false) {
                var messageButtons = {};
                messageButtons['OK'] = function() {
                    var postUrl = GlobalVariables.baseUrl + '/index.php/backend_api/ajax_delete_appointment';
                    var postData = {
                        csrfToken: GlobalVariables.csrfToken,
                        appointment_id : lastFocusedEventData.data['id'],
                        delete_reason: $('#delete-reason').val()
                    };

                    $.post(postUrl, postData, function(response) {
                        $('#message_box').dialog('close');

                        if (response.exceptions) {
                            response.exceptions = GeneralFunctions.parseExceptions(response.exceptions);
                            GeneralFunctions.displayMessageBox(GeneralFunctions.EXCEPTIONS_TITLE,
                                    GeneralFunctions.EXCEPTIONS_MESSAGE);
                            $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.exceptions));
                            return;
                        }

                        if (response.warnings) {
                            response.warnings = GeneralFunctions.parseExceptions(response.warnings);
                            GeneralFunctions.displayMessageBox(GeneralFunctions.WARNINGS_TITLE,
                                    GeneralFunctions.WARNINGS_MESSAGE);
                            $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.warnings));
                        }

                        // Refresh calendar event items.
                        $('#select-filter-item').trigger('change');
                    }, 'json').fail(GeneralFunctions.ajaxFailureHandler);
                };

                messageButtons[EALang['cancel']] = function() {
                    $('#message_box').dialog('close');
                };

                GeneralFunctions.displayMessageBox(EALang['delete_appointment_title'],
                        EALang['write_appointment_removal_reason'], messageButtons);

                $('#message_box').append('<textarea id="delete-reason" rows="3"></textarea>');
                $('#delete-reason').css('width', '100%');
            } else {
                // Do not display confirmation prompt.
                var postUrl = GlobalVariables.baseUrl + '/index.php/backend_api/ajax_delete_unavailable';
                var postData = {
                    csrfToken: GlobalVariables.csrfToken,
                    unavailable_id : lastFocusedEventData.data.id
                };

                $.post(postUrl, postData, function(response) {
                    $('#message_box').dialog('close');

                    if (response.exceptions) {
                        response.exceptions = GeneralFunctions.parseExceptions(response.exceptions);
                        GeneralFunctions.displayMessageBox(GeneralFunctions.EXCEPTIONS_TITLE, GeneralFunctions.EXCEPTIONS_MESSAGE);
                        $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.exceptions));
                        return;
                    }

                    if (response.warnings) {
                        response.warnings = GeneralFunctions.parseExceptions(response.warnings);
                        GeneralFunctions.displayMessageBox(GeneralFunctions.WARNINGS_TITLE, GeneralFunctions.WARNINGS_MESSAGE);
                        $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.warnings));
                    }

                    // Refresh calendar event items.
                    $('#select-filter-item').trigger('change');
                }, 'json').fail(GeneralFunctions.ajaxFailureHandler);
            }
        });

        /**
         * Event: Calendar Filter Item "Change"
         *
         * Load the appointments that correspond to the select filter item and display them on the calendar.
         */
        $('#select-filter-item').change(function() {
            _refreshCalendarAppointments(
                    $('#calendar'),
                    $('#select-filter-item').val(),
                    $('#select-filter-item option:selected').attr('type'),
                    $('#calendar').fullCalendar('getView').visStart,
                    $('#calendar').fullCalendar('getView').visEnd);

            // If current value is service, then the sync buttons must be disabled.
            if ($('#select-filter-item option:selected').attr('type') === FILTER_TYPE_SERVICE) {
                $('#google-sync, #enable-sync, #insert-appointment, #insert-unavailable').prop('disabled', true);
            } else {
                $('#google-sync, #enable-sync, #insert-appointment, #insert-unavailable').prop('disabled', false);

                // If the user has already the sync enabled then apply the proper style changes.
                if ($('#select-filter-item option:selected').attr('google-sync') === 'true') {
                    $('#enable-sync').addClass('btn-danger enabled');
                    $('#enable-sync span:eq(1)').text(EALang['disable_sync']);
                    $('#google-sync').prop('disabled', false);
                } else {
                    $('#enable-sync').removeClass('btn-danger enabled');
                    $('#enable-sync span:eq(1)').text(EALang['enable_sync']);
                    $('#google-sync').prop('disabled', true);
                }
            }
        });
    }

    /**
     * Get Calendar Component Height
     *
     * This method calculates the proper calendar height, in order to be displayed correctly, even when the
     * browser window is resizing.
     *
     * @return {Number} Returns the calendar element height in pixels.
     */
    function _getCalendarHeight() {
        var result = window.innerHeight - $('#footer').outerHeight() - $('#header').outerHeight()
                - $('#calendar-toolbar').outerHeight() - 60; // 60 for fine tuning
        return (result > 500) ? result : 500; // Minimum height is 500px
    }

    /**
     * Calendar Event "Click" Callback
     *
     * When the user clicks on an appointment object on the calendar, then a data preview popover is display
     * above the calendar item.
     */
    function _calendarEventClick(event, jsEvent, view) {
        $('.popover').remove(); // Close all open popovers.

        var html;
        var displayEdit;
        var displayDelete;

        // Depending where the user clicked the event (title or empty space) we
        // need to use different selectors to reach the parent element.
        var $parent = $(jsEvent.target.offsetParent);
        var $altParent = $(jsEvent.target).parents().eq(1);

        if ($parent.hasClass('fc-unavailable') || $altParent.hasClass('fc-unavailable')) {
            displayEdit = (($parent.hasClass('fc-custom') || $altParent.hasClass('fc-custom'))
                    && GlobalVariables.user.privileges.appointments.edit == true)
                    ? '' : 'hide';
            displayDelete = (($parent.hasClass('fc-custom') || $altParent.hasClass('fc-custom'))
                    && GlobalVariables.user.privileges.appointments.delete == true)
                    ? '' : 'hide'; // Same value at the time.

            var notes = '';
            if (event.data) { // Only custom unavailable periods have notes.
                notes = '<strong>Notes</strong> ' + event.data.notes;
            }

            html =
                    '<style type="text/css">'
                        + '.popover-content strong {min-width: 80px; display:inline-block;}'
                        + '.popover-content button {margin-right: 10px;}'
                        + '</style>' +
                    '<strong>' + EALang['start'] + '</strong> '
                        + GeneralFunctions.formatDate(event.start, GlobalVariables.dateFormat, true)
                        + '<br>' +
                    '<strong>' + EALang['end'] + '</strong> '
                        + GeneralFunctions.formatDate(event.end, GlobalVariables.dateFormat, true)
                        + '<br>'
                        + notes
                        + '<hr>' +
                    '<center>' +
                        '<button class="edit-popover btn btn-primary ' + displayEdit + '">' + EALang['edit'] + '</button>' +
                        '<button class="delete-popover btn btn-danger ' + displayDelete + '">' + EALang['delete'] + '</button>' +
                        '<button class="close-popover btn btn-default" data-po=' + jsEvent.target + '>' + EALang['close'] + '</button>' +
                    '</center>';
        } else {
            displayEdit = (GlobalVariables.user.privileges.appointments.edit == true)
                    ? '' : 'hide';
            displayDelete = (GlobalVariables.user.privileges.appointments.delete == true)
                    ? '' : 'hide';

            html =
                    '<style type="text/css">'
                        + '.popover-content strong {min-width: 80px; display:inline-block;}'
                        + '.popover-content button {margin-right: 10px;}'
                        + '</style>' +
                    '<strong>' + EALang['start'] + '</strong> '
                        + GeneralFunctions.formatDate(event.start, GlobalVariables.dateFormat, true)
                        + '<br>' +
                    '<strong>' + EALang['end'] + '</strong> '
                        + GeneralFunctions.formatDate(event.end, GlobalVariables.dateFormat, true)
                        + '<br>' +
                    '<strong>' + EALang['service'] + '</strong> '
                        + event.data['service']['name']
                        + '<br>' +
                    '<strong>' + EALang['provider'] + '</strong> '
                        + event.data['provider']['first_name'] + ' '
                        + event.data['provider']['last_name']
                        + '<br>' +
                    '<strong>' + EALang['customer'] + '</strong> '
                        + event.data['customer']['first_name'] + ' '
                        + event.data['customer']['last_name']
                        + '<hr>' +
                    '<center>' +
                        '<button class="edit-popover btn btn-primary ' + displayEdit + '">' + EALang['edit'] + '</button>' +
                        '<button class="delete-popover btn btn-danger ' + displayDelete + '">' + EALang['delete'] + '</button>' +
                        '<button class="close-popover btn btn-default" data-po=' + jsEvent.target + '>' + EALang['close'] + '</button>' +
                    '</center>';
        }

        $(jsEvent.target).popover({
            placement: 'top',
            title: event.title,
            content: html,
            html: true,
            container: '#calendar',
            trigger: 'manual'
        });

        lastFocusedEventData = event;
        $(jsEvent.target).popover('toggle');

        // Fix popover position
        if ($('.popover').length > 0) {
            if ($('.popover').position().top < 200) $('.popover').css('top', '200px');
        }
    }

    /**
     * Calendar Event "Resize" Callback
     *
     * The user can change the duration of an event by resizing an appointment object on the calendar. This
     * change needs to be stored to the database too and this is done via an ajax call.
     *
     * @see updateAppointmentData()
     */
    function _calendarEventResize(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
        if (GlobalVariables.user.privileges.appointments.edit == false) {
            revertFunc();
            Backend.displayNotification(EALang['no_privileges_edit_appointments']);
            return;
        }

        if ($('#notification').is(':visible')) {
            $('#notification').hide('bind');
        }

        if (event.data.is_unavailable == false) {
            // Prepare appointment data.
            var appointment = GeneralFunctions.clone(event.data);

            // Must delete the following because only appointment data should be provided to the ajax call.
            delete appointment['customer'];
            delete appointment['provider'];
            delete appointment['service'];

            appointment['end_datetime'] = Date.parseExact(
                    appointment['end_datetime'], 'yyyy-MM-dd HH:mm:ss')
                    .add({ minutes: minuteDelta })
                    .toString('yyyy-MM-dd HH:mm:ss');

            // Success callback
            var successCallback = function(response) {
                if (response.exceptions) {
                    response.exceptions = GeneralFunctions.parseExceptions(response.exceptions);
                    GeneralFunctions.displayMessageBox(GeneralFunctions.EXCEPTIONS_TITLE, GeneralFunctions.EXCEPTIONS_MESSAGE);
                    $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.exceptions));
                    return;
                }

                if (response.warnings) {
                    // Display warning information to the user.
                    response.warnings = GeneralFunctions.parseExceptions(response.warnings);
                    GeneralFunctions.displayMessageBox(GeneralFunctions.WARNINGS_TITLE, GeneralFunctions.WARNINGS_MESSAGE);
                    $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.warnings));
                }

                // Display success notification to user.
                var undoFunction = function() {
                    appointment['end_datetime'] = Date.parseExact(
                            appointment['end_datetime'], 'yyyy-MM-dd HH:mm:ss')
                            .add({ minutes: -minuteDelta })
                            .toString('yyyy-MM-dd HH:mm:ss');

                    var postUrl = GlobalVariables.baseUrl + '/index.php/backend_api/ajax_save_appointment';
                    var postData = {
                        csrfToken: GlobalVariables.csrfToken,
                        appointment_data: JSON.stringify(appointment)
                    };

                    $.post(postUrl, postData, function(response) {
                        $('#notification').hide('blind');
                        revertFunc();
                    }, 'json').fail(GeneralFunctions.ajaxFailureHandler);
                };

                Backend.displayNotification(EALang['appointment_updated'], [
                    {
                        'label': 'Undo',
                        'function': undoFunction
                    }
                ]);
                $('#footer').css('position', 'static'); // Footer position fix.
            };

            // Update appointment data.
            BackendCalendarApi.saveAppointment(appointment, undefined, successCallback, undefined);
        } else {
            // Update unavailable time period.
            var unavailable = {
                id: event.data.id,
                start_datetime: event.start.toString('yyyy-MM-dd HH:mm:ss'),
                end_datetime: event.end.toString('yyyy-MM-dd HH:mm:ss'),
                id_users_provider: event.data.id_users_provider
            };

            // Define success callback function.
            var successCallback = function(response) {
                if (response.exceptions) {
                    response.exceptions = GeneralFunctions.parseExceptions(response.exceptions);
                    GeneralFunctions.displayMessageBox(GeneralFunctions.EXCEPTIONS_TITLE, GeneralFunctions.EXCEPTIONS_MESSAGE);
                    $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.exceptions));
                    return;
                }

                if (response.warnings) {
                    // Display warning information to the user.
                    response.warnings = GeneralFunctions.parseExceptions(response.warnings);
                    GeneralFunctions.displayMessageBox(GeneralFunctions.WARNINGS_TITLE, GeneralFunctions.WARNINGS_MESSAGE);
                    $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.warnings));
                }

                // Display success notification to user.
                var undoFunction = function() {
                    unavailable['end_datetime'] = Date.parseExact(
                            unavailable['end_datetime'], 'yyyy-MM-dd HH:mm:ss')
                            .add({ minutes: -minuteDelta })
                            .toString('yyyy-MM-dd HH:mm:ss');

                    var postUrl = GlobalVariables.baseUrl + '/index.php/backend_api/ajax_save_unavailable';
                    var postData = {
                        csrfToken: GlobalVariables.csrfToken,
                        unavailable: JSON.stringify(unavailable)
                    };

                    $.post(postUrl, postData, function(response) {
                        $('#notification').hide('blind');
                        revertFunc();
                    }, 'json').fail(GeneralFunctions.ajaxFailureHandler);
                };

                Backend.displayNotification(EALang['unavailable_updated'], [
                    {
                        'label': 'Undo',
                        'function': undoFunction
                    }
                ]);
                $('#footer').css('position', 'static'); // Footer position fix.
            };

            BackendCalendarApi.saveUnavailable(unavailable, successCallback, undefined);
        }
    }

    /**
     * Calendar Window "Resize" Callback
     *
     * The calendar element needs to be re-sized too in order to fit into the window. Nevertheless, if the window
     * becomes very small the the calendar won't shrink anymore.
     *
     * @see _getCalendarHeight()
     */
    function _calendarWindowResize(view) {
        $('#calendar').fullCalendar('option', 'height', _getCalendarHeight());
    }

    /**
     * Calendar Day "Click" Callback
     *
     * When the user clicks on a day square on the calendar, then he will automatically be transferred to that
     * day view calendar.
     */
    function _calendarDayClick(date, allDay, jsEvent, view) {
        if (allDay) {
            $('#calendar').fullCalendar('gotoDate', date);
            $('#calendar').fullCalendar('changeView', 'agendaDay');
        }
    }

    /**
     * Calendar Event "Drop" Callback
     *
     * This event handler is triggered whenever the user drags and drops an event into a different position
     * on the calendar. We need to update the database with this change. This is done via an ajax call.
     */
    function _calendarEventDrop(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
        if (GlobalVariables.user.privileges.appointments.edit == false) {
            revertFunc();
            Backend.displayNotification(EALang['no_privileges_edit_appointments']);
            return;
        }

        if ($('#notification').is(':visible')) {
            $('#notification').hide('bind');
        }

        if (event.data.is_unavailable == false) {
            // Prepare appointment data.
            var appointment = GeneralFunctions.clone(event.data);

            // Must delete the following because only appointment data should be provided to the ajax call.
            delete appointment['customer'];
            delete appointment['provider'];
            delete appointment['service'];

            appointment['start_datetime'] = Date.parseExact(
                    appointment['start_datetime'], 'yyyy-MM-dd HH:mm:ss')
                    .add({ days: dayDelta, minutes: minuteDelta })
                    .toString('yyyy-MM-dd HH:mm:ss');

            appointment['end_datetime'] = Date.parseExact(
                    appointment['end_datetime'], 'yyyy-MM-dd HH:mm:ss')
                    .add({ days: dayDelta, minutes: minuteDelta })
                    .toString('yyyy-MM-dd HH:mm:ss');

            event.data['start_datetime'] = appointment['start_datetime'];
            event.data['end_datetime'] = appointment['end_datetime'];

            // Define success callback function.
            var successCallback = function(response) {
                if (response.exceptions) {
                    response.exceptions = GeneralFunctions.parseExceptions(response.exceptions);
                    GeneralFunctions.displayMessageBox(GeneralFunctions.EXCEPTIONS_TITLE, GeneralFunctions.EXCEPTIONS_MESSAGE);
                    $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.exceptions));
                    return;
                }

                if (response.warnings) {
                    // Display warning information to the user.
                    response.warnings = GeneralFunctions.parseExceptions(response.warnings);
                    GeneralFunctions.displayMessageBox(GeneralFunctions.WARNINGS_TITLE, GeneralFunctions.WARNINGS_MESSAGE);
                    $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.warnings));
                }

                // Define the undo function, if the user needs to reset the last change.
                var undoFunction = function() {
                    appointment['start_datetime'] = Date.parseExact(
                            appointment['start_datetime'], 'yyyy-MM-dd HH:mm:ss')
                            .add({ days: -dayDelta, minutes: -minuteDelta })
                            .toString('yyyy-MM-dd HH:mm:ss');

                    appointment['end_datetime'] = Date.parseExact(
                            appointment['end_datetime'], 'yyyy-MM-dd HH:mm:ss')
                            .add({ days: -dayDelta, minutes: -minuteDelta })
                            .toString('yyyy-MM-dd HH:mm:ss');

                    event.data['start_datetime'] = appointment['start_datetime'];
                    event.data['end_datetime'] = appointment['end_datetime'];

                    var postUrl  = GlobalVariables.baseUrl + '/index.php/backend_api/ajax_save_appointment';
                    var postData = {
                        csrfToken: GlobalVariables.csrfToken,
                        appointment_data: JSON.stringify(appointment)
                    };

                    $.post(postUrl, postData, function(response) {
                        $('#notification').hide('blind');
                        revertFunc();
                    }, 'json').fail(GeneralFunctions.ajaxFailureHandler);
                };

                Backend.displayNotification(EALang['appointment_updated'], [
                    {
                        'label': 'Undo',
                        'function': undoFunction
                    }
                ]);

                $('#footer').css('position', 'static'); // Footer position fix.
            };

            // Update appointment data.
            BackendCalendarApi.saveAppointment(appointment, undefined, successCallback, undefined);
        } else {
            // Update unavailable time period.
            var unavailable = {
                id: event.data.id,
                start_datetime: event.start.toString('yyyy-MM-dd HH:mm:ss'),
                end_datetime: event.end.toString('yyyy-MM-dd HH:mm:ss'),
                id_users_provider: event.data.id_users_provider
            };

            var successCallback = function(response) {
                if (response.exceptions) {
                    response.exceptions = GeneralFunctions.parseExceptions(response.exceptions);
                    GeneralFunctions.displayMessageBox(GeneralFunctions.EXCEPTIONS_TITLE, GeneralFunctions.EXCEPTIONS_MESSAGE);
                    $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.exceptions));
                    return;
                }

                if (response.warnings) {
                    response.warnings = GeneralFunctions.parseExceptions(response.warnings);
                    GeneralFunctions.displayMessageBox(GeneralFunctions.WARNINGS_TITLE, GeneralFunctions.WARNINGS_MESSAGE);
                    $('#message_box').append(GeneralFunctions.exceptionsToHtml(response.warnings));
                }

                var undoFunction = function() {
                    unavailable['start_datetime'] = Date.parseExact(
                            unavailable['start_datetime'], 'yyyy-MM-dd HH:mm:ss')
                            .add({ days: -dayDelta, minutes: -minuteDelta })
                            .toString('yyyy-MM-dd HH:mm:ss');

                    unavailable['end_datetime'] = Date.parseExact(
                            unavailable['end_datetime'], 'yyyy-MM-dd HH:mm:ss')
                            .add({ days: -dayDelta, minutes: -minuteDelta })
                            .toString('yyyy-MM-dd HH:mm:ss');

                    event.data['start_datetime'] = unavailable['start_datetime'];
                    event.data['end_datetime'] = unavailable['end_datetime'];

                    var postUrl  = GlobalVariables.baseUrl + '/index.php/backend_api/ajax_save_unavailable';
                    var postData = {
                        csrfToken: GlobalVariables.csrfToken,
                        unavailable: JSON.stringify(unavailable)
                    };

                    $.post(postUrl, postData, function(response) {
                        $('#notification').hide('blind');
                        revertFunc();
                    }, 'json').fail(GeneralFunctions.ajaxFailureHandler);
                };

                Backend.displayNotification(EALang['unavailable_updated'], [
                    {
                        label: 'Undo',
                        function: undoFunction
                    }
                ]);

                $('#footer').css('position', 'static'); // Footer position fix.
            };

            BackendCalendarApi.saveUnavailable(unavailable, successCallback, undefined);
        }
    }

    /**
     * Calendar "View Display" Callback
     *
     * Whenever the calendar changes or refreshes its view certain actions need to be made, in order to
     * display proper information to the user.
     */
    function _calendarViewDisplay() {
        if ($('#select-filter-item').val() === null) {
             return;
        }

        _refreshCalendarAppointments(
                $('#calendar'),
                $('#select-filter-item').val(),
                $('#select-filter-item option:selected').attr('type'),
                $('#calendar').fullCalendar('getView').visStart,
                $('#calendar').fullCalendar('getView').visEnd);

        $(window).trigger('resize'); // Places the footer on the bottom.

        // Remove all open popovers.
        $('.close-popover').each(function() {
            $(this).parents().eq(2).remove();
        });

        // Add new pop overs.
        $('.fv-events').each(function(index, eventHandle) {
            $(eventHandle).popover();
        });
    }

    /**
     * Convert titles to HTML
     *
     * On some calendar events the titles contain html markup that is not displayed properly due to the
     * fullcalendar plugin. This plugin sets the .fc-event-title value by using the $.text() method and
     * not the $.html() method. So in order for the title to display the html properly we convert all the
     * .fc-event-titles where needed into html.
     */
    function _convertTitlesToHtml() {
        // Convert the titles to html code.
        $('.fc-custom').each(function() {
            var title = $(this).find('.fc-event-title').text();
            $(this).find('.fc-event-title').html(title);
            var time = $(this).find('.fc-event-time').text();
            $(this).find('.fc-event-time').html(time);
        });
    }

    /**
     * Refresh Calendar Appointments
     *
     * This method reloads the registered appointments for the selected date period and filter type.
     *
     * @param {Object} $calendar The calendar jQuery object.
     * @param {Number} recordId The selected record id.
     * @param {String} filterType The filter type, could be either FILTER_TYPE_PROVIDER or FILTER_TYPE_SERVICE.
     * @param {Date} startDate Visible start date of the calendar.
     * @param {Date} endDate Visible end date of the calendar.
     */
    function _refreshCalendarAppointments($calendar, recordId, filterType, startDate, endDate) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/backend_api/ajax_get_calendar_appointments';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            record_id: recordId,
            start_date: startDate.toString('yyyy-MM-dd'),
            end_date: endDate.toString('yyyy-MM-dd'),
            filter_type: filterType
        };

        $.post(postUrl, postData, function(response) {
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }

            // Add appointments to calendar.
            var calendarEvents = [];
            var $calendar = $('#calendar');

            $.each(response.appointments, function(index, appointment) {
                var event = {
                    id: appointment['id'],
                    title: appointment['service']['name'] + ' - '
                            + appointment['customer']['first_name'] + ' '
                            + appointment['customer']['last_name'],
                    start: appointment['start_datetime'],
                    end: appointment['end_datetime'],
                    allDay: false,
                    data: appointment // Store appointment data for later use.
                };

                calendarEvents.push(event);
            });

            $calendar.fullCalendar('removeEvents');
            $calendar.fullCalendar('addEventSource', calendarEvents);

            // :: ADD PROVIDER'S UNAVAILABLE TIME PERIODS
            var calendarView = $calendar.fullCalendar('getView').name;

            if (filterType === FILTER_TYPE_PROVIDER && calendarView !== 'month') {
                $.each(GlobalVariables.availableProviders, function(index, provider) {
                    if (provider['id'] == recordId) {
                        var workingPlan = jQuery.parseJSON(provider.settings.working_plan);
                        var unavailablePeriod;

                        switch(calendarView) {
                            case 'agendaDay':
                                var selDayName = $calendar.fullCalendar('getView')
                                        .start.toString('dddd').toLowerCase();

                                // Add custom unavailable periods.
                                $.each(response.unavailables, function(index, unavailable) {
                                    var unavailablePeriod = {
										
										//Google Sync mod 1 Craig Tucker start
                                        //ORIGINAL title: EALang['unavailable'] + ' <br><small>' + ((unavailable.notes.length > 30)
										title: '<small>' + ((unavailable.notes.length > 60)
                                                        //ORIGINAL ? unavailable.notes.substring(0, 30) + '...'
														? unavailable.notes.substring(0, 60) + '...' 
														//Google Sync mod 1 Craig Tucker end
														
                                                        : unavailable.notes) + '</small>',
                                        start: Date.parse(unavailable.start_datetime),
                                        end: Date.parse(unavailable.end_datetime),
                                        allDay: false,
                                        color: '#879DB4',
                                        editable: true,
                                        className: 'fc-unavailable fc-custom',
                                        data: unavailable
                                    };
                                    $calendar.fullCalendar('renderEvent', unavailablePeriod, false);
                                });

                                // Non-working day
                                if (workingPlan[selDayName] == null) {
                                    unavailablePeriod = {
                                            title: EALang['not_working'],
                                            start: GeneralFunctions.clone($calendar.fullCalendar('getView').start),
                                            end: GeneralFunctions.clone($calendar.fullCalendar('getView').end),
                                            allDay: false,
                                            color: '#BEBEBE',
                                            editable: false,
                                            className: 'fc-unavailable'
                                        };
                                        $calendar.fullCalendar('renderEvent', unavailablePeriod, true);
                                    return; // Go to next loop
                                }

                                // Add unavailable period before work starts.
                                var calendarDateStart = $calendar.fullCalendar('getView').start,
                                    workDateStart = Date.parseExact(
                                        calendarDateStart.toString('dd/MM/yyyy') + ' '
                                        + workingPlan[selDayName].start,
                                        'dd/MM/yyyy HH:mm');

                                if (calendarDateStart < workDateStart) {
                                    unavailablePeriod = {
                                        title: EALang['not_working'],
                                        start: calendarDateStart,
                                        end: workDateStart,
                                        allDay: false,
                                        color: '#BEBEBE',
                                        editable: false,
                                        className: 'fc-unavailable'
                                    };
                                    $calendar.fullCalendar('renderEvent', unavailablePeriod, false);
                                }

                                // Add unavailable period after work ends.
                                var calendarDateEnd = $calendar.fullCalendar('getView').end;
                                var workDateEnd = Date.parseExact(
                                        calendarDateStart.toString('dd/MM/yyyy') + ' '
                                        + workingPlan[selDayName].end,
                                        'dd/MM/yyyy HH:mm'); // Use calendarDateStart ***
                                if (calendarDateEnd > workDateEnd) {
                                    var unavailablePeriod = {
                                        title: EALang['not_working'],
                                        start: workDateEnd,
                                        end: calendarDateEnd,
                                        allDay: false,
                                        color: '#BEBEBE',
                                        editable: false,
                                        className: 'fc-unavailable'
                                    };
                                    $calendar.fullCalendar('renderEvent', unavailablePeriod, false);
                                }

                                // Add unavailable periods for breaks.
                                var breakStart;
                                var breakEnd;
                                $.each(workingPlan[selDayName].breaks, function(index, currBreak) {
                                    breakStart = Date.parseExact(calendarDateStart.toString('dd/MM/yyyy')
                                            + ' ' + currBreak.start, 'dd/MM/yyyy HH:mm');
                                    breakEnd = Date.parseExact(calendarDateStart.toString('dd/MM/yyyy')
                                            + ' ' + currBreak.end, 'dd/MM/yyyy HH:mm');
                                    var unavailablePeriod = {
                                        title: EALang['break'],
                                        start: breakStart,
                                        end: breakEnd,
                                        allDay: false,
                                        color: '#BEBEBE',
                                        editable: false,
                                        className: 'fc-unavailable fc-break'
                                    };
                                    $calendar.fullCalendar('renderEvent', unavailablePeriod, false);
                                });

                                break;

                            case 'agendaWeek':
                                var currDateStart = GeneralFunctions.clone($calendar.fullCalendar('getView').start);
                                var currDateEnd = GeneralFunctions.clone(currDateStart).addDays(1);

                                // Add custom unavailable periods (they are always displayed on the calendar, even if
                                // the provider won't work on that day).
                                $.each(response.unavailables, function(index, unavailable) {
                                    unavailablePeriod = {
										
										//Google Sync mod 2 Craig Tucker start
                                        //ORIGINAL title: EALang['unavailable'] + ' <br><small>' + ((unavailable.notes.length > 30)
										title: '<small>' + ((unavailable.notes.length > 60)
                                                //ORIGINAL ? unavailable.notes.substring(0, 30) + '...'
												? unavailable.notes.substring(0, 60) + '...' 
												//Google Sync mod 2 Craig Tucker end

                                                : unavailable.notes) + '</small>',
                                        start: Date.parse(unavailable.start_datetime),
                                        end: Date.parse(unavailable.end_datetime),
                                        allDay: false,
                                        color: '#879DB4',
                                        editable: true,
                                        className: 'fc-unavailable fc-custom',
                                        data: unavailable
                                    };
                                    $calendar.fullCalendar('renderEvent', unavailablePeriod, false);
                                });

                                $.each(workingPlan, function(index, workingDay) {

                                    if (workingDay == null) {
                                        // Add a full day unavailable event.
                                        unavailablePeriod = {
                                            title: EALang['not_working'],
                                            start: GeneralFunctions.clone(currDateStart),
                                            end: GeneralFunctions.clone(currDateEnd),
                                            allDay: false,
                                            color: '#BEBEBE',
                                            editable: false,
                                            className: 'fc-unavailable'
                                        };
                                        $calendar.fullCalendar('renderEvent', unavailablePeriod, true);
                                        currDateStart.addDays(1);
                                        currDateEnd.addDays(1);
                                        return; // Go to the next loop.
                                    }

                                    var start;
                                    var end;

                                    // Add unavailable period before work starts.
                                    start = Date.parseExact(currDateStart.toString('dd/MM/yyyy')
                                            + ' ' + workingDay.start, 'dd/MM/yyyy HH:mm');
                                    if (currDateStart < start) {
                                        unavailablePeriod = {
                                            title: EALang['not_working'],
                                            start: GeneralFunctions.clone(currDateStart),
                                            end: GeneralFunctions.clone(start),
                                            allDay: false,
                                            color: '#BEBEBE',
                                            editable: false,
                                            className: 'fc-unavailable'
                                        };
                                        $calendar.fullCalendar('renderEvent', unavailablePeriod, true);
                                    }

                                    // Add unavailable period after work ends.
                                    end = Date.parseExact(currDateStart.toString('dd/MM/yyyy')
                                            + ' ' + workingDay.end, 'dd/MM/yyyy HH:mm');
                                    if (currDateEnd > end) {
                                        unavailablePeriod = {
                                            title: EALang['not_working'],
                                            start: GeneralFunctions.clone(end),
                                            end: GeneralFunctions.clone(currDateEnd),
                                            allDay: false,
                                            color: '#BEBEBE',
                                            editable: false,
                                            className: 'fc-unavailable fc-brake'
                                        };
                                        $calendar.fullCalendar('renderEvent', unavailablePeriod, false);
                                    }

                                    // Add unavailable periods during day breaks.
                                    var breakStart;
                                    var breakEnd;
                                    $.each(workingDay.breaks, function(index, currBreak) {
                                        breakStart = Date.parseExact(currDateStart.toString('dd/MM/yyyy')
                                                + ' ' + currBreak.start, 'dd/MM/yyyy HH:mm');
                                        breakEnd = Date.parseExact(currDateStart.toString('dd/MM/yyyy')
                                                + ' ' + currBreak.end, 'dd/MM/yyyy HH:mm');
                                        var unavailablePeriod = {
                                            title: EALang['break'],
                                            start: breakStart,
                                            end: breakEnd,
                                            allDay: false,
                                            color: '#BEBEBE',
                                            editable: false,
                                            className: 'fc-unavailable fc-break'
                                        };
                                        $calendar.fullCalendar('renderEvent', unavailablePeriod, false);
                                    });

                                    currDateStart.addDays(1);
                                    currDateEnd.addDays(1);
                                });
                                break;
                        }
                    }
                });
            }
        }, 'json').fail(GeneralFunctions.ajaxFailureHandler);
    }


    exports.initialize = function() {
        // Dynamic Date Formats
        var columnFormat = {};

        switch(GlobalVariables.dateFormat) {
            case 'DMY':
                columnFormat = {
                    month: 'ddd',
                    week: 'ddd dd/MM',
                    day: 'dddd dd/MM'
                };

                break;
            case 'MDY':
            case 'YMD':
                columnFormat = {
                    month: 'ddd',
                    week: 'ddd MM/dd',
                    day: 'dddd MM/dd'
                };
                break;
            default:
                throw new Error('Invalid date format setting provided!', GlobalVariables.dateFormat);
        }


        var defaultView = window.innerWidth < 468 ? 'agendaDay' : 'agendaWeek';
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

		var timeFormat;
        switch(GlobalVariables.timeFormat) {
            case 'AM/PM':
                timeFormat = 'hh:mm tt';
                break;
            case '24HR':
                timeFormat = 'HH:mm';
                break;
            default:
                throw new Error('Invalid GlobalVariables.timeFormat value.');
        }	

		console.log('NZ-backend_calendar_default_view.js -> fDaynum ' + fDaynum + ' fDay ' + fDay);
        // Initialize page calendar
        $('#calendar').fullCalendar({
            defaultView: defaultView,
            height: _getCalendarHeight(),
            editable: true,
            firstDay: fDaynum, // Monday
            slotMinutes: 30,
            snapMinutes: 15,
            axisFormat: timeFormat,
            timeFormat: timeFormat + '{ -'+ timeFormat + '}',
            allDayText: EALang['all_day'],
            columnFormat: columnFormat,
            titleFormat: {
                month: 'MMMM yyyy',
                week: "MMMM d[ yyyy]{ '&#8212;'[ MMM] d, yyyy}",
                day: 'dddd, MMMM d, yyyy'
            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'agendaDay,agendaWeek,month'
            },

            // Translations
            monthNames: [EALang['january'], EALang['february'], EALang['march'], EALang['april'],
                           EALang['may'], EALang['june'], EALang['july'], EALang['august'],
                           EALang['september'],EALang['october'], EALang['november'],
                           EALang['december']],
            monthNamesShort: [EALang['january'].substr(0,3), EALang['february'].substr(0,3),
                    EALang['march'].substr(0,3), EALang['april'].substr(0,3),
                    EALang['may'].substr(0,3), EALang['june'].substr(0,3),
                    EALang['july'].substr(0,3), EALang['august'].substr(0,3),
                    EALang['september'].substr(0,3),EALang['october'].substr(0,3),
                    EALang['november'].substr(0,3), EALang['december'].substr(0,3)],
            dayNames: [EALang['sunday'], EALang['monday'], EALang['tuesday'], EALang['wednesday'],
                    EALang['thursday'], EALang['friday'], EALang['saturday']],
            dayNamesShort: [EALang['sunday'].substr(0,3), EALang['monday'].substr(0,3),
                   EALang['tuesday'].substr(0,3), EALang['wednesday'].substr(0,3),
                   EALang['thursday'].substr(0,3), EALang['friday'].substr(0,3),
                   EALang['saturday'].substr(0,3)],
            dayNamesMin: [EALang['sunday'].substr(0,2), EALang['monday'].substr(0,2),
                   EALang['tuesday'].substr(0,2), EALang['wednesday'].substr(0,2),
                   EALang['thursday'].substr(0,2), EALang['friday'].substr(0,2),
                   EALang['saturday'].substr(0,2)],
            buttonText: {
                today: EALang['today'],
                day: EALang['day'],
                week: EALang['week'],
                month: EALang['month']
            },

            // Calendar events need to be declared on initialization.
            windowResize: _calendarWindowResize,
            viewDisplay: _calendarViewDisplay,
            dayClick: _calendarDayClick,
            eventClick: _calendarEventClick,
            eventResize: _calendarEventResize,
            eventDrop: _calendarEventDrop,
            eventAfterAllRender: _convertTitlesToHtml
        });

        // Trigger once to set the proper footer position after calendar initialization.
        _calendarWindowResize();

        // Fill the select listboxes of the page.
        if (GlobalVariables.availableProviders.length > 0) {
            var optgroupHtml = '<optgroup label="' + EALang['providers'] + '" type="providers-group">';
            $.each(GlobalVariables.availableProviders, function(index, provider) {
                var hasGoogleSync = (provider['settings']['google_sync'] === '1')
                        ? 'true' : 'false';

                optgroupHtml += '<option value="' + provider['id'] + '" '
                        + 'type="' + FILTER_TYPE_PROVIDER + '" '
                        + 'google-sync="' + hasGoogleSync + '">'
                        + provider['first_name'] + ' ' + provider['last_name']
                        + '</option>';
            });
            optgroupHtml += '</optgroup>';
            $('#select-filter-item').append(optgroupHtml);
        }

        if (GlobalVariables.availableServices.length > 0) {
            optgroupHtml = '<optgroup label="' + EALang['services'] + '" type="services-group">';
            $.each(GlobalVariables.availableServices, function(index, service) {
                optgroupHtml += '<option value="' + service['id'] + '" ' +
                        'type="' + FILTER_TYPE_SERVICE + '">' +
                        service['name'] + '</option>';
            });
            optgroupHtml += '</optgroup>';
            $('#select-filter-item').append(optgroupHtml);
        }

        // Privileges Checks
        if (GlobalVariables.user.role_slug == Backend.DB_SLUG_PROVIDER) {
            $('#select-filter-item optgroup:eq(0)')
                    .find('option[value="' + GlobalVariables.user.id + '"]').prop('selected', true);
            $('#select-filter-item').prop('disabled', true);
        }

        if (GlobalVariables.user.role_slug == Backend.DB_SLUG_SECRETARY) {
            $('#select-filter-item optgroup:eq(1)').remove();
        }

        if (GlobalVariables.user.role_slug == Backend.DB_SLUG_SECRETARY) {
            // Remove the providers that are not connected to the secretary.
            $('#select-filter-item option[type="provider"]').each(function(index, option) {
                var found = false;
                $.each(GlobalVariables.secretaryProviders, function(index, id) {
                    if ($(option).val() == id) {
                        found = true;
                        return false;
                    }
                });

                if (!found) {
                    $(option).remove();
                }
            });

            if ($('#select-filter-item option[type="provider"]').length == 0) {
                $('#select-filter-item optgroup[type="providers-group"]').remove();
            }
        }

        // Bind the default event handlers.
        _bindEventHandlers();
        $('#select-filter-item').trigger('change');

        // Display the edit dialog if an appointment hash is provided.
        if (GlobalVariables.editAppointment != null) {
            var $dialog = $('#manage-appointment');
            var appointment = GlobalVariables.editAppointment;
            BackendCalendarAppointmentsModal.resetAppointmentDialog();

            $dialog.find('.modal-header h3').text(EALang['edit_appointment_title']);
            $dialog.find('#appointment-id').val(appointment['id']);
            $dialog.find('#select-service').val(appointment['id_services']).change();
            $dialog.find('#select-provider').val(appointment['id_users_provider']);

            // Set the start and end datetime of the appointment.
            var startDatetime = Date.parseExact(appointment['start_datetime'],
                    'yyyy-MM-dd HH:mm:ss');
            $dialog.find('#start-datetime').val(GeneralFunctions.formatDate(startDatetime, GlobalVariables.dateFormat, true));

            var endDatetime = Date.parseExact(appointment['end_datetime'],
                    'yyyy-MM-dd HH:mm:ss');
            $dialog.find('#end-datetime').val(GeneralFunctions.formatDate(endDatetime, GlobalVariables.dateFormat, true));

            var customer = appointment['customer'];
            $dialog.find('#customer-id').val(appointment['id_users_customer']);
            $dialog.find('#first-name').val(customer['first_name']);
            $dialog.find('#last-name').val(customer['last_name']);
            $dialog.find('#email').val(customer['email']);
            $dialog.find('#phone-number').val(customer['phone_number']);
            $dialog.find('#address').val(customer['address']);
            $dialog.find('#city').val(customer['city']);
            $dialog.find('#zip-code').val(customer['zip_code']);
            $dialog.find('#appointment-notes').val(appointment['notes']);
            $dialog.find('#customer-notes').val(customer['notes']);

            $dialog.modal('show');
        }

        // Apply qtip to control tooltips.
        $('#calendar-toolbar button').qtip({
            position: {
                my: 'top center',
                at: 'bottom center'
            },
            style: {
                classes: 'qtip-green qtip-shadow custom-qtip'
            }
        });

        $('#select-filter-item').qtip({
            position: {
                my: 'middle left',
                at: 'middle right'
            },
            style: {
                classes: 'qtip-green qtip-shadow custom-qtip'
            }
        });

        if ($('#select-filter-item option').length == 0) {
            $('#calendar-actions button').prop('disabled', true);
        }

        // Fine tune the footer's position only for this page.
        if (window.innerHeight < 700) {
            $('#footer').css('position', 'static');
        }  
    };

})(window.BackendCalendarDefaultView);
