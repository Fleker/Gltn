currentpanel = "fleker_Wordcloud";
function GetPanelfleker_Wordcloud() {
    return {title:"Word Cloud", width:35, bordercolor: "#3498db"};
}
function RunPanelfleker_Wordcloud() {
    //Grab the content, split into words, and tally them
    var arr = $('.content_textarea').html().toLowerCase().trim().replace(/<[^>]*>/g, "").replace(/"/g, "").replace(/&nbsp;/g, " ").split(' ');
    var obj = {};
    for(i in arr) {
        if(arr[i].length < 1)
            continue;
        if(obj[arr[i].toLowerCase().trim()] == undefined)
            obj[arr[i].toLowerCase().trim()] = 1;
        else
            obj[arr[i].toLowerCase().trim()] = obj[arr[i].toLowerCase().trim()] + 1;
    }
    
    var sortable = [];
    for (var vehicle in obj) {
//        console.log(vehicle, obj[vehicle]);
        sortable.push([vehicle, obj[vehicle]]);
    }
    sortable.sort(function(a, b) {return b[1] - a[1]})
    
    out = "";
    for(i in sortable) {
//        console.log(sortable, i, sortable[i]);
        //Get percent to determine size
        out += "&emsp;&emsp;<span style='border-bottom:solid 1px "+theme.coloralt+";border-bottom-style:outset;font-size:";
        var a = sortable[i][1] / arr.length*10;
//        console.log(sortable[i][1], a);
        if(a > 10)
            out += 40;
        else if(a > 5)
            out += 32;
        else if(a > 2)
            out += 28;
        else if(a > 1)
            out += 26;
        else if(a > 0.7)
            out += 24;
        else if(a > 0.5)
            out += 20;
        else if(a > 0.25)
            out += 18;
        else if(a > 0.1)
            out += 12;
        else if(a > 0.05)
            out += 10;
        else
            out += 8;
        
        out += "pt' title='"+sortable[i][1]+" instance(s)"+"'>"+sortable[i][0]+"</span>       ";
    }
    postPanelOutput(out);
}