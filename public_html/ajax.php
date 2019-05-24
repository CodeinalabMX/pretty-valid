<?php
	//* Set response content type
	header('Content-type: application/json');
	//* Check if is an ajax call
	if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
		/* Get POST/GET values
		 * eg. $_REQUEST['input_name']; */
		$some_input = $_REQUEST['input-text'];
		/* Validate/Sanitize data */
		/* Handle your data
		 * Send email, write to DB, or whatever */
		$handle_result = true;
		$handle_message = 'Things went ok ' . $some_input;
		/* Return a response */
		$response = array();
		$response['status'] = $handle_result; //* Boolean
		$response['message'] = $handle_message; //* String, optional
		echo json_encode($response);
	}