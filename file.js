// File.js handles the saves and restores, changing the formatting, and other file-related functions (convert to PDF? LaTeX, .doc)

//Since the file initiates when it loads, you can do some initization 
citation = new Array();
citationi = 0;

idea = new Array();
ideadefault = "";
fileid = window.location.search.substr(6);

min_char = 0;
max_char = 0;
min_word = 0;
max_word = 0;

hovertagRegistrar = new Array();
obj = {};
document.ready = function() {
	console.log('Gltn has woken up: v 1.0.1.4');
	restoreFile();
};

function saveFile() {
	try {
		window.document.title = "✎"+valMetadata('Title');
	} catch(e) {
		window.document.title = 'Editing Document';
	}	
	fileid = $('#file_name_internal').val();
	$('.content_save').hide();
	//console.log(o.gluten_doc, x, obj);
	if(window.jsonsave == undefined) 
		obj = x;
	else 
		obj = jsonsave.gluten_doc;
	//console.log(window.jsonsave, x, obj);
	for(i=0;i<citation.length;i++) {
		if(citation[i] == undefined)
			citation[i] = "undefined";
	}
	obj.citation = citation;
	obj.citationi = citationi;
	obj.idea = idea;
	obj.ideadefault = ideadefault;
	obj.hovertagRegistrar = hovertagRegistrar;
	obj.file = {};
	obj['file']['format'] = $('#file_format').val();
	obj['file']['language'] = $('#file_language').val();
	obj['file']['tags'] = $('#file_tags').val();
	obj['file']['min_char'] = 0;
	obj['file']['max_char'] = 0;
	obj['file']['min_word'] = 0;
	obj['file']['max_word'] = 0;
	
	//Integrated saves
	if(window.saved != undefined) {	
		obj.saved = {};
		for(i in window.saved) {
			if(window.saved[i] != undefined) {
				writeToSaved(i, window.saved[i]);
				obj.saved[i] = window.saved[i];
			}
		}
	}
	//console.log(obj);
	if(obj.metadata == undefined) 
		obj.metadata = {};
	for(i in window.metadata) {
//		console.log(obj.metadata,i,window.metadata[i].id,obj['metadata'][window.metadata[i].id]);
		var att = window.metadata[i].id.replace(/ /g, '_');
		//console.warn(i);
		obj['metadata'][att] = grabMetadata(i).value;
		//console.log(obj.metadata);
		//console.warn(i);
	}
	content = $('.content_textarea').html();
	o = {};
	o.gluten_doc = obj;
	window.jsonsave = o;
	//console.log(o);
	xo = json2xml(o, "");
	localStorage[fileid] = xo;
	localStorage[fileid+"_c"] = content;
	 
	//Save global settings - Integrated saves
	op = {};
	opbj = {};
	if(window.settings != undefined) {	
		for(i in window.settings) {
//			console.warn("WS "+i);
			writeToSettings(i, window.settings[i]);
			opbj[i] = window.settings[i];
		}
	}
	op.gluten_prefs = opbj;
	xo = json2xml(op, "");
	localStorage['settings'] = xo;
	
	
	$('.content_save').show();
	$('.content_save').html("<span class='fa fa-file-text' style='color:"+window.theme.coloralt+"'></span>&nbsp;<span class='fa fa-check' style='color:"+window.theme.coloralt+"'></span>");
}
docformat = '';
function restoreFile() {
	$("#file_format").on("input", function() {
		console.log($(this).val());
		formatShift();
	});
	
	
	//Load Global Settings
	try {
	xpref = $.xml2json(localStorage['settings']);
	if(xpref != undefined) {
		window.settings = {};
		for(i in xpref) {
			window.settings[i] = xpref[i].replace(/&gt;/g, ">").replace(/&lt;/g, "<");	
		}
	}
	startThemer();
	} catch(e) {
		console.error(e.message);
		var z=confirm("Your settings file isn't working. Click okay to send a bug report.");
		var y=confirm("You'll need to reset your settings. Click okay to clear settings.");
		if(z == true) {
			window.location = "mailto:handnf+gltn@gmail.com?subject=Settings%20Error&body="+encodeURIComponent(localStorage['settings']);
		}
		if(y == true)
			localStorage.removeItem("settings");
	}
	
	
	//var x = xml2json(jQuery.parseHTML(localStorage[fileid]),"  ");
	try {
	x = jQuery.xml2json(localStorage[fileid]);
	} catch(e) {
		console.error(e.message);
		var z = confirm("This document has improper XML. Click okay to send a bug report.");
		var y = confirm("Click okay to delete all metadata. This removes citations, but keeps the main content.");	
		if(z == true)
			window.location = "mailto:handnf+gltn@gmail.com?subject=File%20"+fileid+"%20Broken&body="+encodeURIComponent(localStorage[fileid]);
		if(y == true) 
			localStorage.removeItem(fileid);
	}
	//$.xml2json(xml);
	xc = localStorage[fileid+"_c"];
	if(x.file != undefined) {
		//Load Script
		$('#file_format').val(x.file.format);
		$('#file_name').val(fileid);
		$('#file_name_internal').val(fileid);
		docformat = x.file.format;
		console.log(docformat);
		loadjscssfile(docformat+".js", "js");
		
		$('#file_language').val(x.file.language);
		$('#file_tags').val(x.file.tags);
		min_char = x.file.min_char;
		max_char = x.file.max_char;
		min_word = x.file.min_word;
		max_word = x.file.max_word;
		//console.error(x.citation);
		if(x.citation == undefined) {
			//do nothing
		} else {
			for(i in x.citation) {
				if(x.citation[i] == "undefined")
					citation.push(undefined);
				else 
					citation.push(x.citation[i]);	
			}
		}
		citationi = x.citationi;
		
		if(x.idea != undefined)	
			idea = x.idea;
		ideadefault = x.ideadefault;
		
		if(x.saved != undefined) {
			window.saved = {};
			for(i in x.saved) {
				window.saved[i] = x.saved[i].replace(/&gt;/g, ">").replace(/&lt;/g, "<");	
			}
		}
		
		if(x.hovertagRegistrar == undefined) {
			
		} else if(x.hovertagRegistrar.length == undefined && x.hovertagRegistrar != undefined) {
			hovertagRegistrar.push(x.hovertagRegistrar);
		} else if(x.hovertagRegistrar.length > 1) {
			for(i in x.hovertagRegistrar) {
					hovertagRegistrar.push(x.hovertagRegistrar[i]);	
				}
		}
		setTimeout("finishRestore(x,xc);", 300);		
	} else {
		//New document - most things initialize at the top of this file
		//$('#file_format').val("APA");
		//loadjscssfile("APA.js", "js");
		//setTimeout("finishRestore(x,xc);", 300);
		newFile(x,xc);
	}
}
function finishRestore(x, xc) {
	try {
		//if(x == undefined) {
			//newFile();	
		//} else {
			//if(x.file != undefined) {
				onInitFormat();
			//}
			//else
				//newFile();
		//}
	} catch(e) {
		console.error(e.message);
		setTimeout("finishRestore('"+x+"','"+xc+"');",100);
		return;
	}
	//console.log(5);
	if(x.file != undefined) {
		/*for(i in x['metadata']) {
			//window.metadata[i] = x['metadata'][i];	
			//console.log(4);
			//$('#format_item_'+i).val(window.metadata[i]['value']);
			for(j in window.metadata) {
				if(x.metadata[i].id == window.metadata.id) {
					$('#format_item_'+i).val(x.metadata[i]['value']);
					$('#format_item_'+i).html(x.metadata[i]['value']);
				}
			}
		}	*/
		formatShift2();
		//console.log(3);
		//Do a little more cleaning up
		try {
			$('.content_textarea').html(xc.replace(/<span class="searchResult">/g, ""));
		} catch(e) {
			console.error("*"+e.message);
		}	
		$('#file_name').val(fileid);
	} else {
		//Brand new file - let's do some base stuff here.
		//newFile(x,xc);
	}
	
	recallHovertags();
	postWordCount();
	setHeader();
	initNiftyUI4Saving();
	initPanels();
	//start save client because code should all work by this point
	hideHovertag();
	console.log("Client save initiated; This is a go for launch.");
	setInterval("saveFile()", 500);
}
function newFile(x,xc) {
	console.log('No file found for this name.');
	$('#file_format').val("MLA");
	$('#file_name').val(fileid);
		x.file = {};
	formatShift();
	setTimeout('finishRestore(x,xc);newFile2();', 1000);
	
}	
function newFile2() {
	console.log('Creating new file...');
	//Add me data
	for(i in window.metadata) {
	//	console.log(window.metadata[i].id, i);
		if(window.metadata[i].id == "Author") {
			console.log(i, window.settings.me_name);
			//console.log($('#f'+i));
			$('#format_item_'+i).val(window.settings.me_name);
		}
	}
	//Call {format}
			
}
function exportFile() {
	falseBuild();
	add_new_page();	
	add_to_page("File XML:<br><textarea style='width:95%;height:200px;'>"+localStorage[fileid]+"</textarea><br>");
	add_to_page("Content HTML:<br><textarea style='width:95%;height:200px;'>"+localStorage[fileid+'_c']+"</textarea><br>");
	//fa fa-save
	add_to_page("<br><button onclick='downloadXML()' style='font-size:14pt'><span class='fa fa-cloud-download'></span>&nbsp;Download</button><br>");
	//add_to_page('Execute this code in a web console to transfer the files over to a different computer:<br><textarea style="width:95%;height:200px;">localStorage["'+fileid+'5"] = \042'+localStorage[fileid].replace(/"/g, '\\"')+'\042;localStorage["'+fileid+'5_c"] = \042'+localStorage[fileid+"_c"].replace(/"/g, '\\"')+'\042;</textarea>');
}

