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

class Migration_Add_user_notification extends CI_Migration {
	
    public function up() {
		if (!$this->db->field_exists('notifications', 'ea_users')) {			
			$this->load->dbforge();

			$fields = [
				'notifications' => [ 
					'type' => 'tinyint',
					'constraint' => '4',
					'default' => 1,
	                'after' => 'lang'
				
				]
			]; 

			$this->dbforge->add_column('ea_users', $fields); 
			$this->db->update('ea_users', ['notifications' => 0]);
		}
	}

    public function down() {
		if ($this->db->field_exists('notifications', 'ea_users')) {			
			$this->load->dbforge();
			$this->dbforge->drop_column('ea_users', 'notifications');
		}
    }
}
