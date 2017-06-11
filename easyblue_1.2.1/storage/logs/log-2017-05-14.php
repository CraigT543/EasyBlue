<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

ERROR - 2017-05-14 00:14:30 --> Severity: Notice --> Undefined variable: go_customer /volume1/web/easy/application/controllers/Appointments.php 531
ERROR - 2017-05-14 00:19:12 --> Could not find the language line "show_minimal_details_hint"
ERROR - 2017-05-14 00:19:59 --> Could not find the language line "show_minimal_details_hint"
ERROR - 2017-05-14 00:25:32 --> Could not find the language line "show_minimal_details_hint"
ERROR - 2017-05-14 00:40:00 --> Severity: Parsing Error --> syntax error, unexpected ':', expecting ',' or ';' /volume1/web/easy/application/views/appointments/book.php 715
ERROR - 2017-05-14 08:53:17 --> Could not find the language line "show_minimal_details_hint"
ERROR - 2017-05-14 22:12:16 --> Could not find the language line "show_minimal_details_hint"
ERROR - 2017-05-14 22:17:32 --> Severity: Parsing Error --> syntax error, unexpected '$this' (T_VARIABLE), expecting function (T_FUNCTION) /volume1/web/easy/application/models/Reminders_model.php 6
ERROR - 2017-05-14 22:22:20 --> Severity: Parsing Error --> syntax error, unexpected 'public' (T_PUBLIC) /volume1/web/easy/application/models/Reminders_model.php 11
ERROR - 2017-05-14 22:23:54 --> Severity: Parsing Error --> syntax error, unexpected 'parent' (T_STRING), expecting function (T_FUNCTION) /volume1/web/easy/application/models/Reminders_model.php 6
ERROR - 2017-05-14 22:25:58 --> Severity: Parsing Error --> syntax error, unexpected 'if' (T_IF) /volume1/web/easy/application/models/Reminders_model.php 47
ERROR - 2017-05-14 22:33:57 --> Severity: Notice --> Undefined variable: conf_notice /volume1/web/easy/application/models/Reminders_model.php 16
ERROR - 2017-05-14 22:33:57 --> Query error: Unknown column 'u1.notices' in 'field list' - Invalid query: SELECT `e`.`id` AS `appt_id`, `e`.`start_datetime`, `e`.`end_datetime`, `e`.`hash`, `e`.`id_google_calendar`, `u1`.`first_name` AS `customer_first_name`, `u1`.`last_name` AS `customer_last_name`, `u1`.`email` AS `customer_email`, `u1`.`address` AS `customer_address`, `u1`.`city` AS `customer_city`, `u1`.`zip_code` AS `customer_zip_code`, `u1`.`phone_number` AS `customer_phone_number`, `u1`.`notes` AS `customer_notes`, `u1`.`lang` AS `customer_lang`, `u1`.`notices` as `notifications`, `u2`.`first_name` AS `provider_first_name`, `u2`.`last_name` AS `provider_last_name`, `u2`.`email` AS `provider_email`, `u2`.`phone_number` AS `provider_phone_number`, `s`.`name`, `s`.`duration`, `s`.`price`, `s`.`description`, `cc`.`cellurl` AS `customer_cellurl`
FROM `ea_appointments` `e`
LEFT JOIN `ea_users` `u1` ON `e`.`id_users_customer` = `u1`.`id`
LEFT JOIN `ea_users` `u2` ON `e`.`id_users_provider` = `u2`.`id`
LEFT JOIN `ea_services` `s` ON `e`.`id_services` = `s`.`id`
LEFT JOIN `ea_cellcarrier` `cc` ON `u1`.`id_cellcarrier` = `cc`.`id`
WHERE `e`.`start_datetime` > '2017-05-15 00:00:00'
AND `e`.`start_datetime` < '2017-05-15 23:59:59'
ERROR - 2017-05-14 22:38:18 --> Severity: Notice --> Undefined variable: conf_notice /volume1/web/easy/application/models/Reminders_model.php 16
ERROR - 2017-05-14 22:38:18 --> Query error: Unknown column 'u1.notices' in 'field list' - Invalid query: SELECT `e`.`id` AS `appt_id`, `e`.`start_datetime`, `e`.`end_datetime`, `e`.`hash`, `e`.`id_google_calendar`, `u1`.`first_name` AS `customer_first_name`, `u1`.`last_name` AS `customer_last_name`, `u1`.`email` AS `customer_email`, `u1`.`address` AS `customer_address`, `u1`.`city` AS `customer_city`, `u1`.`zip_code` AS `customer_zip_code`, `u1`.`phone_number` AS `customer_phone_number`, `u1`.`notes` AS `customer_notes`, `u1`.`lang` AS `customer_lang`, `u1`.`notices` as `notifications`, `u2`.`first_name` AS `provider_first_name`, `u2`.`last_name` AS `provider_last_name`, `u2`.`email` AS `provider_email`, `u2`.`phone_number` AS `provider_phone_number`, `s`.`name`, `s`.`duration`, `s`.`price`, `s`.`description`, `cc`.`cellurl` AS `customer_cellurl`
FROM `ea_appointments` `e`
LEFT JOIN `ea_users` `u1` ON `e`.`id_users_customer` = `u1`.`id`
LEFT JOIN `ea_users` `u2` ON `e`.`id_users_provider` = `u2`.`id`
LEFT JOIN `ea_services` `s` ON `e`.`id_services` = `s`.`id`
LEFT JOIN `ea_cellcarrier` `cc` ON `u1`.`id_cellcarrier` = `cc`.`id`
WHERE `e`.`start_datetime` > '2017-05-15 00:00:00'
AND `e`.`start_datetime` < '2017-05-15 23:59:59'
ERROR - 2017-05-14 22:39:49 --> Severity: Notice --> Undefined variable: conf_notice /volume1/web/easy/application/models/Reminders_model.php 16
ERROR - 2017-05-14 22:39:49 --> Query error: Unknown column 'u1.notices' in 'field list' - Invalid query: SELECT `e`.`id` AS `appt_id`, `e`.`start_datetime`, `e`.`end_datetime`, `e`.`hash`, `e`.`id_google_calendar`, `u1`.`first_name` AS `customer_first_name`, `u1`.`last_name` AS `customer_last_name`, `u1`.`email` AS `customer_email`, `u1`.`address` AS `customer_address`, `u1`.`city` AS `customer_city`, `u1`.`zip_code` AS `customer_zip_code`, `u1`.`phone_number` AS `customer_phone_number`, `u1`.`notes` AS `customer_notes`, `u1`.`lang` AS `customer_lang`, `u1`.`notices` as `notifications`, `u2`.`first_name` AS `provider_first_name`, `u2`.`last_name` AS `provider_last_name`, `u2`.`email` AS `provider_email`, `u2`.`phone_number` AS `provider_phone_number`, `s`.`name`, `s`.`duration`, `s`.`price`, `s`.`description`, `cc`.`cellurl` AS `customer_cellurl`
FROM `ea_appointments` `e`
LEFT JOIN `ea_users` `u1` ON `e`.`id_users_customer` = `u1`.`id`
LEFT JOIN `ea_users` `u2` ON `e`.`id_users_provider` = `u2`.`id`
LEFT JOIN `ea_services` `s` ON `e`.`id_services` = `s`.`id`
LEFT JOIN `ea_cellcarrier` `cc` ON `u1`.`id_cellcarrier` = `cc`.`id`
WHERE `e`.`start_datetime` > '2017-05-15 00:00:00'
AND `e`.`start_datetime` < '2017-05-15 23:59:59'
ERROR - 2017-05-14 22:42:16 --> Severity: Notice --> Undefined variable: conf_notice /volume1/web/easy/application/models/Reminders_model.php 17
ERROR - 2017-05-14 22:42:16 --> Severity: Notice --> Undefined variable: conf_notice /volume1/web/easy/application/models/Reminders_model.php 18
ERROR - 2017-05-14 22:42:19 --> Severity: Notice --> Undefined variable: conf_notice /volume1/web/easy/application/models/Reminders_model.php 17
ERROR - 2017-05-14 22:42:19 --> Severity: Notice --> Undefined variable: conf_notice /volume1/web/easy/application/models/Reminders_model.php 18
ERROR - 2017-05-14 22:42:21 --> Severity: Notice --> Undefined variable: conf_notice /volume1/web/easy/application/models/Reminders_model.php 17
ERROR - 2017-05-14 22:42:21 --> Severity: Notice --> Undefined variable: conf_notice /volume1/web/easy/application/models/Reminders_model.php 18
ERROR - 2017-05-14 22:54:26 --> Could not find the language line "show_minimal_details_hint"
ERROR - 2017-05-14 23:46:29 --> Severity: Parsing Error --> syntax error, unexpected '<' /volume1/web/easy/application/views/appointments/book.php 182
ERROR - 2017-05-14 23:48:12 --> Severity: Parsing Error --> syntax error, unexpected 'if' (T_IF) /volume1/web/easy/application/views/appointments/book.php 182
ERROR - 2017-05-14 23:48:22 --> Severity: Parsing Error --> syntax error, unexpected 'if' (T_IF) /volume1/web/easy/application/views/appointments/book.php 182
