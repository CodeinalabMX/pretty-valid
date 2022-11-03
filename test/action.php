<?php
require '../vendor/autoload.php';

$actions = ['submit-form-demo', 'submit-form-demo-1'];

if (isset($_POST['action']) && in_array($_POST['action'], $actions) ) {

  $handle_result = false;

  if (!empty(isset($_POST['g-recaptcha-response'])) {
    $g_recaptcha_response = $_POST['g-recaptcha-response'];
    $ip = $_SERVER['REMOTE_ADDR'];
    $hostname = $_SERVER['HTTP_HOST'];
    if (!g_recaptcha_validation($g_recaptcha_response, $hostname, $ip)) {
      $handle_message = 'reCaptcha validation error.';
    }
  }

  //* Sanitize/Validate POST data


  if (!empty($_POST['is-ajax'])) {
    header('Content-type: application/json');
    $response = [];
    $response['status'] = $handle_result; //* Boolean
    $response['message'] = $handle_message; //* String, optional
    echo json_encode($response);
  }

}


function form_validation()
{

  //* Validate/Sanitize POST data
  return true;
}


/**
 * Google Recaptcha Validation
 * https://github.com/google/recaptcha
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
