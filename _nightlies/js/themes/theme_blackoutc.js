// Sample theme - BlackoutCondensed
// This is meant to be a softer theme, using a dark background to be easier to see
//TODO Include a darker colorset for people working VERY late at night.

theme.bodyColor = "rgb(34,34,34)";
theme.bodyColorDark = "rgb(1,1,1)";
theme.fontColor = "#efefef";
theme.fontColorDark = "#fff";
theme.fontColorAlt = "#eee";
theme.fullscreen.bodyColor = "rgb(41,41,41)";
theme.fullscreen.fontColor = "white";
theme.fullscreenDark.bodyColor = "rgb(41,41,41)";
theme.fullscreenDark.fontColor = "white";
theme.isRelativeDark = true;
theme.ribbon.highlight = "#09f";
if(hasSetting('ribbonhighlight'))
    theme.ribbon.hightlight = getSettings("ribbonhighlight"); 
else
    writeToSettings("ribbonhighlight", "#09f");

function initTheme() {
    $('.header').css('background-color', '#333').css('border-bottom', 'solid 1px rgba(255,255,255,0.4)');
	$('#panel_content').css('background-color', '#333');
	$('#panel_plugin').css('background-color', '#333');
    $('input[data-theme!=false]').css('background-color', '#444').css('color', theme.fontColor).css('font-family', '"Roboto Condensed", sans-serif').css('font-size', '11pt');
    $('td[data-theme!=false]').css('color', theme.fontColor);
    $('button').css('font-family', '"Roboto Condensed", sans-serif');
	$('.toolbar, .overflow').css('background-color', '#444');
	$('.popuptop').css('color', 'white').css('background-color', theme.bodyColor);
	$('.content_textarea[data-fullscreen!=true]').css('line-height','1.4em').css('padding-right', '5px');
	$('.hovertag').css('font-size', '10pt');
}	
function loadThemeSettings() {
    out = 'Highlight Color: <select id="ThemeColor">';
    if(theme.ribbon.highlight == "#09f")
        out += '<option value="#09f" selected="true">Blue</option>';
    else    
        out += '<option value="#09f">Blue</option>';
    if(theme.ribbon.highlight == "#f90")
        out += '<option value="#f90" selected="true">Orange</option>';
    else    
        out += '<option value="#f90">Orange</option>';
        
     return out; 
}
function runThemeSettings() {
    $('#ThemeColor').on('change', function() {
        theme.ribbon.highlight = $(this).val(); 
        writeToSettings('ribbonhighlight', $(this).val());
        executeSettings();  
    });   
}
function executeSettings() {
    writeCss("button:hover {	background-color:"+theme.ribbon.highlight+";color:black;}button:active {	position:relative;	top:1px;}");
    writeCss("button.ribbonbutton:hover, button.toolbutton:hover {	background-color:"+theme.ribbon.highlight+";color:black;}button:active {	position:relative;	top:1px;}");
    writeCss("button.close:hover { background-color:"+theme.palette.red.thick+"}");
    writeCss("::selection {color:white;background:"+theme.ribbon.highlight+";}::-moz-selection {color:white;background:"+theme.ribbon.highlight+";}");  
    writeCss("input:focus, div:focus, button:focus{ outline: solid 1px "+theme.ribbon.highlight+";} input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px "+theme.ribbon.highlight+" inset}");
}
writeCss("@import url(http://fonts.googleapis.com/css?family=Roboto+Condensed:300italic,400italic,700italic,400,300,700);");
writeCss("body { font-family: 'Roboto Condensed', sans-serif }");
	
$('button.toolbutton').css('background-color', '').css('color', '');
writeCss("button.textbutton {text-indent:0;	border:1px solid white;	display:inline-block; color:"+theme.bodyColor+";	font-style:normal;	text-decoration:none;	text-align:center;padding:3px; text-transform:uppercase; min-width:80px; color:white; border-radius: 30px; font-weight:100; font-size:10pt; letter-spacing: 1px; margin-left: 3px; padding-left: 8px; padding-right: 7px;}");
writeCss("button.ribbonbutton { padding-top:2px;height:77px;color:"+theme.fontColor+" }");
writeCss("button { background-color:transparent; padding:6px; padding-left: 10px; padding-right:10px; color: "+theme.fontColor+"; }");
writeCss("select { background-color:#333;color:"+theme.fontColorAlt+";} select:hover { background-color:#555 }");
writeCss(".has-tip:hover { border-bottom: solid 1px #ccc; color:inherit; }");

executeSettings();