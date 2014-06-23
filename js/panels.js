mainpanels = "main_Character, main_Idea, main_Citation, main_Find, main_Filesys, main_Notifications";
//PANEL CLASS
function Panel() {
    this.id = "";
    this.name = "";
    this.icon = "";
    this.url = "";
    this.service = false;
    this.key = [];
    Panel.prototype.getManifest = function() {
        return {id: this.id, name: this.name, icon: this.icon, url: this.url, service: this.service, key:this.key};   
    };
    Panel.prototype.setId = function(id) {
      
        
    };
    
    //Panel events
    Panel.prototype.onInit = undefined;
    Panel.prototype.onRun = undefined;
    Panel.prototype.onContext = undefined;
    Panel.prototype.onExport = undefined;
}
//PANELS ENUM
/*availablePanels = {
    Main_Character = new Panel().set     
};*/
//PERMISSION CLASS
function Permission(permission_key) {
    if(permission_key !== undefined) {
        var c = Permissions[permission_key].clone(Permission); 
        this.id = c.id;
        this.description = c.description;
        this.allowed = c.allowed;
    } else {
        this.id = "";
        this.description = "";
        this.allowed = false;
    }
    Permission.prototype.enable = function(id, allowed) {

    };
    Permission.prototype.isAllowed = function() {
        return allowed;   
    };
    Permission.prototype.setId = function(id) {
        this.id = id;
        return this;
    };
    Permission.prototype.setDescription = function(description) {
        this.description = description;
        return this;
    };
}
//PERMISSION ENUM
Permissions = {
    UNRESTRICTED: new Permission().setId("UNRESTRICTED").setDescription("Have unrestricted access to the webpage")
  };


//Other panels are here by default, but don't need to be called on init
currentpanel = "";

//PANEL INSTALL
function install_panel(id, name, img, url, service, key, num) {
    console.log(id, name, img, url, service, key, num);
	if(service == undefined)
		service = false;
	if(key == undefined)
		key = " ";
	img = img.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
	if(service != true) {
		if(key != undefined && key.length > 0 && key != "[object Object]")
            holoribbon_std['Panels'].push({text: name, img: img, action: "runPanel('"+id+"')", key:key});
		else
			holoribbon_std['Panels'].push({text: name, img: img, action: "runPanel('"+id+"')"});
		newRibbon('.header', holoribbon_std);
		console.log("Installing "+name+"...  "+num);
		ribbonSwitch(ribbon_index,false);
		ribbonLoad();
	}
    if(typeof(service) == "string")
        service = service.replace(/,/, "");
	if(getSettings('panels').indexOf(id) == -1) {
		writeToSettings('panels', getSettings('panels') + ", "+id);
	}
	writeToSettings('panels_'+id, id+","+name+","+img+","+url+","+service+","+key);

	if(window.offline !== true) {
        //Now store script offline - this really sucks though
		loadjscssfile(url, "js");
		$('#themeframe').attr('src', url);
        currentpanel = "null";
        window.setTimeout(function() {download_panel(id,num)}, 200);
	}
}

function download_panel(id,num) {
    if(currentpanel !== id) {
        console.log(id, currentpanel);
        if(!currentpanel.length)
            return;
        window.setTimeout(function() {download_panel(id,num);}, 100);
    } else {
        console.log("Installed");
        localStorage['zpanels_'+id] = $('#themeframe').contents().text();  
        console.log("eval('InitPanel"+id+"();');  "+num);
        setTimeout("eval('InitPanel"+id+"();');", 100);	
        initPanels(num+1);
    }
}

function uninstall_panel(id) {
	//For removing the ribbon, need to compare the name of the ribbon with the name of the panel
	var a = getSettings('panels_'+id).split(', ');
	var b = [];
	for(var i in holoribbon_std.Panels) {
		var j = holoribbon_std.Panels[i];
		if(j.text != a[1]) {
			b.push(j);
		}
	}
	holoribbon_std.Panels = b;
	newRibbon('.header', holoribbon_std);
    //Now we can set up a way for panels to turn off stuff
	//We set a short timer so that if it doesn't exist, it doesn't ruin the flow of the function
	setTimeout("eval('RemovePanel"+id+"();');", 1);
	var a = getSettings('panels').split(', ');
	var b = [];
	for(i in a) {
		if(a[i] != id) {
			b.push(a[i])
		}	
	}	
	writeToSettings('panels', b.join(', '));
	writeToSettings('panels_'+i, undefined);	
	if(localStorage['zpanels_'+id] !== undefined) 
		localStorage.removeItem('zpanels_'+id);
}


