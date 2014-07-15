Themes alter the look and feel of the editor, but they should not alter the actual content on-screen. A theme makes the editor look fresh and new while giving the user a consistent user experience.

What is a theme? It is a collection of attributes that alter the look of the editor without altering the actual content on-screen. This gives the Gltn Editor a fresh look that may be modern while at the same time giving users a consistent user experience. How is a theme written? It is a collection of colors, standardized, that developers can use in their plugins for a consistent color palette across all plugins and devices. A theme developer can make up their own set of colors and the user's editor should accurately refect that theme. In addition to colors, developers may also give general CSS commands and run Javascript. If a developer may also create a settings menu for users to have even more customization.

## Installing
Themes may be installed manually from a console. 
`install_theme(id, name, url, icon)`

* id - A unique internal id for this theme
* name - The name of the theme
* url - The location of this theme
* icon - The icon of the theme

After being installed, the theme is available in window.settings.theme but it is not immediately turned chosen. To select your theme, either choose it from the Themes Panel, or give the command:
`selectTheme(id)` 
Where id is the internal id for the theme.

Themes can be submitted and placed in the Gltn Store for anyone to install.

## Theme Script
A javascript file is all that is required for a theme. It is easy to set up, and it can be organized into several different components

## Function
Your script must have a `function initTheme()` which is called frequently in order for all elements on screen, new and old, to follow the theme's rules.

### Theme Object
The first part of the function should be created the theme object and setting up variables.

```JavaScript
    window.theme = {};
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

### Loader Color
//TODO Make sure this is still true
The new loading icon is developed entirely in CSS. This means the color can be decided by the theme. Write the RGB color for the loader, comma separated.
`setLoaderColor('220, 119, 240');`

### Write CSS
`writeCss(text)` literally inputs CSS and places it in a `<style>` tag. In the Blackout example above, I use this to quickly import a web font.

### Theme Entire Page
Unlike the selective theming above, `themeCss(css-rule, css-value)` will apply that CSS rule to the entire body. (This, of course, will not override styles of children that have a specific value.) 

By commanding `themeCss('color', 'white')`, the font color for the entire editor will be white (except in cases where the font color was given a value).

## Don't Theme
There are certainly a few occasions where a developer will place extra time into a great UI widget, and it wouldn't be fair to overwrite all of the developer's CSS rules. That would leave a subset of users unable to appreciate the design as it was intended.

For developers, there is a tag that may be added to an HTML item: `data-theme`. If that is set to true, then the theme should not theme it. This would be done as shown below. The demo grabs all input fields that are not marked with `data-theme` or where `data-theme` is false. For general CSS theming, this attribute checker should also be present.

```Javascript
    $('input[data-theme!=false]')
```