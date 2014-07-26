## Blackout Condensed
This is the source code for the Blackout theme to help developers see a full theme and how it uses the Theme APIs.

```Javascript
    theme.bodyColor = 'rgb(34, 34, 34)',
    theme.bodyColorDark = 'rgb(1, 1, 1)';
    theme.fontColor = '#efefef';
    theme.fontColorAlt = '#eee';
    theme.fontColorDark = '#fff';
    theme.fullscreen.bodyColor = "rgba(41,41,41)";
    theme.fullscreenDark.bodyColor = "rgba(41,41,41)";
    theme.fullscreenDark.fontColor = 'white';
    theme.fullscreenDark.bodyColor = 'white';
    theme.isRelativeDark = true;
    theme.ribbon.highlight = '#3498db';

    function initTheme() {
        $('.header').css('background-color', '#333').css('border-bottom', 'solid 0px #555');
        $('#panel_content').css('background-color', '#333');
        $('#panel_plugin').css('background-color', '#333');
        $('input[data-theme!=false]').css('background-color', '#444').css('color', theme.fontColor).css('font-family', '"Roboto", sans-serif');
        $('.toolbar, .overflow').css('background-color', '#444');
        $('.popuptop').css('color', 'white').css('background-color', theme.bodyColor);
        $('.popuptitle').css('color', theme.fontColorAlt);
        $('.hovertag').css('font-size', '10pt');
        $('button').css('font-family', '"Roboto", sans-serif').css('border-radius', '0px');
        $('button').css('text-transform', 'initial').css('letter-spacing', '0px');
    }	
    initTheme();
    writeCss("@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic);");

        themeCss('font-family', '"Roboto", sans-serif');

    setLoaderColor('255,255,255');
    writeCss("button { font-family:Roboto;background-color:rgba(255,255,255,0.01);border-radius:3;text-indent:0;border:1px solid #888;display:inline-block;color:#ccc;font-weight:bold;font-style:normal;text-decoration:none;text-align:center;padding:5px;min-width:30px;letter-spacing:0px;} button:hover { background-color: "+theme.ribbon.highlight+"; color: #222; } button:active {position:relative;top:1px;}");

    writeCss("button.textbutton {	background-color:"+theme.fontColor+";	border-radius:3;	text-indent:0;	border:1px solid #888;	display:inline-block;	color:"+theme.bodyColor+";	font-weight:bold;	font-style:normal;	text-decoration:none;	text-align:center;padding:3px;min-width:30px;}");
    writeCss("button.ribbonbutton { border:none; padding-top:2px;height:77px; }");
    writeCss("button { background-color:transparent;color:"+theme.fontColor+" }");
    writeCss("button:hover {	background-color:"+theme.ribbon.highlight+";color:black;}button:active {	position:relative;	top:1px;}");
    writeCss("button.ribbonbutton:hover {	background-color:"+theme.ribbon.highlight+";color:black;}button:active {	position:relative;	top:1px;}");
    writeCss("button.close:hover { background-color:"+theme.palette.red.normal+"}");
```

## *Breaking it Down*

### Define the Palette
The theme's background color is dark. The background is dark gray, and the text color is almost white. Thus, the boolean `isRelativeDark` is set to true. This helps developers pick which color to use. The function `getAppropriateColor(lightcolor, darkcolor)` chooses the color to display based on this boolean. A developer may want their link to be blue. If the background is white, the link color shouldn't be light blue. The specific interpretation of dark can be considered vague. Make it true if the background color is relatively dark. Try to check how certain shades of color respond to your theme to make a better decision.

`theme.isRelativeDark = true;`

### Write CSS
Many rules are specified for how buttons should look and act. This can be done with the `writeCss` function, which directly inserts CSS into the webpage. Whenever a new theme is chosen, these CSS rules are removed so that new ones can be added.

```Javascript
    writeCss("button { font-family:Roboto;background-color:rgba(255,255,255,0.01);border-radius:3;text-indent:0;border:1px solid #888;display:inline-block;color:#ccc;font-weight:bold;font-style:normal;text-decoration:none;text-align:center;padding:5px;min-width:30px;letter-spacing:0px;} button:hover { background-color: "+theme.ribbon.highlight+"; color: #222; } button:active {position:relative;top:1px;}");
    writeCss("button.textbutton {	background-color:"+theme.fontColor+";	border-radius:3;	text-indent:0;	border:1px solid #888;	display:inline-block;	color:"+theme.bodyColor+";	font-weight:bold;	font-style:normal;	text-decoration:none;	text-align:center;padding:3px;min-width:30px;}");
    writeCss("button.ribbonbutton { border:none; padding-top:2px;height:77px; }");
    writeCss("button { background-color:transparent;color:"+theme.fontColor+" }");
    writeCss("button:hover {	background-color:"+theme.ribbon.highlight+";color:black;}button:active {	position:relative;	top:1px;}");
    writeCss("button.ribbonbutton:hover {	background-color:"+theme.ribbon.highlight+";color:black;}button:active {	position:relative;	top:1px;}");
    writeCss("button.close:hover { background-color:"+theme.palette.red.normal+"}");
```