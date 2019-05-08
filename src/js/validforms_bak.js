/*
 * Codeinalab Valid Forms v0.5.0
 *
 * Form validation pluugiun using built-in form validation
 * With custom validations
 *
 * @author      hEy
 * @copyright   Copyright (c) 2018 Codeinalab.
 * @license
 * @link
 * @github
 * @version     0.5.0
 *
 * Reference
 * https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
 * https://learn.jquery.com/plugins/basic-plugin-creation/
 * http://jqueryboilerplate.com v4.0.0
 * https://github.com/johndugan/jquery-plugin-boilerplate
 * http://www.acuriousanimal.com/2013/01/15/things-i-learned-creating-a-jquery-plugin-part-i.html
 * https://websanova.com/blog/jquery/the-ultimate-guide-to-writing-jquery-plugins
 * https://brolik.com/blog/how-to-create-a-jquery-plugin/ 
 * https://www.dotnetcurry.com/jquery/1069/authoring-jquery-plugins
 * https://github.com/aloisdg/awesome-regex
 * https://www.queness.com/post/112/a-really-simple-jquery-plugin-tutorial
 */

/*
 *  Keep all your code in a closure to safely avoid any namespace conflicts.
 *  The semi-colon before the function invocation is a safety net against
 *  concatenated scripts and/or other plugins which may not be closed properly.
 *  Variable name "undefined" is used because the undefined global variable in ECMAScript 3
 *  is mutable (ie. it can be changed by someone else). Because we don't pass a
 *  value to undefined when the anonymyous function is invoked, we ensure that
 *  undefined is truly undefined. Note, in ECMAScript 5 undefined can no
 *  longer be modified.
 *  Variables "window" and "document" are passed as local variables rather than global.
 *  This (slightly) quickens the resolution process.
 */
