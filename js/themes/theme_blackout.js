// Sample theme - Blackout
// This is meant to be a softer theme, using a dark background to be easier to see
function initTheme() {
	window.theme = {};
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
	theme.ribbonhighlight = '#3498db';
	theme.ribbonplain = 'rgba(0,0,0,0)';
	$('.header').css('background-color', '#333').css('border-bottom', 'solid 0px #555');
	$('#panel_content').css('background-color', '#333');
	$('#panel_plugin').css('background-color', '#333');
	$('input').css('background-color', '#444').css('color', theme.normcolor);
	$('.toolbar, .overflow').css('background-color', '#444');
	$('.popuptop').css('color', 'white').css('background-color', theme.normbg);
	$('.popuptitle').css('color', theme.coloralt);
	$('.hovertag').css('font-size', '10pt');
	
	//Misc panel support
	$('.tfile').css('background-color', '#444');
	
	
}	
initTheme();
writeCss("@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic);");
//set theme colors/css
	themeCss('font-family', '"Roboto", sans-serif');
	themeCss('background-color', theme.normbg);
	themeCss('color', theme.normcolor);
setLoaderColor('255,255,255');
writeCss("button { font-family:Roboto;background-color:rgba(255,255,255,0.01);border-radius:3;text-indent:0;border:1px solid #888;display:inline-block;color:#ccc;font-weight:bold;font-style:normal;text-decoration:none;text-align:center;padding:5px;min-width:30px;} button:hover { background-color: "+theme.ribbonhighlight+"; color: #222; } button:active {position:relative;top:1px;}");
//Theme parameters for content_textarea not necessary (unless we removed the reload requirement for themes - but for now it'll stay due to a lack of default parameters)
	//$('.content_textarea').css('background-color', theme.normbg).css('color', theme.normcolor);