<?php defined('BASEPATH') OR exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2017, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.1.0
 * ---------------------------------------------------------------------------- */

class Migration_Add_formatting_and__confidentiality_settings extends CI_Migration {
    public function up() {
        $this->load->model('settings_model');
		
		$this->settings_model->set_setting('reminder_days_out', '1,3');
		$this->settings_model->set_setting('time_format', '24HR');
		$this->settings_model->set_setting('max_date', '30');
		$this->settings_model->set_setting('interval_time', '30');
		$this->settings_model->set_setting('theme_color', 'green');
		$this->settings_model->set_setting('week_starts_on', 'sunday');
		$this->settings_model->set_setting('show_free_price_currency', 'yes');
		$this->settings_model->set_setting('show_any_provider', 'yes');
		$this->settings_model->set_setting('show_minimal_details', 'no');
		$this->settings_model->set_setting('conf_notice', 'no');	
		$this->settings_model->set_setting('google_sync_notice', 'no');	
		$this->settings_model->set_setting('google_sync_from', '');	
		$this->settings_model->set_setting('google_sync_to', '');	
		
    }

    public function down() {
        $this->load->model('settings_model');

        $this->settings_model->remove_setting('reminder_days_out');
        $this->settings_model->remove_setting('time_format');
        $this->settings_model->remove_setting('max_date');
        $this->settings_model->remove_setting('interval_time');
        $this->settings_model->remove_setting('theme_color');
        $this->settings_model->remove_setting('week_starts_on');
        $this->settings_model->remove_setting('show_free_price_currency');
        $this->settings_model->remove_setting('show_any_provider');
        $this->settings_model->remove_setting('show_minimal_details');
        $this->settings_model->remove_setting('conf_notice');
        $this->settings_model->remove_setting('google_sync_notice');
        $this->settings_model->remove_setting('google_sync_from');
        $this->settings_model->remove_setting('google_sync_to');
		
    }
}
