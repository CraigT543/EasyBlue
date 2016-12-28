# EasyBlue
<h1>Modifications for Easy!Appointments</h1>

This is my latest build of Easy!Appointments by Alex Tselegidis found at http://easyappointments.org/ and at https://github.com/alextselegidis/easyappointments.  Alex has been very generous to share this. My modifications are a little hacky and ammeture but they work to do some things that are necessary for a clinical practice to flow smoothely.  

<h1>What I have addded that does not exist in the standard Easy!Appointments</h1>

First, a fully booked calender loads a little slow so I have added a <b>loading spinner</b>.  I do not like people booking more than 60 days out so I made it possible to <b>limit the range of days for booking</b>. I added the ability to send appointment <b>reminders xDays before appointments by cell messaging and Email</b>. I added a <b>waiting list</b> application.  I have my clients log into my word press page to book  but I also wanted potential clients to see my availability so I made a <b>preview screen</b> that can go on my front end with out being booked in.  I <b>modified the return to schedule</b> button so that when people push return to book their personal data from the last booking loads automatically.  I made several significant changes for <b>better integration with Google calender</b>. The Sync part of the application allows the client information to be better represented on Google Calendar and so that if I make an appointment recurring in Google Calendar the client information for those recurring appointments will sync back to Easy!Appointments. I made several Date/Time modifications to <b>comply with US AM/PM, Sun-Sat, M/D/Y formatting</b> on front end and partially on back end, and also in the notifications. I <b>enhanced the email booking notification</b> to include more information such as business address with a google maps link and I added an iCal file so that booking will auto fill into Outlook and Thunderbird as well as Gmail if users turn on iCal import.  I also made modifications for <b>better integration with Wordpress</b>. I can coordinate Wordpress user database with Easy!Appointments database such that when a user is logged in their information will auto fill.  And last of all I explain some <b>Gmail modifications</b> I have made to correct some intermittent email problems I was having on my server.

<h1>Things to be aware of and A Word of Caution</h1>

•	<b>Config.php</b>: To avoid problems if you are going to snip pieces of my code, it would probably save you some trouble to use my config.php file because I have a constant that pops up from time to time in my code and if you do not cut it out it will make the program fail.  So if you just use my config.php file, the constant will be in there and you should have no problems with that.

•	<b>File permissions</b>: I run with file permissions set to 755 recursively for folders and 644 for files rather than 700 for all.  I was having problems with 700.

•	<b>My build works inside and outside of WordPress</b>.  Within WordPress you will need to follow my instructions to integrate it.  It is not designed to work with Alex's WP plug in. However, it can work with Alex's plug in if you do not turn on the global function for the WP header and footer in my config.php file.

•	<b>I changed the SQL structure</b> to accommodate a field for WP user ID and a table for Cell Providers.  So to make that happen you can go use the updat procedure for EA to get all the changes.  If you want to only do part, go to to /assets/sql/structure.sql and  just cut the lines you need out of my structure.sql file and run them in phpMyAdmin's sql box and it will make them for you in an existing install.

•	<b>I added the /application/core/MY_Model.php file</b>.  This is just a group of procedures for adding and dropping records etc.  It is a method I like so I added it and used it for my cell carrier modification because I had trouble at the time understanding Alex's methods in his model.  This is unfortunate.  I wish I could have been more true to Alex's style in all things but my knowledge is too limited.  So to do my modifications you would be wise to also add this.

•	<b>Language File</b>: I added and changed a few things in the English language file.  Most of my entries are at the bottom of the file.  Unfortunately I have not been so careful about documenting these additions but I think they are fairly clear there.
 
These changes work fine for me as a solo practicitoner but they may not work well for you. I am comfortable going back and forth between Google Callendar and Easy!Appointments for doing tasks.  For example if using my Google sync mods, I only set recurring appointments in Google Calendar.  I only schedule new appointments in Easy!Appointments. Rescheduling can be done in Google Calendar but you must run sync immediately afterward for the change to manifest in EA. As long as these things are done it runs great.  If you try to schedule a new client in Google Calendar you risk messing up the codes in the notes section of your appoitment.  If that happens, you have to rebuild the calendar in Easy!Appointments.  That requires the following--First disable the sync in EA, then delete the appointment database in Easy!Appointments, find out where the code got messed up in Google Calendar, fix it, and then restart the sync with Google Calendar in EA. If you are building this for someone else they may not be so patient with that.  Also, to get the waiting list and the reminders to send out you must set up a cronjob and that may be frustrating for some.  I do not find it to be a problem but people who what a slick smoothe foolproof system may be disappointed so play with it first.

