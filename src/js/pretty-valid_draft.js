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
    /* Define private properties within the plugin' scope.
     * To avoid scope issues, assign'this' to 'this_plugin'
     * to reference this class from internal events and functions. */
    var this_plugin = this; //this is also the element attached to
    var private_var = 'private var';
    /* Use the default jQuery.extend utility to merge
     * default with with the ones set per instance.
     * This is the easiest way to have default options.
     */
    var settings = $.extend({
      //* Plugin's default settings
      
      default_setting: 'this is a default setting'
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
          console.log('submit disabled');
        validate();
      });

      return this_plugin;
    };

    var validate = function()
    {
      console.log('validate event handler');
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
