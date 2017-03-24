<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * A modification of Easy!Appointments - Open Source Web Scheduler
 * for use with EasyAppointments by A.Tselegidis <alextselegidis@gmail.com>
 * @link        http://easyappointments.org
 * this uses portions of Alex's code with modifications by Craig Tucker
 * craigtuckerlcsw@verizon.net
 * ---------------------------------------------------------------------------- */

/**
 * User Controller 
 *
 * @package Controllers
 */
class Waitinglist extends CI_Controller {
    public function __construct() {
        parent::__construct();
		$this->load->library('email');
        $this->load->library('session');
		$this->load->model('settings_model');		
        
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
		$this->load->model('user_model');
		$this->load->model( array('appointments_model'));		  

		$company_name = $this->settings_model->get_setting('company_name');
		$currentsched = $this->config->base_url();
		$appointment_link = $this->config->base_url().'index.php/appointments/index/';
		$msg = "";
		$waiting_notices = $this->appointments_model->get_waitinglist();		

		if(!empty($waiting_notices)){
			foreach ($waiting_notices as $notice) {
				$provider_id = $notice->id_users_provider;
				$provider = $this->user_model->get_user_display_name($provider_id);
				$pemail = $this->user_model->get_user_email($provider_id);
				$emailphone = $notice->notes;
				$addresses = explode(";", $emailphone);
				$subject = "Waiting List Update";
				$availability = $this->availabilitylist($provider_id);
				$config['mailtype'] = 'text';
				$this->email->initialize($config);
				$this->email->set_newline("\r\n");
				$this->email->from($pemail, $company_name);
				$this->email->to($addresses[0]);
				$this->email->bcc($addresses[1]);
				$this->email->subject($subject);

				if (empty($availability)){
					$msg .= strtoupper($company_name)."\r\n";
					$msg .= "Update: ". $provider ." has no availabilty at this time:\r\n";
					$msg .= "\r\n";
					$msg .= "To view the current schedule click here: ".$currentsched." \r\n";
					$msg .= "\r\n";
					$msg .= "To remove yourself from the waiting list please click the following link:\r\n";
					$msg .= $appointment_link.$notice->hash."\r\n";
				}else{
					$msg .= strtoupper($company_name)."\r\n";
					$msg .= "Update: ". $provider ." has availabilty on the following dates and times:\r\n";
					$msg .= "\r\n";
					$msg .=	$availability."\r\n";
					$msg .= "To make an appointment click here: ".$currentsched." \r\n";
					$msg .= "\r\n";
					$msg .= "To remove yourself from the waiting list please click the following link:\r\n";
					$msg .= $appointment_link.$notice->hash."\r\n";
					}

				$this->email->message($msg);
				$this->email->send();
				$msg = "";
				echo $this->email->print_debugger();  
			}
		}
    }

    public function get_available_hours($selected_date, $provider_id) {
        $this->load->model('providers_model');
        $this->load->model('appointments_model');
        $this->load->model('settings_model');
        
        $empty_periods = $this->get_provider_available_time_periods($selected_date, $provider_id);

            // Calculate the available appointment hours for the given date. The empty spaces 
            // are broken down to 15 min and if the service fit in each quarter then a new 
            // available hour is added to the "$available_hours" array.

        $available_hours = array();

        foreach ($empty_periods as $period) {
                $start_hour = new DateTime($selected_date . ' ' . $period['start']);
                $end_hour = new DateTime($selected_date . ' ' . $period['end']);

                $minutes = $start_hour->format('i');

                if ($minutes % 30 != 0) {
                    // Change the start hour of the current space in order to be
                    // on of the following: 00, 15, 30, 45.
                    if ($minutes < 30) {
                    //    $start_hour->setTime($start_hour->format('H'), 15);
                    //} else if ($minutes < 30) {
                        $start_hour->setTime($start_hour->format('H'), 30);
                    //} else if ($minutes < 45) {
                     //   $start_hour->setTime($start_hour->format('H'), 45);
                    } else {
                        $start_hour->setTime($start_hour->format('H') + 1, 00);
                    }
                }
				
                $current_hour = $start_hour;
                $diff = $current_hour->diff($end_hour);
				//intval() is the default duration to search for availability
                while (($diff->h * 60 + $diff->i) >= intval(60)) {
                    $available_hours[] = $current_hour->format('g:ia');
                    $current_hour->add(new DateInterval("PT60M"));
                    $diff = $current_hour->diff($end_hour);
                }
            }

		//sort($available_hours, SORT_STRING );
        $available_hours = array_values($available_hours);
        return array_values($available_hours); 
	}

