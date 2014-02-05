<head>
<script src="rangy-1.3alpha.772\rangy-core.js"></script>
<script type="text/javascript" src="rangy-1.3alpha.772\uncompressed\rangy-selectionsaverestore.js"></script>
</head>
<div id="area" style="width:300px;height:300px;border:solid 1px black;" contentEditable="true"></div><br>
Using Rangy this time<br>
<button id='saveButton'>save</button>
<button id='restoreButton'>restore</button>
<button id='change' onclick='change()'>change</button>
<script type="text/javascript">
var a = 0;
function change() {
	document.getElementById('area').innerHTML = document.getElementById('area').innerHTML.replace(/h/g, '<b>'+a+'</b>');
	a++;
}
function gEBI(id) {
            return document.getElementById(id);
        }

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
	//console.log($('.content_textarea').html());
}

function restoreSelection() {
	if (savedSel) {
		rangy.restoreSelection(savedSel, true);
		savedSel = null;
		//gEBI("restoreButton").disabled = true;
		window.setTimeout(function() {
			if (savedSelActiveElement && typeof savedSelActiveElement.focus != "undefined") {
				savedSelActiveElement.focus();
			}
			//saveSelection();
			//console.log($('.content_textarea').html());
		}, 1);
	}
}
        window.onload = function() {
            // Turn multiple selections on in IE
            try {
                document.execCommand("MultipleSelection", null, true);
            } catch(ex) {}

            rangy.init();

           // Enable buttons
            var saveRestoreModule = rangy.modules.SaveRestore;
            if (rangy.supported && saveRestoreModule && saveRestoreModule.supported) {
                var saveButton = gEBI("saveButton");
                saveButton.disabled = false;
                saveButton.ontouchstart = saveButton.onmousedown = function() {
                    saveSelection();
                    return false;
                };

                var restoreButton = gEBI("restoreButton");
                restoreButton.ontouchstart = restoreButton.onmousedown = function() {
                    restoreSelection();
                    return false;
                };

                // Display the control range element in IE
                if (rangy.features.implementsControlRange) {
                    gEBI("controlRange").style.display = "block";
                }
            }
        }
</script>
<div style='visibility:hidden'>
<!--<span class="context" [^>]*>(.*)</span>-->
<!--$1-->
The <span class="context" data-i="1">student body and<span id="selectionBoundary_1390071990944_5053574771154672" class="rangySelectionBoundary" style="line-height: 0; display: none;">﻿</span></span>&nbsp;  

The student<span id="selectionBoundary_1390071989740_8191308123059571" class="rangySelectionBoundary" style="line-height: 0; display: none;">﻿</span>&nbsp;


The hot and comforting&nbsp;<span class="context" data-i="13">student body</span> and I felt that the <span class="context" data-i="11"><span class="context" data-i="12"><span class="context" data-i="13">student body</span></span> was very &nbsp;&nbsp;</span>
</div>