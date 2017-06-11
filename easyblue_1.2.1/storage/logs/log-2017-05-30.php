<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

ERROR - 2017-05-30 14:30:25 --> Severity: Warning --> ini_set(): A session is active. You cannot change the session module's ini settings at this time /volume1/web/wordpress/easy/system/libraries/Session/Session.php 313
ERROR - 2017-05-30 14:31:04 --> Severity: Warning --> ini_set(): A session is active. You cannot change the session module's ini settings at this time /volume1/web/wordpress/easy/system/libraries/Session/Session.php 313
ERROR - 2017-05-30 14:57:59 --> Severity: Warning --> ini_set(): A session is active. You cannot change the session module's ini settings at this time /volume1/web/wordpress/easy/system/libraries/Session/Session.php 313
ERROR - 2017-05-30 14:58:02 --> Severity: Warning --> ini_set(): A session is active. You cannot change the session module's ini settings at this time /volume1/web/wordpress/easy/system/libraries/Session/Session.php 313
ERROR - 2017-05-30 11:33:11 --> Severity: Error --> Call to undefined function wp_get_current_user() /volume1/web/wordpress/easy/application/views/appointments/book.php 8
ERROR - 2017-05-30 17:25:00 --> Severity: Error --> Call to undefined function wp_get_current_user() /volume1/web/wordpress/easy/application/views/appointments/book.php 8
ERROR - 2017-05-30 17:29:20 --> Severity: Error --> Call to undefined function wp_get_current_user() /volume1/web/wordpress/easy/application/views/appointments/book.php 8
ERROR - 2017-05-30 17:29:28 --> Severity: Error --> Call to undefined function wp_get_current_user() /volume1/web/wordpress/easy/application/views/appointments/book.php 8
ERROR - 2017-05-30 21:02:20 --> Severity: error --> Exception: Email could not been sent. Mailer Error (Line 526): Extension missing: openssl /volume1/web/wordpress/easy/engine/Notifications/Email.php 526
ERROR - 2017-05-30 22:05:19 --> Email could not be sent. Mailer Error (Line 258): Extension missing: openssl
ERROR - 2017-05-30 22:05:19 --> #0 /volume1/web/wordpress/easy/application/controllers/Appointments.php(544): EA\Engine\Notifications\Email->sendAppointmentDetails(Array, Array, Array, Array, Array, Object(EA\Engine\Types\Text), Object(EA\Engine\Types\Text), Object(EA\Engine\Types\Url), Object(EA\Engine\Types\Email))
#1 [internal function]: Appointments->ajax_register_appointment()
#2 /volume1/web/wordpress/easy/system/core/CodeIgniter.php(514): call_user_func_array(Array, Array)
#3 /volume1/web/wordpress/easy/index.php(380): require_once('/volume1/web/wo...')
#4 {main}
