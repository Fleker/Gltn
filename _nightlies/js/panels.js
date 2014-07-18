//PANEL CLASS
//function Panel(id, displayName, icon, url, key, service) {
function Panel(id, displayName, icon, url, key, service) {
    this.id = id || "";
    this.name = displayName || "";
    this.title = this.name;
    this.icon = icon || "";
    this.url = url; 
    this.service = service || false;
    this.override = key || [];
    this.bordercolor = "#000";
    this.width = 25;
    this._canMaximize = false;
    this._isMaximized = false;
    Panel.prototype.getManifest = function() {
        return {id: this.id, name: this.name, icon: this.icon, url: this.url, service: this.service, key:this.key, bordercolor:this.bordercolor, width:this.width, maximize:this.canMaximize };   
    };
    Panel.prototype.setManifest = function(json) {
        this.setBordercolor(json.bordercolor);
        this.setMaximize(json.canMaximize);
        this.setName(json.name);
        this.setOverride(json.override);
        this.setWidth(json.width);
        this.title = json.title;
        this.icon = json.icon;
    }
    Panel.prototype.hasBordercolor = function() {
        return this.bordercolor !== undefined && this.bordercolor.length > 0;   
    }
    Panel.prototype.setBordercolor = function(border) {
        this.bordercolor = border;
        return this;
    }
    Panel.prototype.enableMaximize = function() {
        this.maximize = true;
        return this;
    }
    Panel.prototype.setMaximize = function(max) {
        this.maximize = max;
        return this;
    };  
    Panel.prototype.setName = function(name) {
        this.name = name;
        return this;
    };
    Panel.prototype.setOverride = function(ovr) {
        this.override = ovr;
        return this;
    }
    Panel.prototype.setWidth = function(width) {
        this.width = width;
        return this;
    };
    Panel.prototype.canMaximize = function() {
        return this._canMaximize;   
    }
    Panel.prototype.isMaximized = function() {
        return this._isMaximized;   
    }
    Panel.prototype.activate = function() {
        downloadingpanel = this.id;  
    };
    
    //Panel events
    Panel.prototype.onInit = undefined;
    Panel.prototype.onRun = undefined;
    Panel.prototype.onContext = undefined;
    Panel.prototype.onExport = undefined;
    Panel.prototype.onUninstall = undefined;
}
//PanaelManager Class 
function PanelManager() {
    //TODO If I can delay these initalizations until I load the page, then I can use theme attributes for constuctor. 
    //TODO Though for panels it should be done on Run because it will be based on a soft-picked theme. So, a beforeRun function should be called if applicable to set those parameters
    //  on both the developer side and the engine side
    //TODO Move panel parameters to manifest, use id & url only
    this.availablePanels = {
        Main_Character: new Panel("Main_Character", "Character Panel", "", undefined, false, [13]),
        Main_Citation: new Panel("Main_Citation", "Citation Editor"),
        Main_Dictionary: new Panel("Main_Dictionary", "Dictionary"),
        Main_Filesys: new Panel("Main_Filesys", "My Documents"),
        Main_Find: new Panel("Main_Find", "Find & Replace"),
        Main_Guide: new Panel("Main_Guide", "Style Guide"),
        Main_Idea: new Panel("Main_Idea", "My Ideas"),
        Main_Notifications: new Panel("Main_Notifications", "Notifications"),
        Main_Outline: new Panel("Main_Outline", "Outline Editor"),
        Main_Pagecount: new Panel("Main_Pagecount", "Page Count"),
        Main_Sync: new Panel("Main_Sync", "Synchronization Status"),
        Main_Table: new Panel("Main_Table", "Spreadsheets"),
        Main_Themes: new Panel("Main_Themes", "Theme Selector")
    };
    //FIXME service and override are the same
    PanelManager.prototype.fromString = function(j) {
        var json = JSON.parse(j);
        for(var i in json) {
            if(this.availablePanels[i] !== undefined)
                continue;
            
            if(json[i].service === true)
                var p = new Service(json[i].id, json[i].name, json[i].icon, json[i].url, json[i].override, json[i].service);            
            else
                var p = new Panel(json[i].id, json[i].name, json[i].icon, json[i].url, json[i].override, json[i].service);  
            this.availablePanels[i] = p;
        }
    };
    PanelManager.prototype.getAvailablePanelsLength = function() {
        a = 1;
        for(var i in this.availablePanels) { 
//            console.log(a++);
            a++;
        }
        return a;
    };
    PanelManager.prototype.getAvailablePanels = function() {
        //TODO Grab all panels     
        return this.availablePanels;
    };
    //TODO Later
    this.activePanels = [];
    PanelManager.prototype.getActivePanels = function() {
        return this.activePanels;
    };
    PanelManager.prototype.getAvailableServices = function() {
        //TODO Grab panels, filter only services   
    };  
    PanelManager.prototype.getPlugin = function(id) {
        return this.availablePanels[id];   
    }
    PanelManager.prototype.install = function(panel, num) {
        if(panel.service === undefined)
            panel.service = false;
        if(panel.key === undefined)
            panel.key = [];
        panel.icon = panel.icon.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
        //Return keyboard shortcuts
        if(panel.service !== true) {
            holoribbon_std['Panels'].push({text: panel.name, img: panel.img, action: "runPanel('"+panel.id+"')"});
            newRibbon('.header', holoribbon_std);
            console.log("Installing "+panel.name+"...  "+num);
            ribbonSwitch(ribbon_index,false);
            ribbonLoad();
        }
        writeToSettings('panels_'+panel.id, panel.id+","+panel.url);
        this.availablePanels[panel.id] = panel;

        if(window.offline !== true) {
            //Now store script offline - this really sucks though
            loadjscssfile(panel.url, "js");
            $('#themeframe').attr('src', panel.url);
            downloadingpanel = "null";
            window.setTimeout(function() {download_panel(panel.id,num);}, 200);
        }
    };
    PanelManager.prototype.uninstall = function(id) {
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
        if(this.availablePanels[id].onUninstall !== undefined)
            this.availablePanels[id].onUninstall();
        a = getSettings('panels').split(', ');
        b = [];
        for(i in a) {
            if(a[i] != id) {
                b.push(a[i]);
            }	
        }	
        writeToSettings('panels', b.join(', '));
        writeToSettings('panels_'+i, undefined);	
        if(localStorage['zpanels_'+id] !== undefined) 
            localStorage.removeItem('zpanels_'+id);  
    };
    PanelManager.prototype.run = function(id) {
        runPanel(id);   
    }
    
    PanelManager.prototype.onClose = function() {
        $('#PanelCloseEvent').click();
        $('#panel_plugin').animate({
            opacity: 0,
            }, 100, function() {
                sizePanel(0,false);
            }
        );

        $('#panel_content').show(200);
        window.paneltitle = undefined;
        paneloverride = [];    
        //TODO Pop the stack based on the panel that is being closed.
        this.activePanels = [];
    };
    PanelManager.prototype.onMaximize =  function() {
        if($('.PanelMaximizeEvent').attr('data-status') === 0) {
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
            $('.PanelMaximizeEvent').attr('data-status', 0);
        }
        $('.PanelMaximizeEvent').click();
    };
    PanelManager.prototype.onPopupClose = function(title) {
        $('.PanelPopupEvent').attr('data-title', title);
        $('.PanelPopupEvent').click();	
    };
    PanelManager.prototype.toString = function() {
        return JSON.stringify(this.availablePanels);   
    };
}
panelManager = new PanelManager();
//PANELS ENUM

