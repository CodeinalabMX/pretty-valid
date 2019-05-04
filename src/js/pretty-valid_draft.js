/*! Pretty Valid v0.1.0 http://codeinalabmx.github.io/pretty-valid License: MIT */
/*
 * Pretty Valid v0.1.0
 *
 * Custom HTML5 form validation dialogues
 * http://codeinalabmx.github.io/pretty-valid
 * Licence: MIT
 * Author: hEy @ codeinalab.com
 * 
 * Boilerplate
 * http://jqueryboilerplate.com v4.0.0
 * 
 * Reference:
 * 
 * https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
 * https://learn.jquery.com/plugins/basic-plugin-creation/
 * https://github.com/johndugan/jquery-plugin-boilerplate
 * http://www.acuriousanimal.com/2013/01/15/things-i-learned-creating-a-jquery-plugin-part-i.html
 * https://websanova.com/blog/jquery/the-ultimate-guide-to-writing-jquery-plugins
 * https://brolik.com/blog/how-to-create-a-jquery-plugin/ 
 * https://www.dotnetcurry.com/jquery/1069/authoring-jquery-plugins
 * https://github.com/aloisdg/awesome-regex
 * https://www.queness.com/post/112/a-really-simple-jquery-plugin-tutorial
 * https://stackoverflow.com/questions/12880256/jquery-plugin-creation-and-public-facing-methods
 * https://john-dugan.com/jquery-plugin-boilerplate-explained/
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

    'use strict';

        // undefined is used here as the undefined global variable in ECMAScript 3 is
        // mutable (ie. it can be changed by someone else). undefined isn't really being
        // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
        // can no longer be modified.

        // window and document are passed through as local variables rather than global
        // as this (slightly) quickens the resolution process and can be more efficiently
        // minified (especially when both are regularly referenced in your plugin).

        // Create the defaults once
        var pluginName = 'prettyValid',
            defaults = {
                defaultproperty: 'default value'
            };

        // The actual plugin constructor
        function Plugin ( element, options ) {
            this.element = element;

            // jQuery has an extend method which merges the contents of two or
            // more objects, storing the result in the first object. The first object
            // is generally empty as we don't want to alter the default options for
            // future instances of the plugin
            this.settings = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;
            this.init();
        }


        // Avoid Plugin.prototype conflicts
        $.extend( Plugin.prototype, {
            init: function() {

                // Place initialization logic here
                // You already have access to the DOM element and
                // the options via the instance, e.g. this.element
                // and this.settings
                // you can add more functions like the one below and
                // call them like the example below
                console.log('init: '+this._defaults.defaultproperty);
                this.pluginfunction( this.settings.defaultproperty );
            },
            pluginfunction: function( text ) {
                // some logic
                console.log(text);
            },
            pluginpublicfunction: function(param)
            {
                pluginprivatefunction(param);
                console.log(param);
            },
        } );

        
        let pluginprivatefunction = function(param)
        {
            console.log(param);
        }

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function( options ) {
            // slice arguments to leave only arguments after function name
            // 
            // var args = Array.prototype.slice.call(arguments, 1);

            //console.log('direct ' + options);

            return this.each( function() {
                //* 
                //var item = $(this), instance = item.data('CustomSelect');
                //let item = $(this), instance = plugin.data(pluginName);
                if ( !$.data( this, pluginName ) ) {
                    console.log('instance isnt created');
                //if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, pluginName, new Plugin( this, options ) );
                } else {
                // if instance already created call method
                    console.log(options);
                    if (typeof options === 'string') {
                        console.log(args);
                        //this.data[pluginName][options].apply(this.data[pluginName], args);
                    }
                }
            } );
        };

} )( jQuery, window, document );