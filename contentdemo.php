<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>HTML</title>
<script src="C:\Users\N\Documents\GitHub\Gluten_2\rangy-1.3alpha.772\rangy-core.js"></script>
<script src="C:\Users\N\Documents\GitHub\Gluten_2\rangy-1.3alpha.772\rangy-cssclassapplier.js"></script>
<script src="C:\Users\N\Documents\GitHub\Gluten_2\rangy-1.3alpha.772\rangy-textrange.js"></script>
</head>

<body>
<!--<table><tr><td>AutoQuote&emsp;</td><td>Quote To Cite&emsp;</td><td>Define/Wiki</td></tr></table>-->
<div contenteditable="true" class="content_textarea" style="margin-left:5em;width:20em;border:solid 3px #444;height:20em;">
	Here is a <i>bunch</i> of text.
</div>
<div id="data" style="font-size:10pt"></div>
<button onclick="alert(getRange().collapsed)">Is Collapsed?</button>
<button onclick="rangy.getSelection().collapseToStart()">Collapse Range</button>
<button onclick="alert(rangy.getSelection().toHtml())">Return HTML</button>
<button onclick="alert(rangy.getSelection().getRangeAt(0))">Return Text Only</button>
<button onclick="surroundRange()">Add Citation</button>
<button onclick="toggleItalics()">Toggle Italics</button>
<button onclick="appendQuote();">Add Quote</button>
<input type="text" placeholder="Search Terms - No REGEX yet." id="searching">
<br>
<button onclick="moveCarat('word', -1)">Really Move Left</button>
<button onclick="moveCarat('character', -1)">Move Left</button>
<button onclick="moveCarat('character', 1)">Move Right</button>
<button onclick="moveCarat('word', 1)">Really Move Right</button>


<script>
//RANGY OBJECTS DO NOT UPDATE WHEN THE DOM CHANGES -> CREATE NEW OBJECT IF SOMETHING 
range = null;
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
			 
			 //Set up selection parameters
			 document.getElementsByClassName("content_textarea")[0].onmouseup = function() {
                    rangy.getSelection().expand("word", {
                    wordOptions: {
                        includeTrailingSpace: true,
						wordRegex: /[a-z0-9]+(['\-][a-z0-9]+)*/gi
					}
                });
			}
}

function getRange() {
		//gets first range
		var sel = rangy.getSelection();
		return sel.rangeCount ? sel.getRangeAt(0) : null;
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
	surroundCitation.toggleSelection();
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


setInterval("displayData();", 100);
</script>

<style>
	.citation {
		text-decoration: none;
		border-bottom: solid 1px #0CF;
	}	
	.searchResult {
		font-weight: bold;
		background-color: yellow;
		border: solid 1px #dd6;
		padding-left: 2px;
		padding-right: 2px;
	}	
</style>


</body>
</html>
