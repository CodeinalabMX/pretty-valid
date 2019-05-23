/*! Pretty Valid v0.1.0 http://codeinalabmx.github.io/pretty-valid License: MIT */

/*
 * Pretty Valid v0.1.0
 *
 * Custom HTML5 form validation dialogues
 * http://codeinalabmx.github.io/pretty-valid
 * Licence: MIT
 * Author: hEy @ codeinalab.com
 * 
 * Reference:
 *
 * https://learn.jquery.com/plugins/basic-plugin-creation/
 * https://jqueryboilerplate.com/
 * http://scriptble.com/2011/02/14/expanding-the-jquery-plugin-development-pattern/
 * 
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function($)
{

  //* Plugin's name
  /* Set the plugin's name into the jQuery.fn namespace */
  $.fn.prettyValid = function(custom_settings) {

    //* Plugin' settings
    /* Define private variables within the plugin' scope.
     * To avoid scope issues, assign 'this' to 'this_plugin'
     * to reference this class from internal events and functions. */
    var this_plugin = this; /* This is also the element attached to */
    var items, invalid_items, current_item;
    /* Use the default jQuery.extend utility to merge
     * default settings with with the ones set per instance.
     * This is the easiest way to have default options.
     */
    var settings = $.extend({
      //* Plugin's default settings
      notification_wrapper = 'notification'; //* Global notification wrapper ID
      notification_warning_class = 'warning';
      notification_error_class = 'error';
      notification_auto_hide = 8000; //* Boolean or milliseconds
      notification_effetc = 'slide'; //* Notification show/hide effect slide/fade
      success_message = 'EL mensaje ha sido enviado correctamente.';
      warning_message = 'Verifica que hayas completado correctamente los campos señalados.';
      error_message = '';
      inputInvalidClass = 'is-invalid';
      /* Enable send form data via ajax */
      ajax = true; //* Boolean
      ajax_method = 'POST'; //* POST/GET
      ajax_url = 'ajax.php';
      /* Enable google reCaptcha render
       * Get the keys from the google reCaptcha admin console
       * and the anguage code from https://developers.google.com/recaptcha/docs/language 
       * reCaptcha error message is handled by the backend script */
      g_recaptcha = true; //* Boolean
      g_recaptcha_site_key = '6LcSBqUUAAAAANOdeoW7nod-ICnH0ycTTWlSgNlw'
      g_reCaptchaLanguage = 'es-419'; //* 

    }, custom_settings);

    /* In order to create multiple instances
     * of the plugin attached to different DOM elements
     * loop through each of the elements 
     * return 'this_plugin' to allow chaining methods. */
    if (this_plugin.length > 1){
      this_plugin.each(function() {
        $(this_plugin).prettyValid(customOptions)
      });
      return this_plugin;
    }

    //* Plugin's logic
    
    //* Plugin's private functions
    /* Functions defined this way are accessible only within the plugin' scope */
    var init = function()
    {
      /* Attach event handler, replacing default browser validation behavior on submit */
      this_plugin.attr('novalidate', 'novalidate').on('submit', function(e) {
        e.preventDefault();
        e.stopPropagation()
        validate();
      });

      return this_plugin;
    };

    var validate = function()
    {
      /* Get all required elements and check for validity
       *  */
      items = this_plugin.find(':required, [data-required="required"]');
      
      if (items) {
        invalid_tems = '';//$([]);
        items.each(function()
        {
          item_validation($(this)) ? '' : invalid_items++;

        });
      }            
      if (invalid_items.length) {
        //validationResult = false;
        //plugin.notificationShow();
      } else {
        //(plugin.settings.ajax) ? plugin._formAjaxSubmit() : plugin._formSubmit();
      }

    }

    var item_validation = function(current_item)
    {
      /* Do here single item validations */
      //console.log(current_item[0].validity.valid);
      current_item.addClass('test-class');
    }

    //* Plugin's public functions
    /* Expose functions by attaching them to 'this', or in this case 'plugin'
     * as we defined above */
    this_plugin.public_function = function(param)
    {
      //* Do something
      console.log('this is a public funtion with param:' + param);
    };

    //* Plugin's initialization
    return init();

  }

})(jQuery);