<h1 id"My Modification Notes">My Modification Notes</h1>
This is an outline of my modifications and where you can find them in my build by the comment line.  I have tried to comment the changes as much as possible for my benefit, so that when updates come to EA I can more quickly update the files. I have not documented the changes for the color theme because that is all basic CSS and there are good resources for that already. Here the rest of the mods I made:

<a href="#Loading Spinner">Loading Spinner</a><br>
<a href="#Limiting the range of days for booking">Limiting the range of days for booking</a><br>
<a href="#Notice from date picker that there are no available appointments">Notice from date picker that there are no available appointments</a><br>
<a href="#Reminders xDays before appointments by Cell Messaging and Email">Reminders xDays before appointments by Cell Messaging and Email</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Cell Carrier Fields">Cell Carrier Fields</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Sending Appointment Reminders">Sending Appointment Reminders</a><br>
<a href="#Waiting List Application">Waiting List Application</a><br>
<a href="#Preview Screen">Preview Screen</a><br>
<a href="#Google Sync Modifications">Google Sync Modifications</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Front end mods">Front end mods</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Back end google sync mods">Back end google sync mods</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Mods for sync back of client and service information on recurring appointments">Mods for sync back of client and service information on recurring appointments</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Google.php mods">Google.php mods</a><br>
<a href="#Date/Time Modifications (including US formatting)">Date/Time Modifications (including US formatting)</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Changing Time Intervals For Front End Date Picker">Changing Time Intervals For Front End Date Picker</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Using AM/PM format on Front End">Using AM/PM format on Front End</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#AM/PM in Notifications">AM/PM in Notifications</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Change backend calendar to Sunday to Saturday format">Change backend calendar to Sunday to Saturday format</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Change backend calendar to Sunday to Saturday format">Backend Appointment Date Picker Modification</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#AM/PM in Backend Appointment Wizard">AM/PM in Backend Appointment Wizard</a><br>
<a href="#Return to Book Modifications">Return to Book Modifications</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Modified Header">Modified Header</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Auto Fill Client Data on Return to Book">Auto Fill Client Data on Return to Book</a><br>
<a href="#Email Notice Modifications">Email Notice Modifications</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Adding iCal Support to Notifications">Adding iCal Support to Notifications</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#CSS Modifications">CSS Modifications</a><br>
<a href="#Modifications for Wordpress Integration">Modifications for Wordpress Integration</a><br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#Making it all work in WordPress">Making it all work in WordPress</a><br>
<a href="#Gmail Modifications">Gmail Modifications</a><br>

<h1 id="Loading Spinner">Loading Spinner</h1>
I use an additional image file on this for loading.  A full calendar loads slowly. I made a graphic to tell clients to wait for the calendar to load before trying to choose a date.  The graphic is located at /assets/img/loading-dots.gif. The coed for this is in   /application/views/appointments/book.php and /application/views/appointments/bookpreview.php under the comment:

	<!-- Craig Tucker mod start 1-->
	<!-- Craig Tucker mod end 1-->

	<!-- Craig Tucker mod start 2-->
	<!-- Craig Tucker mod end 2-->

The graphic is referenced in /application/views/appointments/book.php and /application/views/appointments/bookpreview.php between the comments:

	<!-- Loading Dots Craig Tucker Start -->
	<!-- Loading Dots Craig Tucker End -->

The CSS file is in /assetes/css/frontend.css between these comments:

	/*Loading dots mod Craig Tucker start 1*/
	/*Loading dots mod Craig Tucker end 1*/

	Through . . .

	/*Loading dots mod Craig Tucker start 4*/
	/*Loading dots mod Craig Tucker end 4*/

