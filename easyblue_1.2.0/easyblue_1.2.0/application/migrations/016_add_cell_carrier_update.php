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

  class Migration_Add_cell_carrier_update extends CI_Migration {

    public function up() {
		if (!$this->db->table_exists('ea_cellcarrier') ){
		
			$data = array(
					array(
							'id' => 17,
							'cellco' => 'Bell',
							'cellurl' => '@txt.bell.ca'
					),
					array(
							'id' => 18,
							'cellco' => 'Bell Mobility',
							'cellurl' => '@txt.bellmobility.ca'
					),
					array(
							'id' => 19,
							'cellco' => 'Koodo Mobile',
							'cellurl' => '@msg.koodomobile.com'
					),
					array(
							'id' => 20,
							'cellco' => 'Fido (Microcell)',
							'cellurl' => '@fido.ca'
					),
					array(
							'id' => 21,
							'cellco' => 'Manitoba Telecom Systems',
							'cellurl' => '@text.mtsmobility.com'
					),
					array(
							'id' => 22,
							'cellco' => 'NBTel',
							'cellurl' => '@wirefree.informe.ca'
					),
					array(
							'id' => 23,
							'cellco' => 'PageNet',
							'cellurl' => '@pagegate.pagenet.ca'
					),
					array(
							'id' => 24,
							'cellco' => 'Rogers',
							'cellurl' => '@pcs.rogers.com'
					),
					array(
							'id' => 25,
							'cellco' => 'Sasktel',
							'cellurl' => '@sms.sasktel.com'
					),
					array(
							'id' => 26,
							'cellco' => 'Telus',
							'cellurl' => '@msg.telus.com'
					),
					array(
							'id' => 27,
							'cellco' => 'Virgin Mobile-CA',
							'cellurl' => '@vmobile.ca'
					)

			);

			$updateData = array(
					'id' => 6,
					'cellco' => 'Virgin Mobile-USA',
					'cellurl' => '@vmobl.com'
			);
			
			
			
			$this->db->insert_batch('ea_cellcarrier', $data);	

			$this->db->where('id', 6);
			$this->db->update('ea_cellcarrier', $updateData);			
		}
	}
    

    public function down() {
		if ($this->db->table_exists('ea_cellcarrier') ){
			  $this->dbforge->drop_table('ea_cellcarrier');
		}
    }
  }
?>
