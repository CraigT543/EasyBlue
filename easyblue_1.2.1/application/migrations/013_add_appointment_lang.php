<?php defined('BASEPATH') OR exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2016, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.2.0
 * ---------------------------------------------------------------------------- */

class Migration_Add_appointment_lang extends CI_Migration {
	
	
    public function up() {
		if (!$this->db->field_exists('lang', 'ea_appointments')) {			
			$this->load->dbforge();

			$fields = [
				'lang' => [ 
					'type' => 'varchar',
					'constraint' => '256',
					'default' => NULL,
	                'after' => 'id_google_calendar'
				
				]
			]; 

			$this->dbforge->add_column('ea_appointments', $fields); 
			$this->db->update('ea_appointments', ['lang' => NULL]);
		}
	}

    public function down() {
		if ($this->db->field_exists('lang', 'ea_appointments')) {			
			$this->load->dbforge();
			$this->dbforge->drop_column('ea_appointments', 'lang');
		}
    }
}
