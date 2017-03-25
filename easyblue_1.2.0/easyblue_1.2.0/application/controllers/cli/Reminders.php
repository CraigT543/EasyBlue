<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * A modification of Easy!Appointments - Open Source Web Scheduler
 * for use with EasyAppointments by A.Tselegidis <alextselegidis@gmail.com>
 * @link        http://easyappointments.org
 * this uses portions of Alex's code with modifications by Craig Tucker
 * craigtuckerlcsw@verizon.net
 * ---------------------------------------------------------------------------- */

//This was based upon http://glennstovall.com/blog/2013/01/07/writing-cron-jobs-and-command-line-scripts-in-codeigniter/ with modifications for Easy!Appointments by Craig Tucker, 7/18/2014.
//--NZ-- need to fix once i can bok appointments - look at language logic from cli/WaitingList
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
			echo 'This script can only be accessed via the command line' . PHP_EOL;
			return;
		}

		$d = 3; //Number of days out for the reminder
		$timestamp = strtotime("+".$d." days");
		$appointments = $this->reminders_model->get_days_appointments($timestamp);
		$baseurl = $this->config->base_url();
		$company_name = $this->settings_model->get_setting('company_name');
		$appointment_link = $this->config->base_url().'index.php/appointments/index/';
		
		if ($d == "1") {
			$notice = $this->lang->line('notice_reminder');
		} else {
			$notice = $d . ' ' . $this->lang->line('notice_reminder_days');
		}
		
		$msg = '';
		
		if(!empty($appointments)) {
			echo "noticeCUSTOM: " . $notice . PHP_EOL;
			foreach($appointments as $appointment) {
				$aptdatetime=date('D g:i a',strtotime($result['start_datetime']));
				$startdatetime=date('l, F j, Y, g:i a',strtotime($appointment->start_datetime));
				$config['mailtype'] = 'text';
				$this->email->initialize($config);
				$this->email->set_newline(PHP_EOL);
				$this->email->to($appointment->customer_email);
					if (!empty($appointment->customer_cellurl)){
						$phone = $appointment->customer_phone_number;
						$phone = preg_replace('/[^\dxX]/', '', $phone);			
						$this->email->bcc($phone.$appointment->customer_cellurl);
					}
				$this->email->from($appointment->provider_email, $company_name);
				$this->email->subject($notice);
					$msg .= $company_name . PHP_EOL;
					$msg .= $this->lang->line('reminder_your_appt_with') . ' ' . $appointment->provider_first_name. ' ' .
						$appointment->provider_last_name . ' ' .  $this->lang->line('is_on')  . $startdatetime . PHP_EOL;
					$msg .=  PHP_EOL;
					$msg .= $this->lang->line('msg_line1') . PHP_EOL;
					$msg .= $this->lang->line('msg_line2') . PHP_EOL;
					$msg .=  PHP_EOL;
					$msg .= $this->lang->line('msg_line3') . PHP_EOL;
					$msg .= $appointment_link.$appointment->hash . PHP_EOL;
					$msg .=  PHP_EOL;
					$msg .= $this->lang->line('msg_line4') . PHP_EOL;
					
				$this->email->message($msg);
				$this->email->send();
				$msg = '';
				echo $this->email->print_debugger();  
			}
		}
	}
}
/* End of file reminders.php */
/* Location: ./application/controllers/cli/reminders.php */