<h1 id="Limiting the range of days for booking">Limiting the range of days for booking</h1>
I only allow my clients to book out 60 days.  When they book out longer the number of no shows increases.  So, to limit that, I added a setting to the datepicker in /assets/js/frontend_book.js by the comment:

	//MaxDate mod Craig Tucker 1
	//MaxDate mod Craig Tucker 2

in /assets/js/frontend_book_api.js by the comment:

	/*MaxDate mod Craig Tucker*/

in /application/controllers/Appointments.php see the comments:

	//MaxDate mod Craig Tucker 1

	//MaxDate mod Craig Tucker 2 start
	//MaxDate mod Craig Tucker 2 end

<h1 id="Notice from date picker that there are no available appointments">Notice from date picker that there are no available appointments</h1>
When selecting a date on the calendar that has no availability I wanted a notice to state that no appointments are available for that day.  In  /assets/js/frontend_book.js I added code between these two comments:

	//Notice that no appointments are available on the date selected Craig Tucker start
	//Notice that no appointments are available on the date selected Craig Tucker end 

<h1 id="Reminders xDays before appointments by Cell Messaging and Email">Reminders xDays before appointments by Cell Messaging and Email</h1>
Although you may not be using my wordpress method, it is integrated throughout much of my code so, for simplicity, it would be wise to start off by using my config.php file or you can paste in my global variable yourself.  It is found at the bottom of the config.php file under this comment:

	// Wordpress Integration--C. Tucker mod contact at craigtuckerlcsw@gmail.com

Just add that and set it to FALSE and you should not have any problems just copying any of this code over.
To add this we will be building a field for cell carrier and then making a reminder application

<h2 id="Cell Carrier Fields">Cell Carrier Fields</h2>
<b>Database</b>: I have created a cellphone carrier database table, 'ea_cellcarrier', and two additional fields in the 'ea_users': id_cellcarrier and wp_id.  . The 'ea_cellcarrier' table is populated with many popular cell carriers. You will just need to replace those with the carriers in your area.  I used http://www.freecarrierlookup.com/ to get some of mine.  You can also google "mms by email" or "sms by email" and get lists.  In /assets/sql/structure.sql you will find the structure for these database changes.  You can cut and paste the code for ea_cellcarrier and ea_users table into phpMyAdmin to make these. Or you can just run the entire structure.sql file in your new installation.  For installing over your existing EA set up, I have included three additional files in the /application/migrations/ folder (009_add_ea_cellcarrier.php, 010_add_id_cellcarrier.php, and 011_add_wp_id.php).  I have modified the version number to 11 in /application/config/migration.php.  Thus, If you wish to update an existing install, just run the standard update for E!A (https://github.com/alextselegidis/easyappointments/wiki/Update-Guide). The only modification on the basic update guide is that you will need to use my config.php file.  Transfer your information on to my config.php file and all should work.

<b>Models</b>: I added a couple models that you will need to copy over in the application/models directory:

Reminders_model.php
Cellcarrier_model.php

Both Reminders_model.php and Cellcarrier.php work with /application/core/MY_Model.php so that needs to be copied too.

<b>Coding</b>
In /application/controllers/Appointments.php I added all code commented with the following:

	//Craig Tucker cell carrier modification

In /application/controllers/Backend.php I added code between the following comments:

	//Craig Tucker cell carrier modification 1 start
	//Craig Tucker cell carrier modification 1 end

Delete 

	$this->load->view('backend/customers', $view) 
	
and replace with the code between:  

	//Craig Tucker cell carrier modification 2 start
	//Craig Tucker cell carrier modification 2 end

In /application/views/appointments/book.php, I added code between: 

	<!-- Craig Tucker cell carrier mod start -->
	<!-- Craig Tucker cell carrier mod end -->

In this section of code you will also see code between these comments:

	//WP integration code start
	//WP integration code end

This code is not necessary and can be deleted if you are not trying to do my WordPress integration. You can leave it in if you also use my config.php file with the constant set to FALSE.

In /application/views/backend/customers.php I added code between: 

	<!-- Craig Tucker cell carrier mod start -->
	<!--Craig Tucker cell carrier mod end -->

In /assets/js/frontend_book.js I added:
 
	id_cellcarrier: $('#cell-carrier').val(), //Craig Tucker Cell Modification 1
	$('#cell-carrier').val(customer['id_cellcarrier']); //Craig Tucker Cell Modification 2

