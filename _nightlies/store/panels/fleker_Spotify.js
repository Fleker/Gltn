var p = panelManager.getAvailablePanels().Fleker_Spotify;
p.setManifest({
    title: "Spotify Player",
    name: "Music",
    bordercolor: "#81b71a",
    icon: "headphones",
    width: 25
});
p.onRun = function() {
    var playlists = {
        Psyched: "https://play.spotify.com/user/12495681/playlist/1nCh78mkclE3034mGo03eT",
        Jazz: "https://play.spotify.com/user/spotify/playlist/5O2ERf8kAYARVVdfCKZ9G7",
        Coffee: "",
        Deep-Focus: ""
    }
	function startPlaying(name) {
		var playlist = playlists[name];
		initService("Fleker_Spotify", "Playing "+name, "<span class='fa fa-headphones'></span>");
		out = "<button class='textbutton return'><span class='fa fa-arrow-left'></span>&nbsp;Back</button><br>";
        
		out += '<iframe style="height:90%;width:95%;" src="https://embed.spotify.com/?uri='+playlist+'" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
		
        postPanelOutput(out);
		writeToSettings('fleker_Spotify', name);
		$('button.return').on('click', function() {
			returnToMain();
		});
	}
	function returnToMain(playlist) {
		initService("Fleker_Spotify", "", "");
		out = "Some people enjoy listening to music while they work.<br>Choose a mood to begin a playlist.<br>";
		for(i in playlists) {
			out += "&emsp;<button class='textbutton playlist' data-id='"+playlists[i]+"'>-"+playlists[i]+"</button>";
		}				

		postPanelOutput(out);
		$('button.playlist').on('click', function() {
			startPlaying($(this).attr('data-id'));
		});
		if(playlist != undefined && playlist != "undefined") {
			startPlaying(playlist);
		} else {
			writeToSettings("fleker_Spotify", undefined);
		}	
	}
	try {
		var pl = getSettings("fleker_Spotify");
	} catch(e) {
		var pl = undefined;
	}
	returnToMain(pl);
}
p.activate();