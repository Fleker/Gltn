var GLTN_VERSION = "1.3.1.6";
//For backwards compatibility, will return true 
function greaterThanVersion(version) {
    var split = version.split(".");
    var V = GLTN_VERSION.split(".");
    if(split[0] < V[0]) {
        return true;
    }
    //1.X v 1.X OR 2.X v 1.Y
    if(split[0] > V[1]) {
        return false;
    }
    //1.1.X v 1.2.X
    if(split[1] < V[1]) {
        return true;
    }
    if(split[1] > V[1]) {
        return false;
    }
    if(split[2] < V[2]) {
        return true;
    } if(split[2] > V[2]) {
        return false;
    } if(split[3] <= V[3]) {
        return true;
    }
    return false;
}

/*** RANGY ***/
	//RANGY OBJECTS DO NOT UPDATE WHEN THE DOM CHANGES -> CREATE NEW OBJECT IF SOMETHING 
range = null;
function debug_buttons() {
	$('.content_buttons').toggle(500);	
}
window.onload = function() {
	if(!doesThisWork()) {
		alert("I'm sorry. I'm so, so sorry. You are not able to run this application. Please try an improved browser, like Google Chrome or Mozilla Firefox.");
	}
    //TODO Change initialization code
	new_gluten_formats();
	new_gluten_languages();
            rangy.init();
			range = rangy.createRange();
			cssClassApplierModule = rangy.modules.CssClassApplier;
			try {
				initFind();
			} catch(e) {
				
			}
			textFound = 0;
			
			surroundCitation = rangy.createCssClassApplier("citation", {
                    elementTagName: "i",
                    elementProperties: {
                    	//id: "citation"+0,						
                    }
             });
			 window.surroundItalics = rangy.createCssClassApplier("", {
                    elementTagName: "i",
                    elementProperties: {
                    	//id: "citation"+0,						
                    }
             });
			 window.surroundBold = rangy.createCssClassApplier("", {
                    elementTagName: "b",
                    elementProperties: {
                    	//id: "citation"+0,						
                    }
             });
			 window.surroundUnder = rangy.createCssClassApplier("", {
                    elementTagName: "u",
                    elementProperties: {
                    	//id: "citation"+0,						
                    }
             });
			 window.surroundStrike = rangy.createCssClassApplier("", {
                    elementTagName: "del",
                    elementProperties: {
                    	//id: "citation"+0,						
                    }
             });
};

content_textarea_var = null;
function postRange(origin) {
	var sel = rangy.getSelection();
//	console.error(origin);
	content_textarea_var = sel.rangeCount ? sel.getRangeAt(0) : null;	
	return sel.rangeCount ? sel.getRangeAt(0) : null;	
}
function getRange() {
		//gets first range
		if(content_textarea_var) {
			console.warn('gr-0');
			moveCarat("word", 1);
			return content_textarea_var;
		}
		else {
			var el = document.getElementsByClassName("content_textarea")[0];
			var range = rangy.createRange();
			range.selectNodeContents(el);
			var sel = rangy.getSelection();
			sel.setSingleRange(range);
			moveCarat("character", 0);
			console.warn('gr--1');
			return sel.getRangeAt(0);
		}
}
	
function displayData() {
	var el = document.getElementById("data");
	var out = "";
	if(getRange().collapsed)
		out = out + "Cursor Mode&emsp;|";
	else
		out = out + "Selection&emsp;|";
	out = out + "Start: "+getRange().startOffset+"&emsp;End: "+getRange().endOffset;
	
	if(textFound > 0) {
		out = out + "&emsp;"+textFound+" items highlighted.";	
	}
	
	el.innerHTML = out;
}	

