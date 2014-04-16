// Sample theme - Blackout
// This is meant to be a softer theme, using a dark background to be easier to see
function initTheme() {
//	window.theme = {};
	//set theme variables
	//fullscreen variables
	theme.darkbg = 'rgb(1, 1, 1)';
	theme.darkcolor = '#fff';
	theme.normbg = 'rgb(34, 34, 34)',
	theme.normcolor = '#efefef';
	theme.coloralt = '#eee';
	theme.normfsui = "rgba(41,41,41)";
	theme.darkfsui = "rgba(41,41,41)";
	theme.darkfsuicolor = 'white';
	theme.normfsuicolor = 'white';
//	theme.ribbonhighlight = '#05a';
    theme.ribbonhighlight = '#09f';
    if(window.settings.ribbonhighlight != undefined && window.settings.ribbonhighlight.length > 0)
        theme.ribbonhighlight = window.settings.ribbonhighlight; 
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
}	
function loadThemeSettings() {
    out = 'Highlight Color: <select id="ThemeColor">';
    if(theme.ribbonhighlight == "#09f")
        out += '<option value="#09f" selected="true">Blue</option>'
    else    
        out += '<option value="#09f">Blue</option>'
    if(theme.ribbonhighlight == "#f90")
        out += '<option value="#f90" selected="true">Orange</option>'
    else    
        out += '<option value="#f90">Orange</option>'
        
     return out; 
}
function runThemeSettings() {
    $('#ThemeColor').on('change', function() {
       theme.ribbonhighlight = $(this).val(); 
        writeToSettings('ribbonhighlight', $(this).val());
        
        writeCss("button:hover {	background-color:"+theme.ribbonhighlight+";color:black;}button:active {	position:relative;	top:1px;}");
        writeCss("button.ribbonbutton:hover {	background-color:"+theme.ribbonhighlight+";color:black;}button:active {	position:relative;	top:1px;}");
        writeCss("::selection {color:white;background:"+theme.ribbonhighlight+";}::-moz-selection {color:white;background:"+theme.ribbonhighlight+";}");
    });   
}
initTheme();
writeCss("@import url(http://fonts.googleapis.com/css?family=Roboto+Condensed:300italic,400italic,700italic,400,300,700);");
//set theme colors/css
	themeCss('font-family', '"Roboto Condensed", sans-serif');
	themeCss('background-color', theme.normbg);
	themeCss('color', theme.normcolor);
//Theme parameters for content_textarea not necessary (unless we removed the reload requirement for themes - but for now it'll stay due to a lack of default parameters)
	$('.content_textarea').css('background-color', theme.normbg).css('color', theme.normcolor);
setLoaderColor('255,255,255');
writeCss("button.textbutton {	background-color:"+theme.normcolor+";	border-radius:3;	text-indent:0;	border:1px solid #888;	display:inline-block;	color:"+theme.normbg+";	font-weight:bold;	font-style:normal;	text-decoration:none;	text-align:center;padding:3px;min-width:30px;}");
writeCss("button.ribbonbutton { padding-top:2px;height:77px; }");
writeCss(".ribbonbutton { padding-top:2px;height:77px; }");
writeCss("button { background-color:transparent }");
writeCss("button:hover {	background-color:"+theme.ribbonhighlight+";color:black;}button:active {	position:relative;	top:1px;}");
writeCss("button.ribbonbutton:hover {	background-color:"+theme.ribbonhighlight+";color:black;}button:active {	position:relative;	top:1px;}");

writeCss("::selection {color:white;background:"+theme.ribbonhighlight+";}::-moz-selection {color:white;background:"+theme.ribbonhighlight+";}");