In /assets/js/backend_customers.js I added:

	id_cellcarrier: $('#cell-carrier').val(), //Cell-carrier mod Craig Tucker 1
	$('#cell-carrier').val(customer['id_cellcarrier']); //Cell-carrier mod Craig Tucker 2

<h2 id="Sending Appointment Reminders">Sending Appointment Reminders</h2>
The reminders require that the cellphone field is working first. The reminders are triggered by a script that is launched by cron tab.  
Create a directory for scripts in /application/controllers/cli

You can copy over the Reminders.php file and the HowToUseCLI.txt file.  The HowToUseCLI.txt file will explain how to set up your Chron job in Crontab.
Adjust the number of days out at this notice in Reminders.php. see the comment:

	//Number of days out for the reminder

<h1 id="Waiting List Application">Waiting List Application</h1>
First, the cell carrier field mods listed above need to be installed. 

The waiting list is launched by this script: /controllers/cli/Waitinglist.php  (this is launched by cron job).  The script is dependent on the following model modifications:

<b>Model Modifications</b>: I modified the /application/models/Appointments_model.php and added procedures to manage my waiting list function at the end of the file.  Copy all code between these comments:

	// Modifications by Craig Tucker for waiting list Start
	// Modifications by Craig Tucker for waiting list End

I modified /application/models/Users_model.php and added the function between these comments:

	// Modifications by Craig Tucker for waiting list Start
	// Modifications by Craig Tucker for waiting list End

Several functions were added to the end of /application/models/Appointments_model.php between these comments:

	//Waiting list functions Craig Tucker start
    //Waiting list functions Craig Tucker end

<b>Controller Modifications</b>: I added messaging code in /application/controllers/appointments.php between the comments:   

	//Waiting List Mod start
	//Waiting List Mod end

I added two functions for the waiting list between these comments:

	//Waiting list functions start
	//Waiting list functions end

I added a long series of functions in /assets/js/frontend_book.js between the two comments:

	//Waiting List Functions start
	//Waiting List Functions end

<b>Java Script Modifications:</b> 

I added a function in /assets/js/frontend_book.js between these comments:

	//Waiting List Functions start
	//Waiting List Functions end

I added a function in /assets/js/frontend_book_api.js between these comments:

	//Waiting list post Craig Tucker start
	//Waiting list post Craig Tucker end

<b>View Modifications</b>: In /application/views/appointments/book.php I added code between these comments:

	<!--Waiting List Button start
	<!--Waiting List Button end-->

	<!-- MANAGE WAITING LIST Modification Start
	<!-- MANAGE WAITING LIST Modification End -->

I also made a change in how the div is formatted to respond better with the waiting list button.  I commented out Alex's code in the comments with Alex's code start and end. My mods are between these comments (it also includes the loading dots discussed above):

	<!-- Craig Tucker mod start-->
	<!-- Craig Tucker mod end-->

I also added two success pages, the first is for the basic front end wizard:

/application/views/appointments/waiting_success.php

And this one is for the preview page, I removed the return button:

/application/views/appointments/waiting_success_viewer.php

<h1 id="Preview Screen">Preview Screen</h1>
I use this in my WordPress website to see availability on front end without being able to schedule anything.  It is very hacky but it works. You will need to copy the following files over to use it. 

/application/controllers/preview.php (this is a copy of Appointments.php renamed and a couple references are changed)
/application/views/appointments/bookpreview.php (this is a stripped down version of book.php with some changed references)

The preview screen also uses the loading spinner discussed in the heading "Loading Spinner".  So you will need the graphic file discussed in that header for the page to look right or you will need to delete the html that references that graphic.

To add this to a WordPress page or a page on an external website, I use an iFrame with code like this:

	<iframe style="float: Right; padding-left: 20px;" src="https://www.MyDomain/wordpress/EasyAppointments/index.php/preview" width="350" height="600" scrolling="No"></iframe>

I have it designed to just reflect 60 min appointments which are standard for me. If you want to let people see other providers and services you can edit the following div:

Change:

	<div class="frame-content" style="display:none;">

to:

	<div class="frame-content">