function surroundRange() {
    var range = getRange();
    if (range) {
        var el = document.createElement("span");
        el.className = "citation";
        el.setAttribute("id", "citation"+0);

        el.setAttribute("data-id", 0);
        el.setAttribute("data-page", "3-5");

        try {
            range.surroundContents(el);
        } catch(ex) {
            if ((ex instanceof rangy.RangeException || Object.prototype.toString.call(ex) == "[object RangeException]") && ex.code == 1) {
                alert("Unable to surround range because range partially selects a non-text node. See DOM Level 2 Range spec for more information.\n\n" + ex);
            } else {
                alert("Unexpected errror: " + ex);
            }
        }
    }
}
function toggleItalics() {
	//instead of using the surroundContents function, this will use the CSS Toggle function. This function will allow an individual to remove an element just as easily as applying one.	
	surroundItalics.toggleSelection();
}
function toggleBold() {
	surroundBold.toggleSelection();
}
function toggleUnder() {
	surroundUnder.toggleSelection();
} 
function toggleStrike() {
	surroundStrike.toggleSelection();
}
function appendQuote() {
	var range = getRange();
	if (range) {
		/*var el = document.createElement("span");
		el.appendChild(document.createTextNode("**INSERTED NODE**"));*/
		var el = document.createTextNode('"');
		range.insertNode(el);
		rangy.getSelection().setSingleRange(range);
		//AS PER THE IDE SET-UP, GO BACK ONE
		//NOPE THE FUNCTION APPENDS IT AFTER TEH CURSOR
		
	}
}
function contentAddText(t) {
	var range = getRange();
	if (range) {
		/*var el = document.createElement("span");
		el.appendChild(document.createTextNode("**INSERTED NODE**"));*/
		var el = document.createTextNode(t);
		range.insertNode(el);
		rangy.getSelection().setSingleRange(range);
		//Move forward one to keep typing.
		moveCarat("character", 1);
		contentValidate();
	}
}
function contentAddSpan(t) {
	//contentAddText(" ");
	//contentAddText(" ");
	var range = getRange();
	if (range) {
		/*var ex = document.createElement("span");
			ex.textContent = "5";
			range.insertNode(ex);
			range.insertNode(ex);*/
		/*var el = document.createElement("span");
		el.appendChild(document.createTextNode("**INSERTED NODE**"));*/
		var el = document.createElement(t.node);
		el.className = t.class;
		el.setAttribute("id", t.id);
        if(t.ce !== undefined) 
            el.contentEditable = t.ce;
		if(!t.leading_quote && t.class == "citation")
			el.textContent = '" ';
		/*else if(t.leading_quote)
			el.textContent = ' "';*/
		//<span class="citation" id="citation"0>"&nbsp;"</span>&nbsp;
		//el = el+document.createTextNode('&nbsp');
		
		//Because both quotes must be the ending and closing of a citation, we must add to the text content.anchor(
		if(t.class == 'citation')
			el.textContent += ' "';
		/*else if(t.class.split(" ")[0] == "table")
			el.textContent += "<span class='fa fa-table'></span>";*/
		else
			el.textContent += t.class.split(" ")[0];
			//range.insertNode(document.createTextNode('"'));
		range.insertNode(el);
		
		/*var range = getRange();
		*/
		
		//rangy.getSelection().setSingleRange(range);
		//Move forward one to keep typing.
		//moveCarat("character", -2-3);
		contentValidate();
        parseCT();
		
	}
}

var searchResultApplier;
function toggleItalicYellowBg() {
	searchResultApplier.toggleSelection();
}
//range.selectNodeContents(document.body); 
//!!! 
function initFind() {
	// Enable buttons
	var cssClassApplierModule = rangy.modules.CssClassApplier;
	if (rangy.supported && cssClassApplierModule && cssClassApplierModule.supported) {
		searchResultApplier = rangy.createCssClassApplier("searchResult");

		/*var searchBox = gEBI("search"),
			regexCheckBox = gEBI("regex"),
			caseSensitiveCheckBox = gEBI("caseSensitive"),
			wholeWordsOnlyCheckBox = gEBI("wholeWordsOnly"),*/
			var searchBox = document.getElementById("FindIn");
			var timer;

		function doSearch() {
			// Remove existing highlights
			var range = rangy.createRange();
			//var caseSensitive = caseSensitiveCheckBox.checked;
			var caseSensitive = false;
			var searchScopeRange = rangy.createRange();
			searchScopeRange.selectNodeContents(document.body);

			var options = {
				caseSensitive: caseSensitive,
				//wholeWordsOnly: wholeWordsOnlyCheckBox.checked,
				wholeWordsOnly: false,
				withinRange: searchScopeRange,
				direction: "forward" // This is redundant because "forward" is the default
			};

			range.selectNodeContents(document.body);
			//range.selectNodeContents(document.getElementsByClassName("content_textarea"));
			searchResultApplier.undoToRange(range);

			// Create search term
			var searchTerm = "";
			if($('#FindOut').val().length) {
				searchTerm = $('#FindOut').val();
			} else {
				searchTerm = searchBox.value;
			}
			
			if (searchTerm !== "") {
				if (true /*regexCheckBox.checked*/) {
					searchTerm = new RegExp(searchTerm, caseSensitive ? "g" : "gi");
				}

				// Iterate over matches
				textFound = 0;
				while (range.findText(searchTerm, options)) {
					// range now encompasses the first text match
					searchResultApplier.applyToRange(range);

					// Collapse the range to the position immediately after the match
					range.collapse(false);
					textFound++;
				}
				$('#FindNum').html(textFound+" found");
			} else {
				$('#FindNum').html('');
			}	

			timer = null;
		}

		function scheduleSearch() {
			if (timer) {
				window.clearTimeout(timer);
			}
			timer = window.setTimeout(doSearch, 100);
		}

		/*document.onpropertychange = function() {
			if (window.event.propertyName == "value") {
				scheduleSearch();
			}
			//IF SEARCH TERMS CHANGE, BUT WE SWEEP EVERY !00 MS - PROBABLY BEST TO REALLY IMPLEMENT THIS LATER
		};*/


		$('#FindIn').on('input', function() {
			scheduleSearch();
		});
		$('#FindOut').on('input', function() {
			scheduleSearch();
		});
		/*regexCheckBox.onclick = scheduleSearch;
		caseSensitiveCheckBox.onclick = scheduleSearch;
		wholeWordsOnlyCheckBox.onclick = scheduleSearch;*/
	}
}

