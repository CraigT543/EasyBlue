<!DOCTYPE html>
<?php
	$this->load->model('settings_model');			
	$theme_color = $this->settings_model->get_setting('theme_color');
?>
<html>
 
<head>
		   <style type="text/css">
body {
    background: #fff!important;
}

#manage-waitinglist.modal.fade.in {
    padding: 0px!important;
	overflow-y: hidden !important;	
}

.form-group {
    margin-bottom: 0px!important; 
}

p {
    line-height: 105%;
    text-align: justify;
    text-justify: inter-word;
}

			</style>

			
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#35A768">
    <title><?php echo $this->lang->line('page_title') . ' ' .  $company_name; ?></title>

    <?php
        // ------------------------------------------------------------
        // INCLUDE CSS FILES
        // ------------------------------------------------------------ ?>
	<!-- CSS mod Craig Tucker start-->
	<link
        rel="stylesheet"
        type="text/css"
        href="<?php echo base_url('assets/ext/bootstrap/css/bootstrap.custom.css'); ?>">
	<!-- CSS mod Craig Tucker end-->
    <link
        rel="stylesheet"
        type="text/css"
        href="<?php echo base_url('assets/ext/bootstrap/css/bootstrap.min.css'); ?>">
	<link
        rel="stylesheet"
        type="text/css"
        href="<?php echo base_url('assets/ext/jquery-ui/jquery-ui.min.css'); ?>">
    <link
        rel="stylesheet"
        type="text/css"
        href="<?php echo base_url('assets/ext/jquery-qtip/jquery.qtip.min.css'); ?>">
    <link
        rel="stylesheet"
        type="text/css"
        href="<?php echo base_url('assets/css/frontend_' . $theme_color . '.css'); ?>">
    <link
        rel="stylesheet"
        type="text/css"
        href="<?php echo base_url('assets/css/general_' . $theme_color . '.css'); ?>">

