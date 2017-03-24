<?php 

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

namespace EA\Engine\Notifications; 

use \EA\Engine\Types\Text;
use \EA\Engine\Types\NonEmptyText;
use \EA\Engine\Types\Url;
use \EA\Engine\Types\Email as EmailAddress;

/**
 * Email Notifications Class
 *
 * This library handles all the notification email deliveries on the system. 
 *
 * Important: The email configuration settings are located at: /application/config/email.php
 */
class Email {
    /**
     * Framework Instance
     *
     * @var CI_Controller
     */
    protected $framework;

    /**
     * Contains email configuration.
     *
     * @var array
     */
    protected $config;

    /**
     * Class Constructor
     *
     * @param \CI_Controller $framework
     * @param array $config Contains the email configuration to be used.
     */
    public function __construct(\CI_Controller $framework, array $config) {
        $this->framework = $framework;
        $this->config = $config;
    }

    /**
     * Replace the email template variables.
     *
     * This method finds and replaces the html variables of an email template. It is used to 
     * generate dynamic HTML emails that are send as notifications to the system users.
     *
     * @param array $replaceArray Array that contains the variables to be replaced.
     * @param string $templateHtml The email template HTML.
     *
     * @return string Returns the new email html that contain the variables of the $replaceArray.
     */
    protected function _replaceTemplateVariables(array $replaceArray, $templateHtml) {
        foreach($replaceArray as $name => $value) {
            $templateHtml = str_replace($name, $value, $templateHtml);
        }

        return $templateHtml;
    }

    /**
     * Send an email with the appointment details.
     *
     * This email template also needs an email title and an email text in order to complete
     * the appointment details.
     *
     * @param array $appointment Contains the appointment data.
     * @param array $provider Contains the provider data.
     * @param array $service Contains the service data.
     * @param array $customer Contains the customer data.
     * @param array $company Contains settings of the company. By the time the
     * "company_name", "company_link" and "company_email" values are required in the array.
     * @param \EA\Engine\Types\Text $title The email title may vary depending the receiver.
     * @param \EA\Engine\Types\Text $message The email message may vary depending the receiver.
     * @param \EA\Engine\Types\Url $appointmentLink This link is going to enable the receiver to make changes
     * to the appointment record.
     * @param \EA\Engine\Types\Email $recipientEmail The recipient email address.
     */
    public function sendAppointmentDetails(array $appointment, array $provider, array $service,
                                           array $customer, array $company, Text $title, Text $message, Url $appointmentLink,
                                           EmailAddress $recipientEmail) {

        // Prepare template replace array.
        $replaceArray = array(
		
			//Notification Mod 1 Craig Tucker start
            '$provider_address'	=> $provider['address'].', '.$provider['city'].', '.$provider['state'].' '.$provider['zip_code'],
			//Notification Mod 1 Craig Tucker end
			//iCal mods 1 Craig Tucker start
			'$method' => 'REQUEST',
			'$icalstart' => gmdate('Ymd\THis\Z', strtotime($appointment['start_datetime'])), 
			'$icalend' => gmdate('Ymd\THis\Z', strtotime($appointment['end_datetime'])), 
			'$icaldatestamp' => gmdate("Ymd\THis\Z"),
			//iCal mods 1 Craig Tucker end
            '$email_title' => $title->get(),
            '$email_message' => $message->get(),
            '$appointment_service' => $service['name'],
            '$appointment_provider' => $provider['first_name'] . ' ' . $provider['last_name'],
			//AM/PM long date mod Craig Tucker, start
			//ORIGINAL '$appointment_start_date' => date('d/m/Y H:i', strtotime($appointment['start_datetime'])),
			'$appointment_start_date' => date('l, F j, Y, g:i a', strtotime($appointment['start_datetime'])),
            //ORIGINAL '$appointment_end_date' => date('d/m/Y H:i', strtotime($appointment['end_datetime'])),
			'$appointment_end_date' => date('l, F j, Y, g:i a', strtotime($appointment['end_datetime'])),
			//AM/PM long date mod Craig Tucker, end
			'$appointment_link' => $appointmentLink->get(),
            '$company_link' => $company['company_link'],
            '$company_name' => $company['company_name'],
            '$customer_name' => $customer['first_name'] . ' ' . $customer['last_name'],
            '$customer_email' => $customer['email'],
            '$customer_phone' => $customer['phone_number'],
            '$customer_address' => $customer['address'],

            // Translations
            'Appointment Details' => $this->framework->lang->line('appointment_details_title'),
            'Service' => $this->framework->lang->line('service'),
            'Provider' => $this->framework->lang->line('provider'),
            'Start' => $this->framework->lang->line('start'),
            'End' => $this->framework->lang->line('end'),
            'Customer Details' => $this->framework->lang->line('customer_details_title'),
            'Name' => $this->framework->lang->line('name'),
            'Email' => $this->framework->lang->line('email'),
            'Phone' => $this->framework->lang->line('phone'),
            'Address' => $this->framework->lang->line('address'),
            'Appointment Link' => $this->framework->lang->line('appointment_link_title')
        );

        $html = file_get_contents(__DIR__ . '/../../application/views/emails/appointment_details.php');
        $html = $this->_replaceTemplateVariables($replaceArray, $html);

		//iCal mods 2 Craig Tucker start
		$email_ics = file_get_contents(__DIR__ . '/../../application/views/emails/iCal.php');
        $email_ics = $this->_replaceTemplateVariables($replaceArray, $email_ics);
		//iCal mods 2 Craig Tucker end

        $mailer = $this->_createMailer();
        $mailer->From = $company['company_email'];
        $mailer->FromName = $company['company_name'];
        $mailer->AddAddress($recipientEmail->get());
		//iCal mods 3 Craig Tucker start
        $mailer->IsHTML(true);
        $mailer->CharSet = 'UTF-8';
		//iCal mods 3 Craig Tucker start
        $mailer->Subject = $title->get();
        $mailer->Body    = $html;
		//iCal mods 4 Craig Tucker start
		$mailer->AltBody = $email_ics;
		$mailer->Ical  =  $email_ics;
		//iCal mods 4 Craig Tucker start
        if (!$mailer->Send()) {
            throw new \RuntimeException('Email could not been sent. Mailer Error (Line ' . __LINE__ . '): ' 
                    . $mailer->ErrorInfo);
        }
    }