function moveCarat(length, delta) {
	rangy.getSelection().move(length, delta);
    return false;
}

function contentValidate() {
	if($('.content_textarea').html().substr(0,1) == "<") {
		$('.content_textarea').prepend("&nbsp;");
		//console.log('"'+$('.content_textarea').html()+'"');
	}
	if($('.content_textarea').html().substr(-1) != ";") {
		$('.content_textarea').append("&nbsp;");
		//console.log('"'+$('.content_textarea').html()+'"');
	}	
}
/** KEY EVENTS **/
document.onkeydown = function(e) {
	//e.ctrlKey - altKey shiftKey metaKey
	//TODO - Add key events to {format}.js and panel.js so panels can receive the same events natively; Also this means moving events to respective functions; Doing so would complete the character panel code
	
	//Word counting - Place in Space only?
		postWordCount();
	//Check beginning and ends of div
	try{
		contentValidate();
	} catch(e) {
		
	}
		//saveFile();
	switch(e.keyCode) {
        case 81: /* Q - Quit */ 
            if(e.altKey) {
                hidePanelPlugin();
                e.preventDefault();
            }   
        break;
		case 32: /* Space */
			//Word filtering
			//Save
			//saveFile();	
			//if(e.shiftKey)
				//parseCT();		
		break;
		case 66:
			if(e.altKey) {
				startBuild();
				e.preventDefault();	
			}
		break;
		/*case 67: C
			if(e.altKey) {
				runPanel('main_Character');	
			} 
		break;*/
		case 68: /*D*/
			if(e.altKey) {
				runPanel('Main_Dictionary');	
				e.preventDefault();	
			} 
		break;
		case 70: /*F*/
			if(e.altKey) {
				runPanel('Main_Find');
				e.preventDefault();		
			} 
		break;
        case 78:
            if(e.altKey) {
                createNewFile();   
            }
        break;
		case 83:
			if(e.altKey) {
				launchStore();
				e.preventDefault();	
			}
		break;
        case 84:
            if(e.altKey) {
                window.introdisabled = true;
//                introJsStart();      
            }
        break;
		case 122: /*F11*/
			if(!fullscreenOn)
				fullscreen();
			else
				normalscreen();
			e.preventDefault();

		break;
		case 13: /* Enter */
		
		break;
	}
	if(panelManager.getActivePanels().length !== 0) {
		var el = '.PanelKeyEvent';
		$(el).attr('data-keycode', e.keyCode);
		$(el).attr('data-alt',e.altKey);
		$(el).attr('data-ctrl',e.ctrlKey);
		$(el).attr('data-shift',e.shiftKey);
		$('.PanelKeyEvent').click();	
		//console.log($(".PanelKeyEvent").attr('data-keycode'));
		if(paneloverride !== undefined) {
			if(paneloverride.indexOf(e.keyCode) > -1)
				e.preventDefault();
		}
	}
};
function postWordCount() {
	//Right now, this only does the words in the content_textarea; it should get the build count
	//Get input - Right now the text
	var a = getWords();
	var char = a.join('').length;
	var word = 0;
	if(char === 0)
		return;
	/*for(i in a.split(' ')) {
		if(a[i] != ' ' && a[i].length) {
			word++;	
		}
	}*/
	word = a.length;
	$('.fullscreencount').html(char+" c<br>"+word+" w");
	//Interpret
		//Get min/max inputs
	$('.content_character').css('width', '100px').html('<div style="height:3px;" class="content_character_bar"></div><span class="content_character_mark">'+char+'c</span>');
	$('.content_word').css('width','100px').html('<div style="height:3px;" class="content_word_bar"></div><span class="content_word_mark">'+word+'w</span>');

	if(min_char <= 0 && max_char <= 0) {
		$('.content_character_bar').css('background-color', '#00AC39').css('width', '100px');
	} else if(min_char > 0 && max_char <= 0) {
		if(char - min_char < -100) 
			$('.content_character_bar').css('background-color','#f44').css('width', (100*(char/min_char))+"px");
		else if(char - min_char < 0)
			$('.content_character_bar').css('background-color','#D0B605').css('width', (100*(char/min_char))+"px");
		else
			$('.content_character_bar').css('background-color','#00AC39').css('width', (100*(min_char/char))+"px");
	} else if(min_char <= 0 && max_char > 0) {
		if(char - max_char > 100) 
			$('.content_character_bar').css('background-color','#f44').css('width', (100*(max_char/char))+"px");
		else if(char - max_char > 0)
			$('.content_character_bar').css('background-color','#D0B605').css('width', (100*(max_char/char))+"px");
		else
			$('.content_character_bar').css('background-color','#00AC39').css('width', (100*(char/max_char))+"px");
	} else {
		if(char < min_char) {
			$('.content_character_bar').css('background-color','#f44').css('width', (100*(char/min_char))+"px");
		} else if(char > max_char) {
			$('.content_character_bar').css('background-color','#f44').css('width', (100*(max_char/char))+"px");
		} else {
			$('.content_character_bar').css('background-color','#00AC39').css('width', (100*(char/max_char))+"px");
		}
	}
	
	if(min_word <= 0 && max_word <= 0) {
		$('.content_word_bar').css('background-color', '#00AC39').css('width', '100px');
	} else if(min_word > 0 && max_word <= 0) {
		if(word - min_word < -100) 
			$('.content_word_bar').css('background-color','#f44').css('width', (100*(word/min_word))+"px");
		else if(word - min_word < 0)
			$('.content_word_bar').css('background-color','#D0B605').css('width', (100*(word/min_word))+"px");
		else
			$('.content_word_bar').css('background-color','#00AC39').css('width', (100*(min_word/word))+"px");
	} else if(min_word <= 0 && max_word > 0) {
		if(word - max_word > 100) 
			$('.content_word_bar').css('background-color','#f44').css('width', (100*(max_word/word))+"px");
		else if(word - max_word > 0)
			$('.content_word_bar').css('background-color','#D0B605').css('width', (100*(max_word/word))+"px");
		else
			$('.content_word_bar').css('background-color','#00AC39').css('width', (100*(word/max_word))+"px");
	} else {
		if(word < min_word) {
			$('.content_word_bar').css('background-color','#f44').css('width', (100*(word/min_word))+"px");
		} else if(word > max_word) {
			$('.content_word_bar').css('background-color','#f44').css('width', (100*(max_word/word))+"px");
		} else {
			$('.content_word_bar').css('background-color','#00AC39').css('width', (100*(word/max_word))+"px");
		}
	}
}