You will also likely have to change the url to your register and log in buttons.  They are now set to: /wordpress/register/ and /wordpress/login/

<h1 id="Google Sync Modifications">Google Sync Modifications</h1>
My goal was to accurately reflect recurring appointment information set in google calendar back to Easy!Appointments.  This requires that if you make an appointment recurring in Google Calendar, that you also manually sync that appointment in Easy!Appointments.  Otherwise it will not be reflected in the calendar in EA.  You can automate this with Chron Tab.  I explain how to do that in a text file found in /application/controllers/cli/HowToUseCLI.txt 

<h2 id="Front end mods">Front end mods</h2>

To sync the Google Calendar for the newly selected provider before looking to book an appointment, I added the following function in /assets/frontend_book.js between these comments:

	//Google sync prior to viewing the calendar C. Tucker --Start
	//Google sync prior to viewing the calendar C. Tucker --End

The function is called at various places in the fill marked by this comment:

	FrontendBook.googleSync(); //Craig Tucker googleSync mod 1
	FrontendBook.googleSync(); //Craig Tucker googleSync mod 2

<h2 id="Back end google sync mods">Back end google sync mods</h2>
I add a function to grab all the providers id's in application/models/providers_model.php between the comments:

	//Get all providers for Google Sync Mod Craig Tucker start
	//Get all providers for Google Sync Mod Craig Tucker end

In /assets/js/backend_calendar_google_sync.js modifications were made at the following comments:

	//Craig Tucker google sync mod- changed '/index.php/google/sync/' to '/index.php/google/sync2/'

<h2 id="Mods for sync back of client and service information on recurring appointments">Mods for sync back of client and service information on recurring appointments</h2>
To improve sync of client information two ways, so recurring appointments show up as client information and not just 'unavailable' I did the following in /assets/js/backend_calendar_default_view.js between the following comment lines:

	//Google Sync mod 1 Craig Tucker start
	//Google Sync mod 1 Craig Tucker end

	//Google Sync mod 2 Craig Tucker start
	//Google Sync mod 2 Craig Tucker end

In /application/assetts/css under the following comment I changed font-size from 17px to 1px:

	/*ORIGINAL font-size: 17px; Google sync mod Craig Tucker*/

In /application/libraries/google_sync.php  I have documented several modifications between the following comments:

	//Craig Tucker Google Sync Mods 1 Start
	//Craig Tucker Google Sync Mods 1 End

through . . .
	
	//Craig Tucker Google Sync Mods 4 Start
	//Craig Tucker Google Sync Mods 4 End

<h2 id="Google.php mods">Google.php mods</h2>
In order to do accurate sync of recurring appointments in Google Calendar and allow for automatic sync of the calendar with cron job  so that they are reflected in Easy!Appointments I have done a rather large modification of /application/controllers/google.php

Just replace Alex's with mine.

<b>Email Notification of Sync</b>: At the very bottom of /application/controllers/google.php I have remarked out code that will send an email telling you that the sync took place.  You will need to unremark this and enter your information in the variables for this to work. This is very helpful to be sure that your Chron tab file is working.

<h1 id="Date/Time Modifications (including US formatting)">Date/Time Modifications (including US formatting)</h1>

<h2 id="Changing Time Intervals For Front End Date Picker">Changing Time Intervals For Front End Date Picker</h2>
When setting up services Alex has added a field for "Availabilities Type" with the options of fixed or flexible.  
Fixed: This means that the appointments will stack up according to the duration in minutes you choose for your appointments.  So if the duration is 10 min and your day starts at 08:00 the front end will list the availability sequentially at 08:00 08:10, 08:20, 08:30 etc. per the duration you selected for that event.
Flexible: This means that regardless of the duration of your appointment, the availability will always stack on the nearest interval of 15 minutes (by default).  Thus your 10 min appointment will stack sequentially at 08:00 08:15, 08:30, 08:45 etc.  And if you book that 10 min appointment, the next series will be 8:10, 8:25, 8:40, etc.  The default interval can be changed in /application/controllers/Appointments.php at the variable:

	$interval = $availabilities_type === AVAILABILITIES_TYPE_FIXED ? (int)$service_duration :

I changed the service duration from 15; to 60;

