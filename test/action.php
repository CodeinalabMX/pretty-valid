<?php
require '../vendor/autoload.php';














//* Set response content type
header('Content-type: application/json');
  //* Check if is an ajax call
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {

  $handle_result = false;
  $handle_message = 'Nothing happened.';
  
  $g_recaptcha_response = false;
  if (isset($_POST['g-recaptcha-response'])) {
    $g_recaptcha_response = $_POST['g-recaptcha-response'];
    $ip = $_SERVER['REMOTE_ADDR'];
    $hostname = $_SERVER['HTTP_HOST'];

  }

  //* Validate recaptcha if token isset
  if ($g_recaptcha_response) {
    if (g_recaptcha_validation($g_recaptcha_response, 
      $hostname, 
      $ip)) {
      $handle_result = true;
      $handle_message = 'reCaptcha validation success.';
    } else {
      $handle_message = 'reCaptcha validation error.';
    }
  }

  //* Validate/Sanitize POST data
  if () {

  }

  /* Return a response */
  $response = [];
  $response['status'] = $handle_result; //* Boolean
  $response['message'] = $handle_message; //* String, optional
  echo json_encode($response);

}


    /**
     * Google Recaptcha Validation
     *
     * @return boolean
     */
    function g_recaptcha_validation($g_recaptcha_response, $hostname, $ip_address)
    {
      $g_recaptcha_secret_key = '';
      /* If allow_url_fopen is off in production server 
         Enable recaptcha using curl method
         ref: https://stackoverflow.com/a/62086095 */
      $g_recaptcha = new \ReCaptcha\ReCaptcha($g_recaptcha_secret_key, 
                     new \ReCaptcha\RequestMethod\CurlPost());
      $response = $g_recaptcha->setExpectedHostname($hostname)
      ->setScoreThreshold(0.5)
      ->verify($g_recaptcha_response, $ip_address);
      if ($response->isSuccess())
      {
        $this->result_code = 1;
        return true;
      }
      else
      {
        $this->result_code = 2;
        $this->result_message = $response->getErrorCodes();
        return false;
      }
    }


  /**
   * reCaptcha validation
   *
   * Server-side verification
   * https://github.com/google/recaptcha
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