/*** HOLORIBBON ***/
function setHeader() {
	console.log('Header set');
	window.holoribbon_std =  {
		Home: new Array(
//            {text: "Start the Tour", img: "<span class='fa fa-home' style='font-size:18pt'></span>", action: "alert('TBD')", key:"Alt+T"}, 
            {text: "Create a File", img: "<span class='fa fa-file' style='font-size:18pt'></span>", action: "createNewFile()", key:"Alt+N"},
            {group: "", value:"<div style='font-size:22pt;padding-top:6px;text-align:center;'>Welcome to Gltn!</div>"},
            {text: "Explore Files", img: "<span class='fa fa-folder-open' style='font-size:18pt'></span>", action: "runPanel('Main_Filesys')", key: "Alt+O"} 
		),
		File: new Array(
			{group: "", value:'<div class="row collapse" style="margin-top:9px"><div class="small-2 medium-5 columns"><input id="file_name" type="text" value="'+fileid+'" /></div><div class="small-4 medium-1 columns"><span class="postfix">.gltn</span></div><div class="small-6 medium-3 columns end"><input type="hidden" id="file_name_internal"><button id="file_name_con" class="textbutton" disabled="true">Rename</button></div></div>'},
			{text: 'Compile & Export', img: '<span style="font-size:18pt" class="fa fa-file"></span>', action: "startBuild()", key: "Alt+B"},
			{text: 'Share', img: '<span style="font-size:18pt" class="fa fa-code-fork"></span>', action: "getShare();"}
		),

		Panels: new Array(
			{text: 'Gltn Store', img: '<span style="font-size:18pt" class="fa fa-shopping-cart"/>', action: "launchStore()", key: "Alt+S"},
			{text: 'Outline', img: '<span style="font-size:18pt" class="fa fa-list"></span>', action: "runPanel('Main_Outline');"},
			{text: 'Citations', img: '<span style="font-size:18pt" class="fa fa-book"></span>', action: "runPanel('Main_Citation');"},
			{text: 'Ideas', img: '<span style="font-size:18pt" class="fa fa-lightbulb-o"></span>', action: "runPanel('Main_Idea');"},
			{text: 'Style Guide', img: '<span style="font-size:18pt" class="fa fa-info-circle"/>', action: "runPanel('Main_Guide');"}
		),

		Tools: new Array(
			{text: 'Find', img: '<span style="font-size:18pt" class="fa fa-search"></span>', action: "runPanel('Main_Find');", key: "Alt+F"},
			{text: 'Dictionary', key:"Alt+D", img: '<span style="font-size:18pt" class="fa fa-quote-left"></span>', action: "runPanel('Main_Dictionary');"},
			{text: 'Themes', img: '<span style="font-size:18pt" class="fa fa-picture-o"></span>', action: "runPanel('Main_Themes')"}
		),

		About: new Array(
			{text: 'GitHub', img: '<span style="font-size:18pt" class="fa fa-github-alt"></span>', action: "openTab('http://www.github.com/fleker/gltn')"},
			{text: 'Documentation', img: '<span style="font-size:18pt" class="fa fa-book"></span>', action: "openTab('http://felkerdigitalmedia.com/gltn/docs')"},
			{text: 'Send Feedback', img: '<span style="font-size:18pt" class="fa fa-envelope"></span>', action: "openFeedback()"},
			{text: 'Gltn Blog', img: '<span style="font-size:18pt" class="fa fa-bullhorn"></span>', action:"openTab('http://gltndev.wordpress.com/')"},
			{text: 'Credits', img: '<span style="font-size:18pt" class="fa fa-legal"></span>', action: 'postLegal()'}
		),

		Me: new Array(
            {group: '', value:"<img style='overflow:hidden;border-radius:50%;width:60px;height:60px;' class='me_avatar_img'>"},
			{group: 'Name', value:'<div style="margin-top:2px"><input id="me_name" type="text" placeholder="Name"></div>'},
			{group: 'Email', value:'<div style="margin-top:2px"><input id="me_email" type="email" placeholder="Email Address"></div>'},
            {text: 'Settings...', img:'<span class="fa fa-cog" style="font-size:18pt"></span>', action:"openPersonalFavorites()"}
		)
	};
	newRibbon('.header', holoribbon_std);
	ribbonSwitch(0,false);
	ribbonLoad();
}