I prefer my appointments stacking up only on the hour and half hour in 60 min increments regardless of the duration of the appointment.  I was able to do this with the older system in EA.  To bring back the older method, I added two more options in the "Availabilities Type" combo box. I added options for appointments appearing only on the hour or half hour (Q30); and another for only on the quarter hour (Q15). To make this possible:

In /application/config/constants.php I added two constants between the comments:

	//Additional availabilities types Craig Tucker start
	//Additional availabilities types Craig Tucker end

In /application/models/Services_model.php I added the new constants between the comments:

	// Availabilities modifications Craig Tucker start
	// Availabilities modifications Craig Tucker end 

In /application/controllers/Appointments.php I added the Q30 and Q15 conditions between the comments:

	//Availabilities Type Mod Craig Tucker start
	//Availabilities Type Mod Craig Tucker end
 
In /application/views/backend/services.php I added options to the combo box between these comments:

	<!--Aditional availabilities types Craig Tucker start -->
	<!--Aditional availabilities types Craig Tucker end-->

<h2 id="Using AM/PM format on Front End">Using AM/PM format on Front End</h2>

In /application/controllers/Appointments.php go to this string

	$available_hours[] = $current_hour->format

Military is (default):

	$available_hours[] = $current_hour->format('H:i');

AM/PM is:

	$available_hours[] = $current_hour->format('h:i a');

Also you will need to comment out two instances of this line

	sort($available_hours, SORT_STRING );

to this:

	//sort($available_hours, SORT_STRING );

In /assets/js/frontend_book.js modifications are made between these comments:

	//AM/PM Modification 1 start
	//AM/PM Modification 1 end

	//AM/PM Modification 2 start
	//AM/PM Modification 2 end

In /assets/js/frontend_book_api.js modifications are made between these comments:

	//AM/PM Time Change Mod 1 Craig Tucker start
	//AM/PM Time Change Mod 1 Craig Tucker end

<h2 id="AM/PM in Notifications">AM/PM in Notifications</h2>
I reformatted the notification dates to be in AM/PM with a long date format.

In /engine/Notifications/Email.php to address date and time in notifications, modifications were made between these comments:
 
	//AM/PM long date mod 1 Craig Tucker, start
	//AM/PM long date mod 1 Craig Tucker, end
   
	//AM/PM long date mod 2 Craig Tucker, start
	//AM/PM long date mod 2 Craig Tucker, end

<h2 id="Change backend calendar to Sunday to Saturday format">Change backend calendar to Sunday to Saturday format</h2> 
In these three files:

/assets/js/backend_calendar_appointments_modal.js
/assets/js/backend_calendar_default_view.js
/assets/js/backend_calendar_unavailabilities_modal.js

-- I changed all instances of 

	firstDay: 0

To this:

	firstDay: 1

In these two files:

/application/views/backend/settings.php
/application/views/backend/users.php

I moved Sunday to the top of Day arrangements in the class "working-plan table table-striped".  I searched for Sunday cell and copied all within the <tr> and </tr> tags for Sunday then move it up before the Monday <tr> tag.

<h2 id="Backend Appointment Date Picker Modification">Backend Appointment Date Picker Modification</h2>
Josep Maria Freixes came up with some code to automatically add end time based upon the appointment selected in the backend appointment date picker.  I found this to be very useful.  The code goes in /assettes/js/backend_calendar_appointments_modal.js and is found between these two comments:

	//Change the end time automatically, added by Craig Tucker start
	//Change the end time automatically, added by Craig Tucker end

I also changed the workflow in the calendar view with start date at top followed by the appointment selector box, and then the end date and time. I moved the form group div containing select-service between start and end date.  This is done in /application/views/backend/calendar.js.

<h2 id="AM/PM in Backend Appointment Wizard">AM/PM in Backend Appointment Wizard</h2>
In /assets/ext/jquery-ui/jquery-ui-timepicker-addon.js cange the timeFormat variable:

timeFormat: 'hh:mm tt',

<h1 id="Return to Book Modifications">Return to Book Modifications</h1>
I wanted my clients to hit the "Go To Booking Page" and to be able to make more appointments without having to re-enter their personal information.  This is possible if the return url includes the hash for the current appointment.

