<head>
<script type="text/javascript" src="http://rangy.googlecode.com/svn/trunk/currentrelease/rangy-core.js"></script>
<script type="text/javascript" src="rangy-1.3alpha.772\uncompressed\rangy-selectionsaverestore.js"></script>
</head>
<div id="area" style="width:300px;height:300px;border:solid 1px black;" contentEditable="true" onkeydown="saveSelection();"></div><br>
Using Rangy this time<br>
<button id='saveButton'>save</button>
<button id='restoreButton'>restore</button>
<button id='change' onclick='change()'>change</button>
<script type="text/javascript">
var a = 0;
function change() {
	document.getElementById('area').innerHTML = document.getElementById('area').innerHTML.replace(/h/g, a);
	a++;
}
function gEBI(id) {
            return document.getElementById(id);
        }

        var savedSel = null;
        var savedSelActiveElement = null;

        function saveSelection() {
			console.log(1);
            // Remove markers for previously saved selection
            if (savedSel) {
                rangy.removeMarkers(savedSel);
            }
            savedSel = rangy.saveSelection();
            savedSelActiveElement = document.activeElement;
            //gEBI("restoreButton").disabled = false;
        }

        function restoreSelection() {
			console.log(savedSel);
            if (savedSel) {
                rangy.restoreSelection(savedSel, true);
                savedSel = null;
                //gEBI("restoreButton").disabled = true;
                window.setTimeout(function() {
                    if (savedSelActiveElement && typeof savedSelActiveElement.focus != "undefined") {
                        savedSelActiveElement.focus();
                    }
					saveSelection();
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