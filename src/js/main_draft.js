/*
 * jQuery init
 */
$(document).ready(function()
{

	var instance = $('#form-demo').prettyValid({
		default_setting: 'effin\ custom'
	}).append('test chain functions.');

});