INSERT INTO `ea_roles` (`id`, `name`, `slug`, `is_admin`, `appointments`, `customers`, `services`, `users`, `system_settings`, `user_settings`) VALUES
	(1, 'Administrator', 'admin', 1, 15, 15, 15, 15, 15, 15),
	(2, 'Provider', 'provider', 0, 15, 15, 0, 0, 0, 15),
	(3, 'Customer', 'customer', 0, 0, 0, 0, 0, 0, 0),
	(4, 'Secretary', 'secretary', 0, 15, 15, 0, 0, 0, 15);

INSERT INTO `ea_settings` (`name`, `value`) VALUES
	('company_working_plan', '{"sunday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"monday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"tuesday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"wednesday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"thursday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"friday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]},"saturday":{"start":"09:00","end":"18:00","breaks":[{"start":"11:20","end":"11:30"},{"start":"14:30","end":"15:00"}]}}'),
	('book_advance_timeout', '240'),
	('reminder_days_out', '1,3'),
	('google_analytics_code', ''),
	('customer_notifications', '1'),
	('date_format', 'DMY'),
	('require_captcha', '0'),
	('time_format', '24HR'),
	('max_date', '30'),
	('interval_time', '30'),
	('theme_color', 'green'),
	('week_starts_on', 'sunday'),
	('show_free_price_currency', 'yes'),
	('show_any_provider', 'yes'),
	('show_minimal_details', 'no'),
	('conf_notice', 'no'),
	('google_sync_notice', 'no'),
	('google_sync_from', ''),
	('google_sync_to', ''),
	('wp_invoice','no')

INSERT INTO `ea_cellcarrier` (`id`, `cellco`, `cellurl`) VALUES
	(1, 'Bell', '@txt.bell.ca'),  
	(2, 'Bell Mobility', '@txt.bellmobility.ca'),  
	(3, 'Koodo Mobile', '@msg.koodomobile.com'),  
	(4, 'Fido (Microcell)', '@fido.ca'),  
	(5, 'Manitoba Telecom Systems', '@text.mtsmobility.com'),  
	(6, 'NBTel', '@wirefree.informe.ca'),  
	(7, 'PageNet', '@pagegate.pagenet.ca'),  
	(8, 'Rogers', '@pcs.rogers.com'),  
	(9, 'Sasktel', '@sms.sasktel.com'),  
	(10, 'Telus', '@msg.telus.com'),  
	(11, 'Virgin Mobile', '@vmobile.ca'), 
	(12, 'AT&T', '@mms.att.net'),
	(13, 'T-Mobile', '@tmomail.net'),
	(14, 'Verizon', '@vtext.com'),
	(15, 'Sprint', '@messaging.sprintpcs.com'),
	(16, 'Sprint PM', '@pm.sprint.com'),
	(17, 'Virgin Mobile', '@vmobl.com'),
	(18, 'Tracfone', '@mmst5.tracfone.com'),
	(19, 'Metro PCS', '@mymetropcs.com'),
	(20, 'Boost Mobile', '@myboostmobile.com'),
	(21, 'Cricket', '@sms.mycricket.com'),
	(22, 'Alltel', '@message.alltel.com'),
	(23, 'Ptel', '@ptel.com'),
	(24, 'Suncom', '@tms.suncom.com'),
	(25, 'Qwest', '@qwestmp.com'),
	(26, 'U.S. Cellular', '@email.uscc.net');	
	
INSERT INTO `migrations` (`version`) VALUES
(18);	