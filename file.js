// File.js handles the saves and restores, changing the formatting, and other file-related functions (convert to PDF? LaTeX, .doc)

//Since the file initiates when it loads, you can do some initization 
citation = new Array();
citationi = 0;

idea = new Array();
ideadefault = "";
fileid = "4xW";

min_char = 0;
max_char = 0;
min_word = 0;
max_word = 0;

hovertagRegistrar = new Array();
document.ready = function() {
	restoreFile();
};

function saveFile() {
	$('.content_save').animate({
		opacity: 0.01
	},100);
	obj = {};
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
	console.log(obj);
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
	xo = json2xml(o, "  ");
	localStorage[fileid] = xo;
	localStorage[fileid+"_c"] = content;
	$('.content_save').animate({
		opacity: 1
	},100);
}
docformat = '';
function restoreFile() {
	//var x = xml2json(jQuery.parseHTML(localStorage[fileid]),"  ");
	x = jQuery.xml2json(localStorage[fileid]);
	//$.xml2json(xml);
	xc = localStorage[fileid+"_c"];
	if(x != undefined) {
		//Load Script
		$('#file_format').val(x.file.format);
		docformat = x.file.format;
		console.log(docformat);
		loadjscssfile(docformat+".js", "js");
		
		$('#file_language').val(x.file.language);
		$('#file_tags').val(x.file.tags);
		min_char = x.file.min_char;
		max_char = x.file.max_char;
		min_word = x.file.min_word;
		max_word = x.file.max_word;

		if(x.citation == undefined) {
			
		} else if(x.citation.length == undefined && x.citation != undefined) {
			citation.push(x.citation);
		} else if(x.citation.length > 1) {
			for(i in x.citation) {
					citation.push(x.citation[i]);	
				}
		}
		citationi = x.citationi;
		
		if(x.idea != undefined)	
			idea = x.idea;
		ideadefault = x.ideadefault;
		
		if(x.hovertagRegistrar == undefined) {
			
		} else if(x.hovertagRegistrar.length == undefined && x.hovertagRegistrar != undefined) {
			hovertagRegistrar.push(x.hovertagRegistrar);
		} else if(x.hovertagRegistrar.length > 1) {
			for(i in x.hovertagRegistrar) {
					hovertagRegistrar.push(x.hovertagRegistrar[i]);	
				}
		}
		setTimeout("finishRestore(x,xc);", 250);		
	} else {
		//New document - most things initialize at the top of this file
		$('#file_format').val("APA");
	}
}
function finishRestore(x, xc) {
	onInitFormat();
	//console.log(5);
	if(x != undefined) {
		for(i in x['metadata']) {
			//window.metadata[i] = x['metadata'][i];	
			//console.log(4);
			//$('#format_item_'+i).val(window.metadata[i]['value']);
			$('#format_item_'+i).val(x.metadata[i]['value'])
		}	
		//console.log(3);
		//Do a little more cleaning up
		$('.content_textarea').html(xc.replace(/<span class="searchResult">/g, ""));
	}
		//console.log(2);
	recallHovertags();
	postWordCount();
	$("#file_format").on("input", function() {
		console.log($(this).val());
		formatShift();
	});
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
		if(formats[i].name == format2) {
			//replacejscssfile('formats/'+docformat+'/format.js', 'formats/'+format2+'/format.js', 'js');
			replacejscssfile(docformat+".js", format2+".js", "js");
			docformat = format2;
			alert("Shift formats");
			//setTimeout("save();$('#body').empty();input();save();", 500);
			setTimeout("onInitFormat();$('.content_textarea').html(xc);", 500);
		}
	}
}
