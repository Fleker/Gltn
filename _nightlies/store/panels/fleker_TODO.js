//TODO Tables to divs
//TODO See your items only
//TODO Remove need for brackets
//TODO Training section
var p = panelManager.getAvailablePanels().Fleker_TODO;
p.setManifest({
    title: "TODO LIST",
    name: "Todo",
    width: 30,
    bordercolor: "#d35400",
    icon: "check-circle-o"
});
//TODO Move to DIVs
p.onRun = function() {
    function restart() {
        out = "Write {TODO,FUTURE ...} to take a note. These notes will be collected here. You can also @ someone to designate a role.<br><br>";
        input = $('.content_textarea').html();
        arr = input.match(/{(TODO|FUTURE|NOTE|FIXME|CHANGES) [^}]*}/g);
        out += "<table style='width:95%'>";
        for(i in arr) {
//            console.warn(arr[i]);
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