<body>

                <?php
                    // ------------------------------------------------------
                    // DISPLAY EXCEPTIONS (IF ANY)
                    // ------------------------------------------------------
                    if (isset($exceptions)) {
                        echo '<div style="margin: 10px">';
                        echo '<h4>' . $this->lang->line('unexpected_issues') . '</h4>';
                        foreach($exceptions as $exception) {
                            echo exceptionToHtml($exception);
                        }
                        echo '</div>';
                    }
                ?>

                <?php
                    // ------------------------------------------------------
                    // SELECT SERVICE AND PROVIDER
                    // ------------------------------------------------------ ?>


                    <div align="center" style="width: 340px; margin: auto;" >
                        <div class="frame-content" style="display:none;">
                            <div  class="form-group">
                            <div class="form-group">
                                <label for="select-provider">
                                    <strong><?php echo $this->lang->line('select_provider'); ?></strong>
                                </label>
                                <select id="select-provider" class="col-md-4 form-control"></select>
                            </div>
								<label><strong><?php echo $this->lang->line('select_service'); ?></strong></label>
                                <select id="select-service" class="col-md-4 form-control">
                                    <?php
                                        // Group services by category, only if there is at least one service
                                        // with a parent category.
                                        $has_category = FALSE;
                                        foreach($available_services as $service) {
                                            if ($service['category_id'] != NULL) {
                                                $has_category = TRUE;
                                                break;
                                            }
                                        }

                                        if ($has_category) {
                                            $grouped_services = array();

                                            foreach($available_services as $service) {
                                                if ($service['category_id'] != NULL) {
                                                    if (!isset($grouped_services[$service['category_name']])) {
                                                        $grouped_services[$service['category_name']] = array();
                                                    }

                                                    $grouped_services[$service['category_name']][] = $service;
                                                }
                                            }

                                            // We need the uncategorized services at the end of the list so
                                            // we will use another iteration only for the uncategorized services.
                                            $grouped_services['uncategorized'] = array();
                                            foreach($available_services as $service) {
                                                if ($service['category_id'] == NULL) {
                                                    $grouped_services['uncategorized'][] = $service;
                                                }
                                            }

                                            foreach($grouped_services as $key => $group) {
                                                $group_label = ($key != 'uncategorized')
                                                        ? $group[0]['category_name'] : 'Uncategorized';

                                                if (count($group) > 0) {
                                                    echo '<optgroup label="' . $group_label . '">';
                                                    foreach($group as $service) {
                                                        echo '<option value="' . $service['id'] . '">'
                                                            . $service['name'] . '</option>';
                                                    }
                                                    echo '</optgroup>';
                                                }
                                            }
                                        }  else {
                                            foreach($available_services as $service) {
                                                echo '<option value="' . $service['id'] . '">'
                                                            . $service['name'] . '</option>';
                                            }
                                        }
                                    ?>
                                </select>
                            </div>
                        </div>

                <?php
                    // ------------------------------------------------------
                    // SELECT APPOINTMENT DATE
                    // ------------------------------------------------------ ?>


	                    <div align="center"><h3 style="text-align: center"><?php echo $this->lang->line('check_availability'); ?></h3></div>

						<div id="myMessage" align="center";>
						<h6 style= "margin-left:20px; margin-right:20px;"><?php echo $this->lang->line('check_availability_msg'); ?><h6>
						</div>
						<div>
							<div align="center" id="select-date" style="position: relative">
							<figure id="wait" class="item">
								<img  src="<?php echo $this->config->item('base_url'); ?>/assets/img/loading.gif" />
							</figure>
							</div>
						</div>	
							<div align="center" style="padding:10px;">
								<a href="https://<?php	echo $_SERVER['SERVER_NAME'];?>/wordpress/register/" target="_parent" class="btn button-waitinglist btn-primary">
									<?php echo $this->lang->line('register'); ?></a>
								<a href="https://<?php echo $_SERVER['SERVER_NAME'];?>/wordpress/login/" target="_parent" class="btn button-waitinglist btn-primary">
                                <?php echo $this->lang->line('login'); ?></a>
								<button id="insert-waitinglist" class="btn button-waitinglist btn-primary" 
									title="<?php echo $this->lang->line('check_availability'); ?>">
									<span class="glyphicon glyphicon-time"></span>
									<?php echo $this->lang->line('waiting_list'); ?>
								</button>
                            </div>
							
								<div id="wrapper">
									<div id="available-hours"></div>
								</div>
							</div>							
                    </div>
					
    
	<!-- MANAGE WAITING LIST Modification Start
	Craig Tucker, craigtuckerlcsw@gmail.com	 -->
	<div id="manage-waitinglist" class="modal fade">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h3 class="modal-title"><?php echo $this->lang->line('waiting_list'); ?></h3>
					<p style= "margin-left:10px; margin-right:10px;"><?php echo $this->lang->line('waiting_list_msg_top1'); ?><?php echo ' ' . $max_date . ' '; ?><?php echo $this->lang->line('waiting_list_msg_top2'); ?></p>
					<p style= "margin-left:10px; margin-right:10px;"><b><u><?php echo $this->lang->line('waiting_list_msg_bottom_header'); ?></u></b><br><?php echo $this->lang->line('waiting_list_msg_bottom'); ?>
					</p>
				</div>
				<div>
					<div class="modal-message alert" style="display: none;"></div>
					<div class="container-fluid" style= "margin-left:10px; margin-right:10px;">
						<div class="form-group">
							<label for="email2" class="control-label">*<?php echo $this->lang->line('email'); ?></label>
							<input type="text" id="email2" class="form-control" maxlength="250" />
							<label for="cell-carrier2">
									<strong><?php echo $this->lang->line('cell_carrier'); ?></strong>
								</label>
								<select id="cell-carrier2" class="col-md-4 form-control">
										<option disabled selected> <?php echo $this->lang->line('select'); ?> </option>	 
										<?php 
									   foreach($cell_services as $carrier) {
										echo '<option value="' . $carrier['cellurl'] . '">' 
													. $carrier['cellco'] . '</option>';
										}
									?>
								</select>
								<label for="phone-number2" class="control-label"><?php echo $this->lang->line('phone_number'); ?></label>
								<input type="text" id="phone-number2" class="form-control" maxlength="60" />
								<em id="form-message" class="text-danger"><?php echo $this->lang->line('fields_are_required'); ?></em>
							</div>					
					</div>
				</div>
				
					<div class="modal-footer">

                    <form id="save-waitinglist-form" style="display:inline-block" method="post">
						<button id="save-waitinglist" type="button" name="submit2" class="btn btn-success" >
						<span class="glyphicon glyphicon-ok"></span>
							<?php echo $this->lang->line('save'); ?>
						</button>
                        <input type="hidden" name="csrfToken" />
                        <input type="hidden" name="post_waiting" />
                    </form>
						
						<button id="cancel-waitinglist" class="btn" data-dismiss="modal">
							<?php echo $this->lang->line('cancel'); ?>
						</button>

					</div>				
					
			</div>
		</div>								
	</div>		
	<!-- MANAGE WAITING LIST Modification End -->	

	
    <?php
        // ------------------------------------------------------------
        // GLOBAL JAVASCRIPT VARIABLES
        // ------------------------------------------------------------ ?>

    <script type="text/javascript">
        var GlobalVariables = {
            availableServices   	: <?php echo json_encode($available_services); ?>,
            availableProviders  	: <?php echo json_encode($available_providers); ?>,
            baseUrl             	: <?php echo json_encode($this->config->item('base_url')); ?>,
            manageMode          	: <?php echo ($manage_mode) ? 'true' : 'false'; ?>,
            dateFormat          	: <?php echo json_encode($date_format); ?>,
            timeFormat          	: <?php echo json_encode($time_format); ?>,
            weekStartson        	: <?php echo json_encode($week_starts_on); ?>,
            maxDate        			: <?php echo json_encode($max_date); ?>,
            showFreePriceCurrency	: <?php echo json_encode($show_free_price_currency); ?>,
            showAnyProvider			: <?php echo json_encode($show_any_provider); ?>,
            appointmentData     	: <?php echo json_encode($appointment_data); ?>,
            providerData        	: <?php echo json_encode($provider_data); ?>,
            customerData        	: <?php echo json_encode($customer_data); ?>,
            csrfToken           	: <?php echo json_encode($this->security->get_csrf_hash()); ?>,
			show_minimal_details	: <?php echo json_encode($show_minimal_details); ?>,
			confNotice				: <?php echo json_encode($conf_notice); ?>

        };

        var EALang = <?php echo json_encode($this->lang->language); ?>;
        var availableLanguages = <?php echo json_encode($this->config->item('available_languages')); ?>;
    </script>

    <?php
        // ------------------------------------------------------------
        // INCLUDE JAVASCRIPT FILES
        // ------------------------------------------------------------ ?>

    <script
        type="text/javascript"
        src="<?php echo base_url('assets/js/general_functions.js'); ?>"></script>
    <script
        type="text/javascript"
        src="<?php echo base_url('assets/ext/jquery/jquery.min.js'); ?>"></script>
    <script
        type="text/javascript"
        src="<?php echo base_url('assets/ext/jquery-ui/jquery-ui.min.js'); ?>"></script>
    <script
        type="text/javascript"
        src="<?php echo base_url('assets/ext/jquery-qtip/jquery.qtip.min.js'); ?>"></script>
    <script
        type="text/javascript"
        src="<?php echo base_url('assets/ext/bootstrap/js/bootstrap.min.js'); ?>"></script>
    <script
        type="text/javascript"
        src="<?php echo base_url('assets/ext/datejs/date.js'); ?>"></script>
    <script
        type="text/javascript"
        src="<?php echo base_url('assets/js/frontend_book_api.js'); ?>"></script>
    <script
        type="text/javascript"
        src="<?php echo base_url('assets/js/frontend_book.js'); ?>"></script>


    <?php
        // ------------------------------------------------------------
        // VIEW FILE JAVASCRIPT CODE
        // ------------------------------------------------------------ ?>

    <script type="text/javascript">
    $(document).ready(function() {
            FrontendBook.initialize(true, GlobalVariables.manageMode);
            GeneralFunctions.enableLanguageSelection($('#select-language'));
        });
		
    </script>

    <?php google_analytics_script(); ?>
</body>

</html>