function writeToSaved(att, val) {
	if(val != undefined && att != undefined) {
		val = val.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&nbsp;/g, " ").replace(/&emsp;/g, ' ');
		//console.log(val);
		if(window.saved != undefined)
			window.saved[att] = val;
		else {
			window.saved = {};
			window.saved[att] = val;
		}		
	}
}
function writeToFile(att, val) {
	writeToSaved(att, val);	
}
function writeToSettings(att, val) {
	if(val != undefined && att != undefined) {
		val = val.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&nbsp;/g, " ").replace(/&emsp;/g, ' ');		
	}
	if(window.settings == undefined)
		window.settings = {};	
	window.settings[att] = val;
}
//Nifty UI for saving
function initNiftyUI4Saving() {
	$('span, div, input').on('input', function() {
		$('.content_save').html("<span class='fa fa-file-text' style='color:"+window.theme.coloralt+"'></span>&nbsp;<span class='fa fa-pencil' style='color:"+window.theme.coloralt+"'></span>");
	});	
}
function downloadXMLX() {
	//creates an XML file
	content = $('.content_textarea').html();
	title = valMetadata('Title');
	console.log(xo);
	var blob = new Blob([xo+content], {type: "text/plain;charset=utf-8"});
	saveAs(blob, title+".txt");	
}
function downloadXML() {
	filename = valMetadata('Title')+".gltn";
	filename = fileid+".gltn";
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xo+content));
    pom.setAttribute('download', filename);
    pom.click();
}
function deleteFile(id) {
	localStorage.removeItem(id)
	localStorage.removeItem(id+"_c");
}	
//Formatting Script Launcher
function createjscssfile(filename, filetype){
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", filename)
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  var fileref=document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", filename)
 }
 return fileref
}

