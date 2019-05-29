<?php
	require '../vendor/autoload.php';
	//* Set response content type
	header('Content-type: application/json');
	//* Check if is an ajax call
	if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {

		$handle_result = false;
		$handle_message = 'Nothing happened.';
		
		/* Get POST/GET values
		 * eg. $_REQUEST['input_name']; */
		$ip = $_SERVER['REMOTE_ADDR'];
		$g_recaptcha_response = (isset($_POST['g-recaptcha-response'])) ? $_POST['g-recaptcha-response'] : false;
		$g_recaptcha_secret = '';
		
		/* Validate/Sanitize data */
		/* If a recaptcha token isset */
		if ($g_recaptcha_response) {
			if (recaptcha_validation('localhost', 
															 'homepage', 
															 $g_recaptcha_secret, 
															 $g_recaptcha_response, 
															 $ip)) {
				/* Handle your data
				 * Send email, write to DB, or whatever */
				$handle_result = true;
				$handle_message = 'Things worked well.';
			} else {
				$handle_message = 'Invalid ReCaptcha.';
			}
		}

		
		/* Return a response */
		$response = [];
		$response['status'] = $handle_result; //* Boolean
		$response['message'] = $handle_message; //* String, optional
		echo json_encode($response);

	}

	/**
	 * recaptcha_validation
	 *
	 * @return boolean
	 */
	function recaptcha_validation($host, 
																$action, 
																$g_recaptcha_secret, 
																$g_recaptcha_response, 
																$ip)
	{
		$recaptcha = new \ReCaptcha\ReCaptcha($g_recaptcha_secret);
		$resp = $recaptcha->setExpectedHostname($host)
		                  ->setExpectedAction($action)
		                  ->setScoreThreshold(0.5)
			                ->verify($g_recaptcha_response, $ip);
			if ($resp->isSuccess()) {
			    return true;
			} else {
			    $errors = $resp->getErrorCodes();
			    return false;
			}
		}