/*! Pretty Valid v0.4.2 http://codeinalabmx.github.io/pretty-valid */

/*
 * Pretty Valid v0.4.2
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
        effect: 'fade', // String fade/slide
        // @todo show/hide effect should be generated from notification.effect setting 
        show_effect: 'fadeIn', // fadeIn/slideDown
        hide_effect: 'fadeOut', // fadeOut/slideUp
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
        badge: 'inline', // String bottomright bottomleft inline
      },
    }, custom_settings);

    /* In order to create multiple instances
     * of the plugin attached to different DOM elements
     * loop through each of the elements 
     * return 'this_plugin' to allow chaining methods. */
    if (this.length > 1){
      this.each(function() {
        $(this).prettyValid(custom_settings)
      });
      return this;
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
      return this_plugin;

    };

    var validity_support = function () {
      var input = document.createElement('input');
      return (
              'validity' in input && 
              'badInput' in input.validity && 
              'patternMismatch' in input.validity && 
              'rangeOverflow' in input.validity && 
              'rangeUnderflow' in input.validity && 
              'stepMismatch' in input.validity && 
              'tooLong' in input.validity && 
              'tooShort' in input.validity && 
              'typeMismatch' in input.validity && 
              'valid' in input.validity && 
              'valueMissing' in input.validity
              );
    };


    var validate = function()
    {

      /* Get all required elements and check for validity */
      items = this_plugin.find(':required');
      items = $.grep(items, function(n)
      {
        $(n).removeClass(settings.input_invalid_class);
        
        return item_validation(n);
        
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
            'size': 'invisible',
            'badge': settings.g_recaptcha.badge,
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
      if (0 === $('#' + this_plugin[0].id + ' .' + settings.notification.wrapper.class).length) {
        item = $('<div/>');
        item.addClass(settings.notification.wrapper.class)
            .addClass(settings.notification.effect)
            .prependTo(this_plugin);
      } else {
        item = $('#' + this_plugin[0].id + ' .' + settings.notification.wrapper.class);
      }

      //* Blink if it's already there
      if (item.is(':visible')) {
        item.removeClass('success warning error information')
            .addClass(type)
            .html(message)
            .fadeTo('fast', 0.5)
            .fadeTo('slow', 1.0);
      } else {
        item.addClass(type).html(message)[settings.notification.show_effect]();
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

      $('#' + this_plugin[0].id + ' .' + settings.notification.wrapper.class)[settings.notification.hide_effect]('fast');
        clearTimeout(auto_hide);

    }


    var item_validation = function(item)
    {
      if (validity_support()) {
        return item.validity.valid;
      } else {
        //
      }
      return item[0].validity.valid;
      item.addClass(settings.notification.invalid_class);
    }

    var custom_validation = {
      text: function(item) {
        return /\w+/.test(item.val());  
      },
      password: function() {
        /* code */
      }

    };


    //* Plugin's public functions
    /* Expose functions by attaching them to 'this'
     * or in this case 'this_plugin' former defined */
    this_plugin.notification_show = function(type, message)
    {

      notification_show(type, message);

    }

    this_plugin.notification_hide = function()
    {

      notification_hide();

    }



    //* Plugin's initialization
    return init();

  }

})(jQuery);
