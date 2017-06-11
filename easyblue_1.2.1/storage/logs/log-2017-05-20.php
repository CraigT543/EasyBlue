<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

ERROR - 2017-05-20 00:46:01 --> Could not find the language line "show_minimal_details_hint"
ERROR - 2017-05-20 02:43:50 --> Email could not be sent. Mailer Error (Line 258): SMTP connect() failed. https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting
ERROR - 2017-05-20 02:43:50 --> #0 /volume1/web/wordpress/easy/application/controllers/Appointments.php(535): EA\Engine\Notifications\Email->sendAppointmentDetails(Array, Array, Array, Array, Array, Object(EA\Engine\Types\Text), Object(EA\Engine\Types\Text), Object(EA\Engine\Types\Url), Object(EA\Engine\Types\Email))
#1 [internal function]: Appointments->ajax_register_appointment()
#2 /volume1/web/wordpress/easy/system/core/CodeIgniter.php(514): call_user_func_array(Array, Array)
#3 /volume1/web/wordpress/easy/index.php(380): require_once('/volume1/web/wo...')
#4 {main}
ERROR - 2017-05-20 22:00:01 --> Severity: error --> Exception: Invalid argument provided as $service_id:  /volume1/web/wordpress/easy/application/models/Services_model.php 243
