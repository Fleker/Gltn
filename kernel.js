// Misc. stuff from edit.php that shouldn't be in there - clutters up stuff
//In the future, arrange a way to programitically grab all values.
	formats = [{name: "APA", type: "Essay"}, {name: "MLA", "type": "Essay"}, {name:"IEEE", type:"Report"}];	
function new_gluten_formats() {		
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
function install_gluten_format(name, type, uri) {
	formats.push({name: name, type: type, uri: uri});
	new_gluten_formats();
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
			setInterval("update_toolbar_style()", 20);
}

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

function initiateCitationEditor(q, hovertag, h2) {
			//q = '"';
			if(q == undefined)
				q = '';
            //var range = rangy.getSelection();
			var range = getRange();
			citei = citationi;
			citeid = citation.length+1;
			window.citationrestore = false;
			if(range.toHtml().length == 0 && hovertag == undefined && q != "panelonly") {
				citationi++;
				//Add quote and citation stuff
				//contentAddText('  ');
				contentAddSpan({class: 'citation', id:'citation'+citei, node:'span', leading_quote:(q.length>0)});
				contentAddText('  ');
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
			} else if(q == "panelonly") {
				citationi++;	
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
			
			window.citetypes = new Array({val: 'Article - Online', format:'web'},{val:'Book', format:'print'}, {val:'Book - Online', format:'ebook'}, {val:'Play', format:'theater'}, {val:'Musical', format:'theater'}, /*{val:'eBook', format:'digital book'}, */{val:'Blog', format:'web'}, {val:'Image - Online', format:'eimage'},{val:'Photo - Online', format:'eimage'},{val:'Bible', format:'bible'},{val:'Government', format:'government'},{val:'Pamphlet',format:'pamphlet'},{val:'Dissertation',format:'dissertation'},{val:"MA Thesis", format:"dissertation"},{val:"MS Thesis", format:"dissertation"},{val: "Magazine Article", format:"periodical"},{val:"Article - Print", format:"periodical"},{val:"Editorial",format:"periodical"},{val:"Letter to the Editor", format:"periodical"},{val:"Article - Journal", format:'journal'});
			var today =  new Date();
			today = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			new Array('Article Online', 'Book - Print', 'Book - Online', 'Book - eBook Reader', 'Book - Database', 'Dictionary', 'eBook', 'Encyclopedia', 'Musical', 'Online Article', 'Newspaper', 'Play', 'Podcast', 'Website - Blog', 'Website - Book','Website - Image');
			out = 'What do you want to cite?<br><input class="citelist" type="text" list="citelist" id="citationEditorIType">';
			out = out + '<datalist id="citelist">'
			for(i in citetypes) {
				out = out + '<option value="'+citetypes[i].val+'" label="'+citetypes[i].format+'">';
			}
			var ht = out+"</datalist>";
			ht = ht + "<div class='citationEditorDatabase citationInput'> Database:<input placeholder='Database Name' id='citationEditorIDatabse'>&nbsp;<input type='URL' placeholder='url' style='width:30em' id='citationEdtiorIDbUrl'></div>";
			ht = ht + "<div class='citationEditorTitle citationInput'><input type='text' placeholder='Main title of the work' style='width: 30em' id='citationEditorITitle' list='citationAutoTitle'><input type='hidden' id='citationEditorIMediumFormat'></div>";
			ht = ht + "<div class='citationEditorDescription citationInput'><input type='text' style='width:35em' placeholder='Description/Individual Work Title' id='citationEditorIDescription'></div>";
			ht = ht + "<div class='citationEditorPlay citationInput'>Act: <input id='citationEditorIAct' style='width:4em'>&nbsp;Scene:<input id='citationEditorIScene' style='width:4em'>&nbsp;Line(s): <input id='citationEditorILines' style='width:10em'></div>";
			ht = ht + "<div class='citationEditorBookpub citationInput'><input type='text' placeholder='Page #' style='width:4em' id='citationEditorIPage'>&nbsp;<input placeholder='Volume' style='width:5em' id='citationEditorIVolume'>&nbsp;<input type='text' placeholder='Edition' style='width:6em' id='citationEditorIEdition'>&nbsp;<input type='text' placeholder='Series' id='citationEditorISeries'>Referenced author?<input type='checkbox' id='citationEditorIMain' value='off'></div>";
			ht = ht + "<div class='citationEditorAuthor citationInput'>Author: <input placeholder='First' class='citationEditorIAuthorFirst' id='citationEditorIAuthorFirst'>&nbsp;<input placeholder='M' style='width:2em' class='citationEditorIAuthorMiddle'' id='citationEditorIAuthorMiddle'>&nbsp;<input placeholder='Last' class='citationEditorIAuthorLast' id='citationEditorIAuthorLast'><span class='fa fa-plus-circle button' id='citationAddContributor'></span></div>";
			ht = ht + "<div class='citationEditorPublication citationInput'>Publication: <input placeholder='Publisher' id='citationEditorIPublisher'>&nbsp;<input placeholder='City' id='citationEditorICity'>&nbsp;<input placeholder='Year' style='width:4em' id='citationEditorIYear'></div>";
			ht = ht + "<div class='citationEditorWebsite citationInput'> Website:<input placeholder='Website Title' id='citationEditorIWebsite'>&nbsp;<input placeholder='Website Publisher' id='citationEditorIWebPublisher'><br>&emsp;&emsp;<input type='url' placeholder='URL' id='citationEditorIUrl'></div>";
			ht = ht + "<div class='citationEditorGovernment citationInput'><input placeholder='Nation' id='citationEditorIGovnation'><input placeholder='Branch of Government' id='citationEditorIGovbranch' list='branches'><input placeholder='Committee' id='citationEditorIGovcomm'><input placeholder='Session, eg. 110th Cong., 1st sess' id='citationEditorIGovsess'></div><datalist id='branches'><option>Cong. Senate</option><option>Cong. Reps</option><option>Supreme Court</option><option>Pres</option></datalist>";
			ht += "<div class='citationEditorUniversity citationInput'><input placeholder='Degree-granting University' id='citationEditorIUniversity'><input placeholder='Year degree was awarded' id='citationEditorIUniversityyear'></div>";
			ht = ht + "<div class='citationEditorPubdate citationInput'> Published On: <input type='date' id='citationEditorIPubdate'></div>";
			ht = ht + "<div class='citationEditorAccdate citationInput'> Accessed On: &nbsp;<input type='date' id='citationEditorIAccdate'></div>";	
			ht = ht + "<div class='citationEditorBible citationInput'> <input placeholder='Book' id='citationEditorIBiblebook'><input placeholder='Chapter' id='citationEditorIBiblechapter'><input placeholder='Verse' id='citationEditorIBibleverse'></div>";
			ht = ht + "<div class='citationEditorMedium citationInput'> <input placeholder='Medium' id='citationEditorIMedium'></div>";
			ht = ht + "<div class='citationEditorAbstract citationInput'>Type a summary of this work and how you used it in writing your document.<br><div contenteditable id='citationEditorIAbstract' style='background-color:white;height:3em;border:solid 1px #999;'></div></div>";
			ht = ht + "<datalist id='citationContributorTypes'><option>Author</option><option>Editor</option><option>Translator</option></datalist><datalist id='citationAutoTitle'></datalist>"			
			ht = ht + "<button style='' id='citationEditorSave'>Save</button>";
		
		var fnc = function x() {
			$('#citationEditorIType').on('input', function() {
				//console.log('!');
				introJsStart(14);
				citationReformat();
			});
			$('#citationEditorSave').on('click', function() {
				citationSave();
			});
			$('#citationAddContributor').on('click', function() {
				var out = "<br><input placeholder='Contribution' class='citationEditorIAuthorType' list='citationContributorTypes' style='width:3.5em'><input placeholder='First' class='citationEditorIAuthorFirst'>&nbsp;<input placeholder='M' style='width:2em' class='citationEditorIAuthorMiddle'>&nbsp;<input placeholder='Last' class='citationEditorIAuthorLast'>";
				$('.citationEditorAuthor').append(out);
			});
			$('#citationEditorITitle, #citationEditorIEdition, #citationEditorIAuthorLast').on('input', function() {
				var t = $('#citationEditorITitle').val();
				var e = $('#citationEditorIEdition').val();
				var a = $('#citationEditorIAuthorLast').first().val();
				var y = $('#citationEditorIType').val();
				
				for(i in citation) {
					if(citation[i] != undefined && citation[i] != "undefined") {
						if(citation[i].Title == t && citation[i].AuthorLast == a && citation[i].Edition == e && citation[i].Type == y) {
							$('#citation'+citei).attr('data-id', i);
							$('#citation'+citei).attr('data-i', citei);
							getCitationI(i);
						}
						else if(citation[i].Title == t) {
							//console.log(i+" is almost there");
							$('#citationEditorIAuthorLast').first().attr('placeholder', citation[i].AuthorLast).css('border-color','#d35400');
							$('#citationEditorIEdition').attr('placeholder', citation[i].Edition).css('border-color', '#d35400');
						}
					}
				}
			});	
			function getCitationI(index) {
				initiateCitationEditor(undefined, -1, index);	
			}
			function citationReformat() {
				ht = "";
				for(i in citation) {
					if(citation[i] != undefined && citation[i] != "undefined") {
						if(citation[i].Type == $('#citationEditorIType').val())
							ht += "<option>"+citation[i].Title+"</option>";
					}
				}
				$('#citationAutoTitle').html(ht);
				for(i=0;i<citetypes.length;i++) {
					//console.log('-'+citetypes[i].val);
					if(citetypes[i].val == $('#citationEditorIType').val()) {
						//console.log('--'+citetypes[i].format);
						window.selectedmedium = citetypes[i].format;
						switch(citetypes[i].format) {
							case 'web':
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
							case 'bible':
								citationShow('Title Bible');
								selectedmedium = "print";
							break;
							case 'government':
								citationShow('Title Author Publication Government');
								$('#citationEditorICity').val("Washington");
								$('#citationEditorIPublisher').val("GPO");
								selectedmedium = "print";
							break;
							case 'pamphlet':
								citationShow('Title Publication');
								selectedmedium = "print";
							break;
							case 'dissertation':
								citationShow('Title Author Publication University');
								selectedmedium = "print";
							break;
							case 'periodical':
								citationShow('Title Description Author Pubdate Publication');
								selectedmedium = "print";
								$('#citationEditorITitle').attr('placeholder', "Title of Periodical");
								$('#citationEditorIDescription').attr('placeholder', "Title of Article");
							break;
							case 'journal':
								citationShow('Title Bookpub Author Publication');
								$('#citationEditorIEdition').attr('placeholder', "Issue #");
								$('#citationEditorITitle').attr('placeholder', "Title of Journal");
								$('#citationEditorIDescription').attr('placeholder', "Title of Article");
								selectedmedium = "print";
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
				$('#citationEditorIMediumFormat').css('display', 'block');
				//if abstracts for citations are turned on,
				if(annotated_bib)
					$('.citationEditorAbstract').css('display', 'block');
			}
			var citeAttributes = new Array('Type', 'Title','Description','Page','Volume','Edition','Main','AuthorFirst','AuthorMiddle','AuthorLast','Publisher','City','Year','Website','WebPublisher','Url','Pubdate','Accdate','Database','DbUrl','Medium','Abstract','Biblebook','Biblechapter','Bibleverse', 'MediumFormat', 'Govnation', 'Govbranch', 'Govcomm', 'Govsess','University','Universityyear');	
			function citationSave() {
				citation[citeid] = {};
				for(i in citeAttributes) {
					//get attributes cattr= $('#citationEditorI'+citeAttributes[i]);
					var cattr = $('#citationEditorI'+citeAttributes[i]).val();
					type = $('#citationEditorIMediumFormat').val()
//					type = 
					//console.log('#citationEditorI'+citeAttributes[i], cattr);
					
					//save attributes to citation[id][citeAttributes[i]]
					//TODO - ,'Act','Scene','Lines'
					//Also- bible
					
					if(citeAttributes[i] == 'Page') {
						if(type == 'bible') 
						 	cattr = $('#citationEditorIBiblebook').val() + "." + $('#citationEditorIBiblechapter').val() + "." + $('#citationEditorIBibleverse').val();
						else if(type == 'theater')
							cattr = $('#citationEditorIAct').val() + "." + $('#citationEditorIScene').val() + "." + $('#citationEditorILines').val();
							$('#citation'+citei).attr('data-page', cattr);
					}
					else if(citeAttributes[i] == 'Main')
						$('#citation'+citei).attr('data-main', cattr);
					else if(citeAttributes[i] == 'Abstract')
						citation[citeid][citeAttributes[i]] = $('#citationEditorIAbstract').html();
					else if(citeAttributes[i] == "MediumFormat")
						citation[citeid][citeAttributes[i]] = window.selectedmedium;
					else if(cattr != undefined)
						citation[citeid][citeAttributes[i]] = cattr;
					else	
						citation[citeid][citeAttributes[i]] = "";
					
					
					//citation[citeid]['type'] = $('#citationEditorIType');	
				}
				//Save contributors
					citation[citeid]['Contributors'] = new Array("Author");
					citation[citeid]['ContributorsFirst'] = new Array();
					citation[citeid]['ContributorsMiddle'] = new Array();;
					citation[citeid]['ContributorsLast'] = new Array();
					for(i=0;i<$('.citationEditorIAuthorType').length;i++) {
						console.warn(i, $('.citationEditorIAuthorType').length);
						var c = $('.citationEditorIAuthorType')[i];
						var cf = $('.citationEditorIAuthorFirst')[i];
						var cm = $('.citationEditorIAuthorMiddle')[i];
						var cl = $('.citationEditorIAuthorLast')[i];
						citation[citeid]['Contributors'].push($(c).val());
						citation[citeid]['ContributorsFirst'].push($(cf).val());
						citation[citeid]['ContributorsMiddle'].push($(cm).val());
						citation[citeid]['ContributorsLast'].push($(cl).val());
					}
				$('#citation'+citei).attr('data-id', citeid);
				$('#citation'+citei).attr('data-i', citei);
				citationHovertag();
				closePopup();
				introJsStart(16);
			}
			function citationRestore() {
				type = citation[citeid]['MediumFormat'];
				for(i in citeAttributes) {
					//Support for theater
					if(citeAttributes[i] == 'Page') {
						if(type == 'bible')  {
							p = $('#citation'+citei).attr('data-page'); 
							$('#citationEditorIBiblebook').val(p.split('.')[0]);
							$('#citationEditorIBiblechapter').val(p.split('.')[1]);
							$('#citationEditorIBibleverse').val(p.split('.')[2]);	
						}						
						else if(type == 'theater') {
							p = $('#citation'+citei).attr('data-page'); 
							$('#citationEditorIAct').val(p.split('.')[0]);
							$('#citationEditorIScene').val(p.split('.')[1]);
							$('#citationEditorILines').val(p.split('.')[2]);
						}
						else
							$('#citationEditorIPage').val($('#citation'+citei).attr('data-page')); 
					}
					else if(citeAttributes[i] == 'Main')
						$('#citationEditorIMain').val($('#citation'+citei).attr('data-main')); 
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
	
			initiatePopup({title: "Citations", bordercolor: "#09f", ht: ht, fnc: fnc});
}

function citationHovertag(recall) {
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
		displayHovertag(citation[$(this).attr('data-id')].Title, {ypos: $(this).offset().top}, "'initiateCitationEditor(undefined,"+$(this).attr('data-i')+")'");
	});
	$('.citation').on('mouseleave', function() {
		//hideHovertag();
	});
//	console.log("CitationHovertag(Recall): "+recall+(recall == undefined));
	if(recall == undefined)	{
		hovertagRegistry('citationHovertag(true)');
	}
}
//'
function formatHovertag(classname, textcode, action, recall) {
	$('.'+classname).off('mouseenter');
	$('.'+classname).off('mouseleave');
	
	$('.'+classname).each(function(index, element) {
        $(this).on('mouseenter', function() {
			try {
			console.log(textcode, action);
			console.log('"'+eval(textcode)+'"');
			} catch(e) {
				textcode = "'Item'";	
				console.error(e);
			}
			try {
			console.log('"'+eval(action)+'"');
			} catch(e) {
				console.error(e);
				action = null;	
			}
			displayHovertag(eval(textcode), {ypos: $(this).offset().top}, '"'+eval(action)+'"');
			//hovertagRegistry(\'displayHovertag(eval(textcode), {ypos: $(this).offset().top}, eval(action));\');
		});
    });
	//'

	if(recall == undefined) 
		hovertagRegistry(classname, textcode, action);
}
function hovertagRegistry(c, t, a) {
	hovertagRegistrar.push({classname: c, textcode: t, action: a});
	saveFile();
}
function recallHovertags() {
	for(i in hovertagRegistrar) {
		if(hovertagRegistrar[i].textcode != undefined)
			try {
			eval('formatHovertag("'+hovertagRegistrar[i].classname+'", "'+hovertagRegistrar[i].textcode+'", "'+hovertagRegistrar[i].action+'", true)'); 
			} catch(e) {
			eval("formatHovertag('"+hovertagRegistrar[i].classname+"', 'Item', null, true)"); 	
			}
		else 
			eval(hovertagRegistrar[i].classname);
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
		if(!t.leading_quote && t.class == "citation")
			el.textContent = '" ';
		/*else if(t.leading_quote)
			el.textContent = ' "';*/
		//<span class="citation" id="citation"0>"&nbsp;"</span>&nbsp;
		//el = el+document.createTextNode('&nbsp');
		
		//Because both quotes must be the ending and closing of a citation, we must add to the text content.anchor(
		if(t.class == 'citation')
			el.textContent += ' "';
		else if(t.class.split(" ")[0] == "table")
			el.textContent += "<span class='fa fa-table'></span>";
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
	console.log(text, fnc);
	ypos = data.ypos;
	if(data.ypos == undefined) 
		ypos = mouseY()-scrollY;
	else
		ypos = ypos - scrollY;
	if(text == undefined)
		text = "Object";
		
	if(mousex-($('.hovertag').width()/2) < 0)
		xpos = 0;
	else
		xpos = mousex-($('.hovertag').width()/2);
	$('.hovertag').css('left', xpos).css('top', ypos+20).css('opacity', 0).animate({
		opacity: 1}, 100, function() {
			$('.hovertag').html(text);	
		});
	$('.hovertag').off('click');
	$('.hovertag').off('mouseleave');
	$('.hovertag').on('mouseleave', function() {
		hideHovertag();
	});
	$('.hovertag').on('click', function() {
		if(fnc != undefined) {
			console.log("Hovertag "+fnc);
			eval(fnc.substring(1,fnc.length-1));
			console.warn(fnc);
		}
	});
	
	if(fnc != undefined) {
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
	hidePanelPlugin();
	$('.content_textarea').css('z-index', 3).css('position', 'fixed');
		$('.content_textarea').animate({
			top: "-.1%",
			left:"-.1%",
			width:"95%",
			width:window.innerWidth-80+"px",
			/*width:"calc(100%-80px)",*/
			height:window.innerHeight-35+"px",
			/*height:"calc(100%-35px)",*/
			fontSize:"16pt",
			paddingLeft:"50px",
			paddingRight:"30px",
			paddingTop:"35px",
			lineHeight:"1.5em"
		},300);
	$('.fullscreenui').fadeIn(500);
	setTimeout("$('.fullscreenui').css('opacity','.1')", 510);
	window.fsuo = "rgba(204,204,204)";
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
		},1000);
		nightscreen(1);
		$('.fullscreenui').fadeOut(100);
}
function nightscreen(option) {
	if($('.content_textarea').css('background-color') == "rgb(0, 0, 0)" || option == 1) {
		//Return to white
		jQuery('.content_textarea').animate({
			backgroundColor: "rgba(255,255,255)",
			color: "rgba(0,0,0)"
		},5000);
		fsuo = "rgba(204,204,204)";
		jQuery('.fullscreenui').animate({
			opacity: 0.1,
			color:'black'
		},100);
	} else {
		jQuery('.content_textarea').animate({
			backgroundColor: "rgba(0,0,0)",
			color: "rgba(200,200,200)"
		},2000);
		fsuo = "rgba(41,41,41)";
		jQuery('.fullscreenui').animate({
			opacity:0.1,
			color:"white"
		},100);
	}
}

window.introdisabled = false;
function checkIntro() {
	//console.log(localStorage['autointro']);
	if(localStorage['autointro'] == undefined) {
		introdisabled = true;
		localStorage['autointro'] = true;
		introJsStart();
	}	
}
setTimeout("checkIntro()", 1000);
function introJsStart(id) {
	if(id == undefined)
		id = 1;
var intro = introJs();
//intro.setOptions({steps: [{element: '#temp_header', intro: "Welcome to the Project Gluten. I hope that you are impressed from the work that has been done so far. There's a lot more to go, but there's a lot of potential here already for a great service.<br><br>-Nick Felker"}, {element:'#file_format', intro:"In this demo, we'll be using the APA format. Do you know how to use this format in a paper? The bigger question is, do you <i>need</i> to know how to use this format. Gluten lets the user focus on the art of writing, and formats the paper behind the scenes. How? Let's take a closer look."},{element:'#file_language', intro:"Near the top of the page, you see a bunch of input boxes. You can alter the contents for each box."},{element:'#format_item_0', intro:"The types of input are based on the format. In APA format, the 'Running Head' is a title that displays in the header."},{element:'#format_item_1', intro:"Well, did you try typing in a title? Why not? The format can set a min and/or a max number of characters/words. See the counter below? The title should not be more than 12 words."},{element:'#format_item_2', intro:"Do you see how the word count above changed? If over or under the set limit, the user is alerted. Go back and check it out."},{element:document.querySelectorAll('.content_textarea')[0],intro:'This is the main part of your paper. Here you can write your content and add rich formatting.'},  {element:"#ADDCITATIONBUTTON", intro:"You can add a citation to your paper as easily as clicking this button. What are you waiting for?", position:"top"},  {element:"#citationEditorIType", intro:"This popup appears giving you the option to cite a variety of different sources. Choose one. (Click 'Skip')"},  {element:'#citationEditorITitle', intro:'You can enter the source title, author, and plenty of other stuff.'},  {element:'#citationEditorIAuthorLast', intro:'Type Smith here. Then we can save this source. (Click "Skip")'},  {element:'#citation0',intro:"Now the citation appears in your essay. Hovering over it tells you the title of the source, and clicking on that hover sends you back to the editor. What if you want to see all your sources?"},  {element:'#CITATIONPANEL', intro:"Panels are a way for 3rd party developers to improve the functionality of the editor. The panel framework is documented on GitHub. Let's check it out.", position:"top"},  {element:'#CITATIONPANEL', intro:'All your citations will be listed in this panel. You can edit them by clicking on the one you want.', position:"top"},  {element:'#IDEAPANEL', intro:"Click on me next!", position:"top"},  {element:'#IDEAPANEL', intro:'What if you are taking notes for your paper? It is easy with the Ideas Panel. Write general notes or for each source you have. The panel scrolls with you, so you can take a look at notes while you write.', position:"top"},  {element:'#BUILDBUTTON', intro:"After adding all of this rich information, you will need to 'build' the paper. This is when the software puts everything together.", position:"top"}]});
intro.setOptions({steps: [{element: '#temp_header', intro:"Welcome to Project Gluten. I hope you find this application useful and you continue to support it with your time."},{element:'#iFILESYS', intro:'In the future, you can open, create, and upload new files using this interface. For now, let us just stick with this document.'},{element: '#file_format', intro:"The system is modular; it revolves around formats. You can write your paper the same way, but you can format it anyway you want. This allows for a consistent and better user experience.<br><br>For this demo we're going to choose 'MLA', so type that option in this field."},{element:'#format_item_0', intro:"Right away you see a bunch of input fields. This makes it easier to add things that are straightforward. Type in your name, just once, and it can be used anywhere. Isn't that easy?"},{element:'#format_item_1', intro:"Add your title here."},{element:'#format_item_2', intro:"This input fields make it easier for you and for developers. I mean, you type in the professor's name here, and a developer gets it with `valMetadata('Professor')`. It's literally that easy."},{element:'#format_item_4', intro:"A format can contain a couple of input types, such as a date. Pick a day, such as today, for this demo."},{element:'.content_textarea', position:"top", intro:"Awesome, now we're finally at the content. This is where you'll write your body. Don't worry about adding paragraph indents. Just separate each one by a blank line."},{element:'#CHARACTERPANEL', intro:"Let's look at the toolbar just above. Click the 'Character' tool."},{element:'#popup_character_search', position:'left', intro:"This is a panel. It's a plugin which can run by itself or integrate into the content somehow. Think of it like an app. This one is a character map. Type in the character you want, like 'pi', and then press enter."},{element:'.content_textarea', position:"top", intro:"It adds the character to your panel, inline. Wasn't that easy? You didn't have to use the mouse or navigate through menus. If you want to open it later, you can use the shortcut Alt+C"},{element:'span[data-t="citation"]', intro:"Now let's add citations. Citations are seen as the hardest thing to add in a paper. There are dozens of rules for adding citations inline and how to organize a bibliography. Thankfully, all this is now automated. You don't even need to copy and paste. What are you waiting for? Click the 'Citation' tool below."},{element:'#citationEditorIType',intro:"This popup gives you the option to cite a variety of different sources. Choose one. (Click 'Skip' first)"},{element:'#citationEditorITitle', intro:"You can enter the source's title, author, and plenty of other stuff."}, {element:'#citationEditorIAuthorLast', intro:'Type Smith here. Then, click skip and save the source.'},{element:'#citation0', intro:"Now the citation appears in your essay. You can add content inside the quotation marks. By hovering over the cyan line, you can see the title of your source. If you click on this 'hovertag', you are able to edit the source even further."},{element:'#temp_header', intro:"This is the tip of the iceburg. There's plenty more stuff you are able to explore, but to appreciate it, you must explore on your own. Keep exploring. Before I depart, one more task. Above me, click 'File' and then 'Build'. You'll see how fast and how accurate your paper is. <br><br>Thanks, Nick Felker"}
]});	
if(window.introdisabled != false)
	intro.goToStep(id).start();
}
function exitintro() {
	window.introdisabled = false;
	introJs().exit();	
	//alert("There you go, one perfectly formatted paper. Wasn't that easy? In fact, it was very simple to do, and it didn't require memorizing a computer language or formatting rules. There's a lot of things the human mind is good at; automation isn't one of them. Save you time for, you know, actually *writing* your paper.\n\nThis project is open source, so check it out on GitHub and contribute if you want. It is easy to develop a panel or add a small feature.\n\nI hope that this project is exciting, and that you'll use it once it is available.\n-Nick Felker");
}

//{element:'#CHARACTERPANEL', intro:'Another useful panel is the character palette.'},  {element:'#CHARACTERPANELCHARACTERS', intro:'This lists all the special characters that you can insert into your document. After clicking on the one you want, the keyboard switches focus so you can keep typing without having to reposition your mouse. Try it. It is really useful.' },  {element:'#popup_character_search', intro:"Can you find the character you want? You can easily find it using the searchbar."},  
//{element:'#build', intro:"There you go, one perfectly formatted paper. Wasn't that easy? In fact, it was very simple to do, and it didn't require memorizing a computer language or formatting rules. There's a lot of things the human mind is good at; automation isn't one of them. Save you time for, you know, actually <i>writing</i> your paper.<br><br>This project is open source, so check it out on GitHub and contribute if you want. It is easy to develop a panel or add a small feature.<br><br>I hope that this project is exciting, and that you'll use it once it is available.<br>-Nick Felker", position:"top"}
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
		contentValidate();
		//saveFile();
	switch(e.keyCode) {
		case 32: /* Space */
			//Word filtering
			//Save
			//saveFile();			
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
				runPanel('main_Dictionary');	
				e.preventDefault();	
			} 
		break;
		case 70: /*F*/
			if(e.altKey) {
				runPanel('main_Find');
				e.preventDefault();		
			} 
		break;
		case 83:
			if(e.altKey) {
				launchStore();
				e.preventDefault();	
			}
		break;
		case 13: /* Enter */
		
		break;
	}
	if(window.paneltitle != undefined) {
		var el = '.PanelKeyEvent';
		$(el).attr('data-keycode', e.keyCode);
		$(el).attr('data-alt',e.altKey);
		$(el).attr('data-ctrl',e.ctrlKey);
		$(el).attr('data-shift',e.shiftKey);
		$('.PanelKeyEvent').click();	
		//console.log($(".PanelKeyEvent").attr('data-keycode'));
		if(paneloverride != undefined) {
			if(paneloverride.indexOf(e.keyCode) > -1)
				e.preventDefault();
		}
	}
};
function postWordCount() {
	//Right now, this only does the words in the content_textarea; it should get the build count
	//Get input - Right now the text
	var a = $('.content_textarea').text();
	var char = a.replace(/ /g, '').length;
	var word = 0;
	if(char == 0)
		return
	/*for(i in a.split(' ')) {
		if(a[i] != ' ' && a[i].length) {
			word++;	
		}
	}*/
	word = a.split(' ').length;
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
function imgDetails(pid) {
	var ht = "&emsp;Image URL: <input type='url' id='image_url'><br>";
	ht += "&emsp;Description: <input id='image_des' style='width:75%'><br>";
	ht += "<button id='image_save'>Save</button><div style='margin-left:50px' id='image_preview'></div>";
	ht += "&emsp;<input type='hidden' id='image_pid' value='"+pid+"'>";
	fnc = function x() {
		var pid = $('#image_pid').val();
		if($('.img'+pid).attr('data-src') != undefined) {
			$('#image_url').val($('.img'+pid).attr('data-src'));
			$('#image_des').val($('.img'+pid).attr('data-des'));
			previewImg();	
		}
		function previewImg() {
			var url = $('#image_url').val()
			$('#image_preview').html('<img src="'+url+'">');
		}
		$('#image_url').on('input', function() {
			previewImg();
		});
		$('#image_save').on('click', function() {
			$('.img'+pid).attr('data-id', pid);
			$('.img'+pid).attr('data-des', $('#image_des').val());
			$('.img'+pid).attr('data-src', $('#image_url').val());
			$('.img'+pid).html("<img src='"+$('#image_url').val()+"' style='width:10%'>");
			closePopup();
			saveFile();
		});	
	};
	initiatePopup({title:"Image Details", bordercolor:'#B54E7C', ht: ht, fnc: fnc});
}
function tableDetails(tableid) {
	var ht = "&emsp;Title: <input id='table_name'>&emsp;Col:<input type='number' style='width:5em' id='table_c'>&nbsp;&nbsp;Row:<input type='number' style='width:5em' id='table_r'><br><button id='table_save'>Save</button><table id='tablep' style='margin-left:30px'></table>"
	ht += "<input type='hidden' id='tableid' value='"+tableid+"'>";
	fnc = function x() {
		var r = 1;
		var c = 1;
		var data = new Array();
		var datax = '';
		var id = $('#tableid').val();
		$('.table'+id).attr('data-id', id);
		if($('.table'+id).attr('data-xml') != undefined) {
			$('#table_name').val($('.table'+id).attr('data-title'));
			$('#table_r').val($('.table'+id).attr('data-row'));
			$('#table_c').val($('.table'+id).attr('data-col'));
			r = parseInt($('.table'+id).attr('data-row'));
			c = parseInt($('.table'+id).attr('data-col'));
			datax = $('.table'+id).attr('data-xml');
			restore();	
		}
		$('#table_r, #table_c').on('input', function() {
			r = $('#table_r').val();
			c = $('#table_c').val();
			if(r > 0 && c > 0)
				preview();
			else
				$('#tablep').html('Please change table dimensions.');
		});
		$('#table_save').on('click', function() {
			save();
		});
		
		function preview() {
			out = '<table style="width:90%">';
			xml = '<table>';
			for(i=0;i<r;i++) {
				out += '<tr>';
				xml += '<row>';
				for(j=0;j<c;j++) {
					//console.log(i+"x"+j,r,c);
					if(i == 0 || j == 0)
						var bg = '#ddd';
					else
						var bg = '#fff';
					try {
						if(r == 1 && c == 1)
							value = data['row']['cell'];
						else if(r == 1)
							value = data['row']['cell'][j];
						else
							value = data['row'][i]['cell'][j];
					} catch(e) {
						value = ''	
					}
					if($('#tablecell_'+i+'_'+j).html() != undefined && $('#tablecell_'+i+'_'+j).html().length > 0)
						value = $('#tablecell_'+i+'_'+j).html();
					if(value == undefined)
						value = " ";
					out += '<td class="tablecell" id="tablecell_'+i+'_'+j+'" contenteditable style="background-color:'+bg+';min-width:5em;">'+value+'</td>';
					xml += '<cell>'+value+'</cell>';	
				}
				xml += '</row>';
				out += '</tr>';
			}
			out += '</table>'
			xml += '</table>'
			$('#tablep').html(out);	
			datax = xml;
		}
		$('.tablecell').on('input', function() {
			preview();
		});
		function save() {
			restore();
			$('.table'+id).attr('data-xml', datax);
			$('.table'+id).attr('data-row', r);
			$('.table'+id).attr('data-col', c);
			var title = $('#table_name').val();
			if(title.length == 0)
				title = " ";
			$('.table'+id).attr('data-title', title);
			$('.table'+id).css('background-color', '#555');
			closePopup();
		}
		function restore() {
			data = $.xml2json(datax);
			preview();
		}
	};
	initiatePopup({title:"Table Editor", bordercolor:'#111', ht: ht, fnc: fnc});
	
}
/*** HOLORIBBON ***/
/*newRibbon('.header', {
       'File': new Array(
			   {'text': 'Back', 'img': '', 'action': 'returnHome();'},
               {'text': 'Download', 'img': '', 'action': "convertToPreview();pdf.save(o.title+'.pdf');"}
           
       ),
	   'View': new Array(
			   {'text': 'Edit', 'img': '', 'action': 'convertToInput()'},
               {'text': 'View XML', 'img': '', 'action': 'convertToXML()'},
			   {'text': 'Preview', 'img': '', 'action': 'convertToPreview()'},
			   {'text': 'Print', 'img': '', 'action': 'print();'}

		),
       'Options': new Array(
                {'group': 'Words', 'value': 'Min: <input type="number" id="count_words_min" value="0" oninput="wordCount()" min="0" class="countinput"><br>Max: <input type="number" id="count_words_max" value="0" oninput="wordCount()" min="0" class="countinput">'},
                {'group': 'Timer', 'value': 'Minutes: <input type="number" id="timer_minutes" value="0" min="0">'}
           
       ),
	   'Panels': new Array (
			   {'text': 'Citations', 'img': '', 'action': 'panelCitation()'},
			   {'text': 'Ideas', 'img': '', 'action': 'panelIdea()'}
	   )
    });*/
function setHeader() {
	window.holoribbon_std =  {
		Home: new Array(
			{group: '', value: '<font size="4" id="temp_header" >Welcome to Gluten!</font><br><table style=\'width:40%;margin-left:30%\'><tr><td><button onclick="window.introdisabled = true;introJsStart();"><span class=\'fa fa-home\'></span>&nbsp;Start the Tour!</button></td><td><button id="iFILESYS" onclick="runPanel(\'main_Filesys\')"><span class=\'fa fa-folder-open\'></span>&nbsp;Explore Files</button></td></tr></table>'}
		),
		File: new Array(
			{group: "File Name", value:"<input id='file_name' style='width:7em'><button id='file_name_con' disabled='true'>Save As</button><input type='hidden' id='file_name_internal'>"},
			{text: 'Build', img: '<span style="font-size:18pt" class="fa fa-file"></span>', action: "startBuild();setTimeout('exitintro();', 1000);", key: "Alt+B"},
			{text: 'Export', img: '<span style="font-size:18pt" class="fa fa-download"></span>', action: "exportFile();"}
		),
		Panels: new Array(
			{text: 'Outline', img: '<span style="font-size:18pt" class="fa fa-list"></span>', action: "runPanel('main_Outline');"},
			{text: 'Citations', img: '<span style="font-size:18pt" class="fa fa-book"></span>', action: "runPanel('main_Citation');"},
			{text: 'Ideas', img: '<span style="font-size:18pt" class="fa fa-lightbulb-o"></span>', action: "runPanel('main_Idea');"},
			/*{text: 'Dictionary', img: '<span style="font-size:18pt" class="fa fa-quote-left"></span>', action: "runPanel('main_Dictionary');"},*/
			{text: 'Style Guide', img: '<span style="font-size:18pt" class="fa fa-info-circle"/>', action: "runPanel('main_Style');"}
		),
		Tools: new Array(
			{text: 'Find', img: '<span style="font-size:18pt" class="fa fa-search"></span>', action: "runPanel('main_Find');", key: "Alt+F"}
		),
		About: new Array(
			{text: 'Source Code @ GitHub', img: '<span style="font-size:18pt" class="fa fa-github-alt"></span>', action: "window.location='http://www.github.com/fleker/gluten'"},
			{text: 'Send Feedback', img: '<span style="font-size:18pt" class="fa fa-envelope"></span>', action: "window.location='mailto:handnf+gltn@gmail.com'"},
			{text: 'Gltn Blog', img: '<span style="font-size:18pt" class="fa fa-bullhorn"></span>', action:"window.location='http://gltndev.wordpress.com/'"},
			{text: 'Credits', img: '<span style="font-size:18pt" class="fa fa-legal"></span>', action: 'postLegal()'}
		),
		Me: new Array(
			{group: 'Name', value:'<input id="me_name">'}
		)
	};
	newRibbon('.header', holoribbon_std);
	ribbonSwitch(0,false);
	
	$('#file_name').val(fileid);
	$('#file_name_internal').val(fileid);
	$('#file_name').on('input', function() {
		$('#file_name_con').attr('disabled', false);
	});
	$('#file_name_con').on('click', function() {
		var v = $('#file_name').val();
		v = v.replace(/ /g, "");
		//console.log(v, localStorage[v]);
		if(localStorage[v] != undefined) {
			ovr = confirm('This file already exists: '+v+'; Overwrite the contents of this file?');	
		}
		if(ovr) {
			if(v.substr(-2) == "_c")
				v = v.substr(0,v.length-2)+"c";
			$('#file_name_con').attr('disabled', true);
			$('#file_name_internal').val(v);
			setTimeout('window.location = "?file='+v+'";', 250);
		}
	});
	$('#me_name').val(window.settings.me_name);
	$('#me_name').on('input', function() {
		writeToSettings('me_name', $('#me_name').val());		
	});
}
function postLegal() {
	out = "©2014 Made by Nick Felker<br>(@HandNF)";
	f = function x() { };
	initiatePopup({title:'Credits', value: out, fnc: f});
}
function install_panel(id, name, img, uri) {
	holoribbon_std['Panels'].push({text: name, img: img, action: "runPanel('"+id+"')"});
	newRibbon('.header', holoribbon_std);
	ribbonSwitch(2,false);
	createjscssfile(uri, "js");
	console.log("eval('InitPanel"+id+"();');");
	setTimeout("eval('InitPanel"+id+"();');", 500);
	if(window.settings.panels.indexOf(id) == -1) {
		window.settings.panels += ", "+id;
		window.settings['panels_'+id] = id+", "+name+", "+img+", "+uri;
	}
}
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
	return !flag.length;
}
function closeButton(i) {
	if(i == 1)
		return "<span class='fa fa-times'/>"
	else
		return '<span class="fa fa-times"/>'	
}