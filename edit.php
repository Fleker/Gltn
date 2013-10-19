<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Editing Document</title>
<link rel="stylesheet" type="text/css" href="standard.css">
<link rel="stylesheet" type="text/css" href="IntroJS/introjs.min.css">

<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
<script src="http://code.jquery.com/color/jquery.color-2.1.2.min.js"></script>

<script src="format.js"></script>
<script src="panels.js"></script>
<script src="popup.js"></script>
<script src="file.js"></script>
<script src="build.js"></script>

<script src="apa.js"></script>

<script src="rangy-1.3alpha.772\rangy-core.js"></script>
<script src="rangy-1.3alpha.772\rangy-cssclassapplier.js"></script>
<script src="rangy-1.3alpha.772\rangy-textrange.js"></script>
<script src="IntroJS/intro.js"></script>
</head>
<body>

<div class="header" style="text-align:center">
<font size="4" id="temp_header" >Welcome to Gluten!</font><br>
<button onclick="introJsStart()">Start the Tour!</button> 
</div>

<div class="body">
	<table style="width:100%"><tr><td id="panel_content" class="panel">
        <div>
            <i>What Kind of Document do You Want to Create?</i><br>
            Format:<input type="text" id="file_format" list="gluten_formats" value="APA">&emsp;&emsp;Language:<input id="file_language" list="gluten_languages" value="English (US)"><br>
            Tags:<input id="file_tags" placeholder="Space Separated Tags">
            
            <div id="file_metadata">
            
            </div>
            <div class="content_buttons" style="display:block"> 
                <button onclick="alert(getRange().collapsed)">Is Collapsed?</button>
                <button onclick="rangy.getSelection().collapseToStart()">Collapse Range</button>
                <button onclick="alert(rangy.getSelection().toHtml())">Return HTML</button>
                <button onclick="alert(rangy.getSelection().getRangeAt(0))">Return Text Only</button>
                <button onclick="initiateCitationEditor();" data-step="8" id="ADDCITATIONBUTTON">Add Citation</button>
                <button onclick="toggleItalics()">Toggle Italics</button>
                <button onclick="appendQuote();">Add Quote</button>
                <input type="text" placeholder="Search Terms - No REGEX yet." id="searching">
                <br>
                <button onclick="moveCarat('word', -1)">Really Move Left</button>
                <button onclick="moveCarat('character', -1)">Move Left</button>
                <button onclick="moveCarat('character', 1)">Move Right</button>
                <button onclick="moveCarat('word', 1)">Really Move Right</button>
                <br>
                <b>Do More Actions:<Br>
                <button onclick="runPanel('main_Citation')" id="CITATIONPANEL">Citation Panel</button>
                <button onclick="runPanel('main_Idea')" id="IDEAPANEL">Idea Panel</button>
                <button onclick="startBuild();setTimeout('exitintro();', 1000);" id="BUILDBUTTON">Build Paper</button>
           </div>
        </div>
      </td>
      
      <td id="panel_plugin" class="panel">  
      	<div class="panel_plugin_title"></div>
        <div class="panel_plugin_content">
    
        </div>
      </td>
        
      <td id="panel_research" class="panel">
        <div>
            <div id="panel_research_bar">
            	<div id="panel_research_tabs"></div>
                <input id="panel_research_url" placeholder="Enter a URL or Search Term">
                <button id="panel_research_go">￫</button>
                <button id="panel_research_main">MAIN</button>
                <button id="panel_research_save">SAVE</button>
                <button id="panel_research_note">NOTE</button>
            </div>
            <div id="panel_research_view">
            
            </div>
        </div>
      </td>
     </tr></table>
</div>
<div class="build" id="build">

</div>
<div class="build_progress">

</div>
<div class="draft">
<!--This section will be a place between the original content and the final build where HTML tags will still exist-->
</div>
<div class="scale">
<!--This section is used for "Build". It uses pixels to see how high the paper is in inches using this scale-->
LOREM IPS/um o
</div>

