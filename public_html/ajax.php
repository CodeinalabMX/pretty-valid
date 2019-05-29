<?php
	//* Set response content type
	header('Content-type: application/json');
	//* Check if is an ajax call
	if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
		/* Get POST/GET values
		 * eg. $_REQUEST['input_name']; */
		$some_input = '';
		foreach ($_POST as $key => $value) {
			$some_input.= $key.': ' . $value . ' / ';
		}
		/* Validate/Sanitize data */
		$ip = $_SERVER['REMOTE_ADDR'];
		$g_recaptcha_response = $_POST['g-recaptcha-response'];
		$g_recaptcha_secret = '6LcSBqUUAAAAAGxFVGdJzCO8jDJWxQNXvq6nLlXt';
		if (recaptcha_validation('localhost', 
														 'homepage', 
														 $g_recaptcha_secret, 
														 $g_recaptcha_response, 
														 $ip)) {
			/* Handle your data
			 * Send email, write to DB, or whatever */
			$handle_result = true;
		} else {
			$handle_result = false;
			$handle_message = 'El captcha no fue validado, intentalo nuevamente.'
		}
		
		$handle_message = 'Things went ok ' . $some_input;
		/* Return a response */
		$response = array();
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
		$recaptcha = new \ReCaptcha\ReCaptcha($secret);
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