function ribbonLoad() {
    $('#file_name').attr('value', fileid);
	$('#file_name').attr('defaultValue', fileid);
	$('#file_name_internal').val(fileid);
	$('#file_name').on('input', function() {
		console.log('file_name oninput');
		$('#file_name_con').attr('disabled', false);
	});
	$('#file_name_con').on('click', function() {
		var v = $('#file_name').val();
		v = v.replace(/ /g, "");
		ovr = true;
		if(localStorage[v] !== undefined) {
			ovr = confirm('This file already exists: '+v+'; Overwrite the contents of this file?');	
		}
		if(ovr) {
            if(v.substr(-2) == "_c")
				v = v.substr(0,v.length-2)+"c";
			$('#file_name_con').attr('disabled', true);
			$('#file_name_internal').val(v);
            localStorage[v] = localStorage[fileid]
            localStorage[v+"_c"] = localStorage[fileid+"_c"];
			setTimeout('window.location = "?file='+v+'";', 250);
		}
	});
    //Initialize Personalization
    if(!hasSetting("personal_name")) {
        writeToSettings("personal_name", "Me");   
    }
    if(!hasSetting("personal_avatar")) {
        writeToSettings("personal_avatar", STOCK_AVATAR);   
    }
    if(!hasSetting("personal_email")) {
        writeToSettings("personal_email", "");
    }   
    if(!hasSetting("personal_color")) {
        writeToSettings("personal_color", "blue");   
    }
    
	$('#me_name').attr('value', getSettings("personal_name"));
	$('#me_name').attr('defaultValue', getSettings("personal_name"));
	$('#me_name').on('input', function() {
		writeToSettings('personal_name', $('#me_name').val());		
	});
	$('#me_avatar').attr('value', getSettings("personal_avatar")).click();
	$('#me_avatar').on('input click', function() {
		writeToSettings('personal_avatar', $('#me_avatar').val());		
        $('#me_avatar_img').attr('src', $('#me_avatar').val());
	});
	$('#me_email').attr('value', getSettings("personal_email"));
	$('#me_email').on('input', function() {
		writeToSettings('personal_email', $('#me_email').val());		
	});
     $('.me_avatar_img').attr('src', getSettings("personal_avatar"));
}
STOCK_AVATAR = "http://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Isidor_von_Sevilla.jpeg/640px-Isidor_von_Sevilla.jpeg";
function appendHoloSelection() {
	var selection = {
		Selection: new Array(
			{text: '', img: '<span style="font-size:18pt" class="fa fa-bold"></span>', action: "toggleBold()"},
			{text: '', img: '<span style="font-size:18pt" class="fa fa-italic"></span>', action: "toggleItalics()"},
			{text: '', img: '<span style="font-size:18pt" class="fa fa-underline"></span>', action: "toggleUnder()"},
			{text: '', img: '<span style="font-size:18pt" class="fa fa-strikethrough"></span>', action: "toggleStrike()"}
		)
	};
	newRibbon('.header', $.extend({}, holoribbon_std, selection));
	ribbonSwitch(ribbon_index, false);
}
function openFeedback() {
    //Instead of a simple email prompt, it will let users send an email or go to Github issues
    var output = "<div style='display:inline-table;width:49%;border-right: solid 1px rgba(128,128,128,1);margin-right: 10px;'><span style='font-size:16pt;cursor:pointer;color: "+getAppropriateColor(theme.palette.blue.accent700, theme.palette.blue.accent100)+"; ' onclick='openTab(\"mailto:handnf+gltn@gmail.com\")'>Send an Email</span><br><span style='font-size:11pt'>Do you want to email the developer directly with a bug or suggestion? Do so here.</span></div>";
    output += "<div style='display:inline-table;width:49%;'><span style='font-size:16pt;cursor:pointer;color: "+getAppropriateColor(theme.palette.blue.accent700, theme.palette.blue.accent100)+"; ' onclick='openTab(\"http://github.com/fleker/gltn/issues\")'>File New Issue</span><br><span style='font-size:11pt'>Already have a GitHub account? File an issue for your bug or suggestion instead.</span></div>";
    var p = new Popup({title: "Send Feedback", ht: output}).show();
}   
function openPersonalFavorites() {
    //Personalization Settings Popup
    
    var colors = ["blue", "red", "green"];
    var output = "<span style='font-size:16pt;font-weight:200;'>"+getSettings("personal_name")+"</span><div class='row'><br><br>";
    
    //Avatar
    output += "<div class='preference_card'><h1>AVATAR</h1><br><img style='overflow:hidden;border-radius:50%;width:60px;height:60px;' class='me_avatar_img'><br><br><input id='me_avatar' type='url' placeholder='Image URL'></div>";
    
    //Colors
    output += "<div class='preference_card'><h1>FAVORITE COLOR</h1><br><div id='me_color_blob' style='background-color:"+getSettings("personal_color")+";width:60px;height:60px;text-align:center;border-radius:100%;'></div><br><select id='me_color'>";
    for(var i in colors) {
        output += "<option value='"+colors[i]+"' selected='"+(colors[i]==getSettings("personal_color"))+"'>"+colors[i].substring(0,1).toUpperCase()+colors[i].substring(1)+"</option>";   
    }   
    output += "</select><br></div>";
    
    //Sync Settings
    output += "<div class='preference_card'><h1>SYNC SETTINGS</h1><br>";
    if(hasSetting("inkpicker_url")) {
        output += "<span class='fa fa-check' style='font-size:9pt;color:"+theme.palette.green.normal+";'></span>&nbsp;<span style='font-size:8pt'>SETTINGS SYNCED</span>";   
    }
    output += "<button class='textbutton' id='up_settings'>Upload Settings</button><br><br><button class='textbutton' id='down_settings'>Download Settings</button><br><span id='validate_settings'></span><br><span id='url_settings' style='font-size:8pt'>";
    
    output += "</span></div>";
    
    output += "</div>";
    
    
    //Info
    output += "<br><br><br><br><div style='font-size:9pt;'>You may personalize some aspects of Gltn. These settings will be synced to all devices when your settings load, but will not be centrally collected. Plugins may access these settings and formats may use this information to populate metadata fields.</div>";
    
    var f = function() {
        $('#me_color').on('change', function() {
            writeToSettings("personal_color", $(this).val());
            $('#me_color_blob').css('background-color', $(this).val());
        }); 
        $('#me_avatar').attr('value', getSettings("personal_avatar")).click();
        $('#me_avatar').on('input click', function() {
            writeToSettings('personal_avatar', $('#me_avatar').val());		
            $('.me_avatar_img').attr('src', $('#me_avatar').val());
        });
        $('.me_avatar_img').attr('src', $('#me_avatar').val());
        $('.preference_card').css('width','calc(50% - 32px)').css('display','inline-table').css('font-weight','200')/*.css('border-right','solid 1px rgba(128,128,128,1);' )*/.css( 'margin-right','16px').css('padding-right','16px').css('border-bottom','solid 1px #999').css('padding-top','8px');
        $('.preference_card>h1').css('color', theme.fontColorAlt).css('text-transform', 'uppercase').css('font-size','13pt').css('font-weight','200').css('margin-left', '-10px').css('font-family', 'inherit');
        
        if(hasSetting("inkblob_url")) 
            $('#url_settings').html("Settings are being synced at "+getSettings('inkblob_url'));
        
        $('#up_settings').on('click', function() {
            //Settings Sync Handler 
            input = localStorage.settings;
            filepicker.store(input, function(InkBlob){
                filepicker.exportFile(
                  InkBlob,
                  {extension:'.xml',
                    suggestedFilename: "gltn-preferences",
                    base64decode: false
                  },
                  function(InkBlob){
                      console.log(event);
                      writeToSettings("inkblob_url", InkBlob.url);
                      writeToSettings("inkblob_modified", new Date().getTime());
                      $('#url_settings').html("File available at "+getSettings('inkpicker_url'));
                      saveFile();
                      filepicker.write(InkBlob,
                         localStorage.settings,
                        function(InkBlob){
                            markAsDirty();
                            console.log("Complete sync for now");
                        }, function(FPError) {
                            console.log("Error: "+FPError.toString());
                        }
                    );
                    console.log(InkBlob.url);
                    console.log("Store successful:", JSON.stringify(InkBlob));
                });
                closePopup();
            }, function(FPError) {
                closePopup();
                console.log(FPError.toString());
            }, function(progress) {
                console.log("Loading: "+progress+"%");
            });       
        });
        $('#down_settings').on('click', function() {
            filepicker.pick({
                extension: '.xml'
            },
            function(InkBlob){
                filepicker.read(InkBlob, function(data) {
                    var djson;
                    try {
                        djson = $.xml2json(data);
                        $('#validate_settings').html("Settings Imported");
                        $('#url_settings').html("File available at "+InkBlob.url);
                    } catch(e) {
                        $('#validate_settings').html("<span style='color:"+theme.palette.red.normal+"'>Invalid XML</span>");
                        return;
                    }
                    localStorage.settings = data;
                    //TODO Hot swap settings, don't require a reload
                    setTimeout("window.location.reload();", 2500);
                });
            },
            function(FPError){
                console.log(FPError.toString());
            }
            );
        }); 
    }
    
    var p = new Popup({title: "Personal Settings", ht: output, fnc: f, size: popupManager.XLARGE}).show();
}

