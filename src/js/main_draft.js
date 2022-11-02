/*
 * jQuery init
 */

$(document).ready(function()
{

  let instance = $('#form-demo').prettyValid({
    ajax: {
      url: 'action.php',
    },
    g_recaptcha: {
      site_key: '',
    }
  });
  //instance.notification_show('success', 'This is a test');


  let instance_1 = $('#form-demo-1').prettyValid({
    ajax: {
      url: 'ajax.php',
    },
    g_recaptcha: {
      site_key: '6LffK88iAAAAAHkbAPXojVtlFRIXzswAfFCiFAWQ',
    }
  });
  //instance_1.notification_show('information', 'This is another test');

});