Here is the code used to make the Spotify Player.

```Javascript
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
```

## *Breaking it Down*

### User Flow
#### JSON
As this panel will display and play several genres of music, a data source must be established. This can be done in an easy, simplified way with a JSON object.
```Javascript
    var playlists = {
        Psyched: "https://play.spotify.com/user/12495681/playlist/1nCh78mkclE3034mGo03eT",
        Jazz: "https://play.spotify.com/user/spotify/playlist/5O2ERf8kAYARVVdfCKZ9G7"
    }
```

#### Start Service
When something is playing, an icon appears in the service bar to let the user know that.
`initService("Fleker_Spotify", "Playing "+name, "<span class='fa fa-headphones'></span>");` 

#### Save Settings
Also, a setting is given the name of the playlist.
`writeToSettings('fleker_Spotify', name);`

#### Retrieve Settings
The user may close the panel and the music will continue to play. If the icon is clicked in the services menu, a check is done.
```Javascript
    try {
        var pl = getSettings("fleker_Spotify");
    } catch(e) {
        var pl = undefined;
    }
```
This is actually the wrong way to complete this task. The same functionality can be determined by using:
    `if(hasSetting("fleker_Spotify"))`

The setting's value is then sent to the inner function `returnToMain`.

#### Remove Service
At first, that funtion ends the service
`initService("Fleker_Spotify", "", "");`

Later, it checks to see if the playlist is real or not. Again, this problem can be simplified to `hasSetting`. If the setting is real, the panel will open the playlist again.

```Javascript
    if(playlist != undefined && playlist != "undefined") {
        startPlaying(playlist);
    } else {
        writeToSettings("fleker_Spotify", undefined);
    }	  
```

### Comments
This panel has a few flaws in it. It's not the most effective way to do the action. Try simplifying it for yourself. Then commit the changes back to the original open source project.
