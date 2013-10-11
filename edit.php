<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Editing Document</title>
<link rel="stylesheet" type="text/css" href="standard.css">

<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>

<script src="format.js"></script>
<script src="panels.js"></script>
<script src="popup.js"></script>
<script src="file.js"></script>
<script src="build.js"></script>

<script src="apa.js"></script>

<script src="C:\Users\N\Documents\GitHub\Gluten_2\rangy-1.3alpha.772\rangy-core.js"></script>
<script src="C:\Users\N\Documents\GitHub\Gluten_2\rangy-1.3alpha.772\rangy-cssclassapplier.js"></script>
<script src="C:\Users\N\Documents\GitHub\Gluten_2\rangy-1.3alpha.772\rangy-textrange.js"></script>
</head>
<body>

<div class="header">

</div>

<div class="body">
	<table style="width:100%"><tr><td id="panel_content" class="panel">
        <div>
            <i>What Kind of Document do You Want to Create?</i><br>
            Format:<input type="text" id="file_format" list="gluten_formats">&emsp;&emsp;Language:<input id="file_language" list="gluten_languages" value="English (US)"><br>
            Tags:<input id="file_tags" placeholder="Space Separated Tags">
            
            <div id="file_metadata">
            
            </div>
            <div class="content_buttons" style="display:block"> 
                <button onclick="alert(getRange().collapsed)">Is Collapsed?</button>
                <button onclick="rangy.getSelection().collapseToStart()">Collapse Range</button>
                <button onclick="alert(rangy.getSelection().toHtml())">Return HTML</button>
                <button onclick="alert(rangy.getSelection().getRangeAt(0))">Return Text Only</button>
                <button onclick="initiateCitationEditor()">Add Citation</button>
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
                <button onclick="runPanel('main_Citation')">Citation Panel</button>
                <button onclick="runPanel('main_Idea')">Idea Panel</button>
                <button onclick="startBuild()">Build Paper</button>
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
<div class="build">

</div>
<div class="build_progress">

</div>

<div class="popup " style="display:none">
  
</div>

<div class="hovertag">

</div>

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
		
		range.insertNode(document.createTextNode('"'));
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
			width:"100.2%",
			height:"100.2%",
			fontSize:"14pt",
			paddingLeft:"20px",
			paddingRight:"30px",
			paddingTop:"15px"
		});
}
function normalscreen() {
	window.fullscreenOn = false;	
	$('.content_textarea').css('z-index', 0).css('position', 'inherit');
		$('.content_textarea').animate({
			width: $('.toolbar').width(),
			fontSize:"12pt",
			paddingLeft:"0px",
			paddingRight:"0px",
			paddingTop:"0px"
		});
}
</script>

</body>
</html>
