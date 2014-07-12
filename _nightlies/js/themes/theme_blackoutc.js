// Sample theme - Blackout
// This is meant to be a softer theme, using a dark background to be easier to see
//TODO Use new palette system 
//TODO Include a darker colorset for people working VERY late at night.
//TODO Replace document
//TODO Take Advantage of New System Stuff
theme.bodyColor = "rgb(34,34,34)";
theme.bodyColorDark = "rgb(1,1,1)";
theme.fontColor = "#efefef";
theme.fontColorDark = "#fff";
theme.fontColorAlt = "#eee";
theme.fullscreen.bodyColor = "rgb(41,41,41)";
theme.fullscreen.fontColor = "white";
theme.fullscreenDark.bodyColor = "rgb(41,41,41)";
theme.fullscreenDark.fontColor = "white";
theme.ribbon.highlight = "#09f";
 if(getSettings("ribbonhighlight") !== undefined && getSettings("ribbonhighlight").length > 0)
        theme.ribbon.hightlight = getSettings("ribbonhighlight"); 

function initTheme() {
	$('.header').css('background-color', '#333').css('border-bottom', 'solid 1px rgba(255,255,255,0.4)');
	$('#panel_content').css('background-color', '#333');
	$('#panel_plugin').css('background-color', '#333');
	$('input').css('background-color', '#444').css('color', theme.fontColor).css('font-family', '"Roboto Condensed", sans-serif').css('font-size', '11pt');
	$('button').css('font-family', '"Roboto Condensed", sans-serif');
	$('.toolbar, .overflow').css('background-color', '#444');
	$('.popuptop').css('color', 'white').css('background-color', theme.bodyColor);
	$('.popuptitle').css('color', theme.fontColorAlt);
    $('.content_textarea').css('line-height','1.4em').css('padding-right', '5px');
	$('.hovertag').css('font-size', '10pt');
	
	//Misc panel support
	$('.tfile').css('background-color', '#444');	
	$('.tfile.selected').css('background-color', theme.palette.blue.normal);	
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
    writeCss("button.ribbonbutton:hover {	background-color:"+theme.ribbon.highlight+";color:black;}button:active {	position:relative;	top:1px;}");
    writeCss("::selection {color:white;background:"+theme.ribbon.highlight+";}::-moz-selection {color:white;background:"+theme.ribbon.highlight+";}");  
    writeCss("input:focus, div:focus, button:focus{ outline: solid 1px "+theme.ribbon.highlight+";} input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px "+theme.ribbon.highlight+" inset}");
}
initTheme();
writeCss("@import url(http://fonts.googleapis.com/css?family=Roboto+Condensed:300italic,400italic,700italic,400,300,700);");
//set theme colors/css

//TODO Future set these bodycolor/fontcolor attributes automatically
	themeCss('font-family', '"Roboto Condensed", sans-serif');
	themeCss('background-color', theme.bodyColor);
	themeCss('color', theme.fontColor);
//Theme parameters for content_textarea not necessary (unless we removed the reload requirement for themes - but for now it'll stay due to a lack of default parameters)
	$('.content_textarea').css('background-color', theme.bodyColor).css('color', theme.fontColor);
setLoaderColor('255,255,255');
writeCss("button.textbutton {text-indent:0;	border:1px solid white;	display:inline-block;	color:"+theme.bodyColor+";	font-style:normal;	text-decoration:none;	text-align:center;padding:3px; text-transform:uppercase; min-width:80px; color:white; background-color: transparent; border-radius: 30px; font-weight:100; font-size:10pt; letter-spacing: 1px; margin-left: 3px; padding-left: 8px; padding-right: 7px;}");
writeCss("button.ribbonbutton { padding-top:2px;height:77px; }");
writeCss(".ribbonbutton { padding-top:2px;height:77px; }");
writeCss("button { background-color:transparent }");
writeCss("button:hover {	background-color:"+theme.ribbon.highlight+";color:black;}button:active {	position:relative;	top:1px;}");
writeCss("button.ribbonbutton:hover {	background-color:"+theme.ribbon.highlight+";color:black;}button:active {	position:relative;	top:1px;}");
writeCss("select { background-color:#999;color:black;}");

executeSettings();
writeCss(".has-tip:hover { border-bottom: solid 1px #ccc; color:inherit; }");