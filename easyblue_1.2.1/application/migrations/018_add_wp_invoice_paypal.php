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

class Migration_Add_wp_invoice_paypal extends CI_Migration {
    public function up() {
        $this->load->model('settings_model');
		$this->settings_model->set_setting('wp_invoice', 'no');	
		
		if (!$this->db->field_exists('pending', 'ea_appointments')) {			
			$this->load->dbforge();

			$fields = [
				'pending' => [ 
					'type' => 'text',
					'default' => '',
					]
			]; 

			$this->dbforge->add_column('ea_appointments', $fields); 
			$this->db->update('ea_appointments', ['pending' => '']);
		}		
    }

    public function down() {
        $this->load->model('settings_model');

        $this->settings_model->remove_setting('wp_invoice');
		
		if ($this->db->field_exists('pending', 'ea_appointments')) {			
			$this->load->dbforge();
			$this->dbforge->drop_column('ea_appointments', 'pending');
		}
    }
}