;(function($, window, document, undefined)
{
    'use strict';
    /*
     * Plugin default settings
     */
    let pluginsName = 'cdnlbValidForms';
    let defaultSettings = {

        globalNotificationWrapper: 'global-notification', //* Element ID
        globalValidationWarningMessage: 'Verifica que hayas llenado correctamente los campos señalados.',
        globalValidationErrorMessage: 'Ocurrio un error al validar el formulario.',
        globalValidationSuccessMessage: 'Tu mensaje ha sido enviado, gracias.',
        individualValidation: false, //* If true validation displays a notification message for each input 
        individualNotificationWrapper: 'individual-notification', //* Element Class, individual messages will be append after input field 
        inputInvalidClass: 'is-invalid',
        notificationWarningClass: 'warning',
        notificationErrorClass: 'error', 
        notificationSuccessClass: 'success', 
        
        showEffect: 'slideDown', //* options avaliable: fadeIn/slideDown
        hideEffect: 'slideUp', //* options avaliable: fadeOut/slideUp
        autoHideDuration: 8000, //* Milliseconds

        ajax: false,
        ajaxMethod: 'POST',
        ajaxUrl: 'ajax.php',
        ajaxErrorMessage: 'Ocurrio un error al enviar los datos. (ajax).',
        ajaxSuccessMessage: 'Tu mensaje ha sido enviado, gracias. (ajax)',

        g_reCaptcha: false,
        g_reCaptchaSiteKey: false, //* Localhost key 6Lf6-I0UAAAAAI9ZIt_87Du-KbrZ5gI-16aToscX
        g_reCaptchaLanguage: 'es-419', //* https://developers.google.com/recaptcha/docs/language

        debug: false,
    }
    //* A list of variables we're gonna use along the plugin methods
    let plugin, $element, items, invalidItems, currentItem, itemId, itemValue, itemCheckFor, itemValidity, minLength, maxLength, minNum, maxNum, step, compareTo, 
        notificationType, notificationMessage, notificationHide, autoHide, i, validationResult, validationErrors, g_reCaptchaScript, g_reCaptchaWrapper, g_reCaptchaId;
    /*
     * Plugin constructor
     * 
     * Store reference to the selected element, a form in this case
     * The "$.extend" method merges default and custom settings
     * Initialize plugin instance
     * 
     */
    function Plugin(element, customSettings) {
        //* We use plugin instead of "this" to avoid jquery items confusion
        plugin = this;
        //* Store the form element as a jquery object
        $element = $(element);
        plugin._name = pluginsName;
        plugin._defaultSettings = $.fn[pluginsName].defaultSettings;
        plugin.settings = $.extend({}, defaultSettings, customSettings);
        plugin.init();
    }
    /*
     * Plugin prototype
     *
     * Add all the plugin's logic
     * Implementing init and destroy method as a common practice
     * Use methods name convention, private functions start with underscore eg. _somePrivatemethod
     * 
     */
    $.extend(Plugin.prototype, {
        
        /*
         * Init
         *
         * Initialization function
         * Bind event to $element
         * Starts the logic associated with the plugin
         */
        init: function()
        {
            if (plugin.settings.debug) { console.log('init: disable built-in validation, bind plugin function to element submit event.'); }

            $element.attr('novalidate', 'novalidate').on('submit', function(e) {
                e.preventDefault();
                plugin.validation();
            });
            if (plugin.settings.g_reCaptchaSiteKey) {
                plugin.g_reCaptchaInit();
            }
            items = $element.find(':required, [data-required="required"]');
            console.log(items);
        },
        /*
         * Destroy
         *
         * Unbinds all events for the specific plugin instance
         * Removes all plugin data stored in the plugin instance
         */
        destroy: function()
        {
            $element.removeData();
            $element.unbind();
        },
        /*
         * Validation
         *
         * Validate the entire item collection
         */
        validation: function()
        {
            if (plugin.settings.debug) { console.log('validation: gather items marked as required from element and loop to validate each.'); }

            items = $element.find(':required, [data-required="required"]');
            if (items) {
                invalidItems = $([]);
                items.each(function()
                {
                    currentItem = $(this);
                    plugin.itemValidation(currentItem);
                });
            }            
            if (invalidItems.length) {
                validationResult = false;
                plugin.notificationShow();
            } else {
                (plugin.settings.ajax) ? plugin._formAjaxSubmit() : plugin._formSubmit();
            }
            //return validationResult;
        },
        /*
         * Item Validation
         *
         * Validate single item
         */
        itemValidation: function(item)
        {
            currentItem = item;
            //* Check if there is a validation type setting else use the input default type
            //* Remove the dash because isn't a valid class or method name character
            if (typeof currentItem[0]['attributes']['data-required-check-for'] === 'undefined') {
                itemCheckFor = currentItem[0]['type'].replace('-', '');
            } else {
                itemCheckFor = currentItem[0]['attributes']['data-required-check-for']['value'].replace('-', '');
            }
            itemId = currentItem[0]['id'];
            itemValue = currentItem[0]['value'];
            //itemValidity = plugin.validationPatterns[ itemCheckFor ](currentItem, itemValue);
            itemValidity = currentItem[0]['validity']['valid'];
            if (!itemValidity) {
                if (plugin.settings.debug) { console.log('item ' + itemId + ' check for ' + itemCheckFor + ': ' + itemValidity) };
                //validationErrors.push(itemId + ' ' + itemValidity);
                invalidItems.push(currentItem);
            }
            plugin.toggleValidationClass(currentItem, itemValidity);
            return itemValidity;
        },
        toggleValidationClass: function(item, itemValidity)
        {
            currentItem = item;
            currentItem.removeClass('' + plugin.settings.inputInvalidClass)
            if (!itemValidity) {
                currentItem.addClass('' + plugin.settings.inputInvalidClass + '');
            }
        },
        /*
         * Notification Show
         *
         * Call the appropriate notification function either global/individual
         */
        notificationShow: function()
        {
            if (plugin.settings.debug) { console.log('Show notification message; form  has ' + invalidItems.length + ' errors'); }
            
            notificationType = plugin.settings.notificationSuccesClass;
            notificationMessage = plugin.settings.globalValidationSuccessMessage;
            if (validationErrors) {
                notificationType = plugin.settings.notificationWarningClass;
                notificationMessage = plugin.settings.globalValidationWarningMessage;
            }
            plugin.globalNotificationShow(notificationType, notificationMessage);
            if (plugin.settings.individualValidation) { 
                plugin.individualNotificationShow()
            }
        },
        notificationHide: function()
        {
            if (plugin.settings.debug) { console.log('Hide the notification message.'); }

            plugin.globalNotificationHide();
            if (plugin.settings.individualValidation) {
                plugin.individualNotificationHide();
            }
        },
        globalNotificationShow: function(type, message)
        {
            if (plugin.settings.debug) { console.log('In this case: global notification.'); }
            
            //* Make sure there is an item to wrap the message 
            if (0 == $('#' + plugin.settings.globalNotificationWrapper).length) {
                $('<div id="' + plugin.settings.globalNotificationWrapper + '"></div>').prependTo('body').hide();
            }
            currentItem = $('#' + plugin.settings.globalNotificationWrapper);
            currentItem.addClass(type).html(message);
            //* Blink if it's already there
            if (currentItem.is(':visible')) {
                currentItem.fadeTo('fast', 0.5).fadeTo('slow', 1.0);
            } else {
                currentItem[plugin.settings.showEffect]();
                currentItem.bind('click', function(e) {
                    plugin.notificationHide();
                });
                autoHide = setTimeout(function() 
                {
                    plugin.notificationHide();
                }, plugin.settings.autoHideDuration);
             }
        },
        globalNotificationHide: function()
        {
            $('#' + plugin.settings.globalNotificationWrapper)[plugin.settings.hideEffect]('fast');
            clearTimeout(autoHide);
        },
        individualNotificationShow: function()
        {
            validationErrors.each(function()
            {
                currentItem = $(this);
                $('<span class="' + plugin.settings.individualNotificationWrapper + '"></span>').insertAfter(currentItem).hide().html('mensaje')[plugin.settings.showEffect]();
            });
        },
        individualNotificationHide: function()
        {
            validationErrors.each(function()
            {
                currentItem = $(this);
                $('#' + plugin.settings.individualNotificationWrapper)[plugin.settings.hideEffect]('fast').remove();
            });
        },
        _formSubmit: function()
        {
            if (plugin.settings.debug) { console.log('there you go, now we submit the form.'); }
            $element.off('submit').submit();
        },
        _formAjaxSubmit: function()
        {
            if (plugin.settings.debug) { console.log('there you go, this time we use ajax to submit the form.'); }

            $.ajax({
                type: plugin.settings.ajaxMethod,
                url: plugin.settings.ajaxUrl,
                data: $element.serializeArray(),
                dataType: 'json',
                success: function(data)
                {
                    if (plugin.settings.debug) { console.log('ajax success.'); }
                    if (data.status){
                        if (plugin.settings.debug) { console.log('ajax data success.'); }
                        plugin.globalNotificationShow(plugin.settings.notificationSuccessClass, plugin.settings.ajaxSuccessMessage);
                        plugin.clearForm();
                    } else {
                        if (plugin.settings.debug) { console.log('ajax data error.'); }
                        plugin.globalNotificationShow(plugin.settings.notificationWarningClass, plugin.settings.ajaxErrorMessage);
                    }
                },
                error: function(data)
                {
                    if (plugin.settings.debug) { console.log('ajax error.'); }
                    validationErrors.push('Ajax error');
                    plugin.globalNotificationShow(plugin.settings.notificationErrorClass, plugin.settings.ajaxErrorMessage);
                }
            })
        },
        g_reCaptchaInit: function()
        {
            if (plugin.settings.debug) { console.log('g_reCaptcha init'); }

            //* Test load external script dynamically
            //* Using javascript            
            //g_reCaptchaScript = document.createElement('script');
            //g_reCaptchaScript.src = 'https://www.google.com/recaptcha/api.js?render=explicit&hl=' + plugin.settings.g_reCaptchaLanguage;
            //g_reCaptchaScript.async = true;
            //g_reCaptchaScript.defer = true;
            //document.body.appendChild(g_reCaptchaScript);
            //* Using jquery
            //$.getScript('https://www.google.com/recaptcha/api.js?render=explicit&hl=' + plugin.settings.g_reCaptchaLanguage, function()
            //{
            //    console.log('jquery get script');
            //});
            //* Create target container dynamically
            //* Using javascript
            //g_reCaptchaWrapper = document.createElement('div');
            //g_reCaptchaWrapper.id = 'g-recaptcha-wrapper';            
            //document.getElementById($element.attr('id')).appendChild(g_reCaptchaWrapper);
            //* Using jquery
            g_reCaptchaWrapper = 'g-recaptcha-wrapper-' + $('.g-recaptcha-wrapper').length;
            $element.append('<div id="' + g_reCaptchaWrapper + '" class="g-recaptcha-wrapper"></div>');
            
            //g_reCaptchaScript.onload = function() {
                grecaptcha.ready(function() {
                    g_reCaptchaId = grecaptcha.render(g_reCaptchaWrapper, 
                    {
                        'sitekey': plugin.settings.g_reCaptchaSiteKey,
                        'size': 'invisible'
                    });

                    grecaptcha.execute(g_reCaptchaId, {action: 'homepage'}).then(function(token)
                    {                       
                        $(g_reCaptchaWrapper + ' .g-recaptcha-response').val(token);
                        console.log('grecaptcha token: '+token);
                    });
                    grecaptcha.reset();
                });
            //}
             

        

        },
        /*
         * Validation patterns
         *
         * Custom validation
         */
        validationPatterns: {
            //* Defaults, html input types
            text: function(item, value)
            {
                return /\w+/.test(value);
            },
            password: function(item, value)
            {
                return /\w+/.test(value);
            },
            file: function(item, value)
            {
                return /\w+/.test(value);
            },
            textarea: function(item, value)
            {
                return /\w+/.test(value);
            },
            selectone: function(item, value)
            {
                return /\w+/.test(value);
            },
            selectmultiple: function(item, value)
            {
                return /\w+/.test(value);
            },
            //* html5 input types
            /*
             * color
             * date
             * datetime-local
             * email
             * month
             * number
             * range
             * search
             * tel
             * time
             * url
             * week
            */
            email: function(item, value)
            {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
            },
            //* Custom validations
            notEmpty: function(item, value)
            { 
                return /\S+/.test(value);
            },
            alpha: function(item, value)
            {
                return /^[a-zA-Z0-9_-]{3,16}$/.test(value);
            },
            alphanumeric: function(item, value)
            {
                return /\w+/.test(value);
            },
            number: function(item, value)
            {
                return /\w+/.test(value);
            },
            numberPositive: function(item, value)
            {
                return /\w+/.test(value);
            },
            numberNegative: function(item, value)
            {
                return /\w+/.test(value);
            },
            checkbox: function(item, value)
            {
                return item.is(':checked')
            },
            radio: function(item, value)
            {
                return item.is(':checked')
            },
            url: function(item, value)
            {
                return /\w+/.test(value);
            },
            integer: function(item, value)
            {
                return /\w+/.test(value);
            },
            decimal: function(item, value)
            {
                return /\w+/.test(value);
            },
        },
        publicf: function(params){
            //console.log('publicf' + params);
            return params;
        },
        _pseudoprivatef: function(){
            console.log('_pseudoprivatef');
        }
    });
    
    //* This is a function only avaliable inside the plugin
    let realPrivaFunction = function()
    {
        console.log('real private function');
        //console.log(this);
    }
    let realPublicF = function(params)
    {
        console.log('real public function');
    }
    /*
     * Attach the plugins name to $.fn for it to be available like any other jQuery object method
     */
    $.fn[pluginsName] = function(customSettings)
    {
        /*
         * Associate functions to each element in a loop
         * Mantain plugin chainability by using return at the start of the loop
         * As we store data for each instance of the plugin in its
         * instantiating element using the $.data method , we can call methods directly on
         * the instance outside of the plugin initalization
         * eg. $('selector').data('plugin_PluginsName').functionName();
         */
        return this.each(function()
        {
            if (!$.data(this, pluginsName)) {
                $.data(this, pluginsName, new Plugin(this, customSettings));
            }
        });
    }

})(jQuery, window, document);        