function initPanels(num) {
    if(num === undefined)
        num = 0;
   if(getSettings('panels') === undefined) {
		writeToSettings('panels', mainpanels);	
	}
	var a = getSettings('panels').split(',');
    if(num === NaN)
        return null;
    if(a.length - 1 < num)
        return null;
    console.log("Initializing Panel #"+num+": "+a[num]);
    a[num] = a[num].trim();
    
		if(a[num].indexOf('main') > -1) {
			try {
				//
				eval('InitPanel'+a[num]+'();');	
				console.log('InitPanel'+a[num]);
			} catch(e) {
				//console.error(e.message);
			}
            initPanels(num+1);
		} else {
			//Need to add script
            console.log(a[num], getSettings('panels_'+a[num]));
			var b = getSettings('panels_'+a[num]).split(',');
            console.log("Panel Manifest "+b.length, b);
			if(b.length == 4)
				install_panel(b[0], b[1], b[2], b[3], false, " ", num);
			else if(b.length == 5)
				install_panel(b[0], b[1], b[2], b[3], b[4], " ", num);
			else if(b.length == 6)
				install_panel(b[0], b[1], b[2], b[3], b[4], b[5], num);
            else if(b.length == 8) /* Data Validation */ {
                install_panel(b[0], b[1].trim(), "?", b[3], b[4].trim(), b[5].trim(), num);     
            }
		}
    if(num == 0) {
        InitPanelmain_Table();
        InitPanelmain_PageCount();
        InitPanelmain_Sync();
    }
//	}
    //Now we do a bit of additional installs
//    install_panel("main_PDF", "Export to PDF", ".", "", true, "");
}
function runPanel(panel_id_name) {
	//Get Properties of the Panel First
	var p = eval("GetPanel"+panel_id_name+"();");
	//$('.panel_plugin_title').html();
    var max = "";
//    console.warn(p.maximize);
    if(p.bordercolor == undefined)
        p.bordercolor = theme.coloralt;
    if(p.maximize == true) {
        
//        max = "<span class='PanelMaximizeEvent' data-status='0'></span><button onclick='maximizePanel()'><span class='fa fa-arrows-alt'></span></button>";
    }
//    console.log(max);
	$('.panel_plugin_title').html('<table class="panel_plugin_head" style="width:100%"><tr><td>'+p.title+'&emsp;<span class="PanelPopupEvent"></span><span class="PanelKeyEvent" data-keycode="" data-alt="" data-ctrl="" data-shift=""></span><span id="PanelCloseEvent"></span><span id="PanelBuildEvent"></span></td><td style="text-align:right;padding:0px;">'+ max+'<button onclick="hidePanelPlugin()" data-step="22" data-intro="Click me to hide the panel." style="margin-top:15px;">'+closeButton()+'</button></td></tr></table>');
	$('#panel_plugin').css("border-color", p.bordercolor).css('display', 'inline-table');
	window.paneloverride = p.override;
    if(p.width < 17)
        p.width = 17;
    window.panelwidth = p.width;
	//$('#panel_plugin').css('margin-top');
	
	//for a phone, do a type of check so that it isn't too small. 
	//Like, make the minimum width 2 inches; 3in is 25% of screen, but that may not look great on phones.
	//for now, relative to a 13.3" screen (11.59" wide)
	var min = 11.19*p.width;
	if(min > 2)
		min = 2;
	window.paneltitle = panel_id_name;
	openPanelPlugin(p.width, min, panel_id_name);
}
function openPanelPlugin(percent, min, panel_id_name) {
	$('#panel_plugin').css('opacity', 0);
    $('.panel_plugin_content').empty();
	setTimeout(function() {
		populatePanelPlugin(panel_id_name);
		/*$('#panel_plugin').animate({
			minWidth: min+"in"
		}, 360);*/
	},250);
    sizePanel(percent);
    $('#panel_plugin').animate({
        opacity:1,
        marginTop:"-1px",
        paddingRight:"15px",
        paddingBottom:"50px",
    },100, function() {
           /* $('#panel_plugin, .panel_plugin_head').animate({
                width:(100/12*columnCount(percent,true))+"%"
            },100);*/
        	sizePanel(percent);
//            $('.panel_plugin_content').animate({
//                width: (columnCount(percent, true)*10)+(Math.floor(window.innerWidth/100)-2)-24+"rem"
//            }, 100);
        });
}
function sizePanel(percent, refresh) {
	//animateContentPanel((97-percent)+"%");
	/*$('#panel_plugin').animate({
		width:(percent-2)+'%',
		opacity: 1,
		marginLeft: '-3px'
		}, 70, function() {
			animateContentPanel((window.innerWidth - $('#panel_plugin').width() - 55)+"px");
			$('.panel_plugin_content').css('height', (window.innerHeight-127)+"px").css('overflow-y', 'auto');
			if(refresh !== false) 
				refreshBodyDesign();
		}
	);
	$('#panel_content').css('width', (97-percent)+"%");*/
    
    //Use Foundation to create an appropriate number of panels
    if(percent == 0)
        $('#panel_content').attr('class', 'columns large-'+(12-columnCount(percent, true))+" small-"+(12-columnCount(percent, true))+" medium-"+(12-columnCount(percent, true)));
    else
        $('#panel_content').attr('class', 'columns large-'+(12-columnCount(percent, true))+" small-"+(7-columnCount(percent, true))+" medium-"+(10-columnCount(percent, true)));
    setTimeout(function() {
        $('#panel_plugin').attr('class', 'columns end large-'+columnCount(percent, true)+' small-'+columnCount(percent+42, true)+' medium-'+columnCount(percent+18, true));
    }, 50);
    //animateContentPanel((window.innerWidth - $('#panel_plugin').width() - 35)+"px");
			
}
function squeezeContentPanel() {
	animateContentPanel("50%");
}
function squishContentPanel() {
	animateContentPanel("0%");
}
function pullContentPanel() {
	animateContentPanel("66%");
}
function stretchContentPanel() {
	animateContentPanel("100%");
}
function animateContentPanel(p) {
	$('#panel_content').animate({
		width: p
		}, 100, function() {
//            $('#panel_content').width($('#panel_content').width()-35);   
        }
	);
}
function maximizePanel() {
    if($('.PanelMaximizeEvent').attr('data-status') == 0) {
        //Maximize
        $('#panel_content').hide(200);
        $('#panel_plugin').animate({
            width:"100%",
            marginLeft:"0px"
        }, 200);
        $('.PanelMaximizeEvent').attr('data-status', 1);
    } else {
        //Minimize
        $('#panel_content').show(200);
        sizePanel(panelwidth);
        $('.PanelMaximizeEvent').attr('data-status', 0)
    }
    $('.PanelMaximizeEvent').click();
}
function hidePanelPlugin() {
	$('#PanelCloseEvent').click();
	//
	$('#panel_plugin').animate({
		opacity: 0,
		}, 100, function() {
//			$('#panel_plugin').css('display', 'none');
//			stretchContentPanel();
//			refreshBodyDesign();
            sizePanel(0,false);
		}
	);
    
    $('#panel_content').show(200);
	window.paneltitle = undefined;
	paneloverride = [];
}
function postPanelOutput(text) {
	$('.panel_plugin_content').html(text+"<br><br>");
	//Any other panel stuff can be here too (if I want to add a footer)
}
function populatePanelPlugin(panel_id_name) {
	eval("RunPanel"+panel_id_name+"();");	
	try {
		eval("StylePanel"+panel_id_name+"();");	
	} catch(e) {
		
	}
	$('.panel_plugin_content').css('height', (window.innerHeight-127-60)+"px").css('overflow-y', 'auto');
}
function openPanelResearch() {
	initResearch();	
}
function closePanelResearch() {
	pauseResearch();
}
function StylePanelClass(classname, arr) {
	//Allow CSS Classes to receive custom CSS values to refine the experience
	//In the future, we will be able to include Gluten-based CSS templates to create a unified experience
	for(i=0;i<arr.length;i+=2) {
		$('.'+classname).css(arr[i], arr[i+1]);
	}
	
}
function PanelOnPopupClose(title) {
	$('.PanelPopupEvent').attr('data-title', title);
	$('.PanelPopupEvent').click();		
}
function initService(id, title, icon) {
	//onclick='runPanel(\'"+id+"\')'
	//console.error(id, title, icon)
	if(window.services == undefined)
		window.services = new Array();
	if($('.content'+id).length == 0) {
		$('.content_wordcount').append("<span title='"+title+"' class='content"+id+"' onclick='runPanel(\""+id+"\")'>&emsp;"+icon+"</span>");
		services.push({id: id, title: title, icon: icon});		
	} else {
		$('.content'+id).attr('title', title).html("&emsp;"+icon);
		for(i in services) {
			if(services[i].id == id) {
				services[i].title = title;
				services[i].icon = icon;	
			}
		}
	}
	//$('.content'+id).remove();
	
}
function keyboardShortcut(id, keys) {
	//keyboardShortcut('main_Charater', {alt: true, key: 67});
	if(keys.alt == undefined)
		keys.alt = false;
	if(keys.shift == undefined)
		keys.shift = false;
	if(keys.ctrl == undefined)
		keys.ctrl = false;
	if(keys.key == undefined)
		return;
	$(document).on('keydown', function(e) {
		if(e.keyCode == keys.key && e.altKey == keys.alt && e.shiftKey == keys.shift && e.ctrlKey == keys.ctrl) {
			runPanel(id);	
		}
	});
}	
function create_panel_data(d) {
	//Like an Intent in Android, you can create a bunch of data here in order to send to a panel. The panel must be programmed to interact with these intents
	for(i in d) { 
		$('.panelIntent').attr('data-'+i, d[i]);
	}
	if(window.paneltitle != undefined)
		$('.panelIntent').attr('data-sender', paneltitle);
}
function grab_panel_data() {
	//Returns an object containing all of this stuff
	var obj = {};
	$('.panelIntent').each(function() {
	  $.each(this.attributes, function() {
		// this.attributes is not a plain object, but an array
		// of attribute nodes, which contain both the name and value
		if(this.specified && this.name.indexOf('data') > -1) {
			obj[this.name.substr(5)] = this.value;
		  //console.log(this.name, this.value);
		}
	  });
	});
	return obj;
}
function clear_panel_data() {
	$('.panelIntent').each(function() {
	  $.each(this.attributes, function() {
		// this.attributes is not a plain object, but an array
		// of attribute nodes, which contain both the name and value
		if(this.specified && this.name.indexOf('data') > -1) {
			//this.name = undefined;
			$(this).attr(this.name, null);
		  //console.log(this.name, this.value);
		}
	  });
	});
}

//Default Plugins Here:

/*** Character Palette */
//TODO, use JSON to enable search
function GetPanelmain_Character() {
	return {title: "Character Palette", bordercolor: "#000099", width: 25, override:[13]};	
}
function RunPanelmain_Character() {
	//var main = new Array('', '', '', '', '', '', '', '', '', '—');
			var main = new Array({val: '✔', title: 'Checkmark', tag: 'checkmark check'});
	/*Music*/	main.push({val:'♪', title: 'Eighth Note', tag: 'music note eighth'}, {val:'♩', title: 'Quarter Note', tag: 'music note quarter'}, {val:'♫', title:'Two Eigth Notes', tag:'music note eighth'}, {val:'♬', title: 'Two Sixteenth Notes', tag: 'music note sixteenth'});
	/*Gender*/	main.push({val:'♀', title: 'Female', tag: 'gender sex female'}, {val:'♂', title:'Male', tag:'gender sex male'});
	/*Currency*/main.push({val:'¥', title:'Yen', tag: 'money currency yen japan'},{val:'€', title:'Euro', tag:'money currency euro europe'},{val:'£', title:'British Pound', tag:'money currency british england pound'},{val:'¢',title:'Cent',tag:'money currency american cent'});
	/*Legal*/	main.push({val:'©', title:'Copyright', tag:'legal copyright'},{val:'®',title:'Reserved',tag:'legal reserved'},{val:'™',title:'Trademark', tag:'legal trademark trademarked'});
	/*GrMath*/	main.push({val:'π',title:'Lowercase Pi',tag:'math greek pi'},{val:'∆',title:'Delta',tag:'math greek delta'},{val:'Π',title:'Uppercase Pi',tag:'math greek pi'});
		//Also get Lambda, Beta, Omega - Separate out non-math symbols
	/*Punction*/main.push({val:'—',title:'Emdash',tag:'dash emdash'},{val:'…',title:'Elipsis',tag:'elipsis dot'},{val:'~', title:'tilde', tag:'tilde'},{val:'¿',title:'Upside-Down Question',tag:'question mark upside down'},{val:'¡',title:'Upside-Down Exclamation Point',tag:'exclamation point upside down'},{val:'‽',title:'Interrobang',tag:'question mark exclamation point interrobang interabang'});
/*Math*/main.push({val:'±', title:'Plus-Minus', tag:'math plus minus'},{val:'√',title:'Root',tag:'math square root'},{val:'÷',title:'Divide',tag:'math divide quotient'},{val:'×',title:'Multiply',tag:'math times multiply multiplication'},{val:'•',title:'Dot',tag:'math dot product multiply'},{val:'°',title:'Degrees',tag:'math degrees'},{val:'′',title:'Minutes',tag:'math degrees minutes'},{val:'″',title:'Seconds',tag:'math degrees minutes seconds'},{val:'℅',title:'Permille',tag:'permille percent'},{val:'∞',title:'Infinity',tag:'math infinite infinity'}); 
/*Symbols*/main.push({val:'♣',title:'Clubs',tag:'symbol cards club'}, {val:'♠',title:'Spades',tag:'symbol cards spade'},{val:'♥',title:'Hearts',tag:'symbol cards heart'},{val:'♦',title:'Diamond',tag:'symbol cards diamond'},{val:'^',title:'Carat',tag:'carat v'},{val:'←',title:'Left Arrow',tag:'direction arrow left'},{val:'↑',title:'Up Arrow',tag:'direction arrow forward up'},{val:'↓',title:'Down Arrow',tag:'direction arrow backward down'},{val:'→',title:'Right Arrow',tag:'direction arrow right'});
/*Document Symbols*/main.push({val:'§',title:'Section Symbol',tag:'markup section'},{val:'¶',title:'Paragraph Break',tag:'markup paragraph enter newline'});
	
	var out = "";
	var searchbar = '<input type="search" id="popup_character_search" style="width:100%" placeholder="Search for Characters" ><br>';
	out += searchbar;
	out += "<div class='character_palette_display' id='CHARACTERPANELCHARACTERS'></div>";
	postPanelOutput(out);
	character = "";
    list = [];
    
	function createCharacterPalette(data) {
        list = data;
		$('#popup_character_search').focus();
		var out = "";
		for(i=0;i<data.length;i++) {
			out = out + '<div style="display:inline-block" onclick="contentAddText(\''+data[i].val+'\')" title="'+data[i].title+'" class="character_palette_character">' + data[i].val + '</div>&emsp;';
		}
		$('.character_palette_display').html(out);
		character = data[0].val;
		console.log(character);
		
		StylePanelClass('character_palette_character', ["cursor", "pointer", "border-bottom", "solid 1px #09f"]);
	}
	$('#popup_character_search').on('input', function() {
			var st = $('#popup_character_search').val().toLowerCase();
			var sr = new Array();
			var word = false;
			for(i=0;i<main.length;i++) {
				word = false;
				for(ii=0;ii<main[i].tag.split(' ').length;ii++) {
					if(main[i].tag.split(' ')[ii].indexOf(st) == 0 && !word) {
						sr.push(main[i]);
						word = true;
					}
				}
			}	
//            character = data[0].val;
			createCharacterPalette(sr);
		});	
		
	createCharacterPalette(main);
	$('.PanelKeyEvent').on('click', function() {
			//console.log('click');
			if($(this).attr('data-keycode') == 13) {
				console.log(list);
                console.log(character);
                
				contentAddText(character);
				$(this).attr('data-keycode', '');	
				if(introdisabled) {
					hidePanelPlugin();	
					setTimeout('introJsStart(11);', 600);
				}
			}
		});
	
	//if I want to hide symbols, I can always put additional main attributes here, maybe call them a different name, like all_ch
	
}
function InitPanelmain_Character() {
	keyboardShortcut('main_Character', {alt: true, key: 67});
	$(document).on('keydown', function(e) {
		if(e.keyCode == 67 && e.altKey) {
			runPanel('main_Character');	
		}
	});
	//initService('main_Character', 'Character', 'C');
}
function StylePanelmain_Character() {

}
function GetPanelmain_Citation() {
	return {title: "Citation Editor", bordercolor: "#09f", width: 25};
}	
function RunPanelmain_Citation() {
	function getCitationI(index) {
		initiateCitationEditor(undefined, -1, index);	
	}
	
	//var out = "<div class='citationPanel_refresh' style='font-size:10pt;cursor:pointer;'>REFRESH</div>";

	function populateCitations() {
		var out = "<button class='citationPanel_new textbutton'>New Source</button><br>";
		for(i=0;i<citation.length;i++) {
			if(citation[i] != undefined && citation[i] != "undefined") {
				c = citation[i];
				console.warn(c);
				out = out + "<div class='citationPanel_citation' data-id='"+i+"' style='background-color:"+theme.normbg+"; border: solid 1px "+theme.coloralt+";padding-left: 5px;padding-right: 10px;border-color: #aaa;color: "+theme.normcolor+";' id='CITATIONPANELEXAMPLE'>"
				try {
					out = out + c['Title']+"<br>&emsp;";
					out = out + "<i>"+c['AuthorFirst']+" "+c['AuthorLast']+"</i>";
                    if(c['Volume'].length > 0)
                        out += "<br>&emsp;<span style='font-size:10pt'>Vol. "+c['Volume']+" "+c['Edition']+" ed.</span>";
                    if(c['Url'].length > 0)
                        out += "<br>&emsp;<span class='PanelUrl' data-url='"+c['Url']+"' style='font-size:10pt;border-bottom:dashed 1px black;text-decoration:none;cursor:pointer;color:"+theme.normcolor+"'><span class='fa fa-link'></span>&nbsp;Vist Site</span></span>";
				} catch(e) {
					console.error(e);
					if(c['Title'] != undefined)
						out = out + c['Title'];
					else
						out = out + "Untitled";
				}
				out = out + "<hr><br></div>";
			}
		}
		if(citation.length == 0)
			out += "&emsp;&emsp;<span style='font-size:28pt;font-weight:100;'>:(</span><br><br>You haven't added any citations.";
		postPanelOutput(out);
		$('.citationPanel_citation, .PanelUrl').on('click', function() {
            if($(this).attr('data-url') != undefined)
                window.open($(this).attr('data-url'), '_blank');
            else
                getCitationI($(this).attr('data-id'));
		});
		$('.citationPanel_new').on('click', function() {
			initiateCitationEditor("panelonly");
		});
	}
	
	$('.PanelPopupEvent').on('click', function() {
		populateCitations();
	});
	populateCitations();
	//figure out a way to repopulate citations after editing
}
function StylePanelmain_Citation() {
		
}
function GetPanelmain_Idea() { 
	return {title: "Document Notes", bordercolor: "#f1c40f", width: 40};	
}
function RunPanelmain_Idea() {
	function populateIdeas() {
		
		out = "<div style='background-color: "+theme.normbg+";border: solid 1px;padding-left: 12px;padding-right: 0px;border-color: #aaa;color: "+theme.coloralt+";padding-top: 6px;width: 94%;' id='PANELIDEA'><u>General Notes</u><br><textarea class='PanelIdea' style='background-color:"+theme.normbg+";color:"+theme.coloralt+";min-height:2em;' data-id='-1'></textarea></div>";
        j = 0;
		for(i in citation) {
			if(citation[i] != "undefined" && citation[i] != undefined) {
//                console.log(j,i,citation[i]);
				out = out+"<hr><div style='background-color: "+theme.normbg+";border: solid 1px;padding-left: 12px;padding-right: 0px;border-color: #aaa;color:"+theme.coloralt+";padding-top: 6px;width: 94%;'><u>"+citation[i].Title+"</u><br><textarea class='PanelIdea' data-id='"+j+"' style='background-color:"+theme.normbg+";color:"+theme.coloralt+"'></textarea></div>";
                j++;
            }
		}
		postPanelOutput(out);
		//Now we have to fill in our contentfilesy
//		$('.PanelIdea[data-id=-1]').val(decodeURIComponent(ideadefault));
//		$('.PanelIdea[data-id=-1]').css('height', decodeURIComponent(ideadefault).split(' ').length/10+"em");
		reHeight();
        
		$('.PanelIdea').on('input', function() {
			var id = $(this).attr('data-id');
			if(id >= 0) 
				idea[id] = encodeURIComponent($(this).val());
			else if(id == -1)
				ideadefault = encodeURIComponent($(this).val());
            markAsDirty();
            reHeight();
		});
        $('.PanelIdea').focusin(function() {
           reHeight(); 
        });
	}
    function reHeight() {
        $('.idea_div').show();
        for(i=-1;i<idea.length;i++) {
            //To grab the logical pixel height of a textarea, the text must first be placed in a DIV, then the height of that is grabbed
            //From http://www.impressivewebs.com/textarea-auto-resize/
            if($('.idea_div').length == 0)
                $('.panel_plugin_content').append('<div class="idea_div" style="border:solid 1px; padding-left:12px; padding-right:0px; padding-top:6px; width: 84%; font-size:0.875rem; word-wrap: break-word;"></div>');
            if(i == -1)
                var v = decodeURIComponent(ideadefault);
            else
                var v = decodeURIComponent(idea[i]);
			if(v == undefined || v == "undefined")
				v = "";
			$('.idea_div').html(v.replace(/\n/g, '<br>'));
			$('.PanelIdea[data-id='+i+']').val(v);
//            console.log($('.idea_div'),$('.idea_div').height());
			$('.PanelIdea[data-id='+i+']').css('height', $('.idea_div').height()+36+"px");
		}
	    $('.idea_div').hide();
           
    }
	$('.PanelPopupEvent').on('click', function() {
		populateIdeas();
	});
	populateIdeas();
}
function StylePanelmain_Idea() {
	$('.PanelIdea').css('width', '90%');
	$('.PanelIdea').css('max-height', '50%');
}

