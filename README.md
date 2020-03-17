# Pretty Valid v0.5.1

Customize/Pretify the HTML5 Constraint Validation dialogues using jQuery/CSS.

Pretty Valid uses the HTML5 Constraint Validation API (native client side validation for web forms) to 
determine if a form is valid or else.

Attach to the form' submit event Pretty Valid will:
- [x] Check the validity of each input with the required attribute.
If any invalid input exists
- [x] a notification message is displayed 
- [x] a CSS class is applied to those inputs
Else the submit action takes place.

#### [Google reCAPTCHA](https://developers.google.com/recaptcha/)
If a reCAPTCHA site_key is set Pretty Valid will automatically do the frontend integration of reCAPTCHA v3 on your app.

#### AJAX
Submit the form using jQuery AJAX by setting your backend url

## How to use:

Include the required files in your HTML5 document:

#### JS
```javascript
<script src="path/to/jquery.min.js"></script>
<script src="path/to/pretty-valid.min.js"></script>
```

#### CSS
```css
<link rel="stylesheet" href="css/pretty-valid.min.css">
```

Attach the plugin to the form element using the ol' jQuery way and customize the avaliable settings

```javascript
$(document).ready(function()
{
	let instance = $('#form-demo').prettyValid({
		notification: {
        wrapper: {
          class: 'notification', 						// String
        },
        message: {
          valid: 'Everything looks good.', 	// String
          invalid: 'Something is missing.', // String
          error: 'An error ocurred.', 			// String
        },
        invalid_class: 'warning', 					// String
        valid_class: 'success', 						// String
        auto_hide: 8000, 										// Boolean/Integer false/Milliseconds
        effect: 'fade', 										// String fade/slide

        // @todo show/hide effect should be generated from notification.effect setting 
        show_effect: 'fadeIn', // fadeIn/slideDown
        hide_effect: 'fadeOut', // fadeOut/slideUp

      },
      input_invalid_class: 'is-invalid', 		// String
      input_valid_class: 'is-valid', 				// String
      ajax: {
        url: '', 														// String
        method: 'POST', 										// POST/GET
      },
      g_recaptcha: {
        site_key: '', 											// String
        class: 'g-recaptcha-wrapper', 			// String
        language: 'es-419', 								// String
        action: 'homepage', 								// String
        badge: 'inline', 										// String bottomright bottomleft inline
      }
	});
}
```