<div class="popup " style="display:none">
  
</div>

<div class="hovertag">

</div>
<div class="fullscreenui" style="display:none; opacity:.1" onMouseOver="$('.fullscreenui').css('background-color', '#ccc').css('opacity',1)" onMouseOut="$('.fullscreenui').css('background-color', 'white').css('opacity', window.fsuo);"><div class="fullscreenexit" onclick="normalscreen()"><br>X<br><br><br></div><div class="fullscreennight" onclick="nightscreen()"><br>-O-<br><br><br></div> <div class="fullscreencount"></div></div>

<div class="footer">

</div>

<datalist id="gluten_formats"></datalist>

<datalist id="gluten_languages"></datalist>

<script>
	function new_gluten_formats() {
		//In the future, arrange a way to programitically grab all values.
		formats = [{name: "APA", type: "Essay"}, {name: "MLA", "type": "Essay"}];	
		
		//Now, let's put them into an HTML based format.
		var out = "";
		for(i=0;i<formats.length;i++) {
			out = out + "<option label='"+formats[i].type+"'>"+formats[i].name+"</option>";	
		}
		
		//Now output
		$('#gluten_formats').html(out);
	}
	
	function new_gluten_languages() {
		window.langs = [{name: "English (US)", code: "en_us"}, {name: "Spanish", code: "es"}];
		
		var out = "";
		for(i=0;i<langs.length;i++) {
			out = out + "<option label='"+langs[i].code+"'>"+langs[i].name+"</option>";	
		}	
		
		$('#gluten_languages').html(out);
	}
	
	//Now call these functions when the system sets up:
	new_gluten_formats();
	new_gluten_languages();
	
	onInitFormat();
	
	
	
	
	
	/*** RANGY ***/
	//RANGY OBJECTS DO NOT UPDATE WHEN THE DOM CHANGES -> CREATE NEW OBJECT IF SOMETHING 
