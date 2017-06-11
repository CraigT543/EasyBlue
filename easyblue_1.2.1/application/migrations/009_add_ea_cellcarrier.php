<?php defined("BASEPATH") or exit("No direct script access allowed");

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2016, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.2.0
 *  MODIFICATION by Craig Tucker
 * ---------------------------------------------------------------------------- */

  class Migration_Add_ea_cellcarrier extends CI_Migration {

    public function up() {
		if (!$this->db->table_exists('ea_cellcarrier') ){
			  $this->dbforge->add_field('id');
			  $this->dbforge->add_field(array(

				'cellco' => array(
				  'type' => 'VARCHAR',
				  'constraint' => '30',
				  'null' => TRUE,
				),
				'cellurl' => array(
				  'type' => 'VARCHAR',
				  'constraint' => '30',
				  'null' => TRUE,
				),
			  ));
			  
			$attributes = array(
				'ENGINE' => 'InnoDB',
				'AUTO_INCREMENT' => 17,
				'DEFAULT CHARSET' => 'utf8'
			);
			
			$this->dbforge->create_table('ea_cellcarrier',TRUE,$attributes);


			$data = array(
					array(
							'id' => 1,
							'cellco' => 'AT&T',
							'cellurl' => '@mms.att.net'
					),
					array(
							'id' => 2,
							'cellco' => 'T-Mobile',
							'cellurl' => '@tmomail.net'
					),
					array(
							'id' => 3,
							'cellco' => 'Verizon',
							'cellurl' => '@vtext.com'
					),
					array(
							'id' => 4,
							'cellco' => 'Sprint',
							'cellurl' => '@messaging.sprintpcs.com'
					),
					array(
							'id' => 5,
							'cellco' => 'Sprint PM',
							'cellurl' => '@pm.sprint.com'
					),
					array(
							'id' => 6,
							'cellco' => 'Virgin Mobile',
							'cellurl' => '@vmobl.com'
					),
					array(
							'id' => 7,
							'cellco' => 'Tracfone',
							'cellurl' => '@mmst5.tracfone.com'
					),
					array(
							'id' => 8,
							'cellco' => 'Metro PCS',
							'cellurl' => '@mymetropcs.com'
					),
					array(
							'id' => 9,
							'cellco' => 'Boost Mobile',
							'cellurl' => '@myboostmobile.com'
					),
					array(
							'id' => 10,
							'cellco' => 'Cricket',
							'cellurl' => '@sms.mycricket.com'
					),
					array(
							'id' => 12,
							'cellco' => 'Alltel',
							'cellurl' => '@message.alltel.com'
					),
					array(
							'id' => 13,
							'cellco' => 'Ptel',
							'cellurl' => '@ptel.com'
					),
					array(
							'id' => 14,
							'cellco' => 'Suncom',
							'cellurl' => '@tms.suncom.com'
					),
					array(
							'id' => 15,
							'cellco' => 'Qwest',
							'cellurl' => '@qwestmp.com'
					),
					array(
							'id' => 16,
							'cellco' => 'U.S. Cellular',
							'cellurl' => '@email.uscc.net'
					)
			);

			$this->db->insert_batch('ea_cellcarrier', $data);			
		}
    }

    public function down() {
		if ($this->db->table_exists('ea_cellcarrier') ){
			  $this->dbforge->drop_table('ea_cellcarrier');
		}
    }

  }
?>
