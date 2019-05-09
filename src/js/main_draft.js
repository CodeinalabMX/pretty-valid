/*
 * jQuery init
 */
$(document).ready(function()
{

	var instance = $('#form-demo').prettyValid({default_setting: 'effin\ custom'}).append('append some content to test chainability');
	instance.public_function('some param');

	var instance1 = $('#form-demo-1').prettyValid({default_setting: 'effin\ custom 1'}).append('append some content to test chainability 1');
	instance.public_function('some param 1');

});