function addNewPanel(panel) {
    panelManager.availablePanels[panel.id] = panel;   
}
//SERVICES CLASS
//TODO Constructor
function Service(id, displayName, icon, url, key, service) {
    this.id = id || "";
    this.name = displayName || "";
    this.icon = icon || "";
    this.url = url; 
    this.service = true;
    this.override = key || [];
    
    this.servicesBarIcon = "";    
    this.servicesBarTitle = "";
    this.onServiceBarClick = undefined; //What happens when service icon is clicked
    this.onHeartbeat = undefined; //Function to call every so often
    this.heartRate = 1000; //MS per beat
    this.heart = undefined; //Interval variable
}
Service.prototype = new Panel();

function addNewService(service) {
    activeServices[service.id] = service;   
}
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
currentpanel = undefined;
downloadingpanel = "";

//PANEL INSTALL
function install_panel(id, name, img, url, service, key, num) {
    panelManager.install(new Panel(id, name, img, url, key, service),num);
}

function download_panel(id,num) {
    if(downloadingpanel !== id) {
        console.log(id, downloadingpanel);
        if(!downloadingpanel.length)
            return;
        window.setTimeout(function() {download_panel(id,num);}, 100);
    } else {
        console.log("Installed "+id);
        localStorage['zpanels_'+id] = $('#themeframe').contents().text();  
        console.log("eval('InitPanel"+id+"();');  "+num);
        eval("availablePanels['"+id+"'] = "+id);
        console.log("availablePanels['"+id+"'] = "+id);
        if(availablePanels[id].onInit !== undefined)
            availablePanels[id].onInit();
        num++;
        initPanels(num);
    }
}

function uninstall_panel(id) {
    panelManager.uninstall(id);
}
function getPanelIndex(index) {
    var a = 0;
    for(i in panelManager.availablePanels) {
        if(a == index)
            return i;
        a++;
    }
}
//TODO I know this is being called twice somehow. I just can't figure out how
function initPanels(num) {
    console.log("!n!t");
    if(!hasSetting("panels")) {
        writeToSettings("panels", panelManager.toString());   
    }
    var a = panelManager.fromString(getSettings('panels'));
    var a_nm = panelManager.getAvailablePanelsLength();
    if(num === undefined) {
        initPanels(0);
        return;
    }   
    if(isNaN(num))
        return null;
    if(num >= a_nm - 1)
        return null;
    
    if(getPanelIndex(num).indexOf('Main') !== 0) {
        console.log("Must install panel "+getPanelIndex(num));
        panelManager.install(plugin, num);
    } else {
        plugin = panelManager.getAvailablePanels()[getPanelIndex(num)];
        console.log("Panel "+getPanelIndex(num)+".onInit is "+(plugin.onInit !== undefined));
        if(plugin.onInit !== undefined)
            plugin.onInit();
        num++;
        console.log(num);
        initPanels(num);
    }
}

//CHANGES I Think I can killl this
function initPanel2s(num) {
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
}

//Panel GUI
function runPanel(panel_id_name) {
    //TODO Optimize height, title size
	//Get Properties of the Panel First
    var p = panelManager.getAvailablePanels()[panel_id_name];
    if(p === undefined) {
        alert("Panel "+panel_id_name+" does not exist");
        return;
    }
    //TODO Don't hack it
    panelManager.activePanels = [p];
    if(p.onBeforeRun !== undefined)
        p.onBeforeRun();
    var max = "";
    if(!p.hasBordercolor())
        p.setBordercolor(theme.coloralt);
    if(p.canMaximize()) {
        max = "<span class='PanelMaximizeEvent' data-status='0'></span><button onclick='maximizePanel()'><span class='fa fa-arrows-alt'></span></button>";
    }
	$('.panel_plugin_title').html('<table class="panel_plugin_head" style="width:100%;background-color:initial;border:none;"><tr><td style="color:'+theme.fontColor+';padding-top:9px;">'+p.title+'&emsp;<span class="PanelPopupEvent"></span><span class="PanelKeyEvent" data-keycode="" data-alt="" data-ctrl="" data-shift=""></span><span id="PanelCloseEvent"></span><span id="PanelBuildEvent"></span></td><td style="text-align:right;padding:0px;line-height:1em;">'+max+ '<button onclick="hidePanelPlugin()" class="close" style="margin:0px;padding:9px; ">'+closeButton()+'</button></td></tr></table>');
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
    panelManager.onPanelMaximize();
}
function hidePanelPlugin() {
	panelManager.onClose();
}
function postPanelOutput(text) {
	panelWrite(text);
}
function panelWrite(text) {
    $('.panel_plugin_content').html(text+"<br><br>");
	//Any other panel stuff can be here too (if I want to add a footer)
}
function populatePanelPlugin(panel_id_name) {
	panelManager.getAvailablePanels()[panel_id_name].onRun();
	$('.panel_plugin_content').css('height', (window.innerHeight-187)+"px").css('overflow-y', 'auto');
}

function PanelOnPopupClose(title) {
    panelManager.onPopupClose(title);
}

//Panel Initiation
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
//Plugin Native
//TODO Move to Polymer

/*** Character Palette */
//TODO, use JSON to enable search
panelManager.getAvailablePanels().Main_Character.setBordercolor("#009").setWidth(25).setOverride([13]);

