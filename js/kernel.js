// Misc. stuff from edit.php that shouldn't be in there - clutters up stuff
//In the future, arrange a way to programitically grab all values.
	formats = [{name: "APA", type: "IN BETA"}, {name: "MLA", "type": "Essay"}, {name:"IEEE", type:"Report"},{name:"Lab", type:"Report"}];	
	
/*(function(){
	//saving the original console.log function
	var preservedConsoleLog = console.log;
 
	//overriding console.log function
	console.log = function() {
 
		//we can't just call to `preservedConsoleLog` function,
		//that will throw an error (TypeError: Illegal invocation)
		//because we need the function to be inside the
		//scope of the `console` object so we going to use the
		//`apply` function
		preservedConsoleLog.apply(console, arguments);
 
		//and lastly, my addition to the `console.log` function
		//if(application.socket){
		//    application.socket.emit('console.log', arguments);
		//}
		alert(JSON.stringify(arguments));
	}
})()*/
//a.replace(/\*(\w+)\*/, '<b>$1<\/b>')
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
	if(settings['formats_name'].indexOf(name) == -1) {
		window.settings['formats_name'] = window.settings['formats_name'] + ", " + name;
		window.settings['formats_type'] = window.settings['formats_type'] + ", " + type;
		window.settings['formats_uri'] = window.settings['formats_uri'] + ", " + uri;
	}

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
	/*for(i in hovertagRegistrar) {
		if(hovertagRegistrar[i].classname == classname && recall != true)
			return;	
	}*/
	$('.'+classname).off();
	
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

	if(recall != true && recall != "true") { 
        include = true;
        for(i in hovertagRegistrar) {
            console.log("!-!", hovertagRegistrar[i].classname, classname, hovertagRegistrar[i].classname == classname);
            if(hovertagRegistrar[i].classname == classname) {
                include = false;
            }
        }
        if(include) {
		  hovertagRegistry(classname, textcode, action);
        }
        console.log(classname, recall);
    } else {
//        console.log("We should NOT be including "+classname);   
    }
}
function hovertagRegistry(c, t, a) {
    console.log("Adding to the Registry: "+c,t,a);
	hovertagRegistrar.push({classname: c, textcode: t, action: a});
	saveFile();
}
function recallHovertags(hovertagRegistryArray) {
	//console.log('.');
	for(i in hovertagRegistryArray) {
//        console.log(hovertagRegistrar[i].classname);
		if(hovertagRegistryArray[i].textcode != undefined)
			try {
			formatHovertag(hovertagRegistryArray[i].classname, hovertagRegistryArray[i].textcode, hovertagRegistryArray[i].action, true);
//                eval('formatHovertag("'+hovertagRegistrar[i].classname+'", "'+hovertagRegistrar[i].textcode+'", "'+hovertagRegistrar[i].action+'", true)'); 
			} catch(e) {
                formatHovertag(hovertagRegistryArray[i].classname, 'Item', null, true);
//			eval("formatHovertag('"+hovertagRegistrar[i].classname+"', 'Item', null, true)"); 	
			}
		else 
			eval(hovertagRegistryArray[i].classname);
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
	$('.content_textarea').css('z-index', 99).css('position', 'fixed');
		$('.content_textarea').stop().animate({
			top: "-.1%",
			left:"-.1%",
			width:"95%",
			width:window.innerWidth-55+"px",
			/*width:"calc(100%-80px)",*/
			height:window.innerHeight-35+"px",
			/*height:"calc(100%-35px)",*/
			fontSize:"16pt",
			paddingLeft:"50px",
			paddingRight:"30px",
			paddingTop:"35px",
			lineHeight:"1.5em"
		},300, 'linear', function() {
		});
	$('.fullscreenui').fadeIn(500);
	window.fsuo = theme.normfsui;
	setTimeout("$('.fullscreenui').css('opacity','.1').css('background-color', '"+theme.normfsui+"')", 510);
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
	console.log($('.content_textarea').css('background-color'), theme.darkbg);
	if($('.content_textarea').css('background-color') == theme.darkbg || option == 1) {
		//Return to white
		jQuery('.content_textarea').animate({
			backgroundColor: window.theme.normbg,
			color: window.theme.normcolor
		},5000);
		fsuo = window.theme.normfsui;
		jQuery('.fullscreenui').animate({
			opacity: 0.1,
			color:window.theme.normfsuicolor
		},100);
	} else if($('.content_textarea').css('background-color') != theme.darkbg || option == 2) {
		jQuery('.content_textarea').animate({
			backgroundColor: window.theme.darkbg,
			color: window.theme.darkcolor
		},2000);
		fsuo = theme.darkfsui;
		jQuery('.fullscreenui').animate({
			opacity:0.1,
			color:window.theme.darkfsuicolor
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
intro.setOptions({steps: [{element: '#temp_header', intro:"Welcome to Project Gluten. I hope you find this application useful and you continue to support it with your time."},{element:'#iFILESYS', intro:'In the future, you can open, create, and upload new files using this interface. For now, let us just stick with this document.'},{element: '#file_format', intro:"The system is modular; it revolves around formats. You can write your paper the same way, but you can format it anyway you want. This allows for a consistent and better user experience.<br><br>For this demo we're going to choose 'MLA', so type that option in this field."},{element:'#format_item_0', intro:"Right away you see a bunch of input fields. This makes it easier to add things that are straightforward. Type in your name, just once, and it can be used anywhere. Isn't that easy?"},{element:'#format_item_1', intro:"Give this document a title."},{element:'#format_item_2', intro:"This input fields make it easier for you and for developers. I mean, you type in the professor's name here, and a developer gets it with `valMetadata('Professor')`. It's literally that easy."},{element:'#format_item_4', intro:"A format can contain a couple of input types, such as a date. Pick a day, such as today, for this demo."},{element:'.content_textarea', position:"top", intro:"Awesome, now we're finally at the content. This is where you'll write your body. Don't worry about adding paragraph indents. Just separate each one by a blank line."},{element:'#CHARACTERPANEL', intro:"Let's look at the toolbar just above. Click the 'Character' tool."},{element:'#popup_character_search', position:'left', intro:"This is a panel. It's a plugin which can run by itself or integrate into the content somehow. Think of it like an app. This one is a character map. Type in the character you want, like 'pi', and then press enter."},{element:'.content_textarea', position:"top", intro:"It adds the character to your panel, inline. Wasn't that easy? You didn't have to use the mouse or navigate through menus. If you want to open it later, you can use the shortcut Alt+C"},{element:'span[data-t="citation"]', intro:"Now let's add citations. Citations are seen as the hardest thing to add in a paper. There are dozens of rules for adding citations inline and how to organize a bibliography. Thankfully, all this is now automated. You don't even need to copy and paste. What are you waiting for? Click the 'Citation' tool below."},{element:'#citationEditorIType',intro:"This popup gives you the option to cite a variety of different sources. Choose one. (Click 'Skip' first)"},{element:'#citationEditorITitle', intro:"You can enter the source's title, author, and plenty of other stuff."}, {element:'#citationEditorIAuthorLast', intro:'Click skip. Type Smith here then save the source.'},{element:'#citation0', intro:"Now the citation appears in your essay. You can add content inside the quotation marks. By hovering over the cyan line, you can see the title of your source. If you click on this 'hovertag', you are able to edit the source even further."},{element:'#temp_header', intro:"This is the tip of the iceburg. There's plenty more stuff you are able to explore, but to appreciate it, you must explore on your own. Keep exploring. Before I depart, one more task. Above me, click 'File' and then 'Build'. You'll see how fast and how accurate your paper is. <br><br>Thanks, Nick Felker"}
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
        case 84:
            if(e.altKey) {
                window.introdisabled = true;
                introJsStart();      
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
	var ht = "<table style='width:100%'><tr><td style='vertical-align:top'><input type='url' id='image_url' style='width:95%'><br>";
	ht += "Description: <input id='image_des' style='width:95%'><br>";
	ht += "<button id='image_save'>Save</button></td><td><div style='margin-left:50px;height:100%' id='image_preview'></div>";
	ht += "&emsp;<input type='hidden' id='image_pid' value='"+pid+"'></td></tr></table>";
        
	fnc = function x() {
		var pid = $('#image_pid').val();
		if($('.img'+pid).attr('data-src') != undefined || $('#image_url').val().length > 0) {
			$('#image_url').val($('.img'+pid).attr('data-src'));
			$('#image_des').val($('.img'+pid).attr('data-des'));
			previewImg();	
		}
		function previewImg() {
			var url = $('#image_url').val();
			$('#image_preview').html('<img src="'+url+'" style="max-height:'+(window.innerHeight/3.3)+'px">');
		}
        $('#image_url').on('input', function() {
           previewImg(); 
        });
        $('#image_url').on('click', function() {
           previewImg(); 
        });
		$('#image_save').on('click', function() {
            console.log(".img"+pid);
			$('.img'+pid).attr('data-id', pid);
			$('.img'+pid).attr('data-des', $('#image_des').val());
			$('.img'+pid).attr('data-src', $('#image_url').val());
			$('.img'+pid).html("<img src='"+$('#image_url').val()+"' style='width:10%'>");
			closePopup();
			markAsDirty();
		});	
	};
    
     if($('.img'+pid).attr('data-src') != undefined && $('.img'+pid).attr('data-src') != "undefined") { 
        initiatePopup({title:"Image Details", bordercolor:'#B54E7C', ht: ht, fnc: fnc});
    } else {
        filepicker.pick({
                mimetype: "image/*"
              },
              function(InkBlob){
                  initiatePopup({title:"Image Details", bordercolor:'#B54E7C', ht: ht, fnc: fnc});
                  setTimeout("$('#image_url').val('"+InkBlob.url+"').click();", 600);
              },
              function(FPError){
                console.log(FPError.toString());
              }
            );
    }
	//initiatePopup({title:"Image Details", bordercolor:'#B54E7C', ht: ht, fnc: fnc});
}
function tableDetails(tableid) {
    //clear_panel_data();
    console.log(tableid);
    create_panel_data({tid: tableid});
    $('.table'+tableid).attr('data-id', tableid);
    
    console.log(grab_panel_data());
    runPanel('main_Table');
}
function InitPanelmain_Table() {
    //Initiate the Spreadsheet framework
    window.Spreadsheet = {
        IF: function(bool, tr, fl) {
            if(bool) {
                return tr;    
            } else {
                return fl;   
            }
        },
        SUB: function(str) {
            return "<sub>"+str.toString()+"</sub>";   
        },
        SUP: function(str) {
            return "<sup>"+str.toString()+"</sup>";   
        },
        LATEX: function(str) {
            console.log(str);
            str = str.replace(/\\/g, "\\");
            console.log(str);
            postLatex(str);
            return getLatex();
        },
        RANGE: function(c1, c2, r1, r2) {
            //convert letters to numbers, run through two loops to grab all the data in an array, return it
            var arr = [];
            for(var index = r1; index<=r2; index++) {
                console.log(Spreadsheet[c1+index]);
                if(Spreadsheet[c1+index].substring(0,1) == "=")
                    ans = Spreadsheet[c1+index].substring(1);
                else
                    ans = Spreadsheet[c1+index];
                console.log(ans);
                
                try {
                    ans = eval(ans);  
                    console.log(ans);
                    if(ans.toString().substring(0,1) == "=")
                        ans = eval(ans.substring(1));
                } catch(e) {
                    console.error("RANGE: "+e.message);
                }
                console.log(ans);
                arr.push(ans);
            }
            return arr;
        },
        SUM: function(arr) {
            var sum = 0;
            for(index in arr) {
                sum += arr[index];
            }
            return sum;
        }
    };
    window.SpreadsheetAPI = {
        IF: {id: "If", tags: "conditional if boolean", cmd: "IF(bool, true, false)", param:[{id:"bool", des:"A conditional statement"}, {id:"true", des:"The value to return if true"}, {id:"false", des:"The value to return if false"}], des:"Changes the output depending on the conditional statement"},
        
        SUB: {id: "Subscript", tags:"element sub subscript", cmd: "SUB(str)", param:[{id:"str", des:"The string to format in subscript"}], des:"Makes a string subscript"},
        
        SUP: {id: "Superscript", tags:"exponent sup superscript", cmd: "SUP(str)", param:[{id:"str", des:"The string to format in superscript"}], des:"Makes a string superscript"},
        
        LATEX: {id: "LaTeX", tags:"latex math exponent text string subscript", cmd: "LATEX(cmd)", param:[{id:"cmd", des:"A LaTeX command as a string"}], des:"Displays a LaTeX formula. <br><b>Note:</b> Due to the way strings are managed in Javascript, you'll need to use two backslashes to count as one: \\\\bar{x}"},
        
        RANGE: {id: "Range", cmd: "RANGE(col1, col2, row1, row2)", param:[{id:"col1", des:"The first column"},{id:"col2", des:"The second column"},{id:"row1", des:"The first row"},{id:"row2", des:"The second row"}], des:"Returns an array of values for a given range", regin:"Spreadsheet.([A-Za-z]+)(\\d+):Spreadsheet.([A-Za-z]+)(\\d+)", regout:'eval(Spreadsheet.RANGE("$1","$3","$2","$4"))'}
    };
    
    window.alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA"];
}
function GetPanelmain_Table() {
    return {title: "Spreadsheets", bordercolor:"#2cc36b", width: 50, maximize:true};   
}
function generateSpreadsheetVars(a, r, c) {
    for(i=1;i<=r;i++) {
        for(j=0;j<c;j++) {
            Spreadsheet[alpha[j]+i] = a[(i-1)*c+j];
        }
    }   
}
function RunPanelmain_Table() {
    id = grab_panel_data().tid;
    if($('.table'+id).attr('data-row') == undefined) {
        $('.table'+id).attr('data-row', 1);
        $('.table'+id).attr('data-col', 1);
        $('.table'+id).attr('data-arr', "0");
    }
    var r = $('.table'+id).attr('data-row');
    var c = $('.table'+id).attr('data-col');
    var t = $('.table'+id).attr('data-title');
    var current = "tableCell_1_1";
    
    out = "<div style='display:inline-table'>&emsp;Title: <input type='text' id='tableTitle' value='"+t+"'><br><input type='number' id='tableRow' style='width:4em' value='"+r+"'>&nbsp;<span class='fa fa-times'></span>&nbsp;<input type='number' id='tableCol' style='width:4em' value='"+c+"'><button id='tableSave'>Save</button><button id='tableHelp'>Reference</button></div><div id='tableHelpReference' style='display:inline-table;padding-left:90px'><input id='tableHelpReferenceHelp' placeholder='Search for something' type='search' style='width:30em;display:inline-table;'></div><div id='tableHelpReferenceOut' style='display:inline-table'></div>";
    out += "<br><span id='tableCurrent'></span><input style='width:85%' id='tableForm' placeholder='Cell Function'>";
    out += "<br><div id='tableFrame' style='width:"+($('.panel_plugin_content').width() - 30)+"px;overflow:auto;padding-bottom: 20px;padding-right: 12px;'><table style='border-spacing:initial;' id='tableView'></table></div>";
    postPanelOutput(out);
    //TODO Fix the system to be more modular  
    //TODO Override Enter
    //TODO Spreadsheet
    //TODO Save
    //TODO Fix inline text
    //TODO Title
    //TODO Optimize overflow
    function generate(why) {
        console.warn("Generating a table because of step "+why);
        var r = $('.table'+id).attr('data-row');
        var c = $('.table'+id).attr('data-col');
        
        console.log($('.table'+id).attr('data-arr'));
        if($('.table'+id).attr('data-arr') != undefined)
           var a = $('.table'+id).attr('data-arr').split("~~");
        else
            var a = ["0"];
        console.log("Create a "+r+" x "+c+" table");
        
        var span = "<span style='font-size:9pt;opacity:.6'>";

        
       // out = "&emsp;Title: <input type='text' id='tableTitle' value='"+t+"'><br><input type='number' id='tableRow' style='width:4em' value='"+r+"'>&nbsp;x&nbsp;<input type='number' id='tableCol' style='width:4em' value='"+c+"'><button id='tableSave'>Save</button>";
//        out += "<br><table style='width:97%;border-spacing:initial'><tr><td></td>";
        out = "<tr><td></td>";
        for(j=0;j<c;j++) {
            out += "<td style='text-align:center'>"+span+alpha[j]+"</span></td>";   
        }
        out += "</tr>";
        
        console.log("Preparing to rebuild");
        console.log(a);
        generateSpreadsheetVars(a, r, c);
        
        for(i=1;i<=r;i++) {
            out += "<tr><td style='vertical-align:middle;text-align:right;padding-right:3px;'>"+span+i+"</span></td>";
            for(j=0;j<c;j++) {
                var k = a[(i-1)*c+j];
                console.log(k);
                if(k == undefined || k == "undefined")
                    k = "";
                var l = k;
                var y = k;
//                console.log(k);
                console.log(i,j, (i-1), r, (i-1)*c, (i-1)*c+j,k);
                //BG Colors
				if(k.substr(0,1) == "=")
                    var bg = "rgba(0,224,0,.2)";
                else if(i == 1 || j == 0)
				    var bg = "rgba(200,200,200,.25)";
                else
					var bg = theme.normbg;
                
                if(k.substr(0,1) == "=") {
                    //$('#tableForm').val(k);
                     console.warn("", k.substr(1));
                    try {
                        y = tableEvaluate(k.substr(1));
                    } catch(e) {
                        console.error(e.message);
                        y = l;
                    }
                    console.log(y);
                } else {
                    $('#tableForm').val("");   
                }
                
/*                if(k.toString().substr(0,1) == "=") {
                    $('#tableForm').val(k);
                    k = tableEvaluate(k.substr(1));
                    console.log(k);
                } else {
                    $('#tableForm').val("");   
                }
                */
                out += "<td style='border:solid 1px "+theme.coloralt+"; background-color:"+bg+";padding-left:4px;min-width:5em;color:"+theme.normcolor+"' contenteditable class='tableCell' id='tableCell_"+i+"_"+j+"' data-form='"+l+"'>"+y+"</td>";
            }
            out += "</tr>";
        }
        out += "</table>";
        $('#tableView').css('min-width', c*5+"em");
        $('#tableFrame').css('width', ($('.panel_plugin_content').width() - 30)+"px");  
        $('#tableView').html(out);
        $('#'+current).focus();
        
        function saveArray() {
            var a = "";
            for(i=1;i<=r;i++) {
                for(j=0;j<c;j++) {
                   // var k = a[(i-1)*r+j-1];
                    var f = $('#tableCell_'+i+'_'+j).attr('data-form');
                    if(f != undefined && f != "" && f != "undefined")
                        var k = f;
                    else
                        var k = $('#tableCell_'+i+'_'+j).html();
                    a += k+"~~";  
                }
            }
            $('.table'+id).attr('data-arr', a);
            console.log(a);
            
        }
        function setCurrent(id) {
            var a = id.split('_');
            if(id == "tableCell_0_0")
                $('#tableCurrent').empty();
            else
                $('#tableCurrent').html(alpha[a[2]]+(parseInt(a[1])));
            current = id;
        }
        function tableForm(text) {
            //Take in form and remove all instances of Spreadsheet
            console.log("tFI: "+text.replace(/Spreadsheet./g, ""));
            return text.replace(/Spreadsheet./g, "");
//            return text;
        }
        function tableFormOut(text) {
            for(i in Spreadsheet) {
                var r = new RegExp(i, 'g');
                console.log(r);
                text = text.replace(i, "Spreadsheet."+i)    ;
            }
            return text;
        }
        $('.tableCell').off().on('input', function() {
            saveArray();
//            console.log(($(this).val().substring(0,1)));
            if($(this).html().substring(0,1) == "=") {
                $('#tableForm').focus().val('=');
            }
            //generate();
        });
        
        $('.tableCell').on('focusout', function() {
            setCurrent($(this).attr('id'));
            console.log("Out: "+current);
            //generate();
        });
        $('.tableCell').on('focusin', function() {
            setCurrent($(this).attr('id'));
            if($(this).attr('data-form') != undefined && $(this).attr('data-form') != "0" && $(this).attr('data-form') != "undefined" && $(this).attr('data-form') != $(this).html())
                $('#tableForm').val(tableForm($(this).attr('data-form')));
            else {
                $('#tableForm').val("");
                $(this).attr('data-form', "undefined");
            }
            $('#tableFrame').css('width', ($('.panel_plugin_content').width() - 30)+"px");  
            console.log("In: "+current,$(this).attr('data-form'),$(this).html(),$(this).attr('data-form') != $(this).val());
        });
//        $('#tableForm').on('focusin', function() {
//            alert(1);
//            console.log("Formin: "+current); 
//            $(this).val($('#'+current).attr('data-form'));
//        });   
        $('#tableForm').focusin(function() {
           //console.log("Formin: "+current); 
           //$(this).val($('#'+current).attr('data-form'));
            if($('#'+current).attr('data-form') == $('#'+current).html())
                $(this).val('');
        });
        $('#tableForm').on('input', function() {
            if($(this).val().substring(0,1) != "=")
                $('#'+current).focus();
        });
        $('#tableForm').focusout(function() {
            console.log("Formout "+current, $(this).val());
            var f = $(this).val();
            if(f.length < 2)
                f = undefined;
            $('#'+current).attr('data-form', tableFormOut($(this).val()));
            saveArray();
//                generate("D");
            $('#tableForm').val('');
            setCurrent('tableCell_0_0');
        });
    }
    
    
    
    
    $('#tableRow, #tableCol').on('input', function() {
        //TODO Validation and min values
        console.log("Changing dimensions");
        $('.table'+id).attr('data-row', $('#tableRow').val());
        $('.table'+id).attr('data-col', $('#tableCol').val()); 
        $('.table'+id).attr('data-title', $('#table').val()); 
        generate("B");
    });
    $('#tableTitle').on('input', function() {
        //TODO Validation and min values
        $('.table'+id).attr('data-title', $('#tableTitle').val()); 
    });
    
   /* $('.PanelKeyEvent').on('click', function() {
        if($(this).attr('data-keycode') == 187 && $(this).attr('data-shift')) {
            $(this).attr('data-keycode', '');   
            $('#tableForm').focus();
        }
    });
    */
    $('#tableSave').on('click', function() {
        generate("C"); 
        $('.table'+id).html($('.table'+id).attr('data-title'));
        markAsDirty();
    });

    $('#tableHelp').on('click', function() {
        ht = "&emsp;&emsp;&emsp;Search for what you want to do:<br>&emsp;<input type='search' id='spreadsheetSearch' style='width:95%' autofocus='true'><br><div id='spreadsheetDetails'></div>";
        fnc = function x() {
            function showFunction(i) {
                out = "<b>"+i.id+"</b>";
                out += "<br>&emsp;<span style='font-family:monospace'>"+i.cmd+"</span>";
                out += "<br>&emsp;"+i.des;
                out += "<ul>";
                for(j in i.param) {
                    out += "<li>"+i.param[j].id+" - "+i.param[j].des+"</li>";
                }
                out += "</ul>";
                $('#spreadsheetDetails').html(out);
            }
            $('#spreadsheetSearch').on('input', function() {
                var t = $(this).val();
                for(i in SpreadsheetAPI) {
                    console.log(i);
                    if(SpreadsheetAPI[i].id == t) {
                        showFunction(SpreadsheetAPI[i]);
                        return;
                    } else if(SpreadsheetAPI[i].tags.indexOf(t) > -1) {
                        showFunction(SpreadsheetAPI[i]);
                        return;
                    }
                }
                $('#spreadsheetDetails').html("Sorry... we can't anything.");
            });
        };
        initiatePopup({title:"Spreadsheet Reference", fnc: fnc, ht: ht, bordercolor:"#2cc36b"});
    });
    $('.PanelMaximizeEvent').on('click', function() {
        if($(this).attr('data-status') == 1) {
            $('#tableHelp').hide(100);
            $('#tableHelpReference, #tableHelpReferenceOut').show(100);
        } else {
            $('#tableHelp').show(100);
            $('#tableHelpReference, #tableHelpReferenceOut').hide(100);
        }
    });
    $('#tableHelpReferenceHelp').on('input', function() {
        $('#tableHelpReferenceOut').html(showSpreadsheetFunction($(this).val()));
    });
    
    $('#tableHelpReference, #tableHelpReferenceOut').hide(100);
    generate("A");
    setTimeout(function() { $('#tableFrame').css('width', ($('.panel_plugin_content').width() - 30)+"px"); }, 1000);
} 

function tableEvaluate(k) {
    console.log(k);
    if(typeof(k) == "number")
        return k;
    //Let's take any specially formatted text and format it using set regular expressions
    for(ii in SpreadsheetAPI) {
        if(SpreadsheetAPI[ii].regin != undefined && SpreadsheetAPI[ii].regout != undefined) {
            var r = new RegExp(SpreadsheetAPI[ii].regin, 'g');
            k = k.replace(r, SpreadsheetAPI[ii].regout); 
        }
    }
    //Now we must iterate through the string to make sure we have all the parenthesis
    var r = new RegExp("(Spreadsheet\\..+\\))|(Spreadsheet.[\\w]*)", 'g');
//    var r = new RegExp("(Spreadsheet.[\\w(,\\s><=$\\\\{}\\\"]*\\))|(Spreadsheet.[\\w]*)",'gi');
    console.log(r);
//    k = k.replace(r, "eval($1)");
    l = k.match(r);
    console.log(l);
    if(l == null)
        l = [];
    console.log(l);
    n = k;
    for(q in l) {
        m = l[q].substr(0, l[q].length);
        console.log(m);
        var j = eval(m).toString();
        //Recursive?
//        j = j.replace(/=/g, "");
        console.log(j);
        var ra = new RegExp(m, 'g');
        console.log(ra);
        console.log(n);
        n = n.replace(ra, j);
    }   
    
    console.log(n);
//    n = n.replace(/=/g, "");
//    console.log(k);
    var p = undefined;
    try {
        if(n.substring(0,1) == "=")
            n = n.substring(1);
        p = eval(n)   
    } catch(e) {
        console.error(e.message);
        console.warn(n);
    }
    console.log(p);
    return p;
}
function showSpreadsheetFunction(str) {
    function showFunction(i) {
                out = "<b>"+i.id+"</b>";
                out += "<br>&emsp;<span style='font-family:monospace'>"+i.cmd+"</span>";
                out += "<br>&emsp;"+i.des;
                out += "<ul>";
                for(j in i.param) {
                    out += "<li>"+i.param[j].id+" - "+i.param[j].des+"</li>";
                }
                out += "</ul>";
                $('#spreadsheetDetails').html(out);
                return out;
            }
    var t = str.toLowerCase();
    if(t.length == 0)
        return "";
    for(i in SpreadsheetAPI) {
        console.log(i);
        if(SpreadsheetAPI[i].id.toLocaleLowerCase() == t) {
            return showFunction(SpreadsheetAPI[i]);
        
        } else if(SpreadsheetAPI[i].tags.indexOf(t) > -1) {
            return showFunction(SpreadsheetAPI[i]);
            
        }
    }
    $('#spreadsheetDetails').html("Sorry... we can't anything.");
    return "Sorry... we can't anything.";
}



function tableDetailsPop(tableid) {
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
function refTextDetails(id) {
    ht = "<span style='font-size:14pt'>Pick an Object. The text will use the figure number of this object. (Just the number)</span><br><div id='Popup'></div>";
    $('.reftext'+id).attr('data-id', id);
    ht += "<input type='hidden' id='PopupId' value='"+id+"'>";
    fnc = function x() {
        id = $('#PopupId').val();
        function populate(ind) {
//            console.log("populate {"+ind+"}");
            var a = $('.img');
            out = "<table style='width:90%'>";
            var i = 0;
            $('.content_textarea .img').each(function() {
                if(ind == i && $('.reftext'+id).attr('data-ref').indexOf('img') > -1)
                    bg = "rgba(0,255,0,.5)";
                else
                    bg = "rgba(0,0,0,0)";
                out += "<tr style='border:solid 1px black;background-color:"+bg+";cursor:pointer;' class='PopupImg' data-i='"+i+"'><td style='text-align:center'><img src='"+$(this).attr('data-src')+"' style='width:50%'></td><td style='vertical-align:center'>&emsp;"+$(this).attr('data-des')+"</td></tr>";     
                i++;
            });
            i = 0;
            $('.content_textarea .table').each(function() {
                if(ind == i && $('.reftext'+id).attr('data-ref').indexOf('table') > -1)
                    bg = "rgba(0,255,0,.5)";
                else
                    bg = "rgba(0,0,0,0)";
                out += "<tr style='border:solid 1px black;background-color:"+bg+";cursor:pointer;' class='PopupTable' data-i='"+i+"'><td style='text-align:center'><td>"+$(this).attr('data-title')+"&emsp;<span style='font-size:10pt'>"+$(this).attr('data-col')+" x "+$(this).attr('data-row')+"</span></td></tr>";     
                i++;
            });
            out += "</table><button class='PopupSave'>Save</button>";
            $('#Popup').html(out);
            $('.PopupImg').on('click', function() {
                $('.reftext'+id).attr('data-ref', 'img'+$(this).attr('data-i')); 
                $('.reftext'+id).attr('data-refid', $(this).attr('data-i')); 
                populate($(this).attr('data-i'));
            });
             $('.PopupTable').on('click', function() {
                $('.reftext'+id).attr('data-ref', 'table'+$(this).attr('data-i')); 
                $('.reftext'+id).attr('data-refid', $(this).attr('data-i')); 
                populate($(this).attr('data-i'));
            });
            $('.PopupSave').on('click', function() {
                closePopup(); 
                markAsDirty();
            });
        }
        if($('.reftext'+id).attr('data-ref') != undefined) {
            populate($('.reftext'+id).attr('data-refid'));
        } else {
            populate(-1);
        }
    };
    initiatePopup({title: "Ref Text", bordercolor:"#09f", ht: ht, fnc: fnc});
}

function LatexGreek(char) {
    return {id:char, keywords: char+" "+char.toLocaleLowerCase(), cmd:"\\"+char.toLowerCase(), param:[], des:"Displays the letter "+char};
}

 window.LatexAPI = {
        /*** LATEX TEXT MARKUP ***/
        Bar: {id:"Bar", keywords:"bar", cmd:"\\bar{x}", param:[{id:"x", des:"Value to get bar placed over it"}], des:"Places a bar over the input value"},
        Subscript: {id:"Subscript", keywords:"element sub subscript", cmd:"_{exp}", param:[{id:"exp", des:"The expression you want subscripted"}], des:"Subscripts a specific input"},
        Superscript: {id:"Superscript", keywords:"exponent sup superscript", cmd:"^{exp}", param:[{id:"exp", des:"The expression you want superscripted"}], des:"Superscripts a specific input"},
        
        /*** LATEX MATH MARKUP ***/
        Fraction: {id:"Fraction", keywords:"frac, fraction, divide, division", cmd:"\\frac{n}{d}", param:[{id:"n", des:"Numerator"},{id:"d", des:"Denominator"}], des:"Displays a fraction"},
        Sum: {id:"Sum", keywords:"sum, summation, sigma", cmd:"\\sum_{i}^{k}", param:[{id:"i", des:"The initial value"},{id:"k", des:"The final value"}],des:"Shows a summation using a sigma"},
        Root: {id:"Root", keywords:"square root radical", cmd:"\\sqrt[root]{exp}", param:[{id:"root", des:"Opt. The root of the radical"},{id:"exp", des:"The expression you want under the radical"}], des:"Shows an expression under a radical"},
            
        /*** LATEX CONSTANTS: GREEK ***/
            
        Alpha: LatexGreek("Alpha"),
        Pi: LatexGreek("Pi"),
        Omega: LatexGreek("Omega"),
        /*** LATEX SYMBOLS & CONSTANTS ***/
        Times: {id:"Times", keywords:"multiplication multiply times", cmd:"\\times", param:[], des:"Displays the times symbol, often used for multiplication"},
        Space: {id:"Space", keywords:"space tab whitespace", cmd:"\\, or \\: or \\;", param:[], des:"Displays a space that is thin, medium, or wide respectively."},
        Bullet: {id:"Bullet", keywordS:"bullet dot times product", cmd:"\\bullet", param:[], des:"Displays a bullet"}
};




function latexDetails(id) {
    ht = "<table style='width:100%'><tr><td style='vertical-align:top;width:50%;'>LaTeX is a form of markup that, among other features, allows for rich math formatting. <br><br>Help:&nbsp;<input type='search' style='width:50%' id='latexSearch' placeholder='Search for something...'><br><span style='font-size:9pt'>Note that mathematical formulas must be placed between \"$\"</span></td><td width:50%;>";
    ht += "<div id='latexRef' style='display:none;background-color: rgba(255,255,255,.1);padding:5px;'></div></td></tr></table>";
   // ht += "<button id='latexPrev'>Preview</button>";
    ht += "<table style='width:99%'><tr><td style='width:50%'><div id='latexCmd' style='height:4em;width:95%;border: solid 1px rgba(0,129,255,1);background-color:"+theme.normfsui+";margin-top:5px;margin-left:5px;margin-bottom:10px;' contenteditable='true'></div></td>";
    
    ht += "<td style='width:50%'><div id='latexView' style='height:4em;width:95%;border: solid 1px;background-color:"+theme.normfsui+";margin-top:5px;margin-left:5px;margin-bottom:10px;'></div></td></tr></table>";
    ht += "<div id='latexBuffer' style='visibility:hidden'></div>";
    ht += "<button id='latexSave'>Save</button>";
    $('.latex'+id).attr('data-id', id);
    ht += "<input type='hidden' id='PopupId' value='"+id+"'>";
    fnc = function x(){
        id = $('#PopupId').val();
        Preview.Init();
        function populate(cmd) {
            var preview = false;
            if(cmd != -1) {
                $('#latexCmd').html(cmd);
                Preview.Update();
            }
            $('#latexPrev').on('click', function() {
                if(preview) { 
                    $('#latexCmd').fadeIn(300);
                    $('#latexView').fadeOut(300);
                    $('#latexPrev').html('Preview');
                    preview = false;
                } else {
                    $('#latexCmd').fadeOut(300);
                    $('#latexView').fadeIn(300);
                    $('#latexPrev').html('View Commands');
                    preview = true;
                }
            });
            $('#latexCmd').on('input', function() {
                $('.latex'+id).html($('#latexView').html());
                $('.latex'+id).attr('data-cmd', $('#latexCmd').text());
                console.log('latexing');
                Preview.Update();
            });
            $('#latexSave').on('click', function() {
                Preview.Update();
                setTimeout(function() {
                    console.log($('#latexView').html());
                    if($('#latexView').html().length < 1)
                        $('#latexView').html("LaTeX")
                    $('.latex'+id).html($('#latexView').html());
                    markAsDirty();
                    closePopup();
                }, 250);
            });
            $('#latexSearch').on('input', function() {
                showLatexReference($(this).val());
            });
        }
        

        
       
        
        
        if($('.latex'+id).attr('data-cmd') != undefined) {
            populate($('.latex'+id).attr('data-cmd'));
        } else {
            populate(-1);
        }  
    };
    initiatePopup({title: "Insert LaTeX", bordercolor: "#f1c40f", ht: ht, fnc: fnc, size: "large"});
}
function showLatexReference(str) {
    function showReference(item) {
        console.log(item);
        out = "<b>"+item.id+"</b><br>";
        out += "<span style='font-family:monospace'>"+item.cmd+"</span>";
        out += "<div style='margin-left:35px;font-size:10pt'><ul>";
        for(i in item.param) {
            out += "<li>"+item.param[i].id+": "+item.param[i].des+"</li>";
        }
        out += "</ul>"+item.des+"</div>";
        $('#latexRef').html(out);
        return out;
    }
    var v = str;
    if(v.length) {
        $('#latexRef').fadeIn(300);
        for(i in LatexAPI) {
            if(v == LatexAPI[i].id) {
//                            console.log(v, console[i].id);
                showReference(LatexAPI[i]); 
                return;
            }
            
            if(LatexAPI[i].keywords.indexOf(v) > -1) {
                showReference(LatexAPI[i]); 
                return;
            }
        }
        $('#latexRef').html("<span style='font-size:11pt'>&emsp;Sorry, that could not be found.</span>");
    } else {
        $('#latexRef').fadeOut(300);   
    }
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
	console.log('Header set');
	window.holoribbon_std =  {
		Home: new Array(
            {text: "Start the Tour", img: "<span class='fa fa-home' style='font-size:18pt'></span>", action: "window.introdisabled = true;introJsStart();", key:"Alt+T"}, 
            {group: "", value:"<span style='font-size:16pt'>Welcome to Gltn!</span>"},
            {text: "Explore Files", img: "<span class='fa fa-folder-open' style='font-size:18pt'></span>", action: "runPanel('main_Filesys')", key: "Alt+O"} 
		//	{group: '', value: '<font size="4" id="temp_header" >Welcome to Gluten!</font><br><table style=\'width:40%;margin-left:30%\'><tr><td><button onclick="window.introdisabled = true;introJsStart();"><span class=\'fa fa-home\'></span>&nbsp;Start the Tour!</button></td><td><button id="iFILESYS" onclick="runPanel(\'main_Filesys\')"><span class=\'fa fa-folder-open\'></span>&nbsp;Explore Files</button></td></tr></table>'}
		),
		File: new Array(
			{group: "File Name", value:"<input type='text' id='file_name' style='width:7em'><button id='file_name_con' disabled='true'>Save As</button><input type='hidden' id='file_name_internal'>"},
			{text: 'Build', img: '<span style="font-size:18pt" class="fa fa-file"></span>', action: "startBuild();setTimeout('exitintro();', 1000);", key: "Alt+B"},
			{text: 'Export', img: '<span style="font-size:18pt" class="fa fa-download"></span>', action: "exportFile();"}
		),
		Panels: new Array(
			{text: 'Gltn Store', img: '<span style="font-size:18pt" class="fa fa-shopping-cart"/>', action: "launchStore()", key: "Alt+S"},
			{text: 'Outline', img: '<span style="font-size:18pt" class="fa fa-list"></span>', action: "runPanel('main_Outline');"},
			{text: 'Citations', img: '<span style="font-size:18pt" class="fa fa-book"></span>', action: "runPanel('main_Citation');"},
			{text: 'Ideas', img: '<span style="font-size:18pt" class="fa fa-lightbulb-o"></span>', action: "runPanel('main_Idea');"},
			{text: 'Style Guide', img: '<span style="font-size:18pt" class="fa fa-info-circle"/>', action: "runPanel('main_Guide');"}
		),
		Tools: new Array(
			{text: 'Find', img: '<span style="font-size:18pt" class="fa fa-search"></span>', action: "runPanel('main_Find');", key: "Alt+F"},
			{text: 'Dictionary', key:"Alt+D", img: '<span style="font-size:18pt" class="fa fa-quote-left"></span>', action: "runPanel('main_Dictionary');"},
			{text: 'Themes', img: '<span style="font-size:18pt" class="fa fa-picture-o"></span>', action: "runPanel('main_Themes')"}
		),
		About: new Array(
			{text: 'Open Source', img: '<span style="font-size:18pt" class="fa fa-github-alt"></span>', action: "window.location='http://www.github.com/fleker/gltn'"},
			{text: 'Send Feedback', img: '<span style="font-size:18pt" class="fa fa-envelope"></span>', action: "window.location='mailto:handnf+gltn@gmail.com'"},
			{text: 'Gltn Blog', img: '<span style="font-size:18pt" class="fa fa-bullhorn"></span>', action:"window.location='http://gltndev.wordpress.com/'"},
			{text: 'Credits', img: '<span style="font-size:18pt" class="fa fa-legal"></span>', action: 'postLegal()'}
		),
		Me: new Array(
			{group: 'Name', value:'<input id="me_name" type="text">'}
		)
	};
	newRibbon('.header', holoribbon_std);
	ribbonSwitch(0,false);
	ribbonLoad();
}
function ribbonLoad() {
	//$('#file_name').val(fileid);
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
		//console.log(v, localStorage[v]);
        ovr = true;
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
	//$('#me_name').val(window.settings.me_name);
	$('#me_name').attr('value', settings.me_name);
	$('#me_name').attr('defaultValue', settings.me_name);
	$('#me_name').on('input', function() {
		writeToSettings('me_name', $('#me_name').val());		
	});
}
function postLegal() {
	out = "©2014 Made by Nick Felker<br>(@HandNF)<br>";
    out += "Made using libraries from Mathjax, Font Awesome, jQuery, Rangy, InkFilepicker, and others<br>";
    out += "Shoutout to everyone who posted online about stuff like replacing text nodes and the ample amount of help from Stacked Overflow.<br>";
    out += "Loader was created by TaniaLD";
	f = function x() { };
	initiatePopup({title:'Credits', value: out, fnc: f});
}
currentpanel = "";
function install_panel(id, name, img, url, service, key) {
	if(service == undefined)
		service = false;
	if(key == undefined)
		key = " ";
	img = img.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
	if(service != true) {
		if(key != undefined && key.length > 0)
			holoribbon_std['Panels'].push({text: name, img: img, action: "runPanel('"+id+"')", key:key});
		else
			holoribbon_std['Panels'].push({text: name, img: img, action: "runPanel('"+id+"')"});
		newRibbon('.header', holoribbon_std);
		console.log("Installing "+name+"...");
		ribbonSwitch(2,false);
		ribbonLoad();
	}
	if(window.settings.panels.indexOf(id) == -1) {
		window.settings.panels += ", "+id;
	}
	window.settings['panels_'+id] = id+", "+name+", "+img+", "+url+", "+service+", "+key;
	
	if(window.offline != true) {
	//Now store script offline - this really sucks though
		loadjscssfile(url, "js");
		//$('body').append('');
		$('#themeframe').attr('src', url);
        window.setTimeout(function() {download_panel(id)}, 200);
        
//        console.log(localStorage['zpanels_'+id]);
//		setTimeout("localStorage['zpanels_"+id+"'] = $('#themeframe').contents().text();", 1000);
	//} else {
	}
	console.log("eval('InitPanel"+id+"();');");
	setTimeout("eval('InitPanel"+id+"();');", 500);	
}
function download_panel(id) {
 if(currentpanel != id) {
    console.log(id, currentpanel);
     if(!currentpanel.length)
         return;
      window.setTimeout(function() {download_panel(id)}, 200);
 } else {
     console.log("Installed");
     localStorage['zpanels_'+id] = $('#themeframe').contents().text();   
 }
}
function uninstall_panel(id) {
	//alert('Fix ribbon');
	//For removing the ribbon, need to compare the name of the ribbon with the name of the panel
	var a = window.settings['panels_'+id].split(', ');
	var b = new Array();
	for(i in holoribbon_std['Panels']) {
		var j = holoribbon_std['Panels'][i];
		//console.log(a[1],i, j);
		if(j.text != a[1]) {
			b.push(j);
			//console.log('Found '+j.text+' as '+id);	
			
		}
	}
	holoribbon_std['Panels'] = b;
	newRibbon('.header', holoribbon_std);

	//Now we can set up a way for panels to turn off stuff
	//We set a short timer so that if it doesn't exist, it doesn't ruin the flow of the function
	setTimeout("eval('RemovePanel"+id+"();');", 1);
	var a = window.settings.panels.split(', ');
	var b = new Array();
	for(i in a) {
		if(a[i] != id) {
			b.push(a[i])
		}	
	}	
	window.settings.panels = b.join(', ');
	window.settings['panels_'+id] = undefined;	
	if(localStorage['zpanels_'+id] != undefined) 
		localStorage.removeItem('zpanels_'+id);
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
	if(window.applicationCache == undefined) {
		alert('You do not have Application Cache in your browser. You may still use Gltn, but it will not work offline.');	
	}
	return !flag.length;
}
function closeButton(i) {
	if(i == 1)
		return "<span class='fa fa-times'/>"
	else
		return '<span class="fa fa-times"/>'	
}
/*** Custom Theming ***/
function initTheme() {
	window.theme = {};	
	//set theme colors/css
	//set theme variables
	//fullscreen variables
	theme.darkbg = "rgb(0, 0, 0)";
	theme.normcolor = "rgb(0, 0, 0)";
	theme.normbg = "rgb(255, 255, 255)";
	theme.darkcolor = "rgb(200, 200, 200)";
	theme.coloralt = '#222';
	theme.normfsui = "rgb(204, 204, 204)";
	theme.darkfsui = "rgb(41, 41, 41)";
	theme.darkfsuicolor = 'white';
	theme.normfsuicolor = 'black';
	theme.ribbonhighlight = 'rgba(0,0,0,.35)';
	theme.ribbonplain = 'rgba(0,0,0,0)';
}
initTheme();
function themeCss(rule, val) {
	$('body').css(rule, val);	
}
function writeCss(rules) {
	$('body').append('<style>'+rules+'</style>');
}
function startThemer() {
	//isn't called until settings are grabbed because otherwise window.settings.theme wouldn't exist
	//grab current theme
	//if not set reset themes
	var url = undefined;
	if(window.settings.theme == undefined) {
		window.settings.theme = "default, blackout";
		window.settings.currenttheme = "default";
		window.settings.theme_default = "default, Default, js/themes/kernel.js, <span class='fa fa-heart-o'></span>";
		window.settings.theme_blackout = "blackout, Blackout, js/themes/theme_blackout.js, <span class='fa fa-heart'></span>";
	} //else {
		var a = window.settings.theme.split(', ');
		var b = window.settings['theme_'+window.settings.currenttheme].split(', ');
		url = b[2];
	//}
	//if not default insert JS
        
	if(url != undefined && b[0] != "default") {
		console.log("Loading theme "+b[1]+" @ "+url);
		console.log(window.offline != true)
		if(window.offline != true) {
			loadjscssfile(url, 'js');
			//Load script and save it
			//Now store script offline - this really sucks though
			$('#themeframe').attr('src', url);		
			setTimeout("localStorage['ztheme_"+id+"'] = $('#themeframe').contents().text();", 1000);
		}
		//JS will have same function and call that script
	} else if(b[0] == "default") {
		initTheme();
        setLoaderColor('32,32,32');
    }
}
function setLoaderColor(col) {
    writeCss('@-webkit-keyframes loader10g{	0%{background-color: rgba('+col+', .2);} 25%{background-color: rgba('+col+', 1);} 50%{background-color: rgba('+col+', .2);} 75%{background-color: rgba('+col+', .2);} 100%{background-color: rgba('+col+', .2);} }');
    writeCss('@keyframes loader10g{0%{background-color: rgba('+col+', .2);} 25%{background-color: rgba('+col+', 1);} 50%{background-color: rgba('+col+', .2);} 75%{background-color: rgba('+col+', .2);} 100%{background-color: rgba('+col+', .2);} }');
    
     writeCss('@-webkit-keyframes loader10m{	0%{background-color: rgba('+col+', .2);}	25%{background-color: rgba('+col+', .2);}	50%{background-color: rgba('+col+', 1);}	75%{background-color: rgba('+col+', .2);}	100%{background-color: rgba('+col+', .2);}}');
    writeCss('@keyframes loader10m{	0%{background-color: rgba('+col+', .2);}	25%{background-color: rgba('+col+', .2);}	50%{background-color: rgba('+col+', 1);}	75%{background-color: rgba('+col+', .2);}	100%{background-color: rgba('+col+', .2);}}');
    
     writeCss('@-webkit-keyframes loader10d{	0%{background-color: rgba('+col+', .2);}	25%{background-color: rgba('+col+', .2);}	50%{background-color: rgba('+col+', .2);}	75%{background-color: rgba('+col+', 1);}	100%{background-color: rgba('+col+', .2);}}');
    writeCss('@keyframes loader10d{	0%{background-color: rgba('+col+', .2);}	25%{background-color: rgba('+col+', .2);}	50%{background-color: rgba('+col+', .2);}	75%{background-color: rgba('+col+', 1);}	100%{background-color: rgba('+col+', .2);}}');
    /*
@keyframes loader10m{
	0%{background-color: rgba(255, 255, 255, .2);}
	25%{background-color: rgba(255, 255, 255, .2);}
	50%{background-color: rgba(255, 255, 255, 1);}
	75%{background-color: rgba(255, 255, 255, .2);}
	100%{background-color: rgba(255, 255, 255, .2);}
}

@-webkit-keyframes loader10d{
	0%{background-color: rgba(255, 255, 255, .2);}
	25%{background-color: rgba(255, 255, 255, .2);}
	50%{background-color: rgba(255, 255, 255, .2);}
	75%{background-color: rgba(255, 255, 255, 1);}
	100%{background-color: rgba(255, 255, 255, .2);}
}
@keyframes loader10d{
	0%{background-color: rgba(255, 255, 255, .2);}
	25%{background-color: rgba(255, 255, 255, .2);}
	50%{background-color: rgba(255, 255, 255, .2);}
	75%{background-color: rgba(255, 255, 255, 1);}
	100%{background-color: rgba(255, 255, 255, .2);}
}');   */
}
function install_theme(id, name, url, icon) {
	if(window.settings.theme.indexOf(id) == -1) {
		window.settings.theme += ", "+id;
		window.settings['theme_'+id] = id+', '+name+', '+url+', '+icon;	
	}
	if(offline != true) {
		//Now store script offline - this really sucks though
		$('#themeframe').attr('src', url);
		setTimeout("localStorage['ztheme_"+id+"'] = $('#themeframe').contents().text();", 1000);
	}
}
function uninstall_theme(id) {
	var a = window.settings.theme.split(', ');
	var b = new Array();
	for(i in a) {
		if(a[i] != id)
			b.push(a[i]);	
		if(a[i] == settings.currenttheme)
			settings.currenttheme = a[i-1];
	}
	window.settings.theme = b.join(', ');
	localStorage.removeItem('theme_'+id);
	if(localStorage['ztheme_'+id] != undefined)
		localStorage.removeItem('ztheme_'+id);
}
function selectTheme(id) {
	var a = window.settings.theme.split(', ');
	var b = new Array();
	for(i in a) {
		if(a[i] == id)
			window.settings.currenttheme = id;	
	}
	//startThemer();
	saveFile();
	setTimeout("window.location.reload();", 150);
}
function onUpdateReady() {
	appcache();
  //window.appcachestatus = "Found new version - Refresh to update";
  console.log('Found new version!');

}
window.applicationCache.addEventListener('error', function() {
	console.error("Error caching files for offline use.");
	if(window.offline != true) {
		window.appcachestatus = "Error caching files for offline use";
		initService("main_Offline", "App caching", "&nbsp;");
	} else {
		window.appcachestatus = "You are currently working offline";
		setTimeout('initService("main_Offline", "App available offline", "<span class=\'fa fa-plane\'></span>");', 2000);
	}
});
window.appcachestatus = "App available offline";
function appcache() {
	console.log("App is now available for offline use.");
	//if($('.contentmain_Offline').length == 0)
		setTimeout('initService("main_Offline", "App available offline", "<span class=\'fa fa-plane\'></span>");', 2000);
	//hot swap	
	try {
		window.applicationCache.swapCache();
	} catch(e) {
		
	}
	return false;
}
function GetPanelmain_Offline() {
	return {title: "<span class='fa fa-plane'></span>&nbsp;Offline", bordercolor:"#ff9900", width: 15};	
}
function RunPanelmain_Offline() {
	out = "<span style='font-size:16pt'>This App is Available Offline</span><br>What Does this Mean?<br><br>If your device is not connected to the Internet, you can still open Gltn in your browser. Of course, not every feature will be available such as the Dictionary and the Gltn Store, but you will be able to edit and build documents like always.<br><br><span style='font-weight:bold;font-size:10pt;color:#ff9900'>"+window.appcachestatus+"</span>";
	postPanelOutput(out);
}
window.applicationCache.oncached = appcache();
window.applicationCache.onupdateready = onUpdateReady();
//window.applicationCache.onerror = console.log('ACE');
//
window.applicationCache.onprogress = function(e) {
    // The event object should be a progress event (like those used by XHR2)
    // that allows us to compute a completion percentage, but if not,
    // we keep count of how many times we've been called.
    var progress = "";
    if (e && e.lengthComputable) // Progress event: compute percentage
        progress = " " + Math.round(100*e.loaded/e.total) + "%"
    else                         // Otherwise report # of times called
        progress = " (" + ++progresscount + ")"

   // console.log("Downloading new version" + progress);
	initService("main_Offline", "App caching", "<span class='fa fa-plane'></span>"+progress);
	window.appcachestatus = "Found new version - Refresh to update";
    postNotification("appcache", "A new version of the app was downloaded. Click to update.", "window.location.reload()");
    return false;
};
function initNotifications() {
	//Notifications live, send out requests?	
	if(window.notifications == undefined) {
		window.notifications = new Array();		
	}
    postNotificationsIcon();
	
	//since appcache is too fast:
	console.log(appcachestatus);
	if(appcachestatus == "Found new version - Refresh to update")
		postNotification("appcache", "A new version of the app was downloaded. Click to update.", "window.location.reload()");
}
function postNotificationsIcon() {
    if(notifications.length == 0)
        initService("main_Notifications", "Notifications (0)", "<span class='fa fa-comment-o'></span>");
    else
        initService("main_Notifications", "Notifications ("+notifications.length+")", "<span class='fa fa-comment'></span>&nbsp;"+notifications.length);
}
function InitPanelmain_Notifications() {
	
}
function GetPanelmain_Notifications() {
	return {title: "Notifications", bordercolor: "#666", width:25};	
}
function RunPanelmain_Notifications() {
	//get window.notifications
	var nonotes = "You have no new notifications";
	var out = "";
	if(notifications.length) {
		for(i in notifications) {
			out += "<div class='notification' style='background-color: rgba(0,255,0,.3);cursor:pointer;padding-left: 5px;padding-top: 5px;border: solid 1px "+theme.coloralt+";' data-id='"+notifications[i].id+"' data-i='"+i+"'><div class='notification_delete fa fa-times' style='width:21px;text-align:center;' data-id='"+notifications[i].id+"'></div>&nbsp;&nbsp;<div style='display:inline-table' onclick='"+notifications[i].action+"' >"+notifications[i].text+"</div></div><br>";
		}
		postPanelOutput(out);
        
        $('.notification_delete').off().hover(function() {
			$(this).css('color', theme.normbg).css('background-color', '#f44').css('border-radius', 100);
		}, function() {
			$(this).css('color', theme.normcolor).css('background-color', 'inherit');
		}).on('click', function() {
            
            for(i in notifications) {
                if(notifications[i].id == $(this).attr('data-id')) {
                    notifications.splice(i);
                    $('.notification[data-i='+i+']').animate({
                        width:'0%',
                        opacity:0
                    }, 300);
                    postNotificationsIcon();
                }   
            }
        });
        
        
	} else {
		postPanelOutput(nonotes);	
	}
}
function postNotification(id, text, action) {
    if(notifications == undefined)
            initNotifications();
	var npush = -1;
	for(i in notifications) {
		if(notifications[i].id == id)
			npush = i;
	}
	if(npush == -1) {
		notifications.push({id:id, text:text, action:action});
		postNotificationsIcon();
	} else {
		notifications[npush] = {id:id, text:text, action:action};
		postNotificationsIcon();
	}
}

/*** Context API ***/
function initContext() {
	if(window.context == undefined)
		window.context = new Array();
	parseCT();
		//formatHovertag("img", "'Image Details'", "'imgDetails('+$(this).attr('data-id')+');'");
	$('.content_textarea').on('keydown', function( event ) {
	  if ( event.which == 32 ) {
	  	parseCT();
		//contentAddText(' ');
	  	//event.preventDefault();
	  }
	});
    
    var exists = false;
    for(i in hovertagRegistrar) {
//        console.log(hovertagRegistrar[i].classname);
        if(hovertagRegistrar[i].classname == "context")
            exists = true;
    }
    if(!exists)
        formatHovertag('context', "window.context[parseInt($(this).attr('data-i'))].type", "'contextPanel('+$(this).attr('data-i')+')'");
}
function parseCT() {
	var r = new RegExp('<span class="context" [^>]*>([\\s\\S]+?)</span>', 'gi');
	try {
		saveSelection();
		var a = $('.content_textarea').html();
   		a = a.replace(r, '$1');
		$('.content_textarea').html(a);
//		console.log(a, r);
	} catch(e) {
		console.error(e.message);
		var a = $('.content_textarea').html();
		a = a.replace(r, '$1');
		$('.content_textarea').html(a);
	}
	//findTextReplaceText(r, '$1');
	//Now we ping other functions, one internal and one by {format}.js to set up stuff
	contextMarkup();
	//console.log($('.content_textarea').html());	
	try {
		onStyleMarkup();
	} catch(e) {
		
	}
	try {
		restoreSelection();	
	} catch(e) {
		
	}
	//Now we do a jQuery event
}
function contextPanel(e) {
	//occurs when item is clicked
	
	//Create intent
	var f = $('.context[data-i='+e+']');
	create_panel_data({html:f.html(), index:f.attr('data-i')});
	//Launch panel
	runPanel('main_Context');
	//In panel, populate data and organize it
	console.log(f.html());

}
function apply_context(text, d) {
	//Finds text (or HTML unfortunately FTM) and replaces it
	var a = $('.content_textarea').html();
	var r = new RegExp('('+text+')', 'gi');
	var b = a.match(r);
	if(b != null) {
		//a = a.replace(r, "<span class='context' data-i='"+window.context.length+"'>$1</span>");
		//$('.content_textarea').html(a);
		if(d.type == "Don't Overuse") {
			var wc = $('.content_textarea').text().split(' ').length;
			var ac = a.match(r);
			if(ac != null) {
				if((ac.length / wc) > d.limit) {
					findTextReplaceText(r, "<span class='context' data-i='"+window.context.length+"'>$1</span>");
					window.context.push(d);
				}
				console.log(ac.length, wc, (ac.length/wc),d.limit);
			}
		} else {
			findTextReplaceText(r, "<span class='context' data-i='"+window.context.length+"'>$1</span>");
			window.context.push(d);
		}
	}
	//Hovertag - use d.type
}
function contextMarkup() {
	//Markup the paper with all these issues, tied with a content object that will give users a recommendation
	function getStrunkTips(note) {
		return "From William Strunk Jr:<br><i style='font-size:10pt'>"+note+"</i>"
	}
	var revise = "Consider Revising";
	var syn = "Suggested Synonym";
	var remove = "Remove Word";
	var overuse = "Don't Overuse";
    var chars = "Replace Characters";
	/***/
	var simplify = "Simplify your sentence by using just one word.";
	var preposition = "You don't need a prepositional phrase to give a specific meaning.";
	var nouning = "A noun should not necessarily be turned into a verb.";
	var overusetip = "Don't overuse this word in your writing.";
	/***/
	var rare = .05;
	var urare = .005;
	
	apply_context("[sS]tudent [bB]ody", {type:"Consider Revising", replacement:"studentry", text: getStrunkTips("Use the word studentry instead of the two word phrase 'student body'. It is cleaner.")});
	apply_context("[Tt]he question as to whether", {type: "Consider Revising", replacement:"whether", text: getStrunkTips(simplify)});
	apply_context("[Tt]he fact that", {type: "Consider Revising", replacement:"", text: getStrunkTips("Don't overcomplicate your sentence. Get rid of this phrase. You don't need it.")});
	apply_context("[Nn]ot honest", {type: "Consider Revising", replacement:"Dishonest", text: getStrunkTips(simplify)});
	apply_context("[Nn]ot important", {type: revise, replacement: "trifling", text: getStrunkTips(simplify)});
	apply_context("[Dd]id not remember", {type: revise, replacement: "forgot", text: getStrunkTips(simplify)});
	apply_context("[Dd]id not pay any attention to", {type: revise, replacement: "ignored", text: getStrunkTips(simplify)});
	apply_context("[Dd]id not have any confidence in", {type: revise, replacement: "distrusted", text: getStrunkTips(simplify)});
	apply_context("[Hh]e is a man who", {type: revise, replacement: "he", text: getStrunkTips(simplify)});
	apply_context("[Tt]here is no doubt but that|[Tt]here is no doubt that", {type: revise, replacement: "no doubt", text: getStrunkTips("You can simplify this phrase by stating 'no doubt' or 'doubtless'.")});
	apply_context("[Ii]n a hasty manner", {type: revise, replacement: "hastily", text: getStrunkTips(simplify)});
	apply_context("[Tt]he reason why is that", {type: revise, replacement: "because", text: getStrunkTips(simplify)});
	apply_context("[Tt]his is a reason that", {type: revise, replacement:"this subject", text: getStrunkTips(simplify)});
	
	apply_context("[Cc]ope", {type: syn, replacement:"cope with", text: getStrunkTips("Including 'with' will improve the sentence's flow.")});
	apply_context("[Aa]nticipate", {type: syn, replacement:"expect", text: getStrunkTips("Don't use fancy words when a simpler word works much better.")});
	apply_context("[Uu]tilize", {type: syn, replacement: "use", text: getStrunkTips("Don't use fancy words when a simpler word works much better.")});
	apply_context("[Oo]wing to the fact that", {type: revise, replacement: "since", text: getStrunkTips("This phrase can be replaced with 'since' or 'because' and retain the same meaning.")});
	apply_context("[Ii]n spite of the fact that", {type: revise, replacement: "although", text: getStrunkTips(simplify)});
	apply_context("[Cc]all your attention to the fact that", {type: revise, replacement: "remind you", text: getStrunkTips("You can easily replace that whole phrase with two words. Why overcomplicate things?")});
	apply_context("I was unaware of the fact that", {type: revise, replacement: "I was unaware that", text: getStrunkTips("You can remove the phrase 'of the fact' and the meaning won't change.")});
	apply_context("[Tt]he fact that he had not succeeded", {type: revise, replacement: "his failure", text: getStrunkTips("Be direct with your sentences. Don't overcomplicate things.")});
	apply_context("[Tt]he fact that I had arrived", {type: revise, replacement: "my arrival", text: getStrunkTips("Don't state 'the fact that' because it becomes too wordy. 'My arrival' has the same meaning.")});
	apply_context("[Ww]ho is a member of", {type: revise, replacement: "a member of", text: getStrunkTips("Using the word 'who' in a non-question makes the sentence overly complicated.")});
	apply_context("[Aa]s to whether", {type: revise, replacement: "whether", text: getStrunkTips(preposition)});
	apply_context("[Aa]s yet|[Aa]s of yet", {type: revise, replacement: "yet", text: getStrunkTips(preposition)});
	apply_context("[Ee]nthuse", {type: remove, replacement: "", text: getStrunkTips(nouning)});
	apply_context("[Ff]acility", {type: revise, text: getStrunkTips("This is a very broad word. You should consider being more specific to help the reader understand and create more sophisticated imagery.")});
	apply_context("[Ff]olk", {type: revise, text: getStrunkTips("This word is very colloquial. You should consider changing the word to be more sophisticated.")});
	apply_context("[Pp]ersonalize", {type: revise, text: getStrunkTips("You should consider changing the word. It has a pretentious connontation.")});
	apply_context("[Tt]he foreseeable future", {type: revise, text: getStrunkTips("What is the definition of 'foreseeable'? This phrase is vague and should be replaced by something more specific.")});
	apply_context("[Tt]ry and", {type: revise, replacement: "try to", text: getStrunkTips("If you're going to 'try and' do something else, then you're doing two separate actions. If so, 'try' isn't very specific and should be improved. If you're doing a single action, you'll 'try to' do that one thing.")});
	apply_context("[Ee]ach and every one", {type: revise, text: getStrunkTips("Unless this is said in conversation, it should be removed. This phrase is very wordy and could easily be simplified to a single word.")});
    
    apply_context("--", {type: chars, text: "Use this character instead", replacement:"—"});
   // apply_context("...", {type: chars, text: "Use this character instead", replacement:"…"});
	
	/***/
	apply_context("[Vv]ery", {type: overuse, text: getStrunkTips(overusetip), limit: rare});
	apply_context("[Pp]rodigious", {type: overuse, text: getStrunkTips(overusetip), limit: rare});
	apply_context("[Cc]urvaceous", {type: overuse, text: getStrunkTips(overusetip), limit: rare});
	apply_context("[Dd]iscombobulate", {type: overuse, text: getStrunkTips(overusetip), limit: urare});
	apply_context("[Rr]eally", {type: overuse, text: getStrunkTips(overusetip), limit: rare});
	apply_context("[Ii]ncredibly", {type: overuse, text: getStrunkTips(overusetip), limit: rare});
}
function GetPanelmain_Context() {	
	return {title: "Writing Tips", bordercolor:"#16a085", width:25};	
}
function RunPanelmain_Context() {
	var d = grab_panel_data();	
	var e = window.context[d.index];
	out = '<br><span style="font-size:15pt;font-style:italics;">"'+d.html+'"</span>';
	out += '<br>&emsp;(<b style="font-size:10pt">'+e.type+'</b>)<br><br>'+e.text+'<br>';
	if(e.replacement != undefined) {
		//Create option to replace all values (or just that one)
		//$('span[data-i=0]')
		out += '<br><br><br><b>What to Do</b><br>&emsp;<span style="font-size:11pt; cursor:pointer;border-bottom:solid 1px '+theme.normcolor+'" class="contextReplaceA">Replace all with "'+e.replacement+'"</span>';	
		//<span style="font-size:11pt; cursor:pointer;border-bottom:solid 1px '+theme.normcolor+'" class="contextReplace">Replace this with "'+e.replacement+'"</span><br><br>&emsp;
	}
	postPanelOutput(out);
	$('.contextReplace').on('click', function() {
		//Global and singular
		console.log($('.context[data-i='+d.index+']'));
		$('.context[data-i='+d.index+']').html(e.replacement);
		parseCT();
	});
	$('.contextReplaceA').on('click', function() {
		//Global and singular
		var re = new RegExp(d.html, 'gi');
		console.log(re, e.replacement);
		findTextReplaceText(re, e.replacement);
		parseCT();
	});
}
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


/*** Sync Service - Not directly related to files ***/
function GetPanelmain_Sync() {
    return {title: "Sync", bordercolor: "#34495e", width:20};   
}
function RunPanelmain_Sync() {
    out = "<span style='font-size:15'>Sync is On</span><br>This file is currently saved somewhere online. You can access it from a different computer.";
    postPanelOutput(out);
}
function initMathjax() {
    window.Preview = {
  delay: 150,        // delay after keystroke before updating

  preview: null,     // filled in by Init below
  buffer: null,      // filled in by Init below

  timeout: null,     // store setTimout id
  mjRunning: false,  // true when MathJax is processing
  oldText: null,     // used to check if an update is needed

  //
  //  Get the preview and buffer DIV's
  //
  Init: function () {
    this.preview = document.getElementById("latexView");
    this.buffer = document.getElementById("latexView");
  },

  //
  //  Switch the buffer and preview, and display the right one.
  //  (We use visibility:hidden rather than display:none since
  //  the results of running MathJax are more accurate that way.)
  //
  SwapBuffers: function () {
    var buffer = this.preview, preview = this.buffer;
    this.buffer = buffer; this.preview = preview;
    buffer.style.visibility = "hidden"; buffer.style.position = "absolute";
    preview.style.position = ""; preview.style.visibility = "";
  },

  //
  //  This gets called when a key is pressed in the textarea.
  //  We check if there is already a pending update and clear it if so.
  //  Then set up an update to occur after a small delay (so if more keys
  //    are pressed, the update won't occur until after there has been 
  //    a pause in the typing).
  //  The callback function is set up below, after the Preview object is set up.
  //
  Update: function () {
    if (this.timeout) {clearTimeout(this.timeout)}
    this.timeout = setTimeout(this.callback,this.delay);
  },

  //
  //  Creates the preview and runs MathJax on it.
  //  If MathJax is already trying to render the code, return
  //  If the text hasn't changed, return
  //  Otherwise, indicate that MathJax is running, and start the
  //    typesetting.  After it is done, call PreviewDone.
  //  
  CreatePreview: function () {
      //console.log(this);
    Preview.timeout = null;
    if (this.mjRunning) return;
    var text = document.getElementById("latexCmd").innerHTML;
      console.log(this.oldtext, text);
    if (text === this.oldtext) return;
    this.buffer.innerHTML = this.oldtext = text;
    this.mjRunning = true;
      console.log(text);
    
    MathJax.Hub.Queue(
      ["Typeset",MathJax.Hub,this.buffer],
      ["PreviewDone",this]
    );
  },

  //
  //  Indicate that MathJax is no longer running,
  //  and swap the buffers to show the results.
  //
  PreviewDone: function () {
    this.mjRunning = false;
    this.SwapBuffers();
  },
        
  doNothing: function() {
        
    }
};

//
//  Cache a callback to the CreatePreview action
//
Preview.callback = MathJax.Callback(["CreatePreview",Preview]);
Preview.callback.autoReset = true;  // make sure it can run more than once
   
//Initialize all the LaTeX attributes because they look ugly at first (this is seriously going to hurt sync though)
    $('.latex').each(function() {
        $(this).html($(this).attr('data-cmd'));
        console.log($(this).html());
        //console.log(MathJax.Hub);
        MathJax.Hub.Queue(
          ["Typeset",MathJax.Hub,this],
          ["doNothing",Preview]
        );
    });
}
function postLatex(cmd, callbackFnc) {
    if($('#latexdummy').length == 0) {
        $('body').append("<span id='latexdummy' style='display:none'></span>");   
    }
    $('#latexdummy').html(cmd);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"latexdummy"], 'getLatex');
    
    
    
//    setTimeout(function() { return $('.latexdummy').html() }, 200);
}

function getLatex() {
    return $('#latexdummy').html();
}

//function doNothing() {
//    
//}
function getLoader(mL) {
    if(mL == undefined)
        return "<div class='loader10'></div>"; 
    else
        return "<div class='loader10' style='margin-left:"+mL+"px'></div>"; 
}

