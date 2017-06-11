<html>
<head>
    <title>$email_title</title>
</head>
<body style="font: 13px arial, helvetica, tahoma;">
    <div class="email-container" style="width: 650px; border: 1px solid #eee;">
        <div id="header" style="background-color: $background_color; border-bottom: 4px solid $border_bottom;
                height: 45px; padding: 10px 15px;">
            <strong id="logo" style="color: white; font-size: 20px;
                    text-shadow: 1px 1px 1px #8F8888; margin-top: 10px; display: inline-block">
                    $company_name</strong>
        </div>

        <div id="content" style="padding: 10px 15px;">
            <h2>$email_title</h2>
            <p>$email_message</p>

            <h2>Appointment Details</h2>
            <table id="appointment-details">
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Provider</td>
                    <td style="padding: 3px;">$appointment_provider</td>
                </tr>
				<!--Google Maps Mod Craig Tucker start -->
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Address</td>
                    <td style="padding: 3px;"><a href="www.google.com/maps/place/$provider_address">$provider_address</a></td>
				</tr>
				<!--Google Maps Mod Craig Tucker end -->
			</table>	
			$limitdetails
			<table id="appointment-details">
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Service</td>
                    <td style="padding: 3px;">$appointment_service</td>
                </tr>
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Duration</td>
                    <td style="padding: 3px;">$appointment_duration</td>
                </tr>				
				<tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Price</td>
                    <td style="padding: 3px;">$appointment_price_currency</td>
                </tr>
			</table>
			</div>
			<table id="appointment-details">
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Start</td>
                    <td style="padding: 3px;">$appointment_start_date</td>
                </tr>
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">End</td>
                    <td style="padding: 3px;">$appointment_end_date</td>
                </tr>
				
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;"></td>
                    <td style="padding: 3px;"><a href="$appointment_link">Click here to edit, reschedule, or cancel the appointment</td>
                </tr>				
            </table>


            <h2>Customer Details</h2>
            <table id="customer-details">
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Name</td>
                    <td style="padding: 3px;">$customer_name</td>
                </tr>
			</table>
			$limitdetails			
		   <table id="customer-details">	
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Email</td>
                    <td style="padding: 3px;">$customer_email</td>
                </tr>
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Phone</td>
                    <td style="padding: 3px;">$customer_phone</td>
                </tr>
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Address</td>
                    <td style="padding: 3px;">$customer_address</td>
                </tr>
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">City</td>
                    <td style="padding: 3px;">$customer_city</td>
                </tr>
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Zip</td>
                    <td style="padding: 3px;">$customer_zip_code</td>
                </tr>
                <tr>
                    <td class="label" style="padding: 3px;font-weight: bold;">Notes</td>
                    <td style="padding: 3px;">$appt_notes_field</td>
                </tr>
            </table>
			</div>
        </div>

        <div id="footer" style="padding: 10px; text-align: center; margin-top: 10px;
                border-top: 1px solid #EEE; background: #FAFAFA;">
            Powered by
            <a href="http://easyappointments.org" style="text-decoration: none;">Easy!Appointments</a>
            |
            <a href="$company_link" style="text-decoration: none;">$company_name</a>
        </div>
    </div>
</body>
</html>
