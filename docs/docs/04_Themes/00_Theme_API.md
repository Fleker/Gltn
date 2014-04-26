Themes alter the look and feel of the editor, but they should not alter the actual content on-screen. A theme makes the editor look fresh and new while giving the user a consistent user experience.

### Installing
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

### Theme Script
A javascript file is all that is required for a theme. It is easy to set up, and it can be organized into several different components

### Function
Your script must have a `function initTheme()` which is called frequently in order for all elements on screen, new and old, to follow the theme's rules.

#### Theme Object
The first part of the function should be created the theme object and setting up variables.

```JavaScript
    window.theme = {};
    theme.normbg = 'black'
```   

Many variables are added to this object and are used throughout the Gltn Editor.

#### Full List of Variables
It is recommended that you provide values for each of these attributes. If not, the system will issue an error if that variable is used.

```JavaScript
	theme.darkbg = "rgb(0, 0, 0)"; //The background color for the content editor when the darken button is pressed in fullscreen
	theme.darkcolor = "rgb(200, 200, 200)"; //The font color for the content editor when the darken button is pressed in fullscreen
	theme.normcolor = "rgb(0, 0, 0)"; //The normal font color for the content editor
	theme.normbg = "rgb(255, 255, 255)"; //The normal background color for the content editor
	theme.coloralt = '#222'; //A color similar to the normal font color for small accenting [Default: "#222"]
	theme.normfsui = "rgb(204, 204, 204)"; //The normal background color for the fullscreen toolbar [Default: "rgb(204, 204, 204)"]
	theme.darkfsui = "rgb(41, 41, 41)"; //The background color for the fullscreen toolbar when the darken button is pressed [Default: "rgb(41, 41, 41)"]
	theme.darkfsuicolor = 'white'; // The font color for the fullscreen toolbar when the darken button is pressed [Default: "white"]
	theme.normfsuicolor = 'black'; //The normal font color for the fullscreen toolbar [Default: "black"]
	theme.ribbonhighlight = 'rgba(44, 62, 80,1.0)'; //The color that items in the ribbon turn when hovered over [Default: "rgba(44, 62, 80,1.0)"]
	theme.ribbonplain = 'rgba(0,0,0,0)'; //The color that items in the ribbon turn when focus is lost [Default: "rgba(0,0,0,0)" in order to go with the parent's background color]
        theme.palette = {}; //Palette object contains an assortment of static colors to better blend colors
        theme.palette.red = "rgb(255,68,68)"; //Default red
        theme.palette.dark = "rgba(44,62,80,1)"; //Default dark/black
        theme.palette.blue = '#2980b9'; //Default blue
```

#### CSS Rules for Elements
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

### Outside of the Function Commands
The following code should be separate, not in any function. 

```JavaScript
    initTheme() /* Including this command is optional */
    writeCss("@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic);");
    themeCss('font-family', '"Roboto", sans-serif');
    themeCss('background-color', theme.normbg);
    themeCss('color', theme.normcolor);
    setLoaderColor('255,255,255');
```

#### Loader Color
The new loading icon is developed entirely in CSS. This means the color can be decided by the theme. Write the RGB color for the loader, comma separated.
`setLoaderColor('220, 119, 240');`

#### Write CSS
`writeCss(text)` literally inputs CSS and places it in a `<style>` tag. In the Blackout example above, I use this to quickly import a web font.

#### Theme Entire Page
Unlike the selective theming above, `themeCss(css-rule, css-value)` will apply that CSS rule to the entire body. (This, of course, will not override styles of children that have a specific value.) 

By commanding `themeCss('color', 'white')`, the font color for the entire editor will be white (except in cases where the font color was given a value).