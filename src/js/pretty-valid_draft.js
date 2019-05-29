/*! Pretty Valid v0.2.0 http://codeinalabmx.github.io/pretty-valid License: MIT */

/*
 * Pretty Valid v0.2.0
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
    var items, item, auto_hide;
    /* Use the default jQuery.extend utility to merge
     * default settings with with the ones set per instance.
     * This is the easiest way to have default options.
     */
    var settings = $.extend(true, {
      //* Plugin's default settings
      notification: {
        wrapper: {
          id: 'notification', // String
          class: 'notification', // String
        },
        message: {
          valid: 'Everything looks good.', // String
          invalid: 'Something is missing.', // String
          error: 'An error ocurred.', // String
        },
        invalid_class: 'warning', // String
        valid_class: 'success', // String
        auto_hide: 8000, // Boolean false/Milliseconds
        show_effect: 'slideDown', // fadeIn/slideDown
        hide_effect: 'slideUp', // fadeOut/slideUp
      },
      input_invalid_class: 'is-invalid', // String
      input_valid_class: 'is-valid', // String
      /* Enable send form data via ajax */
      ajax: {
        url: '', // String
        method: 'POST', // POST/GET
      },
      /* Enable google reCaptcha render
       * Get the keys from the google reCaptcha admin console
       * and the anguage code from https://developers.google.com/recaptcha/docs/language 
       * reCaptcha error message is handled by the backend script */
      g_recaptcha: {
        site_key: '', // String
        class: 'g-recaptcha-wrapper', // String
        language: 'es-419', // String
        action: 'homepage', // String
      },
    }, custom_settings);

    /* In order to create multiple instances
     * of the plugin attached to different DOM elements
     * loop through each of the elements 
     * return 'this_plugin' to allow chaining methods. */
    if (this_plugin.length > 1){
      this_plugin.each(function() {
        $(this_plugin).prettyValid(custom_settings)
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
      if (settings.g_recaptcha.site_key) {
        g_recaptcha_init();
      }

    };


    var validate = function()
    {

      /* Get all required elements and check for validity */
      items = this_plugin.find(':required');
      items = $.grep(items, function(n)
      {
        $(n).removeClass(settings.input_invalid_class);
        /* Keep items when validity.valid is false */
        return !n.validity.valid;
      });

      (items.length) ? notification_show(settings.notification.invalid_class, 
        settings.notification.message.invalid) : submit();

    }


    var g_recaptcha_init = function()
    {

      /* Check if there is more than one reCaptcha wrapper */
      g_recaptcha_wrapper = 'g-recaptcha-wrapper-' + $('.' + settings.g_recaptcha.class).length;
      if (0 === $('#' + g_recaptcha_wrapper).length) {
        item = $('<div/>').attr('id', g_recaptcha_wrapper)
                   .attr('class', settings.g_recaptcha.class)
                   .appendTo(this_plugin[0]);
      } else {
        item = $('#' + g_recaptcha_wrapper);
      }
      $.getScript('https://www.google.com/recaptcha/api.js?render=explicit&hl=' + settings.g_recaptcha.language, function()
      {
        grecaptcha.ready(function() {
          g_recaptcha_id = grecaptcha.render(g_recaptcha_wrapper, 
          {
            'sitekey': settings.g_recaptcha.site_key,
            'size': 'invisible'
          });
          grecaptcha.execute(g_recaptcha_id, {action: settings.g_recaptcha.action}).then(function(token)
          {                       
            $('#g-recaptcha-response').val(token);
          });
        });
      });

    }
    

    var submit = function()
    {

      /* Detach the previous .on event handler with .off */
      (settings.ajax.url) ? submit_ajax() : this_plugin.off('submit').submit();
    
    }

    var submit_ajax = function()
    {
      
      $.ajax({
        type: settings.ajax.method,
        url: settings.ajax.url,
        data: this_plugin.serializeArray(),
        dataType: 'json',
        success: function(data)
        {
          if (data.status){
            message = (data.message) ? data.message : settings.notification.message.valid;
            notification_show(settings.notification.valid_class, 
                              message);
            this_plugin[0].reset();
          } else {
            message = (data.message) ? data.message : settings.notification.message.error;
            notification_show(settings.notification.invalid_class, 
                              message);
          }
        },
        error: function(data)
        {
          notification_show(settings.notification.invalid_class, 
                            settings.notification.message.error);
        }
      });

    }

    var notification_show = function(type, message)
    {

      $.each(items, function(i)
      {
        $(this).addClass(settings.input_invalid_class);
      });
      /* Make sure there is an item to wrap the message */
      if (0 === $('#' + settings.notification.wrapper.id).length) {
        item = $('<div/>').attr('id', settings.notification.wrapper.id)
                   .attr('class', settings.notification.wrapper.class)
                   .prependTo('body');
      } else {
        item = $('#' + settings.notification.wrapper.id);
      }
      item.addClass(type).html(message);
      //* Blink if it's already there
      if (item.is(':visible')) {
        item.fadeTo('fast', 0.5).fadeTo('slow', 1.0);
      } else {
        item[settings.notification.show_effect]();
        item.on('click', function(e)
        {
          notification_hide();
        });
        if (!$.isNumeric(settings.notification.auto_hide)) {
          auto_hide = setTimeout(function() 
        {
          notification_hide();
          }, settings.notification.auto_hide);
        }
      }

    }


    var notification_hide = function()
    {

      $('#' + settings.notification.wrapper.id)[settings.notification.hide_effect]('fast');
        clearTimeout(auto_hide);

    }


    var item_validation = function(item)
    {
      return item[0].validity.valid;
      item.addClass(settings.notification.invalid_class);
    }


    //* Plugin's public functions
    /* Expose functions by attaching them to 'this'
     * or in this case 'this_plugin' former defined */
    this_plugin.public_function = function(param)
    {

      //* Do something
      console.log('this is a public funtion with param:' + param);

    };


    //* Plugin's initialization
    return init();

  }

})(jQuery);
