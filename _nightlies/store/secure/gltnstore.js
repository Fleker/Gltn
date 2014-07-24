/*** Store-Related Code ***/
function getBaseLog(y, x) {
    return Math.log(y) / Math.log(x);
}
//TODO Tools library and spreadsheets
//TODO uummm... oh yeah add a loader
function getIcon(icon, size) {
    var font_size = "13pt";
    var img_size = "24px";
    switch(size) {
        case "small":
            font_size = "7pt";
            img_size = "8px";
            break;
        case "normal":
            break;
        case "large":
            font_size = "18pt";
            img_size = "18px";
            break;
        case "xlarge":
            font_size = "22pt";
            img_size = "24px";
            break;
        default:
            //this is a number
            font_size = size+"pt";
            img_size = font_size;
    }
    //This is an image url
    if(icon.indexOf(".") > -1) {
        return "<img src='"+icon+"' style='"+img_size+"'>";
    }
//        else {
        //Icon Font -- Probably Font Awesome
        return "<span class='fa fa-"+icon+"' style='font-size:"+font_size+"'></span>";
//    }
}
//Estimates a download count to the nearest integer on an order of ten
function getDownloadCount(number) {
    if(number < 10) {
        return "Few downloads";
    } else {
        //console.log(getBaseLog(number, 10),Math.floor(getBaseLog(number, 10)),Math.pow(10, Math.floor(getBaseLog(number, 10))),Math.floor(number/Math.pow(10, Math.floor(getBaseLog(number, 10)))));
        var n = Math.pow(10, Math.floor(getBaseLog(number, 10)))*Math.round(number/Math.pow(10, Math.floor(getBaseLog(number, 10))));
        return "About "+ n + " downloads";
        //Math.round(10*(n/Math.pow(10, Math.floor(getBaseLog(n,10)))))	
    }
}
function getStoreCard(plugin, i) {
    var out = "";
    //console.log(d[i], d[i].parent);
        out += "<div style='display:inline-block'>&emsp;"+getIcon(plugin.icon_fa, 50)+"</div>";
        out += "<div style='display:inline-block;width: calc(100% - 85px);'><div style='font-weight:600;padding-top:10px;padding-left:20px;'>"+plugin.name+"</div>";
        if(isInstalled(plugin)) {
            out += "&emsp;<span style='color:"+theme.palette.green.normal+";font-size:8pt' class='fa fa-check'></span><span style='font-size:6pt;color:green'>ADDED</span>";	
        }
//        out += "<br>&emsp;&emsp;<i style='font-size:10pt'>"+plugin.credit+"</i>";
        if(plugin.description.length > 140)
            out += "<div style='font-size:8pt;padding-left:40px;padding-right:5px;padding-top:8px;'>"+plugin.description.substring(0,140)+"...</div>";	
        else
            out += "<div style='font-size:8pt;padding-left:40px;padding-right:5px;padding-top:8px;'>"+plugin.description+"</div>";
        out += "</div>";

        outt = "<div style='border:solid 1px "+getAppropriateColor(theme.palette.grey.accent700, theme.palette.grey.accent100)+";font-size:13pt;cursor:pointer;background-color:"+getAppropriateColor(theme.palette.grey.white, theme.palette.grey.thick)+";padding-top:5px;margin-top:-1px;color:"+getAppropriateColor(theme.palette.grey.thick, theme.palette.grey.light)+";min-height:100px;display: inline-table; width: 400px; margin-right: 24px; margin-bottom: 16px;' class='store_item' data-id='"+i+"'>"+out+"</div>";
        return outt;
}   
//FIXME THis is wrong
function isInstalled(datum) {
    return panelManager.getAvailablePanels()[datum] !== undefined;
    //TODO themes, dictionaries
    return ((datum.type == "Panel" || datum.type == "Service") && window.settings.panels.indexOf(datum.id) > -1) || (datum.type == "Dictionary" && window.settings.dictionary.indexOf(datum.id) > -1) || (datum.type == "Theme" && window.settings.theme.indexOf(datum.id) > -1)
}
function launchStore(storetype) {
	//Grab store data
	falseBuild(true);
	setTimeout('launchStore2("'+storetype+'")', 251);
}
//Move installed/icon functions to root to make them more universal and give them an API. 
//Look at Brackets Extensions/Google Web Store for UI ideas
function launchStore2(storetype) {
	console.log('gs');
	$('.build').append("<div style='background-color:"+theme.bodyColor+";width: 100%;margin-left: 0%;margin-top: 10px;padding-top: 10px;padding-bottom: 40px;color:"+theme.fontColor+"'><div style='font-size:18pt;color:"+theme.fontColorAlt+";font-family:sans-serif;text-align:center;margin-top:-48px;'>Gltn Plugin Store</div><br><div style='text-align:center; width:100% ;font-size:18pt; padding-bottom:64px;' class='fa-stack fa-lg'><span class='fa fa-circle-o fa-stack-2x'></span><span class='fa fa-shopping-cart fa-stack-1x'></span></div><div style='width:100%;text-align:center;'><span class='fa fa-search'></span>&emsp;<input data-theme='false' type='search' placeholder='Search for something...' style='width:75%;background-color:"+theme.bodyColor+";border:none;font-style:italic;display:inline;color:"+theme.fontColor+";font-size:12pt;' id='store_search'></div><div id='build_inner' class='build_inner'>"+getLoader('build_inner')+"</div></div>");
	$('.build').css('line-height', '1em');
	
	function searchTermed(datum) {
		n = $('#store_search').val().toLowerCase();
		if(datum.name.toLowerCase().indexOf(n) > -1)
			return true;
		else if(datum.credit.toLowerCase().indexOf(n) > -1)
			return true;
		
		return false;
	}
	
	function grabStore(storetype) {	
	$.get('http://felkerdigitalmedia.com/gltn/_nightlies/php/storefront.php', {}, function(data) {
		d = $.parseJSON(data);
        window.store = d;
        //Layout will have large search area at top, categories on side, featured on front. Each category will have featured. Like Chrome Webstore
        out = "<div id='storebody' class='row' style='max-width:100%'> <div id='store_categories' class='small-4 medium-3 large-2 columns'></div> <div id='store_display' class='small-8 medium-9 large-10 columns'></div> </div>";
        $('#build_inner').html(out);
        //TODO Maybe switch to Flatbuttons
        $('#store_categories').html("<button id='store_c_home'>Home</button><br><button id='store_c_panels'>Panels</button><br><button id='store_c_services'>Services</button><br><button id='store_c_dictionaries'>Dictionaries</button><br><button id='store_c_themes'>Themes</button><br><button id='store_c_plugins'>Plugins</button><br><button id='store_c_submit'>Developers Portal</button>");
        function loadHome() {
            $('#store_display').empty();
            $('#store_display').append("<div style='text-align:left;font-size:20pt;padding-bottom:16px;margin-left:-16px;'>home</div>");
            for(i in d) {
                if(d[i].featured == 1) {
                    $('#store_display').append(getStoreCard(d[i],i));   
                }
            }   
            loadStoreClickHandlers();
        }
        function loadStoreCategory(catName) {
            if(catName.toLowerCase() == "undefined" || catName === undefined ) {
                loadHome(); 
                return;
            }
            $('#store_display').empty();
            $('#store_display').append("<div style='text-align:left;font-size:20pt;padding-bottom:16px;margin-left:-16px;text-transform:lowercase;'>"+catName+"</div>");
            for(i in d) {
                if(d[i].type == catName && d[i].featured_c == 1) {
                    $('#store_display').append(getStoreCard(d[i],i));   
                }
            }
            for(i in d) {
                if(d[i].type == catName && d[i].featured_c == 0) {
                    $('#store_display').append(getStoreCard(d[i],i));   
                }
            }   
            loadStoreClickHandlers();
        }
        function loadStoreClickHandlers() {
            $('.store_item').on('click', function() {
                var i = store[$(this).attr('data-id')];
                title = getIcon(i.icon_fa, 30)+"&emsp;"+i.name;
                ht = threeColumnText("<div style='padding-left:16px;opacity:0.7;'>"+i.type+"<br>"+"</div>", "<div style='font-size:9pt;opacity:0.7;'>v "+i.version+"<br>"+getDownloadCount(i.install)+"</div>", "<div style='opacity:0.7'>"+i.uid+"<br>"+((i.dev_twitter.length > 0)?"<a href='http://twitter.com/"+ i.dev_twitter +"' target='_blank'>Twitter</a> ":"")+"</div>");
                ht += "<div style='margin-left:10%;width:80%;font-size:12pt;'>"+i.description+"</div>";
                if(i.github.length > 0) 
                    ht += "<div onclick='openTab(\"http://github.com/"+i.github+"\")'><span class='fa fa-github'></span>&nbsp;Fork Me on Github!</div>";
                if(i.twitter.length > 0) 
                     ht += "<div onclick='openTab(\"http://twitter.com/"+i.twitter+"\")'><span class='fa fa-twitter'></span>&nbsp;Follow Me on Twitter!</div>";
                if(isInstalled(i)) 
                    ht += "<br><br><br>&emsp;<span style='color:green;font-size:12pt' class='fa fa-check'></span><span style='font-size:10pt;color:green'>&nbsp;You've already installed this.</span><br><button class='textbutton store_uninstall' data-id='"+$(this).attr('data-id')+"'>Uninstall</button>";	
                else
                    ht += "<br><br><br>&emsp;<button class='textbutton store_install' data-id='"+$(this).attr('data-id')+"'>Install Now</button>";
                initiatePopup({title: title, ht: ht, bordercolor: '#222'});
                $('.store_install').on('click', function() {
                    var i = store[$(this).attr('data-id')];
                    y = confirm("Install "+i.name+"?");
                    if(y == true) {
                        if(i.type == "Panel" || i.type == "Service") {
//                            install_panel(i.id, i.name, getIcon(i.icon_fa, "large"), i.url, (i.type != "Panel"), i.key);
                            var p = new Panel(i.plugin_id, i.url);
                            console.log("Getting Panel "+i.plugin_id+" from "+i.url);
                            panelManager.install(p);
                            $.get('php/storepost.php', {item: i.plugin_id, action: 'Download'}, function() {
                                console.log('Panel installed');
                            });
                            alert('Panel installed');
                        }
                        else if(i.type == "Dictionary") {
                            //FIXME New Class
                            install_dictionary(i.type_d, i.url, i.name, i.id, getIcon(i.icon_fa, "large"));	
                            $.get('php/storepost.php', {item: i.id, action: 'Download'}, function() {
                                console.log('Dictionary installed');
                            });
                            alert('Dictionary added')
                        }
                        else if(i.type == "Theme") {
                            //FIXME New Class
                            install_theme(i.id, i.name, i.url, getIcon(i.icon_fa, "large"));
                            $.get('php/storepost.php', {item: i.id, action: 'Download'}, function() {
                                console.log('Theme installed');
                            });
                            alert('Theme added');
                        } else
                            alert('Unknown data');
                        closePopup();
                    }
                });
                $('.store_uninstall').on('click', function() {
                    var i = store[$(this).attr('data-id')];
                    y = confirm("Are you sure that you wish to uninstall "+i.name+"?");
                    if(y == true) {
                        if(i.type == "Panel" || i.type == "Service" || i.type == "Spreadsheet Library" || i.type == "Converter") {
                            //install_panel(i.id, i.name, getIcon(i), i.url);
                            uninstall_panel(i.id);
                            $.get('php/storepost.php', {item: i.id, action: 'Uninstall'}, function() {
                                console.log('Panel uninstalled');
                            });
                            alert('The panel was uninstalled.');
                        }
                        else if(i.type == "Dictionary") {
                            uninstall_dictionary(i.id);	
                            $.get('php/storepost.php', {item: i.id, action: 'Uninstall'}, function() {
                                console.log('Dictionary uninstalled');
                            });
                            alert('The dictionary was removed.')
                        }
                        else if(i.type == "Theme") {
                            uninstall_theme(i.id);
                            $.get('php/storepost.php', {item: i.id, action: 'Uninstall'}, function() {
                                console.log('Theme uninstalled');
                            });
                            alert('The theme was removed.');
                        }
                        else
                            alert('Unknown data');
                        closePopup();
                        grabStore();
                    }
                });   
            });
        }
        loadHome();
        $('#store_search').on('input', function() {
            if($('#store_search').val() == "") {
                loadHome();   
                return;
            }
            $('#store_display').empty();
            for(i in d) {
                if(searchTermed(d[i])) {
                    $('#store_display').append(getStoreCard(d[i],i));  
                }
            }
            loadStoreClickHandlers();
        });	
        $('#store_c_home').click(function() {
            loadHome();
        });
        $('#store_c_panels').click(function() {
            loadStoreCategory("Panel");
        });
        $('#store_c_services').click(function() {
            loadStoreCategory("Service");
        });
        $('#store_c_dictionaries').click(function() {
            loadStoreCategory("Dictionary");
        });
        $('#store_c_themes').click(function() {
            loadStoreCategory("Theme");
        });
        $('#store_c_plugins').click(function() {
            loadStoreCategory("Plugin");
        });
        $('#store_c_submit').click(function() {
            //TODO Go to Developer Panel Link
            out = "<div style='margin-left:5%'>The plugin you submit must be uncondensed javascript so it may be reviewed. Your plugin must meet the following guidelines. Keep in mind that they may seem vague, and there is room to compromise.<br><ul><li><b>1. Integration</b> Your plugin may not secretly manipulate user data. This includes but isn't limited to deleting settings and files as well as adding settings and files without the user's consent or knowledge. Also, your plugin should use the APIs and procedures recommened.</li><li><b>2. Function</b> Your plugin must meet its specified function and not secretly run other code. This includes but isn't limited to attacking servers, running malicious code, or interfering with the user in a malicious way.</li><li><b>3. Classiness</b> Your plugin must be tastefully presented. This includes but isn't limited to showing pornography, insulting the user or any other individual, and presenting information in a tasteful manner.</li></ul></div><br>If your plugin meets these guidelines, <a href='mailto:handnf+gltn@gmail.com?subject=Gltn%20Store%20Submission&body=Please%20fill%20out%20the%20following%20information%20for%20appearing%20in%20the%20store%3A%0A%0AProject%20Name%3A%0AProject%20ID%3A%0ADeveloper%20Name%3A%0AIcon%20(Font-Awesome%2C%20IMG%2C%20or%20Text)%3A%0AGive%20a%20brief%20description%20of%20the%20project%3A'> Send an email</a> with the code attached for review.";
			initiatePopup({title: "Submit to Store", ht: out, bordercolor: '#222'});
        });
        if(storetype !== undefined)
            loadStoreCategory(storetype);
	})
	.fail(function() {
		out = "<span style='font-size:20pt'>Sorry</span><br>The store is not available right now. Please try later.";
		$('.build_inner').html(out);
	});
}
	grabStore(storetype);
   
}