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
	
	//set theme colors/css
	themeCss('font-family', 'sans-serif');
	themeCss('background-color', theme.normbg);
	themeCss('color', theme.normcolor);
	
	$('.header').css('background-color', '#333').css('border-bottom', 'solid 0px #555');
	$('#panel_content').css('background-color', '#333');
	$('#panel_plugin').css('background-color', '#333');
	$('input').css('background-color', '#444').css('color', theme.normcolor);
	$('.toolbar').css('background-color', '#444')
	$('.content_textarea').css('background-color', theme.normbg).css('color', theme.normcolor);
	
	//Misc panel support
	$('.tfile').css('background-color', '#444');
	
}	
initTheme();