function postLegal() {
    var favorite = theme.palette[getSettings("personal_color")];
    out = "<span style='color:"+getAppropriateColor(favorite.accent700, favorite.accent100)+"'>Gltn version "+GLTN_VERSION+"</span><br><br>";
	out += "2014 Made by Nick Felker&emsp;<a href='http://twitter.com/handnf'>@HandNF</a><br>";
    out += "Made using libraries from Mathjax, Font Awesome, jQuery, Rangy, InkFilepicker, and others<br>";
    out += "Shoutout to everyone who posted online about stuff like replacing text nodes and the ample amount of help from StackOverflow.<br>";
    out += '<br>Stock Images:<br>&emsp;"<a href="http://commons.wikimedia.org/wiki/File:Isidor_von_Sevilla.jpeg#mediaviewer/File:Isidor_von_Sevilla.jpeg">Isidor von Sevilla</a>" by <a href="//en.wikipedia.org/wiki/Bartolom%C3%A9_Esteban_Murillo" class="extiw" title="en:Bartolomé Esteban Murillo">Bartolomé Esteban Murillo</a> - <a rel="nofollow" class="external free" href="http://www.museumsyndicate.com/artist.php?artist=442">http://www.museumsyndicate.com/artist.php?artist=442</a>. Licensed under Public domain via <a href="//commons.wikimedia.org/wiki/">Wikimedia Commons</a>.'

	f = function() {
        $('#myModal a').css('color', theme.palette[getSettings("personal_color")].normal);
    };
	initiatePopup({title:'About', value: out, fnc: f});
}