function getChar(val, title, tag) {
    return {val: val, title: title, tag: tag};   
}
function getEmoji(val, title, tag) {
    return getChar(val, title, tag+" emoji emoticon");   
}
function getCharAccent(char, accent, or) {
    return getChar(char, or+" w/ "+accent, or+" "+char+" "+accent);  
}
// SPECIALCHARACTERS
specialCharacters = {
    Checkmark: {val: '✔', title: 'Checkmark', tag: 'checkmark check'},

    //  MUSIC
    EighthNote: {val:'♪', title: 'Eighth Note', tag: 'music note eighth'},
    QuarterNote: {val:'♩', title: 'Quarter Note', tag: 'music note quarter'},
    TwoEighthNotes: {val:'♫', title:'Two Eigth Notes', tag:'music note eighth'},
    TwoSixteenthNotes: {val:'♬', title: 'Two Sixteenth Notes', tag: 'music note sixteenth'},
    FlatNote: {val:"♭", title:"Flat", tag:"music note flat"},
    NeutralNote:{val:"♮", title:"Neutral", tag:"music note neutral"},
    SharpNote:{val:"♯", title:"Sharp", tag:"music note sharp"},

    // GENDER
    Female: {val:'♀', title: 'Female', tag: 'gender sex female'},
    Male: {val:'♂', title:'Male', tag:'gender sex male'},
    MaleFemale: getChar("⚥", "Male and Female", "gender sex male femae"),
    DoubleFemale: getChar("⚢", "Double Female", "gender sex female double"),
    DoubleMale: getChar("⚣", "Double Male", "gender sex male double"),
    Mercury: {val:"☿", title:"Mercury", tag:"Mercury"},
    Earth:{val:"♁", title:"Earth", tag:"Earth"},

    // Currency
    Yen: {val:'¥', title:'Yen', tag: 'money currency yen japan'},
    Euro: {val:'€', title:'Euro', tag:'money currency euro europe'},
    Pound: {val:'£', title:'British Pound', tag:'money currency british england pound'},
    Cent: {val:'¢',title:'Cent',tag:'money currency american cent'},
    Austral:{val:"₳", title:"Austral Sign", tag:"money currency austral"},
    Baht: {val:"฿", title:"Baht", tag:"money currency thai baht"},
    Rupee: {val:"₹", title:"Rupee", tag:"money currency india rupee"},


    // LEGAL
    Copyright: {val:'©', title:'Copyright', tag:'legal copyright'},
    Reserved: {val:'®',title:'Reserved',tag:'legal reserved'},
    SoundRecording: getChar("℗","Sound Recording Copyright", "legal sound recording record"),
    Servicemark: getChar("℠", "Service Mark", "legal servicemark trademark"),
    Trademark: {val:'™',title:'Trademark', tag:'legal trademark trademarked'},

    // Greek Math
    Alpha: getChar("Α", "Alpha", "greek alpha sapphire"),
    alpha: getChar("α","Alpha", "greek alpha sapphire rotation"),
    Beta: getChar("Β", "Beta", "greek beta"),
    beta: getChar("β","Beta", "greek beta"),
    Gamma: getChar("Γ", "Gamma", "greek gamma radiation"),
    gamma: getChar("γ","Gamma", "greek gamma radiation"),
    Delta: getChar("Δ", "Delta", "greek delta change"),
    delta: getChar("δ", "Delta", "greek delta change"),
    epsilon: getChar("ε", "Epsilon", "greek epsilon"),
    Epsilon: getChar("Ε", "Epsilon", "greek epsilon"),
    Zeta: getChar("Ζ", "Zeta", "greek zeta"),
    zeta: getChar("ζ", "Zeta", "greek zeta"),
    Eta: getChar("Η", "Eta", "greek eta"),
    eta: getChar("η", "Eta", "greek eta"),
    Theta: getChar("Θ","Theta","greek theta degrees sphere circle"),
    theta: getChar("θ","Theta","greek theta degrees sphere circle"),
    Iota: getChar("Ι","Iota", "greek iota"),
    iota: getChar("ι","Iota", "greek iota"),
    Kappa: getChar("Κ","Kappa", "greek kappa"),
    kappa: getChar("κ","Kappa", "greek kappa"),
    Lambda: getChar("Λ","Lambda", "greek lambda"),
    lambda: getChar("λ","Lambda", "greek lambda wavelength waves light sound"),
    Mu: getChar("Μ", "Mu", "greek mu"),
    mu: getChar("μ", "Mu", "greek mu mew micro statistics"),
    Nu: getChar("Ν","Nu", "greek nu"),
    nu: getChar("ν","Nu", "greek nu"),
    Xi: getChar("Ξ","Xi", "greek xi"),
    xi: getChar("ξ","Xi", "greek xi"),
    Omicron: getChar("Ο","Omicron", "greek omicron"),
    omicron: getChar("ο","Omicron", "greek omicron"),
    Pi: getChar("Π","Pi", "math pi greek product"),
    pi: getChar("π","Pi", "math pi greek product"),
    Rho: getChar("Ρ","Rho", "greek rho"),
    rho: getChar("ρ","Rho", "greek rho calculus sphere"),
    Sigma: getChar("Σ", "Sigma", "greek sigma math sum"),
    sigma: getChar("σ", "Sigma", "greek sigma math standard deviation"),
    sigmaFinal: getChar("ς", "Final Sigma", "final greek sigma math sum"),
    Tau: getChar("Τ","Tau","greek tau humility franciscans"),
    tau: getChar("τ","Tau","greek tau humility franciscans"),
    Upsilon: getChar("Υ","Upsilon","greek upsilon"),
    upsilon: getChar("υ","Upsilon","greek upsilon"),
    Phi: getChar("Φ","Phi","greek phi calculus"),
    phi: getChar("φ","Phi","greek phi calculus"),
    Chi: getChar("Χ","Chi","chi greek statistics chi-squared"),
    chi: getChar("χ","Chi","chi greek statistics chi-squared"),
    Psi: getChar("Ψ","Psi", "greek psi"),
    psi: getChar("ψ","Psi", "greek psi"),
    Omega: getChar("Ω","Omega","greek omega end ruby"),
    omega: getChar("ω","Omega","greek omega end ruby"),
    Pi_:{val:'π',title:'Lowercase Pi',tag:'math greek pi'},
    Pi: {val:'Π',title:'Uppercase Pi',tag:'math greek pi'},
    //TODO Get Lambda, Beta, Omega - Separate out non-math symbols
    //Similar Symbols
    Micro: getChar("µ", "Micro", "micro metric"),

    // Punctuation
    Emdash: {val:'—',title:'Emdash',tag:'dash emdash'},
    Elipsis: {val:'…',title:'Elipsis',tag:'elipsis dot'},
    Tilde: {val:'~', title:'tilde', tag:'tilde about'},
    Upside_DownQuestion: {val:'¿',title:'Upside-Down Question',tag:'question mark upside down'},
    Upside_DownExclamation: {val:'¡',title:'Upside-Down Exclamation Point',tag:'exclamation point upside down'},
    Interrobang: {val:'‽',title:'Interrobang',tag:'question mark exclamation point interrobang interabang'},
    Asterim: getChar("⁂", "Asterim", "asterisk"),
    InsertCaret: getChar("⁁","Insert Caret", "punctuation review caret insert"),
    Tie: getChar("⁀", "Tie", "punctuation review tie"),
    UnderTie: getChar("‿", "Bottom Tie", "punctuation review tie"),
    AsteriskArabic: getChar("٭","Arabic Star", "arabic star asterisk"),
    AsteriskEastAsia: getChar("※","East Asian Asterisk", "asterisk east asian"),
    AsteriskTeardrop: getChar("✻","Teardrop Asterisk", "asterisk teardrop"),
    AsteriskHexadecimal: getChar("✺","Hexadecimal Asterisk", "asterisk sixteen hexadecimal"),


    // Math
    PlusMinus: {val:'±', title:'Plus-Minus', tag:'math plus minus'},
    Root: {val:'√',title:'Root',tag:'math square root'},
    Divide: {val:'÷',title:'Divide',tag:'math divide quotient'},
    Times: {val:'×',title:'Multiply',tag:'math times multiply multiplication'},
    Dot: {val:'•',title:'Dot',tag:'math dot product multiply'},
    Degrees: {val:'°',title:'Degrees',tag:'math degrees'},
    Minutes: {val:'′',title:'Minutes',tag:'math degrees minutes'},
    Seconds: {val:'″',title:'Seconds',tag:'math degrees minutes seconds'},
    Permille: {val:'℅',title:'Permille',tag:'permille percent'},
    BasisPoint: {val:'‱',title:'Basis Point',tag:'permille percent'},
    InfinitySymbol: {val:'∞',title:'Infinity',tag:'math infinite infinity'},
    ApproxEqual: {val:"≈", title:"Approximately Equal", tag:"math approximately equal"},
    NotEqual: getChar("≠", "Not Equal", "not equal math"),
    Integral: getChar("∫", "Integral", "integral calculus"),
    DoubleIntegral: getChar("∬","Double Integral", "double integral calculus"),
    TripleIntegral: getChar("∭","Triple Integral", "triple integral calculus"),
    Proportional: getChar("∝", "Proportional To", "proportional logic"),
    ContourIntegral: getChar("∮","Line Integral","line integral calculus"),
    ClosedSurfaceIntegral: getChar("∯","Double Line Integral", "double line integral calculus"),
    ClosedVolumeIntegral: getChar("∰", "Triple Line Integral", "triple line integral calculus"),
    ClockwiseIntegral: getChar("∱","Clockwise Integral","clockwise integral calculus"),
    AnticlockwiseIntegral: getChar("⨑","Anticlockwise Integral", "anti clockwise integral calculus"),
    ClockwiseContour: getChar("∲","Clockwise Contour Integral", "clockwise contour integral calculus"),
    AnticlockwiseContour: getChar("∳", "Anticlockwise Contour Integral", "anticlockwise contour integral calculus"),
    Angle: getChar("∠","Angle","angle triangle"),
    Angle2: getChar("∡","Angle", "angle triangle"),
    Angle3: getChar("∢","Angle", "angle triangle"),
    Parallel: getChar("∥","Parallel", "math geometry parallel"),
    NotParallel: getChar("∦","Not Parallel", "math geometry not parallel"),
    EqualParallel: getChar("⋕","Equal and Parallel to", "math geometry parallel equal"),
    Perpendicular: getChar("⊥","Perpendicular","math geometry perpendicular"),
    
    //Accents
    Diaeresis: getChar("¨", "Diaeresis", "diaeresis accent"),
    Acute: getChar("´", "Acute", "acute accent"),
    a_grave: getCharAccent("à", "Grave", "a"),
    A_grave: getChar("À", "A w/ Grave", "a grave"),
    a_acute: getCharAccent("á", "Acute", "a"),
    A_acute: getChar("Á", "A w/ Acute", "a acute"),
    a_circum: getCharAccent("â", "Circumflex", "a"),
    A_circum: getChar("Â", "A w/ Circumflex", "a circumflex"),
    a_tilde: getCharAccent("ã", "Tilde", "a"),
    A_tilde: getChar("Ã", "A w/ Tilde", "a tilde"),
    a_diaer: getCharAccent("ä", "Diaeresis", "a"),
    A_diaer: getChar("Ä", "A w/ Diaeresis", "a diaeresis"),
    a_ring: getCharAccent("å", "Ring", "a"),
    A_ring: getChar("Å", "A w/ Ring", "a ring"),
    ae: getChar("æ", "AE", "ae and"),
    AE: getChar("Æ", "AE", "ae and"),
    c_cedil: getCharAccent("ç", "Cedilla", "c"),
    C_cedil: getChar("Ç", "C w/ Cedilla", "c cedilla"),
    e_grave: getCharAccent("è", "Grave", "E"),
    E_grave: getCharAccent("È", "Grave", "E"),
    e_acute: getCharAccent("é", "Acute", "E"),
    E_acute: getCharAccent("É", "Acute", "E"),
    e_circum: getCharAccent("ê", "Circumflex", "E"),
    E_circum: getCharAccent("Ê", "Circumflex", "E"),
    e_diaer: getCharAccent("ë", "Diaeresis", "E"),
    E_diaer: getCharAccent("Ë", "Diaeresis", "E"),
    i_grave: getCharAccent("ì", "Grave", "I"),
    I_grave: getCharAccent("Ì", "Grave", "I"),
    i_acute: getCharAccent("í", "Acute", "I"),
    I_acute: getCharAccent("Í", "Acute", "I"),
    i_circum: getCharAccent("î", "Circumflex", "I"),
    I_circum: getCharAccent("Î", "Circumflex", "I"),
    i_diaer: getCharAccent("ï", "Diaeresis", "I"),
    I_diaer: getCharAccent("Ï", "Diaeresis", "I"),
    n_tilde: getCharAccent("ñ", "Tilde", "N"),
    N_tilde: getCharAccent("Ñ", "Tilde", "N"),
    o_grave: getCharAccent("ò", "Grave", "O"),
    O_grave: getCharAccent("Ò", "Grave", "O"),
    o_acute: getCharAccent("ó", "Acute", "O"),
    O_acute: getCharAccent("Ó", "Acute", "O"),
    o_circum: getCharAccent("ô", "Circumflex", "O"),
    O_circum: getCharAccent("Ô", "Circumflex", "O"),
    o_tilde: getCharAccent("õ", "Tilde", "O"),
    O_tilde: getCharAccent("Õ", "Tilde", "O"),
    o_diaer: getCharAccent("ö", "Diaeresis", "O"),
    O_diaer: getCharAccent("Ö", "Diaeresis", "O"),
    o_stroke: getChar("ø", "Crossed Out O", "0 O stroke cross"),
    O_stroke: getChar("Ø", "Crossed Out O", "0 O stroke cross"),
    u_grave: getCharAccent("ù", "Grave", "U"),
    U_grave: getCharAccent("Ù", "Grave", "U"),
    u_acute: getCharAccent("ú", "Acute", "U"),
    U_acute: getCharAccent("Ú", "Acute", "U"),
    u_circum: getCharAccent("û", "Circumflex", "U"),
    U_circum: getCharAccent("Û", "Circumflex", "U"),
    u_diaer: getCharAccent("ü", "Diaeresis", "U"),
    U_diaer: getCharAccent("Ü", "Diaeresis", "U"),
    y_acute: getCharAccent("ý", "Acute", "Y"),
    Y_acute: getCharAccent("Ý", "Acute", "Y"),
    y_diaer: getCharAccent("ÿ", "Diaeresis", "Y"),
    
    //Logic
    NOT: getChar("¬", "Not (Logic)", "logic not"),
    Therefore: getChar("∴","Therefore", "logic therefore hence so "),
    Because: getChar("∵","Because", "logic because since"),
    Contradiction: getChar("↯","Downward Zigzag", "downward zigzag logic contradiction"),
    XOR: getChar("⊕","Exclusive Or", "logic xor or exclusive"),
    Imply: getChar("→","Implies", "implies if then logic"),
    SubsetEqual: getChar("⊆","Subset and Equal","subset set equal"),
    Subset: getChar("⊂","Subset", "subset set"),
    SupersetEqual: getChar("⊇","Superset and Equal","superset set equal"),
    Superset: getChar("⊃","Superset", "superset set"),
    Infer: getChar("⊢","Infers","infers is derived from logic"),
    IsElement: getChar("∈","Element of", "set is element member"),
    NotElement: getChar("∉","Not Element of", "set not element member"),
    NotContain: getChar("∌","Doesn't Contain Element", "set not contain element member"),
    SuchThat: getChar("∋","Such That", "such that logic"),
    Union: getChar("∪","Union", "union logic u"),
    Intersect: getChar("∩","Intersect","intersect logic n"),
    Join: getChar("∨","Join","join logic V"),
    EmptySet: getChar("∅","Empty Set","empty set logic"),
    
    Exists: getChar("∃","Existenstialist Quantification", "There exists are is Existenstialist Quantification"),
    Unique: getChar("∃!","Uniqueness Quantification", "There exists exactly one unique Uniqueness Quantification"),
    Entailment: getChar("⊧","Entailment","entailment entails"),
    From: getChar("→","From...to","from to"),    
    NormalSubgroup: getChar("◅","Normal Subgroup", "normal subgroup"),
    Ideal: getChar("▻","Ideal/Antijoin", "ideal anti join antijoin subgroup"),
    Expected: getChar("E","Expected Value","expected value function"),

    // Cards
    Clubs: {val:'♣',title:'Clubs',tag:'symbol cards club'},
    Spades:  {val:'♠',title:'Spades',tag:'symbol cards spade'},
    Hearts: {val:'♥',title:'Hearts',tag:'symbol cards heart'},
    Diamond: {val:'♦',title:'Diamond',tag:'symbol cards diamond'},

    // Symbols
    Carat: {val:'^',title:'Carat',tag:'carat v'},
    LeftArrow: {val:'←',title:'Left Arrow',tag:'direction arrow left'},
    UpArrow: {val:'↑',title:'Up Arrow',tag:'direction arrow forward up'},
    DownArrow: {val:'↓',title:'Down Arrow',tag:'direction arrow backward down'},
    RightArrow: {val:'→',title:'Right Arrow',tag:'direction arrow right'},
    PlaceOfInterest:{val:"⌘", title:"Place of Interest", tag:"place interest"},

    // Document Symbols
    Section: {val:'§',title:'Section Symbol',tag:'markup section'},
    Paragraph: {val:'¶',title:'Paragraph Break',tag:'markup paragraph enter newline'},
    Keyboard: {val: "⌨", title:"Keyboard", tag:"markup writing keyboard"},
    
    //Keys
    Search: getChar("⌕","Search","search icon"),
    Enter: getChar("⌤","Enter Key", "enter key"),
    Option: getChar("⌥","Option Key", "option key"),
    Delete: getChar("⌦","Delete Key", "delete key"),
    Backspace: getChar("⌫","Backspace Key","backspace key"),
    Eject: getChar("⏏","Eject Key", "eject key cd"),
    Alt: getChar("⎇","Alt Key", "alt key"),
    Parental: getChar("⚿","Parental Controls","parental controls"),

    // Nature
    BlackFlorette: {val: '✿', title:"Flower", tag:"nature flower"},
    Flower: getChar("⚘","Flower","flower nature"),
    BlackSun: {val:"☀", title:"Sun", tag:"nature sun"},
    PartlyCloudy: getChar("⛅","Partly Cloudy","partly cloudy sunny nature"),
    Sunshine: {val: "☼", title: "Sun Outline", tag:"nature sun"},
    Umbrella: {val: "☂", title:"Umbrella", tag:"nature umbrella"},
    WetUmbrella: getChar("☔","Umbrella", "nature umbrella rain"),
    Snowman: {val:"☃", title:"Snowman", tag:"nature snow snowman"},
    Cloud: {val:"☁", title:"Cloud", tag:"cloud nature"},
    Snowflake: {val: "❄", title:"Snowflake", tag:"snowflake nature"},
    SnowflakeTrifoliate: {val:"❅", title:"Snowflake", tag:"snowflake nature"},
    SnowflakeHeavyChevron: {val: "❆", title:"Snowflake", tag:"snowflake nature"},
    Comet: {val: "☄", title:"Comet", tag:"nature comet meteor"},
    StarOutline: getChar("☆", "Star Outline", "outline star"),
    StarFill: getChar("★","Star Fill", "fill star"),
    Coffee: getChar("☕","Coffee", "coffee joe drink mug steam"),
    Clover: getChar("☘","Clover", "three leaf clover irish"),
    Pepper: getChar("☙","Hot Pepper", "hot pepper ow"),
    Rain: getChar("⛆","Rain","rain wet drizzle downpour"),
    Thundercloud: getChar("⛈","Thundercloud","thundercloud cloud lightning rain"),

    // Culture
    USSR: {val: "☭", title:"Hammer & Sickle", tag: "former soviet russia"},
    Cross: {val: "✞", title:"Cross", tag: "christian cross"},
    DavidStar: {val: "✡", title:"Star of David", tag:"jewish star david"},
    StarCrescent: getChar("☪","Star and Crescent", "star crescent muslim moslem"),
    Ankh: getChar("☥","Anhk", "egyptian ankh"),
    Peace: getChar("☮","Peace", "peace hippie wawa hoagiefest"),
    YinYang: getChar("☯","Yin and Yang", "asian yin yang"),
    HammerPick: getChar("⚒","Hammer and Pick", "hammer pick"),
    Pickaxe: getChar("⛏","Pickaxe", "pickaxe pick"),
    Anchor: getChar("⚓","Anchor","anchors away"),
    Duel: getChar("⚔","Duelling Swords", "duel swords"),
    Scale:getChar("⚖","Weighing Scale", "weigh scale measurements grams metric"),
    Fleur: getChar("⚜","Fleur-de-lis","fleur de lis boy scouts"),

    // Transport
    Airplane: {val:"✈", title:"Airplane", tag:"airplane"},
    Sailboat: getChar("⛵","Sailboat","sailboat yacht boat"),
    Ferry: getChar("⛴","Ferry","ferry boat"),
    
    // Sports
    Football: getChar("⚽","Football (Soccer)","soccer football sports"),
    Baseball: getChar("⚾","Baseball", "baseball ballgame"),
    IceSkate: getChar("⛸","Ice Skate", "ice skate skating"),
    Ski: getChar("⛷","Ski", "Ski skier snowboard"),
    GolfFlag: getChar("⛳","Flag in Hole","flag hole golf"),

    // Hazard
    Skull: {val:"☠", title:"Skull & Crossbones", tag:"skull crossbones pirate"},
    Radioactive: {val:"☢", title:"Radioactive", tag:"radioactive imagine dragons"},
    Biohazard: {val:"☣", title:"Biohazard", tag:"biohazard"},
    Caduceus: {val:"☤", title:"Caduceus", tag:"caduceus medicine snake pole"},
    Recycling: getChar("♺", "Recycling", "recycling reuse recycle"), //Because I didn't know where else to put it :/
    PermPaper: getChar("♾","Permanent Paper", "recycling paper permanent"),
    ElectricArrow: getChar("⌁","Electric Arrow", "electric arrow"),
    Warning: getChar("⚠","Warning","alert warning yellow"),
    HighVoltage: getChar("⚡","High Voltage","electricity warning voltage high pikachu"),

    //Emoticons
    WhiteSmiling: getChar("☺","White Smiling","white smiling face happy"),
    BlackSmiling: getChar("☻", "Black Smiling", "black smiling face happy"),
    WhiteFrown: getChar("☹", "White Frowning", "white frowning face sad"),

    //Science
    Atom: getChar("⚛", "Atomic Model", "atom"),
    Benzene: getChar("⌬","Benzene", "benzene molecule chemical"),
    Alembic: getChar("⚗","Alembic","alchemy alembic"),
    
    //Other Latin Characters
    Eth: getChar("Ð", "Eth", "Latin Icelandic eth"),
    eth: getChar("ð", "Eth", "Latin Icelandic eth"),
    Thorn: getChar("Þ", "Thorn", "Thorn born latin norse"),
    thorn: getChar("þ", "Thorn", "Thorn born latin norse"),
    sharps: getChar("ß", "Sharp S", "German sharp s"),

    //Symbols
    Watch: getChar("⌚","Watch","watch clock time"),
    Hourglass: getChar("⌛","Hourglass", "sand watch clock time hourglass"),
    AlarmClock: getChar("⏰","Alarm Clock", "clock time alarm"),
    
    // Automobiles
    Collision: getChar("⛌","Traffic Collision", "traffic collision"),
    Breakdown: getChar("⛍","Vehicle Breakdown", "vehicle breakdown"),
    Road: getChar("⛑","Road", "road"),
    RoadCondition: getChar("⛐","Road Conditions","road conditions"),
    RoadBlock: getChar("⛒","Roadblock", "roadblock"),
    Snowchains: getChar("⛓","Snow Chains", "snow icy black ice chains snowchains"),
    HandTraffic: getChar("⛕","Right and Left Hand Traffic", "right left traffic road"),
    NoEntry: getChar("⛔","No Entry", "no entry car"),
    TwoWay: getChar("⛖","Two Way Traffic", "two way traffic highway"),
    LaneEnds: getChar("⛙","Lane Ends","lane is ending"),
    LaneCross: getChar("⛌","Lane Crossing", "crossing lane"),
    BlackTruck: getChar("⛟","Black Truck", "black truck"),
    Fuel: getChar("⛽","Fuel Pump","pump fuel"),
    
    //TODO Emoji
    // Emotions
    
    //http://en.wikipedia.org/wiki/Emoji
    // Regional Indicators
    Cyclone: getEmoji("🌀","Cyclone","cyclone hurricane"),
    Foggy: getEmoji("🌁","Foggy","fog foggy frog"),
    ClosedUmbrella: getEmoji("🌂","Closed Umbrella", "closed umbrella"),
    NightWithStars: getEmoji("🌃", "Night with Stars", "night stars city"),
    SunriseOverMountains: getEmoji("🌄","Sunrise over Mountains", "sunrise mountains country"),
    Sunrise: getEmoji("🌅","Sunrise","sunrise"),
    CityscapeAtDusk: getEmoji("🌆", "Cityscape at Dusk", "cityscape dusk"),
    SunsetOverBuildings: getEmoji("🌇","Sunset over Buildings", "sunset buildings city"),
    Rainbow: getEmoji("🌈","Rainbow", "rainbow lucky charms"),
    BridgeAtNight: getEmoji("🌉","Bridge at Night", "bridge nighttime"),
    WaterWave: getEmoji("🌉","Water Wave", "beach water wave"),
    Volcano: getEmoji("🌋", "Volcano", "volcano lava"),
    MilkyWay: getEmoji("🌌","Milky Way", "milky way galaxy space universe"),
    EarthEA: getEmoji("🌍", "Earth Europe-Africa", "earth europe africa"),
    EarthAs: getEmoji("🌎", "Earth Americas", "north south america earth"),
    EarthAA: getEmoji("🌏", "Earth Asia-Australia", "earth asia australia"),
    GlobeMeridians: getEmoji("🌐", "Globe with Meridians", "globe meridians earth"),
    Moon_N: getEmoji("🌑", "New Moon", "new moon"),
    
    Wheelchair: getChar("♿","Wheelchair",'wheelchair chair'),
    Fountain: getChar("⛲","Fountain","fountain water park"),
    UmbrellaBeach: getChar("⛱","Umbrella on Beach", "umbrella on beach bathing"),
    Mountain: getChar("⛰","Mountain","mountain rock tunnel"),
    Scissors: getChar("✂","Scissors","scissors incision scyther scisor cut"),
    
    // Games
    Die1: getChar("⚀","Die Face-1", "die face dice"),
    Die2: getChar("⚁","Die Face-2", "die face dice"),
    Die3: getChar("⚂","Die Face-3", "die face dice"),
    Die4: getChar("⚃","Die Face-4", "die face dice"),
    Die5: getChar("⚄","Die Face-5", "die face dice"),
    Die6: getChar("⚅","Die Face-6", "die face dice"),
    CheckerW: getChar("⛀","White Draughts Man", "checkers piece"),
    CheckerW2: getChar("⛁","White Draughts King", "checkers piece"),
    CheckerB: getChar("⛂","White Draughts Man", "checkers piece"),
    CheckerB2: getChar("⛃","White Draughts Man", "checkers piece"),
    //TODO Chess, Dominos, Cards
    
};

