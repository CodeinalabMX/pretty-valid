/*
 * jQuery init
 */
$(document).ready(function()
{

	var instance = $('#form-demo').prettyValid({
		ajax: {
			url: 'ajax.php',
		},
		g_recaptcha: {
    	site_key: '',
  	}
	});

});