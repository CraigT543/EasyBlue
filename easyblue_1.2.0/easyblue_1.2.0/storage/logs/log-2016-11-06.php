<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

ERROR - 2016-11-06 17:15:06 --> Email could not been sent. Mailer Error (Line 137): Could not instantiate mail function.
ERROR - 2016-11-06 17:15:06 --> #0 C:\Users\alext\Dev\easyappointments\src\application\controllers\Appointments.php(455): EA\Engine\Notifications\Email->sendAppointmentDetails(Array, Array, Array, Array, Array, Object(EA\Engine\Types\Alphanumeric), Object(EA\Engine\Types\Alphanumeric), Object(EA\Engine\Types\Url), Object(EA\Engine\Types\Email))
#1 C:\Users\alext\Dev\easyappointments\src\system\core\CodeIgniter.php(514): Appointments->ajax_register_appointment()
#2 C:\Users\alext\Dev\easyappointments\src\index.php(353): require_once('C:\\Users\\alext\\...')
#3 {main}