function doesThisWork() {
	var flag = new Array();
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	  flag.push('The File APIs are not fully supported in this browser.')
	}
	
	if(window.localStorage) {
	} else {
		alert('Local Storage is not supported in this browser.');
		flag.push('Local Storage is not supported in this browser.')
	}	
	try {
		$('#header').attr('id');
	} catch(e) {
		alert('jQuery does not work');
		flag.push('jQuery does not work');		
	}
	try { var isFileSaverSupported = !!new Blob(); } catch(e){
		alert('Blobs are not supported');
		flag.push('Blobs are not supported');	
	}
	if(window.applicationCache === undefined) {
		alert('You do not have Application Cache in your browser. You may still use Gltn, but it will not work offline.');	
	}
	return !flag.length;
}
function closeButton(i) {
	if(i === 1)
		return "<span class='fa fa-times'/>"
	else
		return '<span class="fa fa-times"/>'	
}
function onUpdateReady() {
	appcache();
 //window.appcachestatus = "Found new version - Refresh to update";
  console.log('Found new version!');
}

window.applicationCache.addEventListener('error', function() {
	console.error("Error caching files for offline use.");
	if(window.offline !== true) {
		window.appcachestatus = "Error caching files for offline use";
		initService("Main_Offline", "App caching", "&nbsp;");
	} else {
		window.appcachestatus = "You are currently working offline";
		setTimeout('initService("Main_Offline", "App available offline", "<span class=\'fa fa-plane\'></span>");', 2000);
	}
});