    /**
     * Send an email notification to both provider and customer on appointment removal.
     *
     * Whenever an appointment is cancelled or removed, both the provider and customer
     * need to be informed. This method sends the same email twice.
     *
     * <strong>IMPORTANT!</strong> This method's arguments should be taken
     * from database before the appointment record is deleted.
     *
     * @param array $appointment The record data of the removed appointment.
     * @param array $provider The record data of the appointment provider.
     * @param array $service The record data of the appointment service.
     * @param array $customer The record data of the appointment customer.
     * @param array $company Some settings that are required for this function. By now this array must contain 
     * the following values: "company_link", "company_name", "company_email".
     * @param \EA\Engine\Types\Email $recipientEmail The email address of the email recipient.
     * @param \EA\Engine\Types\Text $reason The reason why the appointment is deleted.
     */
    public function sendDeleteAppointment(array $appointment, array $provider,
                                          array $service, array $customer, array $company, EmailAddress $recipientEmail,
                                          Text $reason) {



        // Prepare email template data. 

        $replaceArray = array(
            '$email_title' => $this->framework->lang->line('appointment_cancelled_title'),
            '$email_message' => $this->framework->lang->line('appointment_removed_from_schedule'),
            '$appointment_service' => $service['name'],
            '$appointment_provider' => $provider['first_name'] . ' ' . $provider['last_name'],
			//AM/PM long date mod 2 Craig Tucker, start
            //ORIGINAL '$appointment_date' => date('d/m/Y H:i', strtotime($appointment['start_datetime'])),
			'$appointment_date' => date('l, F j, Y, g:i a', strtotime($appointment['start_datetime'])),
			//AM/PM long date mod 2 Craig Tucker, end
			'$appointment_duration' => $service['duration'] . ' minutes',
            '$company_link' => $company['company_link'],
            '$company_name' => $company['company_name'],
            '$customer_name' => $customer['first_name'] . ' ' . $customer['last_name'],
            '$customer_email' => $customer['email'],
            '$customer_phone' => $customer['phone_number'],
            '$customer_address' => $customer['address'],
            '$reason' => $reason->get(),

			//Notification Mod 2 Craig Tucker start
            '$provider_address'	=> $provider['address'].', '.$provider['city'].', '.$provider['state'].' '.$provider['zip_code'], 
			//Notification Mod 2 Craig Tucker end
			//iCal mods 5 Craig Tucker start
			'$method' => 'CANCEL',
			'$icalstart' => gmdate('Ymd\THis\Z', strtotime($appointment['start_datetime'])), 
			'$icalend' => gmdate('Ymd\THis\Z', strtotime($appointment['end_datetime'])), 
			'$icaldatestamp' => gmdate("Ymd\THis\Z"),
			//iCal mods 5 Craig Tucker end
			
            // Translations
            'Appointment Details' => $this->framework->lang->line('appointment_details_title'),
            'Service' => $this->framework->lang->line('service'),
            'Provider' => $this->framework->lang->line('provider'),
            'Date' => $this->framework->lang->line('start'),
            'Duration' => $this->framework->lang->line('duration'),
            'Customer Details' => $this->framework->lang->line('customer_details_title'),
            'Name' => $this->framework->lang->line('name'),
            'Email' => $this->framework->lang->line('email'),
            'Phone' => $this->framework->lang->line('phone'),
            'Address' => $this->framework->lang->line('address'),
            'Reason' => $this->framework->lang->line('reason')
        );

        $html = file_get_contents(__DIR__ . '/../../application/views/emails/delete_appointment.php');
        $html = $this->_replaceTemplateVariables($replaceArray, $html);

		//iCal mods 6 Craig Tucker start
		$email_ics = file_get_contents(__DIR__ . '/../../application/views/emails/iCal.php');
        $email_ics = $this->_replaceTemplateVariables($replaceArray, $email_ics);
		//iCal mods 6 Craig Tucker end

        // Send email to recipient.
        $mailer = $this->_createMailer();
        $mailer->From = $company['company_email'];
        $mailer->FromName = $company['company_name'];
        $mailer->AddAddress($recipientEmail->get()); // "Name" argument crushes the phpmailer class.
		//iCal mods 7 Craig Tucker start
        $mailer->IsHTML(true);
        $mailer->CharSet = 'UTF-8';
		//iCal mods 7 Craig Tucker end
        $mailer->Subject = $this->framework->lang->line('appointment_cancelled_title');
        $mailer->Body = $html;
		//iCal mods 8 Craig Tucker start
		$mailer->AltBody = $email_ics;
		$mailer->Ical  =  $email_ics;
		//iCal mods 8 Craig Tucker end
        if (!$mailer->Send()) {
            throw new \RuntimeException('Email could not been sent. Mailer Error (Line ' . __LINE__ . '): ' 
                    . $mailer->ErrorInfo);
        }
    }

