// JavaScript Document
console.warn("This app is offline, load the offline stuff");
window.offline = true;

function offlineGo() {
	window.offline = true;
	console.log("Offline-Go");
	console.log($('#file_name_internal').val());
//Load 3rd-Party Panels
	var a = window.settings.panels.split(', ');
	for(i in a) {
		//get panel file
		if(localStorage['zpanels_'+a[i]] != undefined) {
			console.log(['zpanels_'+a[i]]);
			$('body').append("<script>"+localStorage['zpanels_'+a[i]]+"</script>");	
		}
	}
	console.log($('#file_name_internal').val());
	initPanels();
	console.log($('#file_name_internal').val());

//Load 3rd-Party Themes
	var b = window.settings.theme.split(', ');
	for(i in b) {
		//console.log('ztheme_'+b[i], settings.currenttheme);
		if(localStorage['ztheme_'+b[i]] != undefined && b[i] == settings.currenttheme) {
			console.log("Insert JS " + 'ztheme_'+b[i]);
			$('body').append("<script>"+localStorage['ztheme_'+b[i]]+"</script>");
		}
	}
	console.log($('#file_name_internal').val());
	startThemer();
	console.log($('#file_name_internal').val());
}
//setTimeout("offlineGo()", 5000);