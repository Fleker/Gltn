## Blackout Condensed
This is the source code for the Blackout Condensed theme to help developers see a full theme and how it uses the Theme APIs.

```Javascript
    function initTheme() {
        theme.darkbg = 'rgb(1, 1, 1)';
        theme.darkcolor = '#fff';
        theme.normbg = 'rgb(34, 34, 34)',
        theme.normcolor = '#efefef';
        theme.coloralt = '#eee';
        theme.normfsui = "rgba(41,41,41)";
        theme.darkfsui = "rgba(41,41,41)";
        theme.darkfsuicolor = 'white';
        theme.normfsuicolor = 'white';
        theme.ribbonhighlight = '#09f';
        if(getSettings("ribbonhighlight") !== undefined && getSettings("ribbonhighlight").length > 0)
            theme.ribbonhighlight = getSettings("ribbonhighlight"); 
        theme.ribbonplain = 'rgba(0,0,0,0)';

        $('.header').css('background-color', '#333').css('border-bottom', 'solid 1px rgba(255,255,255,0.4)');
        $('#panel_content').css('background-color', '#333');
        $('#panel_plugin').css('background-color', '#333');
        $('input').css('background-color', '#444').css('color', theme.normcolor).css('font-family', '"Roboto Condensed", sans-serif').css('font-size', '11pt');
        $('button').css('font-family', '"Roboto Condensed", sans-serif');
        $('.toolbar, .overflow').css('background-color', '#444');
        $('.popuptop').css('color', 'white').css('background-color', theme.normbg);
        $('.popuptitle').css('color', theme.coloralt);
        $('.content_textarea').css('line-height','1.4em').css('padding-right', '5px');
        $('.hovertag').css('font-size', '10pt');

        //Misc panel support
        $('.tfile').css('background-color', '#444');	
        $('.tfile.selected').css('background-color', theme.palette.blue);	
    }	
    function loadThemeSettings() {
        out = 'Highlight Color: <select id="ThemeColor">';
        if(theme.ribbonhighlight == "#09f")
            out += '<option value="#09f" selected="true">Blue</option>';
        else    
            out += '<option value="#09f">Blue</option>';
        if(theme.ribbonhighlight == "#f90")
            out += '<option value="#f90" selected="true">Orange</option>';
        else    
            out += '<option value="#f90">Orange</option>';

         return out; 
    }
    function runThemeSettings() {
        $('#ThemeColor').on('change', function() {
           theme.ribbonhighlight = $(this).val(); 
            writeToSettings('ribbonhighlight', $(this).val());

            executeSettings();
        });   
    }
    function executeSettings() {
        writeCss("button:hover {	background-color:"+theme.ribbonhighlight+";color:black;}button:active {	position:relative;	top:1px;}");
        writeCss("button.ribbonbutton:hover {	background-color:"+theme.ribbonhighlight+";color:black;}button:active {	position:relative;	top:1px;}");
        writeCss("::selection {color:white;background:"+theme.ribbonhighlight+";}::-moz-selection {color:white;background:"+theme.ribbonhighlight+";}");  
        writeCss("input:focus, div:focus, button:focus{ outline: solid 1px "+theme.ribbonhighlight+";} input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px "+theme.ribbonhighlight+" inset}");
    }
    initTheme();
    writeCss("@import url(http://fonts.googleapis.com/css?family=Roboto+Condensed:300italic,400italic,700italic,400,300,700);");
        themeCss('font-family', '"Roboto Condensed", sans-serif');
        themeCss('background-color', theme.normbg);
        themeCss('color', theme.normcolor);
        $('.content_textarea').css('background-color', theme.normbg).css('color', theme.normcolor);
    setLoaderColor('255,255,255');
    writeCss("button.textbutton {text-indent:0;	border:1px solid white;	display:inline-block;	color:"+theme.normbg+";	font-style:normal;	text-decoration:none;	text-align:center;padding:3px; text-transform:uppercase; min-width:80px; color:white; background-color: transparent; border-radius: 30px; font-weight:100; font-size:10pt; letter-spacing: 1px; margin-left: 3px; padding-left: 8px; padding-right: 7px;}");
    writeCss("button.ribbonbutton { padding-top:2px;height:77px; }");
    writeCss(".ribbonbutton { padding-top:2px;height:77px; }");
    writeCss("button { background-color:transparent }");
    writeCss("button:hover {	background-color:"+theme.ribbonhighlight+";color:black;}button:active {	position:relative;	top:1px;}");
    writeCss("button.ribbonbutton:hover {	background-color:"+theme.ribbonhighlight+";color:black;}button:active {	position:relative;	top:1px;}");
    writeCss("select { background-color:#999;color:black;}");

    executeSettings();
    writeCss(".has-tip:hover { border-bottom: solid 1px #ccc; color:inherit; }");
```

##Breaking it Down
######Let's examine this theme piece by piece

###initTheme
When the theme is loaded, all code not in a function is executed immediately. `initTheme` executes periodically, about 10 times a second, to fit all on-screen elements according to the defined styles.

This is clear in some of the code that is written:

* `theme.darkbg = 'rgb(1, 1, 1)';` 
    * You must define the palette that you want for this theme
    * If your palette is based on user selection, grab those settings: `theme.ribbonhighlight = getSettings("ribbonhighlight"); `
* `$('#panel_content').css('background-color', '#333');`
    * Any elements that you want to style should also be chosen here
    
### Theme Settings
#### Loading
As you see here, `loadThemeSettings` creates HTML for the settings menu. If this function does not exist, the settings menu will not appear. Note how the theme must take into account current settings when creating options

```Javascript
    function loadThemeSettings() {
        out = 'Highlight Color: <select id="ThemeColor">';
        if(theme.ribbonhighlight == "#09f")
            out += '<option value="#09f" selected="true">Blue</option>'; 
        else    
            out += '<option value="#09f">Blue</option>';
        if(theme.ribbonhighlight == "#f90")
            out += '<option value="#f90" selected="true">Orange</option>';
        else    
            out += '<option value="#f90">Orange</option>';

         return out; 
    }
```

#### Executing
After the HTML is returned and sent to the settings menu, more code is run to check for changes and if so, change the theme.
```Javascript
    function runThemeSettings() {
        $('#ThemeColor').on('change', function() {
           theme.ribbonhighlight = $(this).val(); 
            writeToSettings('ribbonhighlight', $(this).val());

            executeSettings();
        });   
    }
```

When settings change the theme, it is recommended that an external function is called. This function is also called at the beginning. This reduces the amount of code needed.

```Javascript
    function executeSettings() {
        writeCss("button:hover {	background-color:"+theme.ribbonhighlight+";color:black;}button:active {	position:relative;	top:1px;}");
        writeCss("button.ribbonbutton:hover {	background-color:"+theme.ribbonhighlight+";color:black;}button:active {	position:relative;	top:1px;}");
        writeCss("::selection {color:white;background:"+theme.ribbonhighlight+";}::-moz-selection {color:white;background:"+theme.ribbonhighlight+";}");  
        writeCss("input:focus, div:focus, button:focus{ outline: solid 1px "+theme.ribbonhighlight+";} input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px "+theme.ribbonhighlight+" inset}");
    }
```
    