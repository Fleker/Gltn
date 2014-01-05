	// JavaScript Document
mainpanels = "main_Character, main_Idea, main_Citation, main_Find";
//Other panels are here by default, but don't need to be called on init
function initPanels() {
	if(window.settings.panels == undefined) {
		window.settings.panels = mainpanels;	
	}
	var a = window.settings.panels.split(', ');
	for(i in a) {
		try {
			//console.log(a[i]);
			eval('InitPanel'+a[i]+'();');	
		} catch(e) {
			//console.error(e.message);
		}
	}
}
function runPanel(panel_id_name) {
	//Get Properties of the Panel First
	var p = eval("GetPanel"+panel_id_name+"();");
	$('.panel_plugin_title').html(p.title);
	$('.panel_plugin_title').append('&emsp;<span class="PanelPopupEvent"></span><span class="PanelKeyEvent" data-keycode="" data-alt="" data-ctrl="" data-shift=""></span><span id="PanelCloseEvent"></span> <button onclick="hidePanelPlugin()" data-step="22" data-intro="Click me to hide the panel.">'+closeButton()+'</button>');
	$('#panel_plugin').css("border-color", p.bordercolor);
	window.paneloverride = p.override;
	//$('#panel_plugin').css('margin-top');
	
	//for a phone, do a type of check so that it isn't too small. 
	//Like, make the minimum width 2 inches; 3in is 25% of screen, but that may not look great on phones.
	//for now, relative to a 13.3" screen (11.59" wide)
	var min = 11.59*p.width;
	if(min > 2)
		min = 2;
	window.paneltitle = panel_id_name;
	openPanelPlugin(p.width, min, panel_id_name);
}
function openPanelPlugin(percent, min, panel_id_name) {
	$('#panel_plugin').css('display', 'block').css('opacity', 0.01);
	$('#panel_plugin').animate({
		/*width: percent+"%",*/
		width:'95%',
		minWidth: min+"in",
		opacity: 1,
		marginLeft: 0
		}, 70, function() {
			animateContentPanel(100-percent+'%');
			setTimeout("populatePanelPlugin('"+panel_id_name+"');",10);	
		}
	);
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
		}, 250
	);
}
function hidePanelPlugin() {
	$('#PanelCloseEvent').click();
	//
	$('#panel_plugin').animate({
		width: "0%",
		minWidth: "0in",
		opacity: 0,
		marginLeft:"100%"
		}, 500, function() {
			$('#panel_plugin').css('display', 'none');
			stretchContentPanel();
		}
	);
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
	$('.panel_plugin_content').css('height', (window.innerHeight-137)+"px").css('overflow-y', 'auto');
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
	$('.content'+id).remove(this);
	$('#content_row').append("<span title='"+title+"' class='content"+id+"' onclick='runPanel(\""+id+"\")'>&emsp;"+icon+"</span>");	
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
	out = out + searchbar;
	out = out + "<div class='character_palette_display' id='CHARACTERPANELCHARACTERS'></div>";
	postPanelOutput(out);
	var character = "";
	function createCharacterPalette(data) {
		$('#popup_character_search').focus();
		var out = "";
		for(i=0;i<data.length;i++) {
			out = out + '<div style="display:inline-block" onclick="contentAddText(\''+data[i].val+'\')" title="'+data[i].title+'" class="character_palette_character">' + data[i].val + '</div>&emsp;';
		}
		$('.character_palette_display').html(out);
		character = data[0].val;
		console.log(character);
		
		StylePanelClass('character_palette_character', new Array("cursor", "pointer", "border-bottom", "solid 1px #09f"));
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
			createCharacterPalette(sr);
		});	
		
	createCharacterPalette(main);
	$('.PanelKeyEvent').on('click', function() {
			//console.log('click');
			if($(this).attr('data-keycode') == 13) {
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
	$(document).on('keydown', function(e) {
		if(e.keyCode == 67 && e.altKey) {
			runPanel('main_Character');	
		}
	});
	initService('main_Character', 'Character', 'C');
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
		var out = "<button class='citationPanel_new'>New Source</button><br>";
		for(i=0;i<citation.length;i++) {
			if(citation[i] != undefined && citation[i] != "undefined") {
				c = citation[i];
				console.warn(c);
				out = out + "<div class='citationPanel_citation' data-id='"+i+"' style='background-color:white;border: solid 1px;padding-left: 5px;padding-right: 10px;border-color: #aaa;color: #333;' id='CITATIONPANELEXAMPLE'>"
				try {
					out = out + c['Title']+"<br>&emsp;";
					out = out + "<i>"+c['AuthorFirst']+" "+c['AuthorLast']+"</i><br>&emsp;<span style='font-size:10pt'>Vol. "+c['Volume']+" "+c['Edition']+" ed.</span>";
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
			out += "<span style='font-size:20pt'>:(</span><br>You haven't added any citations.";
		postPanelOutput(out);
		$('.citationPanel_citation').on('click', function() {
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
		
		out = "<div style='background-color: white;border: solid 1px;padding-left: 12px;padding-right: 0px;border-color: #aaa;color: #333;padding-top: 6px;width: 94%;' id='PANELIDEA'><u>General Notes</u><br><textarea class='PanelIdea' data-id='-1'></textarea></div>";
		for(i in citation) {
			if(citation[i] != "undefined")
				out = out+"<hr><div style='background-color: white;border: solid 1px;padding-left: 12px;padding-right: 0px;border-color: #aaa;color: #333;padding-top: 6px;width: 94%;'><u>"+citation[i].Title+"</u><br><textarea class='PanelIdea' data-id='"+i+"'></textarea></div>";
		}
		postPanelOutput(out);
		//Now we have to fill in our content
		$('.PanelIdea[data-id=-1]').val(ideadefault);
		for(i in citation) {
			$('.PanelIdea[data-id='+i+']').val(idea[i]);
		}
	
		$('.PanelIdea').on('input', function() {
			var id = $(this).attr('data-id');
			if(id >= 0) 
				idea[id] = $(this).val();
			else if(id == -1)
				ideadefault = $(this).val();
		});
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
	return {title: "Outline", bordercolor: "#2c3e50", width: 40, override:[9]};	
}
function RunPanelmain_Outline() {
	range = null;
	try {
		outline = x.saved.main_outline;
	} catch(e) {
		outline = "<li></li>";
	}
	if(!outline.length)
		outline = "<li></li>";
	//load
		postPanelOutput(generatePanel());
		range = obtainRange();
	function generatePanel() {
		ht = "<button class='fa fa-file' id='outlineBuild'></button>";
		ht += "<div style='overflow-y:auto;/*height:"+(window.innerHeight-215)+"px*/'><ul contenteditable='true' class='Outline'>"+outline+"</ul></div>";
		return ht;
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
			if($(this).attr('data-keycode') == 9 && $(this).attr('data-shift') == "true") {
				deleteTab();
				console.log("DT");				
				$(this).attr('data-keycode', '');	
			} else if($(this).attr('data-keycode') == 9) {
				insertTab();
				//console.log("IT");
				$(this).attr('data-keycode', '');	 	
			}
		});
	//save
	$('.Outline').on('input', function() {
		writeToSaved('main_outline', $('.Outline').html());
		if($('.Outline').html().substring(0,4) != "<li>" || $('.Outline').html().length == 0) 
			$('.Outline').html("<li></li>");
		var sel = rangy.getSelection();
		range = sel.rangeCount ? sel.getRangeAt(0) : null;
	});
	$('#outlineBuild').on('click', function() {
		$('.draft').html(valMetadata('Author')+"<br>"+"<ul style='line-height:1.8em'>"+$('.Outline').html()+"</ul>");
		//startBuild('.draft');
		falseBuild();
		add_new_page();
			add_to_page(valMetadata('Author')+"<br>");
			add_to_page("<ul style='line-height:1.8em'>"+$('.Outline').html()+"</ul>");
	});	
}
function StylePanelmain_Outline() {
	$('.Outline').css('background-color', 'white').css('border', 'solid 1px black').css('width', '85%');
}
function GetPanelmain_Filesys() {
	return {title: '<span class="fa fa-folder-open" style="font-size:13pt"></span>&nbsp;My Documents', bordercolor: '#7f8c8d', width:15};
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
			$(this).css('color', '#fff').css('background-color', '#f44').css('border-radius', 100);
		}, function() {
			$(this).css('color', '#000').css('background-color', 'inherit');
		});
		
		$('.tfile').on('click', function() {
			if($('.Filesys_delete').attr('data-end') != "true")
				wl($(this).attr('data-v'));
		});
		$('#filesys_new').on('click', function() {
			localStorage['untitled'] = "";
			localStorage['untitled_c'] = "";
			alert("Please change the filename before continuing.");
			wl('untitled');
		});
		$('#filesys_up').on('click', function() {
			$('#filesys_u').click();
			document.getElementById('filesys_u').addEventListener('change', handleFileSelect, false);
		});
		$('#filesys_s').on('input', function() {
			console.log(1);
			resetFolder($('#filesys_s').val());
		});
		$('#filesys_s').focus();
		$('#filesys_s').val(term);	
		function handleFileSelect(evt) {
			//Popup
			initiatePopup({title:'Importing File',ht:'<div class="progress" style="font-size:14pt;text-align:center;width:100%;"></div>',bordercolor:'#7f8c8d'});
    		var files = evt.target.files;
			var file = files[0];
			var start = 0;
			var stop = file.size - 1;
			if(file.name.split('.')[file.name.split('.').length-1] != "gltn") {
				//Popup false
				$('.progress').html('<span style="color:red">Error: Not a proper Gltn file</span>');
				//set timeout close
				setTimeout('closePopup()', 4000);
				return null;
			}
		
			var reader = new FileReader();
			// If we use onloadend, we need to check the readyState.
			reader.onloadend = function(evt) {
			  if (evt.target.readyState == FileReader.DONE) { // DONE == 2
				//console.log(evt.target.result);
				//Save to localStorage
				var xmli = evt.target.result.indexOf('</gluten_doc>')+13;
				var xml = evt.target.result.substring(0,xmli);
				try {
					var i = $.xml2json(xml);
				} catch(e) {
					$('.progress').html('<span style="color:red">Error: Not a proper Gltn file</span>');
					setTimeout('closePopup()', 4000);
					return null;
				}
				var ht = evt.target.result.substring(xmli);
				console.log(xml+";;;;"+ht);
				//evt.target.result;
				save = file.name.split(' ')[0];
				save = save.split('.')[0];
				if(localStorage[save] != undefined) {
					ovr = confirm('This filename already exists: '+save+'; Overwrite the contents of this file?');
				}
				if(ovr) {
					localStorage[save] = xml;
					localStorage[save+"_c"] = ht;
					console.log(file.name, save);
					$('.progress').html('<span style="color:green">The file '+save+'.gltn was successfully imported.<br><span style="font-size:10pt">The file will now be accessible on this computer. To use it on another computer you must export the file after editing.</span></span>');
					setTimeout('closePopup()', 4000);
					resetFolder(term);
				}
			  }
			};
		
			var blob = file.slice(start, stop + 1);
			reader.readAsText(blob);
		}
	}
	function resetFolder(term) {
		//postPanelOutput("<div id='spin' style='margin-left:25%'></div>");
		$('.panel_plugin_content').html("<div id='spin' style='margin-left:8%'></div>");
			var opts = {
			  lines: 7, // The number of lines to draw
			  length: 10, // The length of each line
			  width: 3, // The line thickness
			  radius: 13, // The radius of the inner circle
			  corners: 1, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  direction: 1, // 1: clockwise, -1: counterclockwise
			  color: '#000', // #rgb or #rrggbb or array of colors
			  speed: 0.7, // Rounds per second
			  trail: 20, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: '30px', // Top position relative to parent in px
			  left: '50%' // Left position relative to parent in px
			};
			var target = document.getElementById('spin');
			var spinner = new Spinner(opts).spin(target);
			
		if(term == undefined)
			sterm = "";
		else
			sterm = term.toLowerCase();
		out = "<button id='filesys_new'><span class='fa fa-plus'></span>&nbsp;New</button><input type='file' id='filesys_u' style='display:none' name='file[]'><button id='filesys_up'><span class='fa fa-cloud-upload'>&nbsp;Upload</span></button><br><span class='fa fa-search'></span>&nbsp;<input type='search' id='filesys_s' style='width:85%' value='"+sterm+"'><table style='width:100%'>";
		fstotal = 0;
		for(i in localStorage){
			c(i);
			if(localStorage[i] != undefined && localStorage[i+"_c"] != undefined) {
				//We've got something!
				var title = "";
				try {
					var xx = $.xml2json(localStorage[i]);
					title = localStorage[i].indexOf("<id>Title</id>");
				} catch(e) {
					c(e.message);
					continue;
				}
				if(title > -1) {
					var title2 = localStorage[i].substring(title);
					var t3 = title2.indexOf("<value>")+7;
					var t4 = title2.indexOf("</value>");
					var t5 = title2.substring(t3,t4);
					c(title2);
					c(t3);
					c(t4);
					c(t5);
				}
				if(t5 == undefined)
					t5 = "";
				if(i == fileid)
					bgc = '#2980b9';
				else
					bgc = '#ecf0f1';
				var fsi = localStorage[i].length;
				var fsci = localStorage[i+"_c"].length;
				fstotal += fsi;
				fstotal += fsci;
				var fsout = Math.round((fsi+fsci)/100)/10+"KB";
				//console.log(xx.file.tags.split(','),sterm)
				if(sterm == undefined || (sterm != undefined  && (t5.toLowerCase().indexOf(sterm) > -1) || i.toLowerCase().indexOf(sterm) > -1 || xx.file.tags.indexOf(sterm) > -1)) {
					try {
						var y = xx.file.format;
					} catch(e) {
						console.error(e.message);
						continue;
					}
					out += "<tr><td class='tfile' style='background-color:"+bgc+";border:solid 1px #2c3e50;padding-bottom:8px;width:98%;cursor:pointer;' data-v='"+i+"'><table style='font-size:7pt;font-family:sans-serif;width:100%;'><tr><td style='text-align:left'><span style='font-size:8pt' class='fa fa-file-text'></span>&nbsp;"+i+".gltn</td><td style='text-align:center;width:20px' class='Filesys_delete' data-f='"+i+"'>X</td></tr></table>";
					if(t5 != undefined)
						out += "<div style='margin-left:3px'><b>"+t5+"</b></div>";	
					out += "<span style='font-size:8pt'>&emsp;"+xx.file.format+"&nbsp;&nbsp;"+xx.file.language+"&nbsp;&nbsp;"+fsout+"</span>";	
					out += "</td></tr>";	
				}
			}	
		}
		out += "</table>";
		fstotal += localStorage['settings'].length;
		fstotalout = "<span style='font-size:10pt'>&emsp;"+Math.round(fstotal/100)/10+"KB stored</span>"
		out += fstotalout;
		post(out,term);
		//setTimeout("post(out);", 50);
	}	
	resetFolder();
}
function GetPanelmain_Style() {
	return {title: '<span class="fa fa-info-circle" style="font-size:13pt"></span>&nbsp;Style Guide', bordercolor: '#7f8c8d', width:30};
}
function RunPanelmain_Style() {
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
	out += "<button id='FindApply'>Replace All</button>";
	out += "<button id='FindCancel'>Cancel Changes</button>";
	postPanelOutput(out);
	window.cta = $('.content_textarea').html();
	window.cta2 = $('.content_textarea').html();	
	initFind();
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
function GetPanelmain_Dictionary() {
	return {title:"Dictionary", bordercolor: "#2980b9", width: 40};	
}
function RunPanelmain_Dictionary() {
	var no_results = "<span style='font-size:16pt'>No Results</span><br>This does not appear in any of your dictionaries. Install a new dictionary or change your search.";
	var no_connection = "<span style='font-size:16pt'>Sorry</span><br>The dictionary feature is currently broken. Please report this if you feel it should work.";
	var connect_time = 0;
	//Check stock dictionaries and 'install' if null
	if(window.settings.dictionary == undefined) {
		window.settings.dictionary = 'wikipedia';
		window.settings.dictionary_wikipedia = 'HTML, http://felkerdigitalmedia.com/gltn/dictionary_wiki.php, Wikipedia, wikipedia, W';
	}	
	function openApp() {
		out = "<input type='search' id='DictionaryIn' style='width:90%'><button class='fa fa-cog' id='DictionarySettings'></button>";
		out += "<div id='DictionaryOut'><span style='font-size:16pt'>Welcome</span><br>Search for something<br><br><br><div style='text-align:center;width:100%;font-size:30pt;margin-top:25%;' class='fa-stack fa-lg'><span class='fa fa-circle-o fa-stack-2x'></span><span class='fa fa-quote-left fa-stack-1x'></span></div>";
		out += "</div>";
		postPanelOutput(out);	
		$('#DictionaryIn').focus();
		$('#DictionarySettings').on('click', function() {
			openSettings();
		});	
		$('#DictionaryIn').on('input', function() {
			var end = false;
			var opts = {
				  lines: 7, // The number of lines to draw
				  length: 10, // The length of each line
				  width: 3, // The line thickness
				  radius: 13, // The radius of the inner circle
				  corners: 1, // Corner roundness (0..1)
				  rotate: 0, // The rotation offset
				  direction: 1, // 1: clockwise, -1: counterclockwise
				  color: '#000', // #rgb or #rrggbb or array of colors
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
				var spinner = new Spinner(opts).spin(target);
			$.get('http://felkerdigitalmedia.com/gltn/dictionary.php', {word: $('#DictionaryIn').val()}, function(data) {
				//console.log(data);
				data = $.parseJSON(data);
				if(data.error != "404") {
					$('#DictionaryOut').html(xmlDictionaryParse(data));
					end = true;
				} else {
					//Send to all the dictionary packs installed
					//get window.settings.dictionary which will be an array of objects
					if(window.settings.dictionary != undefined) {
						var d = window.settings.dictionary.split(',');
						for(i in d) {
							j = window.settings['dictionary_'+d[i]].split(',');
							if(end)
								break;
							if(j[0] == "XML") {
								$.get(j[1], {word: $('#DictionaryIn').val()}, function(data) {
									if(data.error != "404") {
										$('#DictionaryOut').html(xmlDictionaryParse(data));
										end = true;
								
									} 
								});
							} else { //HTML
								$.get(j[1], {word: $('#DictionaryIn').val()}, function(data) {
									if(data != "404") {
										console.log(data);
										$('#DictionaryOut').html('<iframe style="width:100%;height:'+(window.innerHeight-210)+'px" id="DictionaryFrame" seamless></iframe>');
										//$('#DictionaryFrame').attr('srcdoc', data);
										$('#DictionaryFrame').attr('src', j[1]+"?word="+$('#DictionaryIn').val());
										end = true;		
									}
								});
							}
						}
						if(!end)
							$('#DictionaryOut').html(no_results);
					} else {
						$('#DictionaryOut').html(no_results);
					}
						//dictionary[0] = {format: XML, url: URL, name: TITLE, id: D_TITLE, icon: URL} but using commas instead
						//If format is XML, then it will get item using same request format and the same parser
							//Else need to show data.error = 404
						//If format is HTML, then it will just get item and display output
							//Else need to show just "404"
					//TODO - Override default, sort dictionaries for priority
					//TODO - Simple way to handle failure, and move to next dictionary
				}
			})
			.fail(function() {
				$('#DictionaryOut').html(no_connection);
			})
			.always(function() {
				if($('#DictionaryIn').val().length == 0) 
					openApp();
			});
		});
	}
	function openSettings() {
		alert('TODO');	
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
		$('#DictionaryOut').html(out);
	}
	openApp();
}