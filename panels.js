	// JavaScript Document
function runPanel(panel_id_name) {
	//Get Properties of the Panel First
	var p = eval("GetPanel"+panel_id_name+"();");
	$('.panel_plugin_title').html(p.title);
	$('.panel_plugin_title').append('&emsp;<span class="PanelPopupEvent"></span><span class="PanelKeyEvent" data-keycode="" data-alt="" data-ctrl="" data-shift=""></span><span id="PanelCloseEvent"></span> <button onclick="hidePanelPlugin()" data-step="22" data-intro="Click me to hide the panel.">X</button>');
	$('#panel_plugin').css("border-color", p.bordercolor);
	
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
	$('#panel_plugin').css('display', 'block').css('opacity', 0);
	$('#panel_plugin').animate({
		/*width: percent+"%",*/
		width:'95%',
		minWidth: min+"in",
		opacity: 1,
		marginLeft: 0
		}, 500, function() {
			animateContentPanel(100-percent+'%');
			populatePanelPlugin(panel_id_name);		
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
		}, 500
	);
}
function hidePanelPlugin() {
	$('#PanelCloseEvent').click();
	stretchContentPanel();
	$('#panel_plugin').animate({
		width: "0%",
		minWidth: "0in",
		opacity: 0,
		marginLeft:"100%"
		}, 500, function() {
			$('#panel_plugin').css('display', 'none');
		}
	);
	window.paneltitle = undefined;
}
function postPanelOutput(text) {
	$('.panel_plugin_content').html(text+"<br><br><br><br><br>");
	//Any other panel stuff can be here too (if I want to add a footer)
}
function populatePanelPlugin(panel_id_name) {
	eval("RunPanel"+panel_id_name+"();");	
	eval("StylePanel"+panel_id_name+"();");	
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

//Default Plugins Here:

/*** Character Palette */
//TODO, use JSON to enable search
function GetPanelmain_Character() {
	return {title: "Character Palette", bordercolor: "#000099", width: 25};	
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
			}
		});
	
	//if I want to hide symbols, I can always put additional main attributes here, maybe call them a different name, like all_ch
	
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
		var out = "";
		for(i=0;i<citation.length;i++) {
			if(citation[i] != undefined) {
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
			out = "<span style='font-size:20pt'>:(</span><br>You haven't added any citations.";
		postPanelOutput(out);
		$('.citationPanel_citation').on('click', function() {
			getCitationI($(this).attr('data-id'));
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
	return {title: "Document Notes", bordercolor: "rgb(207,196,29)", width: 40};	
}
function RunPanelmain_Idea() {
	function populateIdeas() {
		
		out = "<div style='background-color: white;border: solid 1px;padding-left: 12px;padding-right: 0px;border-color: #aaa;color: #333;padding-top: 6px;width: 94%;' id='PANELIDEA'><u>General Notes</u><br><textarea class='PanelIdea' data-id='-1'></textarea></div>";
		for(i in citation) {
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