    public function get_provider_available_time_periods($selected_date, $provider_id) {
        $this->load->model('appointments_model');
        $this->load->model('providers_model');
        
        // Get the provider's working plan and reserved appointments.        
        $working_plan = json_decode($this->providers_model->get_setting('working_plan', $provider_id), true);
        
        $where_clause = array(
            //'DATE(start_datetime)' => date('Y-m-d', strtotime($selected_date)),
            'id_users_provider' => $provider_id
        );     
        
        $reserved_appointments = $this->appointments_model->get_batch($where_clause);
        
        
        // Find the empty spaces on the plan. The first split between the plan is due to 
        // a break (if exist). After that every reserved appointment is considered to be 
        // a taken space in the plan.
        $selected_date_working_plan = $working_plan[strtolower(date('l', strtotime($selected_date)))];
        $available_periods_with_breaks = array();
        
        if (isset($selected_date_working_plan['breaks'])) {
            if (count($selected_date_working_plan['breaks'])) {
                foreach($selected_date_working_plan['breaks'] as $index=>$break) {
                    // Split the working plan to available time periods that do not
                    // contain the breaks in them.
                    $last_break_index = $index - 1;

                    if (count($available_periods_with_breaks) === 0) {
                        $start_hour = $selected_date_working_plan['start'];
                        $end_hour = $break['start'];
                    } else {
                        $start_hour = $selected_date_working_plan['breaks'][$last_break_index]['end'];
                        $end_hour = $break['start'];
                    }

                    $available_periods_with_breaks[] = array(
                        'start' => $start_hour,
                        'end' => $end_hour
                    );
                }

                // Add the period from the last break to the end of the day.
                $available_periods_with_breaks[] = array(
                    'start' => $selected_date_working_plan['breaks'][$index]['end'],
                    'end' => $selected_date_working_plan['end']
                );
            } else {
                $available_periods_with_breaks[] = array(
                    'start' => $selected_date_working_plan['start'],
                    'end' => $selected_date_working_plan['end']
                );
            }
        }
        
        // Break the empty periods with the reserved appointments.
        $available_periods_with_appointments = $available_periods_with_breaks;
        
        foreach($reserved_appointments as $appointment) {
            foreach($available_periods_with_appointments as $index => &$period) {
            
                $a_start = strtotime($appointment['start_datetime']);
                $a_end =  strtotime($appointment['end_datetime']);
                $p_start = strtotime($selected_date .  ' ' . $period['start']);
                $p_end = strtotime($selected_date .  ' ' .$period['end']);

                if ($a_start <= $p_start && $a_end <= $p_end && $a_end <= $p_start) {
                    // The appointment does not belong in this time period, so we
                    // will not change anything.
                } else if ($a_start <= $p_start && $a_end <= $p_end && $a_end >= $p_start) {
                    // The appointment starts before the period and finishes somewhere inside.
                    // We will need to break this period and leave the available part.
                    $period['start'] = date('H:i', $a_end);

                } else if ($a_start >= $p_start && $a_end <= $p_end) {
                    // The appointment is inside the time period, so we will split the period
                    // into two new others.
                    unset($available_periods_with_appointments[$index]);
                    $available_periods_with_appointments[] = array(
                        'start' => date('H:i', $p_start),
                        'end' => date('H:i', $a_start)
                    );
                    $available_periods_with_appointments[] = array(
                        'start' => date('H:i', $a_end),
                        'end' => date('H:i', $p_end)
                    );

                } else if ($a_start >= $p_start && $a_end >= $p_start && $a_start <= $p_end) {
                    // The appointment starts in the period and finishes out of it. We will
                    // need to remove the time that is taken from the appointment.
                    $period['end'] = date('H:i', $a_start);

                } else if ($a_start >= $p_start && $a_end >= $p_end && $a_start >= $p_end) {
                    // The appointment does not belong in the period so do not change anything.
                } else if ($a_start <= $p_start && $a_end >= $p_end && $a_start <= $p_end) {
                    // The appointment is bigger than the period, so this period needs to be 
                    // removed.
                    unset($available_periods_with_appointments[$index]);
                }
            }
        }
        return array_values($available_periods_with_appointments);
    }

	public function availabilitylist($provider_id){
		$availabilitylist = "";
		// Start date
		$date = date('d-m-Y',strtotime('+1 days')); //to change the days out strtotime e.g.('+2 days')
		// End date
		$end_date = date('d-m-Y',strtotime('+60 days')); //to change the days out strtotime e.g('+2 days')
		
		while (strtotime($date) <= strtotime($end_date)) {
			$dateview=date('m/d/Y, l',strtotime($date));
			$availabehours=$this->get_available_hours($date, $provider_id);
			if (!empty($availabehours)) {
				$availableslots = $this->get_available_hours($date, $provider_id);

				$foundAm = false;
				$foundPm = false;
				foreach( $availableslots as $index => $timeSlot ) {
					if( strpos( $timeSlot, "am" ) !== false && $foundAm === false ) {
							$foundAm = true;
							continue;
					} else if( strpos( $timeSlot, "pm" ) !== false && $foundPm === false ) {
							$foundPm = true;
							continue;
					}
					 $availableslots[$index] = trim( str_replace( array( "am", "pm" ) , "", $timeSlot ) );
				}
				
				$cstimes = implode(", ", $availableslots);
				$daysandslots = $dateview.": ".$cstimes."\n\n";
				$availabilitylist .= $daysandslots;
			}
			$date = date ('d-m-Y', strtotime("+1 day", strtotime($date)));
		}
		return $availabilitylist;
	}
}
/* End of file 'waitinglist'.php */
/* Location: ./application/controllers/ci/'waitinglist'.php */