window.appcachestatus = "App available offline";

function appcache() {
	console.log("App is now available for offline use.");
    setTimeout('initService("Main_Offline", "App available offline", "<span class=\'fa fa-plane\'></span>");', 2000);
	//hot swap	
	try {
		window.applicationCache.swapCache();
	} catch(e) {}
	return false;
}

//TODO New Panel Structre
function GetPanelmain_Offline() {
	return {title: "<span class='fa fa-plane'></span>&nbsp;Offline", bordercolor:"#ff9900", width: 15};	
}

function RunPanelmain_Offline() {
	out = "<span style='font-size:16pt'>This App is Available Offline</span><br>What Does this Mean?<br><br>If your device is not connected to the Internet, you can still open Gltn in your browser. Of course, not every feature will be available such as the Dictionary and the Gltn Store, but you will be able to edit and build documents like always.<br><br><span style='font-weight:bold;font-size:10pt;color:#ff9900'>"+window.appcachestatus+"</span>";
	postPanelOutput(out);
}
window.applicationCache.oncached = appcache();
window.applicationCache.onupdateready = onUpdateReady();
window.applicationCache.onprogress = function(e) {
    // The event object should be a progress event (like those used by XHR2)
    // that allows us to compute a completion percentage, but if not,
    // we keep count of how many times we've been called.
    var progress = "";
    if (e && e.lengthComputable) // Progress event: compute percentage
        progress = " " + Math.round(100*e.loaded/e.total) + "%"
    else                         // Otherwise report # of times called
        progress = " (" + ++progresscount + ")"
	initService("main_Offline", "App caching", "<span class='fa fa-plane'></span>"+progress);
	window.appcachestatus = "Found new version - Refresh to update";
    postNotification("appcache", "A new version of the app was downloaded. Click to update.", "window.location.reload()");
    return false;
};
/*** Still Important Div Cursor Restore

-Thanks to Rangy ***/
var savedSel = null;
var savedSelActiveElement = null;

function saveSelection() {
	// Remove markers for previously saved selection
	if (savedSel) {
		rangy.removeMarkers(savedSel);
	}
	savedSel = rangy.saveSelection();
	savedSelActiveElement = document.activeElement;
	//gEBI("restoreButton").disabled = false;
//	console.log($('.content_textarea').html());
}

function restoreSelection() {
	if (savedSel != null) {
		rangy.restoreSelection(savedSel, true);
		savedSel = null;
		//gEBI("restoreButton").disabled = true;
		window.setTimeout(function() {
			if (savedSelActiveElement && typeof savedSelActiveElement.focus != "undefined") {
				savedSelActiveElement.focus();
			}
			//saveSelection();
//			console.log($('.content_textarea').html());
		}, 1);
	}
}
/* Takes a percent and converts it to the nearest column value in a 12-column system */
function columnCount(p, trunc) {
    var a = 100/12;
    var b = p/a;
    if(trunc == true)
        return Math.floor(b);
    else
        return Math.round(b);
}
 
function getloader() {
    return "<div style='text-align:center; width:100%;' class='spin'></div>";  
}
function spinloader(inline) {
    if(inline)
        $('.spin').spin({ color: theme.coloralt, shadow: false, lines: 7, length:4, width:2, radius:2, corners:1, trail:68, speed:1.6}).css('width','').css('height','').css('display','inline').css('margin-left','-20px');   
    else
        $('.spin').spin({ color: theme.coloralt, shadow: false, lines: 7, length:30, width:6, radius:21, corners:1, trail:68, speed:1.6});     
}
