/**
 * jQuery init
 */
$(document).ready(function()
{

	let instance = $('#form-demo').prettyValid({
		defaultproperty: 'new value',
	});
	//$('#form-demo').data.cdnlbValidForms('pluginpublicfunction');
	instance.prettyValid('pluginpublicfunction', 'direct call param');

});