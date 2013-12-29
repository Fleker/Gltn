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
document.ready = function() {
	restoreFile();
};

function saveFile() {
	window.document.title = "✎"+valMetadata('Title');
	fileid = $('#file_name_internal').val();
	$('.content_save').hide();
	obj = {};
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
			writeToSaved(i, window.saved[i]);
			obj.saved[i] = window.saved[i];
		}
	}
	//console.log(obj);
	obj.metadata = new Array();
	for(i in window.metadata) {
		//console.log(obj.metadata);
		//console.warn(i);
		obj['metadata'][i] = grabMetadata(i);
		//console.log(obj.metadata);
		//console.warn(i);
	}
	content = $('.content_textarea').html();
	o = {};
	o.gluten_doc = obj;
	//console.log(o);
	xo = json2xml(o, "");
	localStorage[fileid] = xo;
	localStorage[fileid+"_c"] = content;
	 
	//Save global settings - Integrated saves
	o = {};
	obj = {};
	if(window.settings != undefined) {	
		for(i in window.settings) {
			writeToSettings(i, window.settings[i]);
			obj[i] = window.settings[i];
		}
	}
	o.gluten_prefs = obj;
	xo = json2xml(o, "");
	localStorage['settings'] = xo;
	$('.content_save').show();
}
docformat = '';
function restoreFile() {
	$("#file_format").on("input", function() {
		console.log($(this).val());
		formatShift();
	});
	//var x = xml2json(jQuery.parseHTML(localStorage[fileid]),"  ");
	x = jQuery.xml2json(localStorage[fileid]);
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
		loadjscssfile("APA.js", "js");
		setTimeout("finishRestore(x,xc);", 300);
	}
}
function finishRestore(x, xc) {
	try {
		onInitFormat();
	} catch(e) {
		console.error(e.message);
		setTimeout("finishRestore('"+x+"','"+xc+"');",100);
	}
	//console.log(5);
	if(x.file != undefined) {
		for(i in x['metadata']) {
			//window.metadata[i] = x['metadata'][i];	
			//console.log(4);
			//$('#format_item_'+i).val(window.metadata[i]['value']);
			$('#format_item_'+i).val(x.metadata[i]['value']);
			$('#format_item_'+i).html(x.metadata[i]['value']);
		}	
		//console.log(3);
		//Do a little more cleaning up
		$('.content_textarea').html(xc.replace(/<span class="searchResult">/g, ""));
		$('#file_name').val(fileid);
	} else {
		$('#file_format').val("APA");
		$('#file_name').val(fileid);
	}
	//Load Global Settings
	xpref = $.xml2json(localStorage['settings']);
	if(xpref != undefined) {
		window.settings = {};
		for(i in xpref) {
			window.settings[i] = xpref[i].replace(/&gt;/g, ">").replace(/&lt;/g, "<");	
		}
	}
		//console.log(2);
	recallHovertags();
	postWordCount();
	setHeader();
	//start save client because code should all work by this point
	console.log("Client save initiated; This is a go for launch.");
	setInterval("saveFile()", 100);
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
		val = val.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&nbsp;/g, " ");
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
		val = val.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&nbsp;/g, " ");		
	}
	if(window.settings == undefined)
		window.settings = {};	
	window.settings[att] = val;
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
			console.log(docformat, formats[i]);
			//replacejscssfile('formats/'+docformat+'/format.js', 'formats/'+format2+'/format.js', 'js');
			if(formats[i].uri == undefined)
				replacejscssfile(docformat, format2+".js", "js");
			else
				replacejscssfile(docformat, formats[i].uri, "js");
			docformat = format2;
			//alert("Shift formats");
			//setTimeout("save();$('#body').empty();input();save();", 500)
			setTimeout("onInitFormat();$('.content_textarea').html(xc);setInterval('saveFile()', 100);", 500);
		}
	}
}
