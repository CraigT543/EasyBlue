<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2016, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.0.0
 * ---------------------------------------------------------------------------- */

/**
 * Roles Model
 *
 * @package Models
 */
class Roles_Model extends CI_Model {
    /**
     * Get the record id of a particular role.
     *
     * @param string $role_slug The selected role slug. Slugs are
     * defined in the "application/config/constants.php" file.
     * @return int Returns the database id of the roles record.
     */
    public function get_role_id($role_slug) {
        return $this->db->get_where('ea_roles', array('slug' => $role_slug))->row()->id;
    }

    /**
     * Returns all the privileges (bool values) of a role slug.
     *
     * The privilege numbers are converted into bool values of the four main actions (view,
     * add, edit, delete). By checking each value you can know if the user is able to perform
     * this action.
     *
     * @param string $slug The role slug.
     * @return array Returns the privilege value.
     */
    public function get_privileges($slug) {
        $privileges = $this->db->get_where('ea_roles', array('slug' => $slug))->row_array();
        unset($privileges['id'], $privileges['name'], $privileges['slug'], $privileges['is_admin']);

        // Convert the numeric values to bool so that is easier to check whether a
        // user has the required privileges for a specific action.
        foreach($privileges as &$value) {
            $privileges_number = $value;

            $value = array(
                'view' => FALSE,
                'add' => FALSE,
                'edit' => FALSE,
                'delete' => FALSE
            );

            if ($privileges_number > 0) {
                if (intval($privileges_number / PRIV_DELETE) == 1) {
                    $value['delete'] = TRUE;
                    $privileges_number -= PRIV_DELETE;
                }

                if (intval($privileges_number / PRIV_EDIT) == 1) {
                    $value['edit'] = TRUE;
                    $privileges_number -= PRIV_EDIT;
                }

                if (intval($privileges_number / PRIV_ADD) == 1) {
                    $value['add'] = TRUE;
                    $privileges_number -= PRIV_ADD;
                }

                $value['view'] = TRUE;
            }
        }

        return $privileges;
    }
}

/* End of file roles_model.php */
/* Location: ./application/models/roles_model.php */
