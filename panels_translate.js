// Translate Panel
currentpanel = "fleker_Translate";
function GetPanelfleker_Translate() {
	return {title: "Translate", bordercolor: "#09f", width: 35, override:[13]};
}
function RunPanelfleker_Translate() {
	var noconnection = "<span class='font-size:16pt'>Sorry</span><br>You need to be online to translate words.";
	postPanelOutput("Loading...");
	$.get('panels_translater.php', {}, function(d) {
		out = '<iframe seamless style="width:100%;height:'+(window.innerHeight-210)+'px" src="panels_translater.php"></iframe>';
		postPanelOutput(out);
	})
	.fail(function() {
		postPanelOutput(noconnection);
	});
}