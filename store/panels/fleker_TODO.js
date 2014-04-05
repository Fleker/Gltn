currentpanel = "fleker_TODO";
function GetPanelfleker_TODO() {
    return {title: "TODO LIST", width:30, bordercolor: "#d35400"};
}
function RunPanelfleker_TODO() {
    function restart() {
        out = "Write {TODO ...} or {FUTURE ...} to take a note. These notes will be collected here. You can also @ someone to designate a role.<br><br>";
        input = $('.content_textarea').html();
        arr = input.match(/{(TODO|FUTURE) [^}]*}/g);
        out += "<table style='width:95%'>";
//        console.log(arr);
        for(i in arr) {
            console.warn(arr[i]);
            var user = undefined;
            if(arr[i].search(/@ ([^\s]*)/g) != -1) {
                //Pull out username
                user = arr[i].substring(arr[i].search(/@ ([^\s]*)/g)).split(' ')[1];
            }
            //Construct a Card for each item
            out += "<tr><td style='background-color:"+theme.normbg+";padding-bottom: 15px;padding-left: 15px;padding-top: 6px;'><b>";
            if(arr[i].split(' ')[0] == "{TODO")
               out += "<span style='color:#d35400'>TODO</span>";
            else
               out += "<span style='color:#8e44ad'>FUTURE</span>";
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
    }   
    restart();
}