<h2 id="Modified Header">Modified Header</h2>
I modified the header so that an options for New, Edit, and Cancel are all available when the hash link url is selected in the email notification or when hitting my modified return button after scheduling an appointment.  I also added a menu page to select New, Edit, Cancel options.  The English Language file contains several new fields found between

	//Craig Tucker Mods start
	//Craig Tucker Mods start end

I added /assets/js/frontend_book.js between the two comments:

	// Mod cancel bar to new/modify/delete - start
	// Mod cancel bar to new/modify/delete - end

In /assets/css/frontend.css modifications are between these comments:

	/* Return to book mod 1 Craig Tucker start*/
	/* Return to book mod 1 Craig Tucker end*/

	/* Return to book mod 2 Craig Tucker start*/
	/* Return to book mod 2 Craig Tucker end*/

<h2 id="Auto Fill Client Data on Return to Book">Auto Fill Client Data on Return to Book</h2>
In /application/views/appointments/book_success.php I have modified the string for the return button to include the hash of the appointment:

	<a href="'.$this->config->base_url(); ?>index.php/appointments/index/<?php echo $appointment_data['hash'].'" class="btn btn-success btn-large">

<h1 id="Email Notice Modifications">Email Notice Modifications</h1>
Note: To change time formatting see heading Date/Time Modifications (including US formatting) and subheading AM/PM in Notifications.
I wanted my email notice to include my address and I wanted to tighten up  the notice so that the hash to cancel was close to the statement that you can make changes by hitting the link. So to add that information in I did the following modifications.

In /application/controllers/Appointments.php I have two items between these comments:

	//Notification Mod 1 Craig Tucker start
	//Notification Mod 1 Craig Tucker end

through . . .

	//Notification Mod 4 Craig Tucker start
	//Notification Mod 4 Craig Tucker end

In /application/controllers/Backend_api.php I have two items between these comments:

	//Notification Mod 1 Craig Tucker start
	//Notification Mod 1 Craig Tucker end

	//Notification Mod 2 Craig Tucker start
	//Notification Mod 2 Craig Tucker end
 
In /engine/Notifications/Email.php I made modifications between these comments:

	//Notification Mod 1 Craig Tucker start
	//Notification Mod 1 Craig Tucker end

	//Notification Mod 2 Craig Tucker start
	//Notification Mod 2 Craig Tucker end

Added a Link to Google Maps in 

/application/views/emails/appointment_details.php between these comments:

	<!--Google Maps Mod Craig Tucker start -->
	<!--Google Maps Mod Craig Tucker end -->

I also made some rearrangements of the html that work better for my business.

<h2 id="Adding iCal Support to Notifications">Adding iCal Support to Notifications</h2>
EA imports into Google Calendar with a button.  I wanted automatic import of the calendar data into Outlook, Thunderbird-Lightning, and iCloud Calendar as well as Google Calendar for persons that have automatic import authorized.  Adding iCal support is what makes this possible.  To make this happen I did the following:

In /application/views/emails

I added iCal.php

In /engine/Notifications/Email.php several modifications were made between the following comments:

	//iCal mods 1 Craig Tucker start
	//iCal mods 1 Craig Tucker end

through . . .

	//iCal mods 8 Craig Tucker start
	//iCal mods 8 Craig Tucker end


<h1 id="Modifications for Wordpress Integration">Modifications for Wordpress Integration</h1> 
Although Alex's WordPress plug in works well and is very easy to use, I wanted to tie in more deeply with WordPress so that I could use some of the WordPress functions to assign a WordPress ID to each client, and then to auto fill EA client information with WP user information when clients log into my WordPress site.  I also wanted EA to take on some of the styling elements from the WordPress CSS. So this is how I accomplished that:

In /assets/sql/structure.sql I modified the database to include a wp_id field to coordinate with Wordpresses user ID.
In /assetts/frontend_book.js I added: 

	wp_id: $('#wp-id').val(), //WP mod Craig Tucker 1
	$('#wp-id').val(customer.wp_id); //WP mod Craig Tucker 2

in /assetts/backend_customers_helper.js

	wp_id: $('#wp-id').val(), //WP mod Craig Tucker 1
	$('#wp-id').val(customer.wp_id); //WP mod Craig Tucker 2