function RunPanelmain_Character() {
    //TODO integrate into plgin
	
	var out = "";
	var searchbar = '<input type="search" id="popup_character_search" style="width:100%" placeholder="Search for Characters" ><br>';
	out += searchbar;
	out += "<div class='character_palette_display' style='width:95%;'></div>";
	postPanelOutput(out);
	character = "";
    list = [];
    $('.panel_plugin_content').css('height', (window.innerHeight-160)+"px").css('overflow-y','auto');
	function createCharacterPalette(data) {
        list = data;
		$('#popup_character_search').focus();
		var out = "";
        var index = 0;
        var first;
		for(i in data) {
            if(index == 0)
                first = i;
			out = out + '<div style="display:inline-block;padding-left:8px;margin-bottom:12px;padding-bottom:4px;font-size:16pt;" onclick="contentAddText(\''+data[i].val+'\')" title="'+data[i].title+'" class="character_palette_character">' + data[i].val + '</div>';
            index++;
		}
		$('.character_palette_display').html(out);
//        console.log(data);
        if(first !== undefined)
            character = data[first].val;
//		console.log(character);
		
//		StylePanelClass('character_palette_character', ["cursor", "pointer", "border-bottom", "solid 1px #09f"]);
        $('.character_palette_character').css('cursor','pointer').css('border-bottom', 'solid 1px '+theme.palette.blue.accent400);
	}
	$('#popup_character_search').on('input', function() {
			var st = $('#popup_character_search').val().toLowerCase();
			var sr = new Array();
			var word = false;
			for(i in specialCharacters) {
				word = false;
				for(ii=0;ii<specialCharacters[i].tag.split(' ').length;ii++) {
					if(specialCharacters[i].tag.split(' ')[ii].indexOf(st) == 0 && !word) {
						sr.push(specialCharacters[i]);
						word = true;
					}
				}
			}	
//            character = data[0].val;
			createCharacterPalette(sr);
		});	
		
	createCharacterPalette(specialCharacters);
	$('.PanelKeyEvent').on('click', function() {
			if($(this).attr('data-keycode') == 13) {
				console.log(list);
                console.log(character);
                
				contentAddText(character);
				$(this).attr('data-keycode', '');
			}
		});
	
	//if I want to hide symbols, I can always put additional main attributes here, maybe call them a different name, like all_ch
	
}
panelManager.getAvailablePanels().Main_Character.onRun = RunPanelmain_Character;
function InitPanelmain_Character() {
//	keyboardShortcut('Nain_Character', {alt: true, key: 67});
	$(document).on('keydown', function(e) {
		if(e.keyCode == 67 && e.altKey) {
			runPanel('Main_Character');	
		}
	});
	//initService('main_Character', 'Character', 'C');
}
panelManager.getAvailablePanels().Main_Character.onInit = InitPanelmain_Character;
panelManager.getAvailablePanels().Main_Citation.setBordercolor("#09f").setWidth(25);
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
panelManager.getAvailablePanels().Main_Citation.onRun = RunPanelmain_Citation;
panelManager.getAvailablePanels().Main_Idea.setBordercolor("#f1c40f").setWidth(40);
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
panelManager.getAvailablePanels().Main_Idea.onRun = RunPanelmain_Idea;
function StylePanelmain_Idea() {
	$('.PanelIdea').css('width', '90%');
	$('.PanelIdea').css('max-height', '50%');
}
panelManager.getAvailablePanels().Main_Outline.setBordercolor("#2c3e50").setWidth(40);
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
		ht += "<div style='overflow-y:auto;/*height:"+(window.innerHeight-215)+"px*/'><div contenteditable='true' style='line-height:1.5em;background-color:"+theme.bodyColor+";color:"+theme.fontColor+"' class='Outline'>"+outline;+"</div></div>";
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
panelManager.getAvailablePanels().Main_Outline.onRun = RunPanelmain_Outline;
function StylePanelmain_Outline() {
	$('.Outline').css('border', 'solid 1px black').css('width', '85%');
} 
panelManager.getAvailablePanels().Main_Outline.setBordercolor('#7f8c8d').setWidth(25);
panelManager.getAvailablePanels().Main_Filesys.title = '<span class="fa fa-folder-open" style="font-size:15pt"></span>&nbsp;My Documents';
//TODO X Circle Button cut off on top
//TODO Shorten search width a little, color in tables
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
panelManager.getAvailablePanels().Main_Filesys.onInit = InitPanelmain_Filesys;
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
                        out += "<div class='fileformat' data-name='"+formats[i].name+"' style='width:8em;height:4em;display:inline-table;text-align:center;' class='large-4 medium-6 small-12'><div style='width:8em;height:4em;display:inline-table;border:solid 2px "+theme.fontColorAlt+";background-color:"+theme.ribbon.highlight+";color:"+theme.palette.grey.accent400+";font-size:18pt;text-align:center;'>"+formats[i].name+"</div><div style='text-align:center;font-size:14pt;'>"+formats[i].name+"&nbsp;"+formats[i].type+"</div></div>";
                        
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
			$(this).css('color', theme.bodyColor).css('background-color', theme.palette.red.normal).css('border-radius', 100);
		}, function() {
			$(this).css('color', theme.fontColor).css('background-color', 'inherit');
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
                
                bgc = theme.fontColorAlt;
				if(i == fileid)
					bgc = theme.palette.blue.normal;
					
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
panelManager.getAvailablePanels().Main_Filesys.onRun = RunPanelmain_Filesys;
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
panelManager.getAvailablePanels().Main_Guide.setBordercolor('#7f8c8d').setWidth(30).onRun = RunPanelmain_Guide;
panelManager.getAvailablePanels().Main_Guide.title = '<span class="fa fa-info-circle" style="font-size:13pt"></span>&nbsp;Style Guide';
    
    
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
panelManager.getAvailablePanels().Main_Find.setBordercolor("#e74c3c").setWidth(20).onRun = RunPanelmain_Find;
panelManager.getAvailablePanels().Main_Find.title = '<span class="fa fa-exchange" style="font-size:13pt"></span>&nbsp;Find & Replace';


//Dictionary Class
function Dictionary(format, url, name, id, icon) {
    this.format = format||"XML";
    this.url = url||"";
    this.name = name||"";
    this.id = id||"";
    this.icon = icon||"";
    this.toString = function() {
        var json = {format: this.format, url: this.url, name: this.name, id: this.id, icon: this.icon};
        return JSON.stringify(json);
    }
    this.fromString = function(j) {
        console.log(j);
        var json = JSON.parse(j);
        this.format = json.format;
        this.url = json.url;
        this.name = json.name;
        this.id = json.id;
        this.icon = json.icon;
    }
}

//TODO Keyboard Nain_Character
//DictionaryManager Class
function DictionaryManager() {
    this.installedDictionaries = {
        ouvert: new Dictionary("XML", "http://felkerdigitalmedia.com/gltn/dictionaries/dictionary.php", "Ouvert Dictionary", "ouvert", "G"),
        wiktionary: new Dictionary("HTML", "http://felkerdigitalmedia.com/gltn/dictionaries/dictionary_wik.php", "Wikitionary", "wiktionary", '<span class="fa fa-terminal"></span>'),
        wikipedia: new Dictionary("HTML", "http://felkerdigitalmedia.com/gltn/dictionaries/dictionary_wiki.php", "Wikipedia", "wikipedia", '<span class="fa fa-globe"></span>')
    };
    DictionaryManager.prototype.install = function(dic) {
        if(getSettings('dictionary').indexOf(dic.id) == -1) {
            this.installedDictionaries[dic.id] = dic;
            writeToSettings('dictionary', getSettings('dictionary') + ";"+dic.toString());
            writeToSettings('dictionarysort', getSettings('dictionarysort') + ";"+dic.id);
        } else
            console.error("You've already installed "+id); 	
    };  
    DictionaryManager.prototype.uninstall = function(id) {
        var a = getSettings('dictionary').split(';');
        var b = [];
        for(i in a) {
            var dic = new Dictionary().fromString(a[i]);
            if(dic.id != id) {
                b.push(dic.toJSON())
            }	
        }	
        writeToSettings('dictionary', b.join(';'));
        
        var a = getSettings('dictionarysort').split(';');
        var b = [];
        for(i in a) {
            if(a[i] != id) {
                b.push(a[i])
            }	
        }	
        writeToSettings('dictionarysort', b.join(';'));   
    }
    this.previousSearches = [];
    DictionaryManager.prototype.appendPreviousSearch = function(string) {
        if(string == "")
            return;
        if(this.previousSearches.indexOf(string) > -1)
            return; //We don't want repetitive inputs
        this.previousSearches.unshift(string);
        if(this.previousSearches.length > 5)
            this.previousSearches.length = 5;
        
        var settings;
        for(i in this.previousSearches) {
            settings += this.previousSearches[i]+",";
        }
        writeToSettings("dictionarySearches", settings);
        //TODO Make this optional, have it opt-out through a checkbox in dictionary settings
    };
    DictionaryManager.prototype.getPreviousSearch = function(index) {
        //Returns the given text or returns false if index is invalid
        if(this.previousSearches.length <= index) 
            return false;
        else
            return this.previousSearches[index];
    };
    DictionaryManager.prototype.hasPreviousSearch = function(index) {
        //Same idea, but true/false
        if(this.getPreviousSearch(index) === false)
            return false;
        else
            return true;
    };
    DictionaryManager.prototype.toString = function() {
        return JSON.stringify(this.installedDictionaries);     
    };
    DictionaryManager.prototype.fromString = function(j) {
        var json = JSON.parse(j);
        for(i in json) {
            this.install(json[i]);   
        }
    };
    DictionaryManager.prototype.getDictionary = function(index) {
        //Returns a given dictionary based on dictionarysort
        var b = getSettings("dictionarysort").split(';');
        return this.installedDictionaries[b[index]];
    };
    DictionaryManager.prototype.getDictionaryLength = function() {
        var a = 1;
        for(i in this.installedDictionaries) {
            a++;   
        }
        return a;
    };  
}
dictionaryManager = new DictionaryManager();

function install_dictionary(format, url, name, id, icon) {
	var dic = new Dictionary(format, url, name, id, icon);
    dictionaryManager.install(dic);
}	
function uninstall_dictionary(id) {
    dictionaryManager.uninstall(id);
}
panelManager.getAvailablePanels().Main_Dictionary.onInit = function() {
    //TODO Install any misc. dictionaries
    console.log("TODO Install any misc. dictionaries");
    if(!hasSetting("dictionary")) {
        writeToSettings("dictionary", dictionaryManager.toString());   
    }
    if(!hasSetting("dictionarysort")) {
        var a = dictionaryManager.installedDictionaries;
        var b = [];
        for(i in a) {
            b.push(a[i].id);
        }   
        writeToSettings("dictionarysort", b.join(";"));
    }
    if(hasSetting("dictionarySearches"))
       dictionaryManager.previousSearches = getSettings("dictionarySearches").split(",");
    else
       dictionaryManager.previousSearches = [];
};
//NOTE
function startDictionarySearch(query) {
    if(panelManager.getActivePanels()[0] !== undefined) {
        if(panelManager.getActivePanels()[0].id == "Main_Dictionary")
            $('#DictionaryIn').val(query).click();   
    } else {
        runPanel("Main_Dictionary");
        setTimeout(function() {
            $('#DictionaryIn').val(query).click(); 
        },600);
    }   
}
function GetPanelmain_Dictionary() {
	return {title:"Dictionary", bordercolor: "#2980b9", width: 40};	
}
function RunPanelmain_Dictionary() {
	var no_results = "<span style='font-size:16pt'>No Results</span><br>This does not appear in any of your dictionaries. Try to:<ul><li> Install a new dictionary</li>OR<li>Change your search.</li></ul>";
	var no_connection = "<span style='font-size:16pt'>Sorry</span><br>The dictionary does not work offline.";
	var connect_time = 0;
	var ajaxrequests = [];
    $('.panel_plugin_content').css('overflow-y', 'inherit');
    
	function openApp() {
		out = "<input type='search' id='DictionaryIn' style='width:65%;display:inline;'><button id='DictionarySettings'><span class='fa fa-cog'></span></button>";
		out += "<div id='DictionaryOut'><span style='font-size:16pt'>Welcome</span><br>Search for something<br><br><br><div style='text-align:center;padding-left:80%;font-size:30pt;margin-top:25%;' class='fa-stack fa-lg'><span class='fa fa-circle-o fa-stack-2x'></span><span class='fa fa-quote-left fa-stack-1x'></span></div>";
        
        out += "<br><br><br><br><br>";
        phrases = ["Try", "Or", "Maybe", "Perhaps", "How About", "Want"];
        for(i=0;i<5;i++) {
            if(dictionaryManager.hasPreviousSearch(i))
                out += "<div style='margin-bottom:6px;font-weight:bold;cursor:pointer;text-transform:uppercase;' onclick='startDictionarySearch(\""+dictionaryManager.getPreviousSearch(i)+"\")'>"+phrases[i]+"&nbsp;"+dictionaryManager.getPreviousSearch(i)+"</div>";
        }
		out += "</div>";
		postPanelOutput(out);	
        //FIXME
        $('.panel_plugin_content').css('overflow-y', 'inherit');
        
		$('#DictionaryIn').focus();
		$('#DictionarySettings').on('click', function() {
			openSettings();
		});	
		$('#DictionaryIn').on('input click keydown', function() {
            console.log("D!");
			var end = false;
            if($('#DictionaryOut .loader10').length == 0)
                getLoader("DictionaryOut");
			for(i in ajaxrequests) {
				ajaxrequests[i].abort();	
			}
			var d = window.settings.dictionarysort.split(';');
			var end = false;
			ajaxrequests = [];
			index = 0;
			function tryDictionary(i) {
                console.log(i);
                j = dictionaryManager.getDictionary(i);
				console.log(i, j.name, $('#DictionaryIn').val(), j.url);
				$('#DictionaryOut').css('background-color', 'inherit').css('padding-left', '0').css('padding-top', '0').css('padding-bottom', '0').css('border', 'none').css('margin-top', '0').css('width', '100%').css('color', 'inherit');
				var req = $.get(j.url, {word: $('#DictionaryIn').val()}, function (data) {
					if(j.format == "XML") {
						console.log(data);
						data = $.parseJSON(data);
						if(data.error != "404") {
							//style='background-color: white;padding-left: 6px;padding-top: 8px;padding-bottom: 50px;border: solid 1px #999;margin-top: 4px;width: 95%;
							$('#DictionaryOut').html(xmlDictionaryParse(data)).css('background-color', 'white').css('padding-left', '6px').css('padding-top', '8px').css('border', 'solid 1px #999').css('margin-top', '4px').css('width', '95%').css('color', 'black');
                            dictionaryManager.appendPreviousSearch($('#DictionaryIn').val());
							end = true;	
						} else {
							if(i == dictionaryManager.getDictionaryLength)
								$('#DictionaryOut').html(no_results);
							else 
								tryDictionary(i+1);
						}	
					} else {
						if(data != "404" && data != '{"error":"404"}') {
							//console.log(data);
							$('#DictionaryOut').html('<iframe style="width:100%;height:'+(window.innerHeight-210)+'px" id="DictionaryFrame" seamless></iframe>');
							//$('#DictionaryFrame').attr('srcdoc', data);
							$('#DictionaryFrame').attr('src', j.url+"?word="+$('#DictionaryIn').val());
                            dictionaryManager.appendPreviousSearch($('#DictionaryIn').val());
							end = true;	
						} else {
							if(i == dictionaryManager.getDictionaryLength)
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
        //TODO Arrow back
		out = "<button id='DictionaryBack'><span class='fa fa-arrow-left'></span></button><br>";
		out += "Sort the dictionaries that you want to access, separated by a semicolon.<br>";
		out += "<input id='DictionarySort' value='"+getSettings("dictionarysort")+"' style='width:95%'>";
		out += "<br><br><u>Accessible Dictionaries</u><ul style='margin-left:20px;margin-top:0px;'>";
		var a = dictionaryManager.installedDictionaries;
		for(i in a) {
			a[i].icon = a[i].icon.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
			out += a[i].icon+"&ensp;"+a[i].id+"<br>";
//			console.log(a[i]);
		}	
		out += "</ul><button id='DictionaryStore' class='textbutton' onclick='launchStore(\"Dictionary\")'>Download More Dictionaries</button>";
		postPanelOutput(out);
		$('#DictionaryBack').on('click', function() {
			openApp();
		});
		$('#DictionarySort').on('input', function() {
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
panelManager.getAvailablePanels().Main_Dictionary.setBordercolor("#2980b9").setWidth(40).onRun = RunPanelmain_Dictionary;


//*** Theme Panel ***/
panelManager.getAvailablePanels().Main_Themes.onInit = function() {
    startThemer();
    console.log("themes are heere");
    if(!hasSetting("themes"))
        writeToSettings("themes", themeManager.toString());
    if(!hasSetting('activeTheme'))
        writeToSettings("activeTheme", "enterprise");
    
    setInterval("iterateTheme()", 500);
};
function GetPanelmain_Themes() {
	return {title:"Change Theme", bordercolor: '#2ecc71', width: 25};	
}
function RunPanelmain_Themes() {
	function loadThemes() {
		var a = themeManager.availableThemes;
        out = "<button id='ThemeSettings' class='textbutton'><span class='fa fa-cog'></span>&nbsp;Theme Settings</button><br>";

        for(i in a) {
			var bg = "inherit";
			if(a[i].id == getSettings('activeTheme'))
				bg = theme.palette.blue.normal;
			out += "<div style='background-color:"+bg+";min-height:50px;margin-bottom:15px;cursor:pointer;padding-left: 6px;padding-top: 7px;padding-bottom:5px;' class='ThemesCard' data-c='"+a[i].id+"'>";
			out += getIcon(a[i].icon, 16)+"&nbsp;<span style='font-size:16pt'>"+a[i].name+"</span>";
			out += "</div>";
		}
		out += "<br><br><button class='textbutton' onclick='launchStore(\"Theme\")'>Download More Themes</button>";
		postPanelOutput(out);
		$('.ThemesCard').on('click', function() {
			var c = $(this).attr('data-c');
			themeManager.pickTheme(c);
            console.warn("reload for "+c);
            loadThemes();/*
            alert("reload");
			window.location.reload();*/
		});
        $('#ThemeSettings').on('click', function() {
           var out = "<button id='ThemeCards'><span class='fa fa-arrow-left'></span></button><br>"+loadThemeSettings();
            postPanelOutput(out);
            runThemeSettings();
            $('#ThemeCards').on('click', function() {
                loadThemes();
            });
        });
	}
	loadThemes();
}	
panelManager.getAvailablePanels().Main_Themes.setBordercolor('#2ecc71').setWidth(20).onRun = RunPanelmain_Themes;

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
//TODO Use ColorAlt
panelManager.getAvailablePanels().Main_Pagecount.setBordercolor('#fff').setWidth(20);
panelManager.getAvailablePanels().Main_Pagecount.onInit = InitPanelmain_PageCount;
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
panelManager.getAvailablePanels().Main_Pagecount.onRun = RunPanelmain_PageCount;
function postPageCount() {
    var i = Math.round(onGetPageCount()*10)/10;  
//    initService("Main_PageCount", "Page Count", Math.ceil(i)+" Page"+(Math.ceil(i)==1?"":"s")); 
    initService("Main_PageCount", "Page Count", "<b>"+Math.ceil(i)+",/b>"); 
    return i;
}
function onGetPageCount() {
    //Based on MLA procedures
    var a = getWords();
    return a.length*2/700;
}   