function GetPanelmain_Outline() {
	return {title: "Outline", bordercolor: "#2c3e50", width: 40};	
}
function RunPanelmain_Outline() {
	range = null;
	raw = "";
	formatted = "";
	try {
			outline = getFileData('main_outline');
		} catch(e) {
			outline = "-";
		}
	if(!outline.length)
		outline = "-";
	//load
		generatePanel();
		range = obtainRange();
	function generatePanel() {
		ht = "<div id='outlineButtons'><button id='outlineBuild'><span class='fa fa-file'></span></button>&nbsp;Use '-' to denote levels.</div>";
		ht += "<div style='overflow-y:auto;/*height:"+(window.innerHeight-215)+"px*/'><div contenteditable='true' style='line-height:1.5em;background-color:"+theme.normbg+";color:"+theme.normcolor+"' class='Outline'>"+outline;+"</div></div>";
		postPanelOutput(ht);
		$('.Outline').on('input', function() {
			writeToSaved('main_outline', $('.Outline').html());
			if($('.Outline').html().substring(0,1) != "-" || $('.Outline').html().length == 0) 
				$('.Outline').html("-");
			var sel = rangy.getSelection();
			range = sel.rangeCount ? sel.getRangeAt(0) : null;
		});
		$('#outlineBuild').on('click', function() {
			raw = $('.Outline').html();
			formatted = raw+"<br>";
			
			var r = new RegExp("---([\\s\\S]+?)(\\n|\\r|<br>|<div>|</div>)", "gi");
			formatted = formatted.replace(r, "<ul><ul><li>$1</li></ul></ul>");
			
			var r = new RegExp("--([\\s\\S]+?)(\\n|\\r|<br>|<div>|</div>)", "gi");
			formatted = formatted.replace(r, "<ul><li>$1</li></ul>");
			
			var r = new RegExp("-([\\s\\S]+?)(\\n|\\r|<br>|<div>|</div>)", "gi");
			formatted = formatted.replace(r, "<li>$1</li>");
			
			formatted = "<ul>"+formatted+"</ul>";
			console.log(formatted);
			$('.Outline').attr('contenteditable', 'false').html(formatted);
			$('#outlineButtons').html("<button id='outlineBack'><span class='fa fa-angle-left'></span></button><button id='outline2Build'><span class='fa fa-file'></span></button>");
			$('#outlineBack').on('click', function() {
				outline = raw;
				generatePanel();
				$('.Outline').on('input', function() {
					writeToSaved('main_outline', $('.Outline').html());
					if($('.Outline').html().substring(0,1) != "-" || $('.Outline').html().length == 0) 
						$('.Outline').html("-");
					var sel = rangy.getSelection();
					range = sel.rangeCount ? sel.getRangeAt(0) : null;
				});
			});
				$('#outline2Build').on('click', function() {
				//$('.draft').html(valMetadata('Author')+"<br>"+"<ul style='line-height:1.8em'>"+formatted+"</ul>");
				//startBuild('.draft');
				falseBuild();
				add_new_page();
					add_to_page(valMetadata('Author')+"<br>");
					add_to_page("<div style='line-height:1.8em'>"+formatted+"</div>");
			});	
		});
	}	
	function obtainRange() {
		var el = document.getElementsByClassName("Outline")[0];
		var range = rangy.createRange();
			range.selectNodeContents(el);
			var sel = rangy.getSelection();
			sel.setSingleRange(range);
			//moveCarat("character", 0);
			rangy.getSelection().collapseToEnd();
			return sel.getRangeAt(0);	
	}
	function insertTab() {
		moveCarat("character", -1);
		rangy.getSelection().expand("character", {
						wordOptions: {
							includeTrailingSpace: false,
							wordRegex: /[a-z0-9]+(['\-][a-z0-9]+)*/gi
						}
                		});
		if(range == null)
			range = obtainRange();
		var uls = rangy.getSelection().toHtml();
		console.log(uls, uls.split('<ul>').length);
		var el = document.createElement("ul");
		console.log(uls.split('<ul>'));
		if(uls.split('<ul>').length <= 1)
			el.innerHTML = "<li></li>";
		else if(uls.split('<ul>').length == 2) 
			el.innerHTML = "<li></li>";
		else if(uls.split('<ul>').length == 3) 
			el.innerHTML = "<ul><li></li></ul>";
		else
			el.innerHTML = "<ul><ul><li></li></ul></ul>";
		//moveCarat("character", 0);
		//
		//rangy.getSelection().setSingleRange(range);	
		//rangy.getSelection().collapseToStart();
		
		range.insertNode(el);
		moveCarat("character", 1);	
	}
	function deleteTab() {
		moveCarat("character", -1);	
		rangy.getSelection().expand("character", {
						wordOptions: {
							includeTrailingSpace: false,
							wordRegex: /[a-z0-9]+(['\-][a-z0-9]+)*/gi
						}
                		});
		rangy.getSelection().deleteFromDocument();
		if(range == null)
			range = obtainRange();
		var uls = rangy.getSelection().toHtml();
		console.log(uls);
		var el = document.createElement("ul");
		console.log(uls.split('<ul>'));
		if(uls.split('<ul>').length <= 2)
			el.innerHTML = "<li></li>";
		else if(uls.split('<ul>').length == 3) 
			el.innerHTML = "<li></li>";
		else if(uls.split('<ul>').length == 4) 
			el.innerHTML = "<ul><li></li></ul>";
		else
			el.innerHTML = "<ul><ul><li></li></ul></ul>";
		//moveCarat("character", 0);
		//
		//rangy.getSelection().setSingleRange(range);	
		//rangy.getSelection().collapseToStart();
		range.insertNode(el);
		moveCarat("character", 1);	
	}
	//Tab Get
	$('.PanelKeyEvent').on('click', function() {
			//console.log($(this).attr('data-keycode'))
			/*if($(this).attr('data-keycode') == 9 && $(this).attr('data-shift') == "true") {
				deleteTab();
				console.log("DT");				
				$(this).attr('data-keycode', '');	
			} else if($(this).attr('data-keycode') == 9) {
				insertTab();
				//console.log("IT");
				$(this).attr('data-keycode', '');	 	
			}*/
		});
}
function StylePanelmain_Outline() {
	$('.Outline').css('border', 'solid 1px black').css('width', '85%');
} 
function GetPanelmain_Filesys() {
	return {title: '<span class="fa fa-folder-open" style="font-size:15pt"></span>&nbsp;My Documents', bordercolor: '#7f8c8d', width:25};
}
function InitPanelmain_Filesys() {
	$(document).on('keydown', function(e) {
		if(e.keyCode == 79 && e.altKey) {
			runPanel('main_Filesys'); 
		}
	});
}
//Modal for new file creation and implementation
function createNewFile() {
    ht = '<div class="row collapse"><div class="small-3 medium-3 columns"><input id="FileName" type="text" value="untitled" /></div><div class="small-3 medium-1 columns"><span class="postfix">.gltn</span></div>';
    ht += "<div class='small-6 medium-8 columns end'>&emsp;<input type='search' id='FormatFinder' style='width:40%;display:inline-block' placeholder='Choose a Format'>&ensp;<button id='FormatOk' class='textbutton' style='margin-left:30px;font-size:16pt;'>Create</button></div></div><br><span style='font-size:14pt;'>&emsp;Search for a Format<br></span><br><div id='FormatSearch' style='text-align:center'><div>";
    fnc = function x() {
        function search(v) {
            arr = [];
            out = "<div class='row'>";
            if(v == undefined)
                v = "";
            for(i in window.formats) {
                if(formats[i].type != "IN BETA") {
                    if(formats[i].type.toLowerCase().indexOf(v.toLowerCase()) > -1 || formats[i].name.toLowerCase().indexOf(v.toLowerCase()) > -1) {
                        //Add to the grid
                        arr.push(formats[i]);
                        out += "<div class='fileformat' data-name='"+formats[i].name+"' style='width:8em;height:4em;display:inline-table;text-align:center;' class='large-4 medium-6 small-12'><div style='width:8em;height:4em;display:inline-table;border:solid 2px "+theme.coloralt+";background-color:"+theme.ribbonhighlight+";color:"+theme.darkcolor+";font-size:18pt;text-align:center;'>"+formats[i].name+"</div><div style='text-align:center;font-size:14pt;'>"+formats[i].name+"&nbsp;"+formats[i].type+"</div></div>";
                        
                    }
                }
            }
            out += "</div>";
            $('#FormatSearch').html(out);
            $('.fileformat').on('click', function() {
                $('#FormatFinder').val($(this).attr('data-name')); 
                $('#FormatFinder').trigger('input');
            });
        }
        search();
        $('#FormatFinder').on('input', function() {
            search($(this).val());                   
        });
        $('#FormatOk').on('click', function() {
            nFileid = $('#FileName').val();
            localStorage[nFileid] = "";
            localStorage[nFileid+"_c"] = "";
            window.location = "?file="+nFileid+"&format="+$('#FormatFinder').val();
        });
    }
    initiatePopup({title: "New File", ht:ht, fnc:fnc,size:"large"});
}
function RunPanelmain_Filesys() {
	function c(i) {
		//console.log(i);	
	}
	function wl(i) {
		c('?file='+i);
		window.location = '?file='+i;	
	}
	function post(out,term) {
		postPanelOutput(out);
		$('.Filesys_delete').on('click', function() {
			$('.Filesys_delete').attr('data-end', true);
			x = confirm('Delete '+$(this).attr('data-f')+'.gltn? This cannot be undone.');
			if(x == true) {
				y = confirm('Are you positive that you want this file to be completely erased?');
				if(y == true) {
					deleteFile($(this).attr('data-f'));
					resetFolder($('#filesys_s').val());
				}
			}
		});
		$('.Filesys_delete').hover(function() {
			$(this).css('color', theme.normbg).css('background-color', theme.palette.red).css('border-radius', 100);
		}, function() {
			$(this).css('color', theme.normcolor).css('background-color', 'inherit');
		});
		
		$('.tfile').on('click', function() {
			if($('.Filesys_delete').attr('data-end') != "true")
				wl($(this).attr('data-v'));
		});
		$('#filesys_new').on('click', function() {
			createNewFile();
		});
		$('#filesys_up').on('click', function() {
            cloudImport("HFS");
            //handleFileSelect(window.ink);
			//$('#filesys_u').click();
			//document.getElementById('filesys_u').addEventListener('change', handleFileSelect, false);
		});
        $('#filesys_file').on('click', function() {
           handleFileSelect(window.imported, window.ink2.filename); 
        });
		$('#filesys_s').on('input', function() {
			resetFolder($('#filesys_s').val());
		});
		$('#filesys_s').focus();
		$('#filesys_s').val(term);	
		function handleFileSelect(evt, filename) {
			//Popup
			initiatePopup({title:'Importing File',ht:'<div class="progress" style="font-size:14pt;text-align:center;width:100%;"></div>',bordercolor:'#7f8c8d'});
            
    	/*	var files = evt.target.files;
			var file = files[0];
			var start = 0;
			var stop = file.size - 1;
			if(file.name.split('.')[file.name.split('.').length-1] != "gltn") {
				//Popup false
				$('.progress').html('<span style="color:red">Error: Not a proper Gltn file</span>');
				//set timeout close
				setTimeout('closePopup()', 4000);
				return null;
			}*/
		
//			var reader = new FileReader();
			// If we use onloadend, we need to check the readyState.
//			reader.onloadend = function(evt) {
//			  if (evt.target.readyState == FileReader.DONE) { // DONE == 2
				//console.log(evt.target.result);
				//Save to localStorage
				var xmli = evt.indexOf('</gluten_doc>')+13;
				var xml = evt.substring(0,xmli);
				try {
					var i = $.xml2json(xml);                
				} catch(e) {
                    console.error(e.message);
					$('.progress').html('<span style="color:red">Error: Not a proper Gltn file</span>');
					setTimeout('closePopup();', 4000);
					return null;
				}
				var ht = evt.substring(xmli);
                //Need to insert something before I'm completely finished
                if(xml.indexOf("inkblob_url") == -1) {
                    var j = xml.indexOf("<saved>");
                    if(j > -1)
                        xml = xml.substring(0,j+7) + "<inkblob_url>"+ink2.url+"</inkblob_url>" + xml.substring(j+7,xmli);
                    else
                        xml = xml.substring(0,12) + "<saved><inkblob_url>"+ink2.url+"</inkblob_url></saved>" + xml.substring(12,xmli);
                }
				console.log(xml+";;;;"+ht);
				//evt.target.result;
				save = filename.split(' ')[0];
				save = save.split('.')[0];
                ovr = true;
				if(localStorage[save] != undefined) {
					ovr = confirm('This filename already exists: '+save+'; Overwrite the contents of this file?');
				}
				if(ovr) {
					localStorage[save] = xml;
					localStorage[save+"_c"] = ht;
					console.log(filename, save);
					$('.progress').html('<span style="color:green">The file '+save+'.gltn was successfully imported.<br><span style="font-size:10pt">The file will now be accessible on this computer. To use it on another computer you must export the file after editing.</span></span>');
					setTimeout('closePopup()', 4000);
					resetFolder(term);
				}
//			  }
			}
		
			//var blob = file.slice(start, stop + 1);
			//reader.readAsText(blob);
	}
    function resetFolder(term) {
		//postPanelOutput("<div id='spin' style='margin-left:25%'></div>");
		$('.panel_plugin_content').html(getLoader(0,30));
			
		if(term == undefined)
			sterm = "";
		else
			sterm = term.toLowerCase();
		out = "<button class='textbutton' id='filesys_new'><span class='fa fa-plus'></span>&nbsp;New</button><input type='file' id='filesys_u' style='display:none' name='file[]'><button class='textbutton' id='filesys_up'><span class='fa fa-cloud-upload'>&nbsp;</span>Upload</button><br><span class='fa fa-search' style='font-size:16pt'></span>&nbsp;&nbsp;&nbsp;<input type='search' id='filesys_s' style='width:85%;display:inline' value='"+sterm+"'><table style='width:100%'><input type='hidden' id='filesys_file'>";
		fstotal = 0;
		for(i in localStorage){
			c(i);
			if(localStorage[i] != undefined && localStorage[i+"_c"] != undefined) {
				//We've got something!
				try {
					var xx = $.xml2json(localStorage[i]);
				} catch(e) {
					c(e.message);
					continue;
				}
				title = decodeURIComponent(xx.metadata.Title);
				if(title == undefined)
					title = "";
                
                bgc = theme.coloralt;
				if(i == fileid)
					bgc = theme.palette.blue;
					
				var fsi = localStorage[i].length;
				var fsci = localStorage[i+"_c"].length;
				fstotal += fsi;
				fstotal += fsci;
				var fsout = truncateFloat(getLocalStorageOf(i)+getLocalStorageOf(i+"_c"))+"KB";
				//console.log(xx.file.tags.split(','),sterm)
				if(sterm == undefined || (sterm != undefined  && (title.toLowerCase().indexOf(sterm) > -1) || i.toLowerCase().indexOf(sterm) > -1 || xx.file.tags.indexOf(sterm) > -1)) {
					try {
						var y = decodeURIComponent(xx.file.format);
					} catch(e) {
						console.error(e.message);
						continue;
					}
                    var time = "";
                    timeiso = undefined;
                    try {
                         //console.log(xx.file.last_modified, time);
                       time = jQuery.timeago(new Date().setTime(xx.file.last_modified));
                        timeiso = new Date();
                        timeiso.setTime(decodeURIComponent(xx.file.last_modified));
                        //console.log(xx.file.last_modified,timeiso, timeiso.getTime());
                        timeiso = timeiso.toISOString();
                        //console.log(xx.file.last_modified, time, timeiso);
                    } catch(e) {
                        time = undefined;   
                        timeiso = undefined;
                        //console.error(e.message);
                    } 
                    //#2c3e50
					out += "<tr><td class='tfile "+((i==fileid)?"selected":"")+"' style='background-color:"+bgc+";border:solid 0px "+bgc+";padding-bottom:8px;width:98%;cursor:pointer;' data-v='"+i+"'><table style='font-size:7pt;font-family:sans-serif;width:100%;'><tr><td style='text-align:left'><span style='font-size:8pt' class='fa fa-file-text'></span>&nbsp;"+i+".gltn</td><td style='text-align:center;width:36px' class='Filesys_delete' data-f='"+i+"'>X</td></tr></table>";
					if(title != undefined)
						out += "<div style='margin-left:3px'><b>"+title+"</b></div>";	
					out += "<span style='font-size:8pt'>&emsp;"+xx.file.format+"&nbsp;&nbsp;"+xx.file.language+"&nbsp;&nbsp;"+fsout+"</span><br>";
                    time = "";
                    out += "&emsp;";
                    if(xx.saved != undefined) {
                        if(xx.saved.inkblob_url != undefined)
                            out += "<span class='fa fa-cloud' style='font-size:7pt'></span>&nbsp;";
                    }
                        
                    if(timeiso != undefined)
                        out += "<span style='font-size:7pt'>Last edited <abbr class='timeago' title='"+timeiso+"'></abbr>"+time+"</span>";
					out += "</td></tr>";	
				}
			}	
		}
		out += "</table>";
		fstotal += localStorage['settings'].length;
		fstotalout = "<br><span style='font-size:10pt'>&emsp;"+getLocalStorageLength()+"KB stored</span><br><button class='textbutton exportall'>Export All Data</button>"
		out += fstotalout;
		post(out,term);
        jQuery("abbr.timeago").timeago();
        $('.exportall').on('click', function() {
            startExportHTML(getGltp(), "My Gltn Data");   
        });
		//setTimeout("post(out);", 50);
	}	
	resetFolder();
}
function GetPanelmain_Guide() {
	return {title: '<span class="fa fa-info-circle" style="font-size:13pt"></span>&nbsp;Style Guide', bordercolor: '#7f8c8d', width:30};
}
function RunPanelmain_Guide() {
	try {
		out = onStyleGuide();
	} catch(e) {
		out = "<br><br><br><div style='font-size:34pt;text-align:center;width:100%;'>: (</div><br>There is not a Style Guide available for this format. Sorry.";
	}
	postPanelOutput(out);	
}
function GetPanelmain_Find() {
	return {title: '<span class="fa fa-exchange" style="font-size:13pt"></span>&nbsp;Find & Replace', bordercolor: '#e74c3c', width:20};
}
function RunPanelmain_Find() {
	out = "Enter a phrase or a regular expression<br>";
	out += "<input type='search' id='FindIn' placeholder='Find' style='width:95%'><br>";
	out += "<input type='search' id='FindOut' placeholder='Replace With' style='width:95%'><br>";
	out += "<span id='FindNum' style='font-size:10pt'></span><br>";
	out += "<button id='FindApply' class='textbutton'>Replace All</button><br><br>";
	out += "<button id='FindCancel' class='textbutton'>Cancel Changes</button>";
	postPanelOutput(out);
	window.cta = $('.content_textarea').html();
	window.cta2 = $('.content_textarea').html();	
	initFind();
	$('#FindIn').focus();
	$('#FindIn').on('input', function() {
		
	})
	$('#FindOut').on('input', function() {
		$('.content_textarea').html(window.cta);
		//$('.content_textarea').html(window.cta.replace(re, $('#FindOut').val()));
		doTheReplacing();
	});
	$('#FindApply').on('click', function() {
		window.cta = $('.content_textarea').html();
		$('#FindIn').val($('#FindOut').val());
		$('#FindOut').val('');
	});
	//FindApply saves to cta
	$('#FindCancel').on('click', function() {
		window.cta = window.cta2;
		$('.content_textarea').html(window.cta);
		ctt = $('.content_textarea').text();
		$('#FindIn').val('');
		$('#FindOut').val('');
		
	});
	//Cancel reverts cta to cta2
	$('#PanelCloseEvent').on('click', function() {
		$('.content_textarea').html(window.cta);
		$('#FindIn').val('');
		$('#FindOut').val('');
		try {
			range.selectNodeContents(document.body);
			searchResultApplier.undoToRange(range);
		} catch(e) {
			//No worries, that means there isn't anything to undo.
		}
	});
	function doTheReplacing() {
		re = new RegExp($('#FindIn').val(),"gi");
		//console.log(re);
		ro = $('#FindOut').val();
	  
		$('.content_textarea').each(function() {
		    traverseChildNodes(this);
		});
				 
		function traverseChildNodes(node) {
			var next;		 
			if (node.nodeType === 1) {
		 		// (Element node)
		 		if (node = node.firstChild) {
					do {
						// Recursively call traverseChildNodes
						// on each child node
						next = node.nextSibling;
						traverseChildNodes(node);
					} while(node = next);
				}
			} else if (node.nodeType === 3) {
				// (Text node
				if (re.test(node.data)) {
					wrapMatchesInNode(node);
				}
			}
		}	
		function wrapMatchesInNode(textNode) {
			var temp = document.createElement('span');
			temp.innerHTML = textNode.data.replace(re, ro);
			// temp.innerHTML is now:
			// "\n    This order's reference number is <a href="/order/RF83297">RF83297</a>.\n"
			// |_______________________________________|__________________________________|___|
			//                     |                                      |                 |
			//                 TEXT NODE                             ELEMENT NODE       TEXT NODE
		 
			// Extract produced nodes and insert them
			// before original textNode:
			while (temp.firstChild) {
				/*console.log(temp.firstChild);
				console.log(textNode);
				console.log(textNode.parentNode);
				console.log(textNode.parentNode.parentNode);
				console.log(temp.firstChild.nodeType);*/
				textNode.parentNode.insertBefore(temp.firstChild, textNode);
			}
			// Logged: 3,1,3
		 	// Remove original text-node:
			textNode.parentNode.removeChild(textNode);
		}
	}
}
function findTextReplaceText(finder, replacer) {
	re = finder;
	//console.log(re);
	ro = replacer;
  
	$('.content_textarea').each(function() {
		traverseChildNodes(this);
	});
			 
	function traverseChildNodes(node) {
		var next;		 
		if (node.nodeType === 1) {
			// (Element node)
			if (node = node.firstChild) {
				do {
					// Recursively call traverseChildNodes
					// on each child node
					next = node.nextSibling;
					traverseChildNodes(node);
				} while(node = next);
			}
		} else if (node.nodeType === 3) {
			// (Text node
			if (re.test(node.data)) {
				wrapMatchesInNode(node);
			}
		}
	}	
	function wrapMatchesInNode(textNode) {
		var temp = document.createElement('span');
		temp.innerHTML = textNode.data.replace(re, ro);
		// temp.innerHTML is now:
		// "\n    This order's reference number is <a href="/order/RF83297">RF83297</a>.\n"
		// |_______________________________________|__________________________________|___|
		//                     |                                      |                 |
		//                 TEXT NODE                             ELEMENT NODE       TEXT NODE
	 
		// Extract produced nodes and insert them
		// before original textNode:
		while (temp.firstChild) {
			/*console.log(temp.firstChild);
			console.log(textNode);
			console.log(textNode.parentNode);
			console.log(textNode.parentNode.parentNode);
			console.log(temp.firstChild.nodeType);*/
			textNode.parentNode.insertBefore(temp.firstChild, textNode);
		}
		// Logged: 3,1,3
		// Remove original text-node:
		textNode.parentNode.removeChild(textNode);
	}
}
function install_dictionary(format, url, name, id, icon) {
	//window.settings.dictionary = 'gltn, wiktionary, wikipedia';
	//window.settings.dictionary_gltn = 'XML, http://felkerdigitalmedia.com/gltn/dictionary.php, Ouvert Dictionary, gltn, G';
	if(getSettings('dictionary').indexOf(id) == -1) {
		writeToSettings('dictionary', getSettings('dictionary') + ", "+id);
		writeToSettings('dictionary_'+id, format+', '+url+', '+name+', '+id+', '+icon);
		writeToSettings('dictionarysort', getSettings('dictionarysort') + ", "+id);
	} else
		console.error("You've already installed "+id); 	
}	
function uninstall_dictionary(id) {
	var a = getSettings('dictionary').split(', ');
	var b = new Array();
	for(i in a) {
		if(a[i] != id) {
			b.push(a[i])
		}	
	}	
	writeToSettings('dictionary', b.join(', '));
	writeToSettings('dictionary_'+id, undefined);
	
	var a = getSettings('dictionarysort').split(', ');
	var b = new Array();
	for(i in a) {
		if(a[i] != id) {
			b.push(a[i])
		}	
	}	
	writeToSettings('dictionarysort', b.join(', '));
	
}
function GetPanelmain_Dictionary() {
	return {title:"Dictionary", bordercolor: "#2980b9", width: 40};	
}
function RunPanelmain_Dictionary() {
	var no_results = "<span style='font-size:16pt'>No Results</span><br>This does not appear in any of your dictionaries. Try to:<ul><li> Install a new dictionary</li>OR<li>Change your search.</li></ul>";
	var no_connection = "<span style='font-size:16pt'>Sorry</span><br>The dictionary does not work offline.";
	var connect_time = 0;
	var ajaxrequests = new Array();
	//Check stock dictionaries and 'install' if null
	if(getSettings('dictionary') == undefined) {
		writeToSettings('dictionary', 'gltn, wiktionary, wikipedia');
		writeToSettings('dictionary_gltn', 'XML, http://felkerdigitalmedia.com/gltn/dictionaries/dictionary.php, Ouvert Dictionary, gltn, <span class="fa fa-leaf"></span>');
		writeToSettings('dictionary_wiktionary', 'HTML, http://felkerdigitalmedia.com/gltn/dictionaries/dictionary_wik.php, Wiktionary, wiktionary, <span class="fa fa-terminal"></span>');
		writeToSettings('dictionary_wikipedia', 'HTML, http://felkerdigitalmedia.com/gltn/dictionaries/dictionary_wiki.php, Wikipedia, wikipedia, <span class="fa fa-globe"></span>');
	}	
	if(getSettings('dictionarysort') == undefined || getSettings('dictionarysort') == "undefined")
		writeToSettings('dictionarysort', getSettings('dictionary'));
	function openApp() {
		out = "<input type='search' id='DictionaryIn' style='width:65%;display:inline;'><button id='DictionarySettings'><span class='fa fa-cog'></span></button>";
		out += "<div id='DictionaryOut'><span style='font-size:16pt'>Welcome</span><br>Search for something<br><br><br><div style='text-align:center;padding-left:80%;font-size:30pt;margin-top:25%;' class='fa-stack fa-lg'><span class='fa fa-circle-o fa-stack-2x'></span><span class='fa fa-quote-left fa-stack-1x'></span></div>";
		out += "</div>";
		postPanelOutput(out);	
		$('#DictionaryIn').focus();
		$('#DictionarySettings').on('click', function() {
			openSettings();
		});	
		$('#DictionaryIn').on('input', function() {
			var end = false;
			/*var opts = {
				  lines: 7, // The number of lines to draw
				  length: 10, // The length of each line
				  width: 3, // The line thickness
				  radius: 13, // The radius of the inner circle
				  corners: 1, // Corner roundness (0..1)
				  rotate: 0, // The rotation offset
				  direction: 1, // 1: clockwise, -1: counterclockwise
				  color: theme.normcolor, // #rgb or #rrggbb or array of colors
				  speed: 0.7, // Rounds per second
				  trail: 20, // Afterglow percentage
				  shadow: false, // Whether to render a shadow
				  hwaccel: false, // Whether to use hardware acceleration
				  className: 'spinner', // The CSS class to assign to the spinner
				  zIndex: 2e9, // The z-index (defaults to 2000000000)
				  top: '30px', // Top position relative to parent in px
				  left: '50' // Left position relative to parent in px
				};
				$('#DictionaryOut').empty();
				var target = document.getElementById('DictionaryOut');
				var spinner = new Spinner(opts).spin(target);*/
            if($('#DictionaryOut .loader10').length == 0)
                getLoader("DictionaryOut");
			for(i in ajaxrequests) {
				ajaxrequests[i].abort();	
			}
			var d = window.settings.dictionarysort.split(', ');
			var end = false;
			ajaxrequests = [];
			index = 0;
			function tryDictionary(i) {
				console.log(i, d[i]);
				j = getSettings('dictionary_'+d[i]).split(', ');
				console.log(j[2], $('#DictionaryIn').val());
				$('#DictionaryOut').css('background-color', 'inherit').css('padding-left', '0').css('padding-top', '0').css('padding-bottom', '0').css('border', 'none').css('margin-top', '0').css('width', '100%').css('color', 'inherit');
				var req = $.get(j[1], {word: $('#DictionaryIn').val()}, function (data) {
					if(j[0] == "XML") {
						console.log(data);
						data = $.parseJSON(data);
						if(data.error != "404") {
							//style='background-color: white;padding-left: 6px;padding-top: 8px;padding-bottom: 50px;border: solid 1px #999;margin-top: 4px;width: 95%;
							$('#DictionaryOut').html(xmlDictionaryParse(data)).css('background-color', 'white').css('padding-left', '6px').css('padding-top', '8px').css('border', 'solid 1px #999').css('margin-top', '4px').css('width', '95%').css('color', 'black');
							end = true;	
						} else {
							if(i == d.length-1)
								$('#DictionaryOut').html(no_results);
							else 
								tryDictionary(i+1);
						}	
					} else {
						if(data != "404") {
							//console.log(data);
							$('#DictionaryOut').html('<iframe style="width:100%;height:'+(window.innerHeight-210)+'px" id="DictionaryFrame" seamless></iframe>');
							//$('#DictionaryFrame').attr('srcdoc', data);
							$('#DictionaryFrame').attr('src', j[1]+"?word="+$('#DictionaryIn').val());
							end = true;	
						} else {
							if(i == d.length-1)
								$('#DictionaryOut').html(no_results);
							else 
								tryDictionary(i+1);	
						}
					}
				})
				.fail(function() {
					if(offline == true)
						$('#DictionaryOut').html(no_connection);
				})
				.always(function() {
					if($('#DictionaryIn').val().length == 0) 
						openApp();
				});
				ajaxrequests.push(req);
			}
			tryDictionary(0);
		});
	}
	function openSettings() {
		out = "<button id='DictionaryBack'><span class='fa fa-angle-left'></span></button><br>";
		out += "Sort the dictionaries that you want to access, separated by a comma then a space.<br>";
		out += "<input id='DictionarySort' value='"+getSettings("dictionarysort")+"' style='width:95%'>";
		//out += "<button id='DictionarySortSave'>Save Order</button>";
		out += "<br><br><u>Accessible Dictionaries</u><ul style='margin-left:20px;margin-top:0px;'>";
		var a = getSettings('dictionary').split(', ');
		for(i in a) {
			console.log('dictionary_'+a[i]);
			var b = getSettings('dictionary_'+a[i]).split(', ');
			//"<span class='fa fa-circle-o' style='font-size:9pt'></span>"+	
			b[4] = b[4].replace(/&gt;/g, ">").replace(/&lt;/g, "<");
			out += b[4]+" "+a[i]+"<br>";
			console.log(b);
		}	
		out += "</ul><button id='DictionaryStore' class='textbutton' onclick='launchStore()'>Download More Dictionaries</button>";
		postPanelOutput(out);
		$('#DictionaryBack').on('click', function() {
			openApp();
		});
		$('#DictionarySort').on('input', function() {
			//$('#DictionarySortSave').attr('disabled', false);
			writeToSettings('dictionarysort', $('#DictionarySort').val());
		});
	}
	function xmlDictionaryParse(d) {
		out = "<span style='font-size:17pt'>"+d.name+"</span>";
		if(d.pronunciation != undefined) {
			out += "<br><span style='font-size:10pt;font-style:italic'>"+d.pronunciation.text;
			if(d.pronunciation.simple != undefined)
				out += "&nbsp;("+d.pronunciation.simple+")</span>";
		}
		if(d.definition[0] == undefined) {
			switch(d.definition.type) {
				case "Noun":
					var p = "N";
					break;
				case "Verb":
					var p = "Vb";
					break;	
			}
			out += "<br><br>&emsp;<i>"+p+":</i>&emsp;"+d.definition.text;
			if(d.definition.synonym != undefined)
				out += "<br>&emsp;&emsp;<b>S</b>-&nbsp;<span style='font-size:10pt'>"+d.definition.synonym.split(';').join(', ')+"</span>";
			if(d.definition.antonym != undefined)
				out += "<br>&emsp;&emsp;<b>A</b>-&nbsp;<span style='font-size:10pt'>"+d.definition.antonym.split(';').join(', ')+"</span>";
			$('#DictionaryOut').append(out);	
		} else {
			for(i in d.definition) {
				console.warn(i);
				switch(d.definition[i].type) {
					case "Noun":
						var p = "N";
						break;
					case "Verb":
						var p = "Vb";
						break;	
				}
				out = "<i>"+p+"</i>&emsp;"+d.definition[i].text;
				if(d.definition[i].synonym != undefined)
					out += "<br><b>S</b><span style='font-size:10pt'>"+d.definition[i].synonym.split(';').join(', ')+"</span>";
				if(d.definition[i].antonym != undefined)
					out += "<br><b>A</b><span style='font-size:10pt'>"+d.definition[i].antonym.split(';').join(', ')+"</span>";
			}
		}
		out += "<div style='font-size:8pt;text-align:center;margin-top:50px;height:16px;'>";
		if(d.credit != undefined)
			out += d.credit.text;
		out += "</div>";
		$('#DictionaryOut').html(out);
	}
	openApp();
}
//*** Theme Panel ***/
function GetPanelmain_Themes() {
	return {title:"Change Theme", bordercolor: '#2ecc71', width: 20};	
}
function RunPanelmain_Themes() {
	function loadThemes() {
		var a = getSettings('theme').split(', ');
        try {
            loadThemeSettings();
		    out = "<button id='ThemeSettings' class='textbutton'><span class='fa fa-cog'></span>&nbsp;Theme Settings</button><br>";
        } catch(e) {
            out = "";
        }
		for(i in a) {
			var b = getSettings('theme_'+a[i]).split(', ');
			var bg = theme.palette.red;
			console.log(a[i], getSettings('currenttheme'))
			if(a[i] == getSettings('currenttheme'))
				bg = theme.palette.blue;
			out += "<div style='background-color:"+bg+";min-height:50px;margin-bottom:15px;cursor:pointer;padding-left: 4px;padding-top: 3px;' class='ThemesCard' data-c='"+a[i]+"'>";
//			b[3] = b[3].replace(/&gt;/g, ">").replace(/&lt;/g, "<");
			out += b[3]+"&nbsp;<span style='font-size:16pt'>"+b[1]+"</span>";
			out += "</div>";
		}
		out += "<br><br><button class='textbutton' onclick='launchStore()'>Download More Themes</button>";
		postPanelOutput(out);
		$('.ThemesCard').on('click', function() {
			var c = $(this).attr('data-c');
			selectTheme(c);
			window.location.reload();
		});
        $('#ThemeSettings').on('click', function() {
           var out = "<button id='ThemeCards'><span class='fa fa-times'></span></button><br>"+loadThemeSettings();
           postPanelOutput(out);
            runThemeSettings();
            $('#ThemeCards').on('click', function() {
                loadThemes();
            });
        });
	}
	loadThemes();
}	

/** Page Count **/
function InitPanelmain_PageCount() {
    postPageCount();
    $(document).on('keydown', function(e) {
        if(e.keyCode == 32) {
            postPageCount();
            if(window.paneltitle == "main_PageCount")
                RunPanelmain_PageCount();
        }
     });
}
function GetPanelmain_PageCount() {
    return {title:"Page Count", bordercolor: theme.coloralt, width:20};   
}
function RunPanelmain_PageCount() {
    out = "<div style='text-align:center'>This document is</div><br><br>";
    out += "<div style='font-size:24pt;text-align:center;font-weight:100;'>~"+postPageCount()+" Page"+(postPageCount()==1?"":"s")+"</div>";
    out += "<br><div style='text-align:center;font-size:8pt;font-style:italic;'>Based on the number of words that can fit on a page. This does not factor additional formatting like bibliographies or cover pages.</div><br><br><br><br><br>"; 
    
    out += "<div style='text-align:center'>Spoken, it is</div><br><br>";
    out += "<div style='font-size:24pt;text-align:center;font-weight:100;'>~"+Math.round(10*getWords().length/130)/10+" Minute"+(postPageCount()==1?"":"s")+"</div>";
    out += "<br><div style='text-align:center;font-size:8pt;font-style:italic;'>Based on an average of 130 words per minute.</div><br><br><br><br><br>";
    
    out += "<div style='text-align:center;'></div><br><br>";
    out += "<div style='text-align:center;font-size:18pt;font-weight:100;'>"+getWords().length+" Words<br><br>"+getWords().join('').length+" Chars</div>";
    postPanelOutput(out);
}
function postPageCount() {
    var i = Math.round(onGetPageCount()*10)/10;  
    initService("main_PageCount", "Page Count", Math.ceil(i)+" Page"+(Math.ceil(i)==1?"":"s")); 
    return i;
}
function onGetPageCount() {
    //Based on MLA procedures
    var a = getWords();
    return a.length*2/700;
}   