function replacejscssfile(oldfilename, newfilename, filetype){
 var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist using
 var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
 var allsuspects=document.getElementsByTagName(targetelement)
 for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
  if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename)!=-1){
   var newelement=createjscssfile(newfilename, filetype)
   allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i])
  }
 }
}
function loadjscssfile(filename, filetype){
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", filename);
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  var fileref=document.createElement("link")
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", filename);
 }
 if (typeof fileref!="undefined") {
  document.getElementsByTagName("head")[0].appendChild(fileref);
  //console.log("loading "+filename);
 }
}

var filesadded="" //list of files already added

function checkloadjscssfile(filename, filetype){
 if (filesadded.indexOf("["+filename+"]")==-1){
  loadjscssfile(filename, filetype)
  filesadded+="["+filename+"]" //add to list of files already added, in the form of "[filename1],[filename2],etc"
 }
 else
  alert("file already added!")
}
//format = 'mla';
function formatShift() {
	//unload js file
	format2 = $('#file_format').val();
	for(i in formats) {
		if(formats[i].name == docformat && formats[i].uri != undefined)
			docformat = formats[i].uri;
		else if(formats[i].name == docformat)
			docformat = docformat+'.js';
		if(formats[i].name == format2) {
//			console.log(docformat, formats[i]);
			//replacejscssfile('formats/'+docformat+'/format.js', 'formats/'+format2+'/format.js', 'js');
			if(formats[i].uri == undefined)
				replacejscssfile(docformat, format2+".js", "js");
			else
				replacejscssfile(docformat, formats[i].uri, "js");
			docformat = format2;
			//alert("Shift formats");
			//setTimeout("save();$('#body').empty();input();save();", 500)
			setTimeout("onInitFormat();$('.content_textarea').html(xc);", 500);
			setTimeout('formatShift2()', 510);
			console.log('The document format is shifting.');
		}
	}
}
function formatShift2() {
	//Set up parameters	
	for(i in x['metadata']) {
			//window.metadata[i] = x['metadata'][i];	
			//console.log(4);
			//$('#format_item_'+i).val(window.metadata[i]['value']);
			for(j in window.metadata) {
				//console.log("'"+x.metadata[i].id+"'", "'"+window.metadata[j].id+"'");
//				console.log(i,j);
				if(i == window.metadata[j].id.replace(/ /g, '_') && $('#format_item_'+j).val().length == 0) {
//					console.log(i,j,x.metadata[i]);
					//console.log($('#format_item_'+j).val(), i);
					$('#format_item_'+j).val(x.metadata[i]);
					$('#format_item_'+j).html(x.metadata[i]);
				} else {
					//console.log('-');	
				}
			}
	}
	console.log('The document format has shifted.');
}