At the root of Easy!Appointments in index.php I added a conditional statment and a function between these comments:

	//Craig Tucker, WP-EA plugin modifications start
	//Craig Tucker, WP-EA plugin modifications end

At the root of Easy!Appointments in config.php I added the WP_HEADER_FOOTER constant under the following comment:

	// Wordpress Integration--C. Tucker mod contact at craigtuckerlcsw@gmail.com

In /application/views/appointments/book.php I have added the WP header and footer tags and made the customer fields auto fill with WP User data with added code between the following comments:

	<!-- WP Mod 1 Craig Tucker start -->
	<!-- WP Mod 1 Craig Tucker end -->

through . . .

	<!-- WP Mod 6 Craig Tucker start -->
	<!-- WP Mod 6 Craig Tucker end -->

In /application/views/backend/customers.php I have added a field between:

	<!--Craig Tucker WP mod start -->
	<!--Craig Tucker WP mod end -->

In /application/views/backend/customers.php you will also see a variable for WP mod within my Cell Carrier modification.  I explain how to add or delete that In the section "Reminders xDays before appointments by Cell Messaging and Email", Sub heading "Cell Carrier Fields:", Sub heading "Coding", in the discussion of these comment lines:

	//WP integration code start
	//WP integration code end
	
<h2 id="CSS Modifications">CSS Modifications</h2>
I added /assets/ext/bootstrap/css/bootstrap.custom.css to help with some formatting problems in the WP window. This is linked in the book.php view.

<h2 id="Making it all work in WordPress">Making it all work in WordPress</h2>


•	Option 1: If you use Alex's plugin, you will need to replace his files in the \ea-vendor\ directory with mine.  You can then zip it up and plug it into your installation.  Alex uses an iFrame to accomplish his method and it allows WP and EA to work as two independent services.  This has some advantages.  But it does not work well for a logged in approach.  So if you use mine with the WP_HEADER_FOOTER constent set to true in the config.php file you will not be able to use his short code. You will keep the WP_HEADER_FOOTER variable in the config.php file set to false durring installation.<br>
•	Option 2: install my Easy!Appointments directory within my WordPress directory and install it normally per the normal EA process by navigating to www.yourdomain.com/wordpress/youreasyappointments .  In the Easy!Appointments config.php file I use the WordPress database credentials for the installation.  I keep the WP_HEADER_FOOTER variable in the config.php file set to false.<br>  
•	Then when all is installed and running I set the WP_HEADER_FOOTER to true.  Now when you navigate to www.yourdomain.com/wordpress/youreasyappointments you will now see easy appointments with your wordpress theme formatting. And all WP functions will run in your EA file.  If you have EA running behind a sign in the fields will auto fill with the WP user information (cool).<br>
•	I install the "Page Links To" plugin from the WP plugin store.<br>  
•	I create a page and name it something.  I use the same name as my Easy!Appointments directory but that is not necessary.<br>  
•	I open the page to edit and at the bottom of the page there is the "Page Links To" box.  I put the Easy!Appointments url there and save.  Now Easy!Appointments works as a page within WordPress.<br>
•	If you want the phone number and cell phone data to auto fill you will need to modify the user registration.  I use the "Theme My Login" plug in for this. I within that plug in I design a custom registration template to include these fields by following the instructions on the "Theme My Login" site.  The most difficult part of this was setting up the functions.php file.  I have included a copy of what I did within my functions.php in a file attached called WP_theme_functions.php.  If you are not adding the cell carrier field to your installation be sure to delete those fields from this example.


<h1 id="Gmail Modifications">Gmail Modifications</h1>
I found that my email notifications were not going out regularly and that I was getting email errors frequently.  One solution was to reset my server (not acceptable).  An authentic solution is to go to /vendor/phpmailer/phpmailer/class.phpmailer.php and to edit the following with your credentials for gmail.  

	public $Mailer = 'smtp';
	public $Host = 'smtp.gmail.com';
	public $SMTPSecure = 'tls';
	public $Port = 587;   
	public $SMTPAuth = true;
	public $Username = 'username@gmail.com';
	public $Password = 'mypassword'; 
