<?php
	//* Set response content type
	header('Content-type: application/json');
	//* Do at least some basic validation
	//* Check if is an ajax call
	if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
		//* Handle your data
		$handle_result = true;
		//* Send a response
		$response = array('status'=>$handle_result);
		echo json_encode($response);
	}