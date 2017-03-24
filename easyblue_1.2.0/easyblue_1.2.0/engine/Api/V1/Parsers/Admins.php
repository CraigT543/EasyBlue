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

namespace EA\Engine\Api\V1\Parsers; 

/**
 * Admins Parser 
 *
 * This class will handle the encoding and decoding from the API requests. 
 */
class Admins implements ParsersInterface {
    /**
     * Encode Response Array 
     * 
     * @param array &$response The response to be encoded.
     */
    public function encode(array &$response) {
        $encodedResponse = [
            'id' => $response['id'] !== null ? (int)$response['id'] : null,
            'firstName' => $response['first_name'],
            'lastName' => $response['last_name'],
            'email' => $response['email'],
            'mobile' => $response['mobile_number'],
            'phone' => $response['phone_number'],
            'address' => $response['address'],
            'city' => $response['city'],
            'state' => $response['state'],
            'zip' => $response['zip_code'],
            'notes' => $response['notes'],
            'settings' => [
                'username' => $response['settings']['username'],
                'notifications' => filter_var($response['settings']['notifications'], FILTER_VALIDATE_BOOLEAN),
                'calendarView' => $response['settings']['calendar_view']
            ]
        ];

        $response = $encodedResponse; 
    }

    /**
     * Decode Request 
     * 
     * @param array &$request The request to be decoded. 
     * @param array $base Optional (null), if provided it will be used as a base array. 
     */
    public function decode(array &$request, array $base = null) {
        $decodedRequest = $base ?: []; 

        if (!empty($request['id'])) {
            $decodedRequest['id'] = $request['id']; 
        }

        if (!empty($request['firstName'])) {
            $decodedRequest['first_name'] = $request['firstName'];
        }

        if (!empty($request['lastName'])) {
            $decodedRequest['last_name'] = $request['lastName'];
        }

        if (!empty($request['email'])) {
            $decodedRequest['email'] = $request['email']; 
        }

        if (!empty($request['mobile'])) {
            $decodedRequest['mobile_number'] = $request['mobile']; 
        }

        if (!empty($request['phone'])) {
            $decodedRequest['phone_number'] = $request['phone']; 
        }

        if (!empty($request['address'])) {
            $decodedRequest['address'] = $request['address']; 
        }

        if (!empty($request['city'])) {
            $decodedRequest['city'] = $request['city']; 
        }

        if (!empty($request['state'])) {
            $decodedRequest['state'] = $request['state']; 
        }

        if (!empty($request['zip'])) {
            $decodedRequest['zip_code'] = $request['zip']; 
        }

        if (!empty($request['notes'])) {
            $decodedRequest['notes'] = $request['notes']; 
        }

        if (!empty($request['settings'])) {
            if (empty($decodedRequest['settings'])) {
                $decodedRequest['settings'] = [];
            }

            if (!empty($request['settings']['username'])) {
                $decodedRequest['settings']['username'] = $request['settings']['username']; 
            }

            if (!empty($request['settings']['password'])) {
                $decodedRequest['settings']['password'] = $request['settings']['password']; 
            }

            if ($request['settings']['notifications'] !== null) {
                $decodedRequest['settings']['notifications'] = filter_var($request['settings']['notifications'], 
                        FILTER_VALIDATE_BOOLEAN); 
            }

            if (!empty($request['settings']['calendarView'])) {
                $decodedRequest['settings']['calendar_view'] = $request['settings']['calendarView']; 
            }
        }

        $request = $decodedRequest; 
    }
}