range = null;
function debug_buttons() {
	$('.content_buttons').toggle(500);	
}
window.onload = function() {
            rangy.init();
			range = rangy.createRange();
			cssClassApplierModule = rangy.modules.CssClassApplier;
			initFind();
			textFound = 0;
			
			surroundCitation = rangy.createCssClassApplier("citation", {
                    elementTagName: "i",
                    elementProperties: {
                    	//id: "citation"+0,						
                    }
             });
			 surroundItalics = rangy.createCssClassApplier("", {
                    elementTagName: "i",
                    elementProperties: {
                    	//id: "citation"+0,						
                    }
             });
			 
			 //Set up selection parameters
			 document.getElementsByClassName("content_textarea")[0].onmouseup = function() {
				 	if($('.content_textarea').html().length > 1) {				 
						rangy.getSelection().expand("word", {
						wordOptions: {
							includeTrailingSpace: false,
							wordRegex: /[a-z0-9]+(['\-][a-z0-9]+)*/gi
						}
                		});
					}
					postRange('click and select');
			}
			document.getElementsByClassName("content_textarea")[0].oninput = function() {
				postRange('oninput');
			}	
			document.getElementsByClassName("content_textarea")[0].onkeyup = function() {
				postRange('onkeyup');
			}	
}

content_textarea_var = null;
function postRange(origin) {
	var sel = rangy.getSelection();
	//console.warn(origin);
	content_textarea_var = sel.rangeCount ? sel.getRangeAt(0) : null;	
	return sel.rangeCount ? sel.getRangeAt(0) : null;	
}
function getRange() {
		//gets first range
		if(content_textarea_var) {
			//console.warn('gr-0');
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

function initiateCitationEditor(q, hovertag, h2) {
			//q = '"';
			if(q == undefined)
				q = '';
            //var range = rangy.getSelection();
			var range = getRange();
			citei = citationi;
			citeid = citation.length+1;
			window.citationrestore = false;
			if(range.toHtml().length == 0 && hovertag == undefined) {
				citationi++;
				//Add quote and citation stuff
				contentAddText('  ');
				contentAddSpan({class: 'citation', id:'citation'+citei, node:'span', leading_quote:(q.length>0)});
				//contentAddSpan({node:'span'});
			}
			else if(hovertag >= 0 /*citation is selected OR hovertag click - hovertag is the citei*/) {
				citei = hovertag;
				citeid = $('#citation'+hovertag).attr('data-id');
				window.citationrestore = true;
			}
			else if(hovertag == -1 && h2) {
				citei = -1;
				citeid = h2;
				window.citationrestore = true;	
			}
            else { //if you're selecting a bunch of text
				citationi++;
                var el = document.createElement("span");
                el.className = "citation";
				el.setAttribute("id", "citation"+citei);
				citationi++;
				
				el.setAttribute("data-id", citeid);
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
			
			window.citetypes = new Array({val: 'Article Online', format:'online'},{val:'Book', format:'print'}, {val:'Book - Online', format:'ebook'}, {val:'Play', format:'theater'}, {val:'Musical', format:'theater'}, /*{val:'eBook', format:'digital book'}, */{val:'Blog', format:'online'}, {val:'Image - Online', format:'eimage'},{val:'Photo - Online', format:'eimage'});
			var today =  new Date();
			today = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			new Array('Article Online', 'Book - Print', 'Book - Online', 'Book - eBook Reader', 'Book - Database', 'Dictionary', 'eBook', 'Encyclopedia', 'Musical', 'Online Article', 'Newspaper', 'Play', 'Podcast', 'Website - Blog', 'Website - Book','Website - Image');
			out = 'What do you want to cite?<br><input class="citelist" type="text" list="citelist" id="citationEditorIType">';
			out = out + '<datalist id="citelist">'
			for(i in citetypes) {
				out = out + '<option value="'+citetypes[i].val+'" label="'+citetypes[i].format+'">';
			}
			var ht = out+"</datalist>";
			
			ht = ht + "<div class='citationEditorTitle citationInput'><input type='text' placeholder='Title of the work' list='citetitlelist' style='width: 30em' id='citationEditorITitle'></div>";
			ht = ht + "<div class='citationEditorDescription citationInput'><input type='text' style='width:35em' placeholder='If no official title, please describe' id='citationEditorIDescription'></div>";
			ht = ht + "<div class='citationEditorPlay citationInput'>Act: <input id='citationEditorIAct' style='width:4em'>&nbsp;Scene:<input type='citationEditorIScene' style='width:4em'>&nbsp;Line(s): <input id='citationEditorILines' style='width:10em'></div>";
			ht = ht + "<div class='citationEditorBookpub citationInput'><input type='text' placeholder='Page #' style='width:4em' id='citationEditorIPage'>&nbsp;<input placeholder='Volume' style='width:5em' id='citationEditorIVolume'>&nbsp;<input type='text' placeholder='Edition' style='width:6em' id='citationEditorIEdition'>&nbsp;<input type='text' placeholder='Series' id='citationEditorISeries'>Main Title?<input type='checkbox' id='citationEditorIMain' value='off'></div>";
			ht = ht + "<div class='citationEditorAuthor citationInput'>Author: <input placeholder='First' id='citationEditorIAuthorFirst'>&nbsp;<input placeholder='M' style='width:2em' id='citationEditorIAuthorMiddle'>&nbsp;<input placeholder='Last' id='citationEditorIAuthorLast'></div>";
			ht = ht + "<div class='citationEditorPublication citationInput'>Publication: <input placeholder='Publisher' id='citationEditorIPublisher'>&nbsp;<input placeholder='City' id='citationEditorICity'>&nbsp;<input placeholder='Year' style='width:4em' id='citationEditorIYear'></div>";
			ht = ht + "<div class='citationEditorWebsite citationInput'> Website:<input placeholder='Website Title' id='citationEditorIWebsite'>&nbsp;<input placeholder='Website Publisher' id='citationEditorIWebPublisher'><br>&emsp;&emsp;<input type='url' placeholder='URL' id='citationEditorIUrl'></div>";
			ht = ht + "<div class='citationEditorPubdate citationInput'> Published On: <input type='date' id='citationEditorIPubdate'></div>";
			ht = ht + "<div class='citationEditorAccdate citationInput'> Accessed On: &nbsp;<input type='date' id='citationEditorIAccdate'></div>";
			ht = ht + "<div class='citationEditorDatabase citationInput'> Database:<input placeholder='Database Name' id='citationEditorIDatabse'>&nbsp;<input type='URL' placeholder='url' style='width:30em' id='citationEdtiorIDbUrl'></div>";
			ht = ht + "<div class='citationEditorMedium citationInput'> <input placeholder='Medium' id='citationEditorIMedium'></div>";
			ht = ht + "<div class='citationEditorAbstract citationInput'>Type a summary of this work and how you used it in writing your document.<br><textarea id='citationEditorIAbstract'></textarea></div>";
			ht = ht + "<button style='' id='citationEditorSave'>Save</button>";
		
		var fnc = function x() {
			$('#citationEditorIType').on('input', function() {
				//console.log('!');
				citationReformat();
			});
			$('#citationEditorSave').on('click', function() {
				citationSave();
			});
			function citationReformat() {
				for(i=0;i<citetypes.length;i++) {
					//console.log('-'+citetypes[i].val);
					if(citetypes[i].val == $('#citationEditorIType').val()) {
						//console.log('--'+citetypes[i].format);
						introJsStart(10);
						switch(citetypes[i].format) {
							case 'online':
								citationShow('Title Author Website Pubdate Accdate');
							break;
							case 'print':
								citationShow('Title Author Bookpub Publication');
							break;
							case 'ebook':
								citationShow('Title Author Bookpub Publication Website Pubdate Accdate');
							break;	
							case 'digital book':
								citationShow('Title Author Bookpub Publication Medium');
							break;
							case 'theater':
								citationShow('Title Play Author Publication');
							break;
							case 'eimage':
								citationShow('Title Description Author Website Pubdate Accdate');
							case 'raw data':
								//IDK
								citationShow('Description');
							break;
						}
						return;
					}
				}
			}
			function citationShow(str) {
				stra = str.split(' ');
				$('.citationInput').css('display','none');
				//console.log('---'+stra.length);
				//console.log(stra);
				for(i in stra) {
					$('.citationEditor'+stra[i]).css('display', 'block');	
				}
				//if abstracts for citations are turned on,
				//$('.citationEditorAbstract').css('display', 'block');
			}
			var citeAttributes = new Array('Type', 'Title','Description','Page','Volume','Edition','Main','AuthorFirst','AuthorMiddle','AuthorLast','Publisher','City','Year','Website','WebPublisher','Url','Pubdate','Accdate','Database','DbUrl','Medium','Abstract');	
			function citationSave() {
				citation[citeid] = {};
				for(i in citeAttributes) {
					//get attributes cattr= $('#citationEditorI'+citeAttributes[i]);
					var cattr = $('#citationEditorI'+citeAttributes[i]).val();
					//console.log('#citationEditorI'+citeAttributes[i], cattr);
					
					//save attributes to citation[id][citeAttributes[i]]
					//TODO - ,'Act','Scene','Lines'
					
					if(citeAttributes[i] == 'Page')
						$('#citation'+citei).attr('data-page', cattr);
					else if(cattr != undefined)
						citation[citeid][citeAttributes[i]] = cattr;
					else	
						citation[citeid][citeAttributes[i]] = "";
					
					
					//citation[citeid]['type'] = $('#citationEditorIType');	
				}
				$('#citation'+citei).attr('data-id', citeid);
				$('#citation'+citei).attr('data-i', citei);
				citationHovertag();
				closePopup();
				introJsStart(12);
			}
			function citationRestore() {
				for(i in citeAttributes) {
					
					//Support for theater
					if(citeAttributes[i] == 'Page')
						$('#citationEditorIPage').val($('#citation'+0).attr('data-page'));
					else {
						//get attribute citation[id][citeAttributes[i]]
						//store in $('#citationEditorI'+citeAttributes[i]).val(citation[id][citeAttributes[i]]);
						$('#citationEditorI'+citeAttributes[i]).val(citation[citeid][citeAttributes[i]]);	
					}
					citationReformat();	
				}
			}
			//Do this last
			if(window.citationrestore == true) {
				citationRestore();
			}
		};
	
			initiatePopup({title: "Citations", border: "#09f", ht: ht, fnc: fnc});
}

function citationHovertag() {
	/*$('.citation').off('hover');
	$('.citation').on('hover', function() {
		alert(5);
		displayHovertag(citation[$(this).attr('data-id')].title, {ypos: $(this).offset().top});
	}, function() {
		alert(4);
		hideHovertag();
	});*/
	$('.citation').off('mouseenter');
	$('.citation').off('mouseleave');
	
	$('.citation').on('mouseenter', function() {
		displayHovertag(citation[$(this).attr('data-id')].Title, {ypos: $(this).offset().top}, "initiateCitationEditor(undefined,"+$(this).attr('data-i')+")");
	});
	$('.citation').on('mouseleave', function() {
		//hideHovertag();
	});
}

function toggleItalics() {
	//instead of using the surroundContents function, this will use the CSS Toggle function. This function will allow an individual to remove an element just as easily as applying one.	
	surroundItalics.toggleSelection();
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
		
	}
}
function contentAddSpan(t) {
	var range = getRange();
	if (range) {
		/*var el = document.createElement("span");
		el.appendChild(document.createTextNode("**INSERTED NODE**"));*/
		var el = document.createElement(t.node);
		el.className = t.class;
		el.setAttribute("id", t.id);
		if(!t.leading_quote)
			el.textContent = '" ';
		/*else if(t.leading_quote)
			el.textContent = ' "';*/
		//<span class="citation" id="citation"0>"&nbsp;"</span>&nbsp;
		//el = el+document.createTextNode('&nbsp');
		
		//Because both quotes must be the ending and closing of a citation, we must add to the text content.anchor(
		el.textContent += ' "  ';
			//range.insertNode(document.createTextNode('"'));
		range.insertNode(el);
		
		/*var range = getRange();
		*/
		
		rangy.getSelection().setSingleRange(range);
		//Move forward one to keep typing.
		moveCarat("character", -2);
		
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
			var searchBox = document.getElementById("searching");
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
			var searchTerm = searchBox.value;
			
			if (searchTerm !== "") {
				if (false /*regexCheckBox.checked*/) {
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

		searchBox.oninput = function() {
			if (searchBox.onpropertychange) {
				searchBox.onpropertychange = null;
			}
			scheduleSearch();
		};

		/*regexCheckBox.onclick = scheduleSearch;
		caseSensitiveCheckBox.onclick = scheduleSearch;
		wholeWordsOnlyCheckBox.onclick = scheduleSearch;*/
	}
}

function moveCarat(length, delta) {
	rangy.getSelection().move(length, delta);
    return false;
}


/*** HOVERTAG ***/
//Get position of mouse with relation to scroll
mousex = 0;
mousey = 0;
$( document ).on( "mousemove", function( event ) {
  mousex = event.pageX;
  mousey = event.pageY;
});
function mouseX() {
	return mousex-scrollX;
}
function mouseY() {
	return mousey-scrollY;
}
function displayHovertag(text, data, fnc) {
	ypos = data.ypos;
	if(data.ypos == undefined) 
		ypos = mouseY()-scrollY;
	else
		ypos = ypos - scrollY;
	if(text == undefined)
		text = "object";
		
	if(mousex-($('.hovertag').width()/2) < 0)
		xpos = 0;
	else
		xpos = mousex-($('.hovertag').width()/2);
	$('.hovertag').css('left', xpos).css('top', ypos+20).css('opacity', 0).animate({
		opacity: 1}, 100, function() {
			$('.hovertag').html(text);	
		});
	$('.hovertag').off('click');
	if(fnc != undefined) {
		$('.hovertag').on('click', function() {
			eval(fnc);
		});
		console.warn(fnc);
		$('.hovertag').css('cursor', 'pointer');
	} else {
		$('.hovertag').css('cursor', 'initial');
	}
				
}
function hideHovertag() {
	$('.hovertag').animate({
		opacity: 0}, 100, function(data) {
		$('.hovertag').css('left', '110%').css('top', '110%');	
	});
}
function fullscreen() {
	window.fullscreenOn = true;	
	$('.content_textarea').css('z-index', 3).css('position', 'fixed');
		$('.content_textarea').animate({
			top: "-.1%",
			left:"-.1%",
			width:"95%",
			width:"calc(100.2% - 50px)",
			height:"100.2%",
			fontSize:"16pt",
			paddingLeft:"50px",
			paddingRight:"30px",
			paddingTop:"35px",
			lineHeight:"1.5em"
		},300);
	$('.fullscreenui').fadeIn(500);
	setTimeout("$('.fullscreenui').css('opacity','.1')", 510);
	window.fsuo = 0.1;
}
function normalscreen() {
	window.fullscreenOn = false;	
	$('.content_textarea').css('z-index', 0).css('position', 'inherit');
		$('.content_textarea').animate({
			width: $('.toolbar').width(),
			fontSize:"12pt",
			paddingLeft:"0px",
			paddingRight:"0px",
			paddingTop:"0px",
			lineHeight:"1em"
		},300);
		nightscreen(1);
		$('.fullscreenui').fadeOut(100);
}
function nightscreen(option) {
	if($('.content_textarea').css('background-color') == "rgb(0, 0, 0)" || option == 1) {
		//Return to white
		jQuery('.content_textarea').animate({
			backgroundColor: "rgba(255,255,255)",
			color: "rgba(0,0,0)"
		},2000);
		$('.fullscreenui').animate({
			opacity: 0.1
		},100);
		fsuo = .1;
	} else {
		jQuery('.content_textarea').animate({
			backgroundColor: "rgba(0,0,0)",
			color: "rgba(200,200,200)"
		},2000);
		$('.fullscreenui').animate({
			opacity:0.02
		},100);
		fsuo = 0.02;
	}
}

//INTRO JS
//setInterval('introJs().refresh();', 10);
/*function reintro() {  
	//console.log('ping');
  $('#format_item_0').attr('data-step', 4);
	$('#format_item_0').attr('data-intro', );
	$('#format_item_1').attr('data-step', 5);
	$('#format_item_1').attr('data-intro', );
	//See counter
	$('#format_item_1').attr('data-position', 'top');
	$('#format_item_2').attr('data-step', 6);
	$('#format_item_2').attr('data-intro', );
	$('.content_textarea').attr('data-step', 7);
	$('.content_textarea').attr('data-intro', 'This is the main part of your paper. Here you can write your content and add rich formatting.');
	
	$('#citationEditorITitle').attr('data-step', 10).attr('data-intro', 'You can enter the source title, author, and plenty of other stuff.');
	$('#citation0').attr('data-step', 13);
	$('#citation0').attr('data-intro', "Now the citation appears in your essay. Hovering over it tells you the title of the source, and clicking on that hover sends you back to the editor. What if you want to see all your sources?");
	$('#citationEditorIAuthorLast').attr('data-step',11).attr('data-intro', 'Type Smith here. Then we can save this source.');
	$('#citationEditorSave').attr('data-step', 12).attr('data-intro', 'After you type the data, click save.');
};
setInterval("reintro()", 100);
*/
function introJsStart(id) {
	if(id == undefined)
		id = 1;
var intro = introJs();
intro.setOptions({steps: [{element: '#temp_header', intro: "Welcome to the Project Gluten. I hope that you are impressed from the work that has been done so far. There's a lot more to go, but there's a lot of potential here already for a great service.<br><br>-Nick Felker"}, {element:'#file_format', intro:"In this demo, we'll be using the APA format. Do you know how to use this format in a paper? The bigger question is, do you <i>need</i> to know how to use this format. Gluten lets the user focus on the art of writing, and formats the paper behind the scenes. How? Let's take a closer look."},{element:'#file_language', intro:"Near the top of the page, you see a bunch of input boxes. You can alter the contents for each box."},{element:'#format_item_0', intro:"The types of input are based on the format. In APA format, the 'Running Head' is a title that displays in the header."},{element:'#format_item_1', intro:"Well, did you try typing in a title? Why not? The format can set a min and/or a max number of characters/words. See the counter below? The title should not be more than 12 words."},{element:'#format_item_2', intro:"Do you see how the word count above changed? If over or under the set limit, the user is alerted. Go back and check it out."},{element:document.querySelectorAll('.content_textarea')[0],intro:'This is the main part of your paper. Here you can write your content and add rich formatting.'},  {element:"#ADDCITATIONBUTTON", intro:"You can add a citation to your paper as easily as clicking this button. What are you waiting for?", position:"top"},  {element:"#citationEditorIType", intro:"This popup appears giving you the option to cite a variety of different sources. Choose one. (Click 'Skip')"},  {element:'#citationEditorITitle', intro:'You can enter the source title, author, and plenty of other stuff.'},  {element:'#citationEditorIAuthorLast', intro:'Type Smith here. Then we can save this source. (Click "Skip")'},  {element:'#citation0',intro:"Now the citation appears in your essay. Hovering over it tells you the title of the source, and clicking on that hover sends you back to the editor. What if you want to see all your sources?"},  {element:'#CITATIONPANEL', intro:"Panels are a way for 3rd party developers to improve the functionality of the editor. The panel framework is documented on GitHub. Let's check it out.", position:"top"},  {element:'#CITATIONPANEL', intro:'All your citations will be listed in this panel. You can edit them by clicking on the one you want.', position:"top"},  {element:'#IDEAPANEL', intro:"Click on me next!", position:"top"},  {element:'#IDEAPANEL', intro:'What if you are taking notes for your paper? It is easy with the Ideas Panel. Write general notes or for each source you have. The panel scrolls with you, so you can take a look at notes while you write.', position:"top"},  {element:'#BUILDBUTTON', intro:"After adding all of this rich information, you will need to 'build' the paper. This is when the software puts everything together.", position:"top"}]});
if(window.introdisabled != false)
	intro.goToStep(id).start();
}
function exitintro() {
	introJs().exit();	
	alert("There you go, one perfectly formatted paper. Wasn't that easy? In fact, it was very simple to do, and it didn't require memorizing a computer language or formatting rules. There's a lot of things the human mind is good at; automation isn't one of them. Save you time for, you know, actually *writing* your paper.\n\nThis project is open source, so check it out on GitHub and contribute if you want. It is easy to develop a panel or add a small feature.\n\nI hope that this project is exciting, and that you'll use it once it is available.\n-Nick Felker");
}

//{element:'#CHARACTERPANEL', intro:'Another useful panel is the character palette.'},  {element:'#CHARACTERPANELCHARACTERS', intro:'This lists all the special characters that you can insert into your document. After clicking on the one you want, the keyboard switches focus so you can keep typing without having to reposition your mouse. Try it. It is really useful.' },  {element:'#popup_character_search', intro:"Can you find the character you want? You can easily find it using the searchbar."},  
//{element:'#build', intro:"There you go, one perfectly formatted paper. Wasn't that easy? In fact, it was very simple to do, and it didn't require memorizing a computer language or formatting rules. There's a lot of things the human mind is good at; automation isn't one of them. Save you time for, you know, actually <i>writing</i> your paper.<br><br>This project is open source, so check it out on GitHub and contribute if you want. It is easy to develop a panel or add a small feature.<br><br>I hope that this project is exciting, and that you'll use it once it is available.<br>-Nick Felker", position:"top"}
</script>

</body>
</html>
