/*
 * jQuery init
 */
$(document).ready(function()
{

	var instance = $('#form-demo').prettyValid({
		ajax: {
			url: '',
		},
		g_recaptcha: {
    	site_key: '',
  	}
	});

});