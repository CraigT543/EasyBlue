<?php
//This was based upon http://glennstovall.com/blog/2013/01/07/writing-cron-jobs-and-command-line-scripts-in-codeigniter/ with modifications for Easy!Appointments by Craig Tucker, 7/18/2014.

class Reminders extends CI_Controller {
    public function __construct() {
        parent::__construct();
		
		$this->load->library('email');
        $this->load->library('session');
		$this->load->model('settings_model');		
        $this->load->model('reminders_model');
		
        // Set user's selected language.
        if ($this->session->userdata('language')) {
        	$this->config->set_item('language', $this->session->userdata('language'));
        	$this->lang->load('translations', $this->session->userdata('language'));
        } else {
        	$this->lang->load('translations', $this->config->item('language')); // default
        }
	}

    public function index() {
		if(!$this->input->is_cli_request()) {
			echo "This script can only be accessed via the command line" . PHP_EOL;
			return;
		}

		$d = 3; //Number of days out for the reminder
		$timestamp = strtotime("+".$d." days");
		$appointments = $this->reminders_model->get_days_appointments($timestamp);
		$baseurl = $this->config->base_url();
		$company_name = $this->settings_model->get_setting('company_name');
		$appointment_link = $this->config->base_url().'index.php/appointments/index/';
		
		if ($d == "1") {
			$notice = "One more day until your appointment.";
		} else {
			$notice = $d." more days until your appointment.";
		}

		$msg = '';
		
		if(!empty($appointments)) {
			foreach($appointments as $appointment) {
				$aptdatetime=date('D g:i a',strtotime($result["start_datetime"]));
				$startdatetime=date('l, F j, Y, g:i a',strtotime($appointment->start_datetime));
				$config['mailtype'] = 'text';
				$this->email->initialize($config);
				$this->email->set_newline("\r\n");
				$this->email->to($appointment->customer_email);
					if (!empty($appointment->customer_cellurl)){
						$phone = $appointment->customer_phone_number;
						$phone = preg_replace('/[^\dxX]/', '', $phone);			
						$this->email->bcc($phone.$appointment->customer_cellurl);
					}
				$this->email->from($appointment->provider_email, $company_name);
				$this->email->subject($notice);
					$msg .= $company_name."\r\n";
					$msg .= "REMINDER: Your appointment with ".$appointment->provider_first_name." ".
						$appointment->provider_last_name." is on ".$startdatetime."\r\n";
					$msg .= "\r\n";
					$msg .= "If you have had a good experience, let others know! Please review me at:\r\n";
					$msg .= "www.healthgrades.com/review/XGVRC\r\n";
					$msg .= "\r\n";
					$msg .= "To edit, reschedule, or cancel your appointment please click the following link:\r\n";
					$msg .= $appointment_link.$appointment->hash."\r\n";
					$msg .= "\r\n";
					$msg .="To attend your session on line, log in to www.craigtuckerlcsw.com and go to 'My Appointments'\r\n";
					
				$this->email->message($msg);
				$this->email->send();
				$msg = "";
				echo $this->email->print_debugger();  
			}
		}
	}
}
/* End of file reminders.php */
/* Location: ./application/controllers/cli/reminders.php */
