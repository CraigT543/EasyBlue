<?php
BEGIN:VCALENDAR
CREATED
LAST-MODIFIED
PRODID:-//Microsoft Corporation//Outlook 12.0 MIMEDIR//EN
VERSION:2.0
METHOD:$method
BEGIN:VEVENT
ORGANIZER:MAILTO: $company_name
DTSTART: $icalstart
DTEND: $icalend
LOCATION: $appointment_provider -- $provider_address
TRANSP:OPAQUE
SEQUENCE:0
UID: $appointment_link
DTSTAMP: $icaldatestamp
DESCRIPTION: $customer_name,\n$email_message\n$appointment_link\n$reason
SUMMARY: $summaryical
PRIORITY:5
CLASS:PUBLIC
END:VEVENT
END:VCALENDAR
?>