<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Test extends CI_Controller { 
	public function __construct() { 
		parent::__construct(); 
		$this->load->library('email');
	}
	
  public function index(){
	if(!$this->input->is_cli_request()) {
		echo 'This script can only be accessed via the command line' . PHP_EOL;
		return;
	}
	
	
		$pemail = "craig@craigtuckerlcsw.com";
		$company_name = "Craig Tucker, LCSW";
		$sms_field = "9093892414@tmomail.net";
		$sms_subject = "My Test SMS";

		$str = PHP_EOL;
		$str .= 'This is the first line.' . PHP_EOL;
		$str .= 'This is the second ling.' . PHP_EOL;
		$str .= 'This is the last line';
		
		$email = new \EA\Engine\Notifications\Email($this, $this->config->config);
		$email->sendTxtMail($pemail, $company_name, $sms_field, $sms_subject, $str);

		echo  $sms_field . PHP_EOL;	
		$email_field = "craigtuckerlcsw@verizon.net";
		$subject = "My test email";		
		$msg = "<h1>A Title</h1><p>And some text below</p>";

		$email = new \EA\Engine\Notifications\Email($this, $this->config->config);
		$email->sendHtmlMail($pemail, $company_name, $email_field, $subject, $msg);

		echo $email_field . PHP_EOL;
		

  }
}
?>



		