    /**
     * This method sends an email with the new password of a user.
     *
     * @param \EA\Engine\Types\NonEmptyText $password Contains the new password.
     * @param \EA\Engine\Types\Email $recipientEmail The receiver's email address.
     * @param array $company The company settings to be included in the email.
     */
    public function sendPassword(NonEmptyText $password, EmailAddress $recipientEmail, array $company) {
        $replaceArray = array(
            '$email_title' => $this->framework->lang->line('new_account_password'),
            '$email_message' => $this->framework->lang->line('new_password_is'),
            '$company_name' => $company['company_name'],
            '$company_email' => $company['company_email'],
            '$company_link' => $company['company_link'],
            '$password' => '<strong>' . $password->get() . '</strong>'
        );
        $html = file_get_contents(__DIR__ . '/../../application/views/emails/new_password.php');
        $html = $this->_replaceTemplateVariables($replaceArray, $html);



        $mailer = $this->_createMailer();
        $mailer->From = $company['company_email'];
        $mailer->FromName = $company['company_name'];
        $mailer->AddAddress($recipientEmail->get()); // "Name" argument crushes the phpmailer class.
        $mailer->Subject = $this->framework->lang->line('new_account_password');
        $mailer->Body = $html;

        if (!$mailer->Send()) {
            throw new \RuntimeException('Email could not been sent. Mailer Error (Line ' . __LINE__ . '): ' 
                . $mailer->ErrorInfo);
        }
    }

    /**
     * Create PHP Mailer Instance
     *
     * @return \PHPMailer
     */
    protected function _createMailer()
    {
        $mailer = new \PHPMailer;
        if ($this->config['protocol'] === 'smtp') {
            $mailer->isSMTP();
            $mailer->Host = $this->config['smtp_host'];
            $mailer->SMTPAuth = true;
            $mailer->Username = $this->config['smtp_user'];
            $mailer->Password = $this->config['smtp_pass'];
            $mailer->SMTPSecure = $this->config['smtp_crypto'];
            $mailer->Port = $this->config['smtp_port'];
        }

        $mailer->IsHTML($this->config['mailtype'] === 'html');
        $mailer->CharSet = $this->config['charset'];

        return $mailer;
    }
}
