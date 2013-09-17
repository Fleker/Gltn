// JavaScript Document
function runPanel(panel_id_name) {
	//Get Properties of the Panel First
	var p = eval("GetPanel"+panel_id_name+"();");
	$('.panel_plugin_title').html(p.title);
	$('.panel_plugin_title').append('&emsp;<button onclick="hidePanelPlugin()">X</button>');
	$('#panel_plugin').css("border-color", p.bordercolor);
	
	//for a phone, do a type of check so that it isn't too small. Like, make the minimum width 4 inches.
	//for now, relative to a 13.3" screen (11.59" wide)
	var min = 11.59*p.width;
	if(min > 4)
		min = 4;
	
	openPanelPlugin(p.width, min, panel_id_name);
}
function openPanelPlugin(percent, min, panel_id_name) {
	$('#panel_plugin').css('display', 'block').css('opacity', 0);
	$('#panel_plugin').animate({
		width: percent+"%",
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
	/*GrMath*/	main.push({val:'π',title:'Pi',tag:'math greek pi'},{val:'∆',title:'Delta',tag:'math greek delta'});
		//Also get Lambda, Beta, Omega
	/*Punction*/main.push({val:'—',title:'Emdash',tag:'dash emdash'},{val:'…',title:'Elipsis',tag:'elipsis dot'});
	
	var out = "";
	var searchbar = '<input type="search" id="popup_character_search" style="width:100%" placeholder="Search for Characters"><br>';
	out = out + searchbar;
	out = out + "<div class='character_palette_display'></div>";
	postPanelOutput(out);
	 
	function createCharacterPalette(data) {
		var out = "";
		for(i=0;i<data.length;i++) {
			out = out + '<div style="display:inline" onclick="contentAddText(\''+data[i].val+'\')" title="'+data[i].title+'" class="character_palette_character">' + data[i].val + '</div>&emsp;';
		}
		$('.character_palette_display').html(out);
		
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
	
	//if I want to hide symbols, I can always put additional main attributes here, maybe call them a different name, like all_ch
	
}
function StylePanelmain_Character() {

}
