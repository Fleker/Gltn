This is a simple TODO app. By typing TODO or FUTURE, it will put that into a list where you are able to see all your tasks. You can also assign tasks to other people.

```Javascript
    var p = panelManager.getAvailablePanels().Fleker_TODO;
    p.setManifest({
        title: "TODO LIST",
        name: "Todo",
        width: 30,
        bordercolor: "#d35400",
        icon: "check-circle-o"
    });
    p.onRun = function() {
        function restart() {
            out = "Write {TODO,FUTURE ...} to take a note. These notes will be collected here. You can also @ someone to designate a role.<br><br>";
            input = $('.content_textarea').html();
            arr = input.match(/{(TODO|FUTURE|NOTE|FIXME|CHANGES) [^}]*}/g);
            out += "<table style='width:95%'>";
            for(i in arr) {
                var user = undefined;
                if(arr[i].search(/@ ([^\s]*)/g) != -1) {
                    //Pull out username
                    user = arr[i].substring(arr[i].search(/@ ([^\s]*)/g)).split(' ')[1];
                }
                //Construct a Card for each item
                out += "<tr><td style='background-color:"+theme.normbg+";padding-bottom: 15px;padding-left: 15px;padding-top: 6px;'><b>";
                var kind = arr[i].split(' ')[0];
                if(kind == "{TODO")
                    out += "<span style='color:#d35400'>TODO</span>";
                else if(kind == "{FUTURE")
                    out += "<span style='color:#8e44ad'>FUTURE</span>";
                else if(kind == "{NOTE")
                    out += "<span style='color:#14e715'>NOTE</span>";
                else if(kind == "{FIXME")
                    out += "<span style='color:#e00032'>FIXME</span>";
                else if(kind == "{CHANGES")
                    out += "<span style='color:#607d8b'>CHANGES</span>";
                out += "</b><br>";
                if(user != undefined) {
                    out += "<b>For "+user+"</b><div style='padding-left:1em'>";
                    for(j in arr[i].substring(arr[i].search(/@ ([^\s]*)/g)).split(' ')) {
                        if(j >= 2) {
                            out += arr[i].substring(arr[i].search(/@ ([^\s]*)/g)).split(' ')[j].replace(/}/g, "")+" ";
                        }
                    }
                    out += "</div>";
                } else {
                    out += "<div style='padding-left:1em'>";
                    for(j in arr[i].split(' ')) {
                        if(j >= 1) {
                            out += arr[i].split(' ')[j].replace(/}/g, "")+" ";
                        }
                    }
                    out += "</div>";
                }
                out += "</td></tr>";
            }
            out += "</tr></table>";
            postPanelOutput(out);
            $('.PanelKeyEvent').off().on('click', function() {
                restart();
            });

        }   
        restart();
    }
    p.activate();
```

## *Breaking it Down*

### Setting Attributes
The first things that are done are that the panel is found in the panel manager and the manifest is set.
```Javascript
    var p = panelManager.getAvailablePanels().Fleker_TODO;
    p.setManifest({
        title: "TODO LIST",
        name: "Todo",
        width: 30,
        bordercolor: "#d35400",
        icon: "check-circle-o"
    });
```

Note how you set the title and name as two separate things? The name "Todo" appears in the holoribbon as the name of the panel. When opened, "TODO LIST" is displayed at the top so you know what panel is active. Other attributes are also set here, such as the width of the panel, color of the border, and the icon to be displayed. In this case, the icon is a Font Awesome character. 

### Running
The panel will run as the `onRun` method is called. The method includes functions inside the scope in order to make cleaner and more organized code.
```Javascript
    p.onRun = function() {
        function restart() {
            out = "Write {TODO,FUTURE ...} to take a note. These notes will be collected here. You can also @ someone to designate a role.<br><br>";
            ...
            postPanelOutput(out);
        }
        restart();
    }
```

### Respond to Keys
The TODO panel, if it continues to be open, should continually refresh to make sure that all TODOs are displayed. To respond to keypresses, the panel adds a click event for the panel key event.

```Javascript
    $('.PanelKeyEvent').off().on('click', function() {
        restart();
    });
```

### Activate
The panel must be activated before it can be used. This is your way of telling the `PanelManager`, "Hey, I'm downloaded and ready to be used." This can be done with one simple line of code.
`p.activate();`