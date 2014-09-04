A Javascript file is all that is required for a theme. It is easy to set up, and it can be organized into several different components

## Function
Your script must have a `function initTheme()` which is called frequently in order for all elements on screen, new and old, to follow the theme's rules.

### Theme Object
The first part of the function should be created the theme object and setting up variables.

```JavaScript
    theme.bodyColor = 'black'
```   

Many variables are added to this object and are used throughout the Gltn Editor. You may use any type of HTML-supported color format. Just keep in mind a variety of use cases, and try to follow the names of each theme. For example, `theme.bodyColor` would be the background color of the editor. Don't make it something odd like bright green.

### CSS Rules for Elements
Now we use jQuery to apply CSS rules to individual objects. Most elements are applicable, though the code below should cover most of the objects. The following snippet is from the Blackout Theme
    
```JavaScript
    $('.header').css('background-color', '#333').css('border-bottom', 'solid 0px #555');
	$('#panel_content').css('background-color', '#333');
	$('#panel_plugin').css('background-color', '#333');
	$('input').css('background-color', '#444').css('color', theme.normcolor);
	$('.toolbar, .overflow').css('background-color', '#444');
	$('.popuptop').css('color', 'white').css('background-color', theme.normbg);
	$('.popuptitle').css('color', theme.coloralt);
	$('.tfile').css('background-color', '#444');
```

Notice how you can use the variables set above in order to make theming more streamlined.

## Outside of the Function Commands
The following code should be separate, not in any function. 

```JavaScript
    initTheme() /* Including this command is optional */
    writeCss("@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic);");
    themeCss('font-family', '"Roboto", sans-serif');
    themeCss('background-color', theme.normbg);
    themeCss('color', theme.normcolor);
    setLoaderColor('255,255,255');
```

### Write CSS
`writeCss(text)` literally inputs CSS and places it in a `<style>` tag. In the Blackout example above, I use this to quickly import a web font.

### Theme Entire Page
Unlike the selective theming above, `themeCss(css-rule, css-value)` will apply that CSS rule to the entire body. (This, of course, will not override styles of children that have a specific value.) 

By commanding `themeCss('color', 'white')`, the font color for the entire editor will be white (except in cases where the font color was given a value).

## Don't Theme
There are certainly a few occasions where a developer will place extra time into a great UI widget, and it wouldn't be fair to overwrite all of the developer's CSS rules. That would leave a subset of users unable to appreciate the design as it was intended.

For developers, there is a tag that may be added to an HTML item: `data-theme`. If that is set to false, then the theme should not theme it. This would be done as shown below. The demo grabs all input fields that are not marked with `data-theme` or where `data-theme` is true. For general CSS theming, this attribute checker should also be present.

```Javascript
    $('input[data-theme!=false]')
```