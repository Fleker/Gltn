Themes can include settings to make them more personal to the user. Doing so requires two functions in the theme script.
<img src="http://felkerdigitalmedia.com/gltn\images\blog\theme_settings.png">

#### Load HTML
```Javascript
    function loadThemeSettings() {
        out = 'Highlight Color: <select id="ThemeColor">';
        if(theme.ribbon.highlight == "#09f")
            out += '<option value="#09f" selected="true">Blue</option>'
        else    
            out += '<option value="#09f">Blue</option>'
        if(theme.ribbon.highlight == "#f90")
            out += '<option value="#f90" selected="true">Orange</option>'
        else    
            out += '<option value="#f90">Orange</option>'
        return out; 
    }
```
This function is used to generate the HTML that will appear in the settings. It will be returned as a string of HTML that will then appear in the Themes Panel. Users may interact with these fields and using a separate function translate those interactions into changes.

#### Modify Settings
```Javascript
    function runThemeSettings() {
        $('#ThemeColor').on('change', function() {
           theme.ribbon.highlight = $(this).val(); 
           writeToSettings('ribbonhighlight', $(this).val());
        });   
    }
```
This function is run after the HTML is generated and appears in the panel. You assign event listeners to change settings. These settings are saved globally.

#### Recall Settings
The last thing to do is make sure these saved settings are recalled properly. If the setting value exists, then load that. Otherwise, just go with the default value. This will go in `initTheme()`
```Javascript
    function initTheme() {
        theme.ribbon.highlight = '#09f';
        if(getSettings("ribbonhighlight") != undefined && getSettings("ribbonhighlight").length > 0)
            theme.ribbon.highlight = getSettings("ribbonhighlight"); 
    }
```
