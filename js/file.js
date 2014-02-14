// File.js handles the saves and restores, changing the formatting, and other file-related functions (convert to PDF? LaTeX, .doc)

//Since the file initiates when it loads, you can do some initization 
citation = new Array();
citationi = 0;

idea = new Array();
ideadefault = "";
fileid = window.location.search.substr(6);
if(window.location.search.indexOf("&share") > -1)
    fileid = window.location.search.substring(6,window.location.search.indexOf("&share"));

min_char = 0;
max_char = 0;
min_word = 0;
max_word = 0;

hovertagRegistrar = new Array();
obj = {};
currentformat = "";
document.ready = function() {
	console.log('Gltn has woken up: v 1.1.3.2');
    x = {};
    //Setup Filepicker
    filepicker.setKey("AePnevdApT62LvpkSSsiVz");
    
    //Let's check the file to determine whether we should grab it locally or online
    if(localStorage[fileid] != undefined) {
        if(window.location.href.indexOf("&share=") > -1) {
            var c = window.location.href.substr(window.location.href.indexOf("&share=")+7);
            cloudRead("https://www.filepicker.io/api/file/"+c, "RF", fileid);
        } else if(localStorage[fileid].indexOf('<inkblob_filename') > -1) {
            //First, let's get the last time the local file was modified
            var a = localStorage[fileid].indexOf('<last_modified>')+15;
            var b = localStorage[fileid].indexOf('</last_modified>');
            console.log(localStorage[fileid].substring(a,b));
            var d = localStorage[fileid].substring(a,b);
            
            //Okay, grab the InkBlob url and sync    
             initiatePopup({title:'Syncing...',ht:'<div class="progress" style="font-size:14pt;text-align:center;width:100%;"></div>',bordercolor:'#7f8c8d', ht:"&emsp;&emsp;&emsp;Downloading the latest copy."});
            var a = localStorage[fileid].indexOf('<inkblob_url>')+13;
            var b = localStorage[fileid].indexOf('</inkblob_url>');
            console.log(localStorage[fileid].substring(a,b));
            var c = localStorage[fileid].substring(a,b);
            
            //Okay, we can pass the modified date to this function. If the cloud file is newer, use that. Else, return nothing and keep using local
            //Then we can call this function continuosly to check for updates in the session
            cloudRead(c,"RF", d);
        } else {
            restoreFile();   
        }
    } else {
        if(window.location.href.indexOf("&share=") > -1) {
            var c = window.location.href.substr(window.location.href.indexOf("&share=")+7);
            cloudRead("https://www.filepicker.io/api/file/"+c, "RF", fileid);
        }
        else
            restoreFile();
    }
};
function startSaveFile() {
    //Will only sync if dirty -- else it syncs down instead
    //If not a cloud doc, saves as usual
    if(isCloudSaved() && window.dirty)
        saveFile();
    else if(isCloudSaved()) {
        cloudRead(window.saved.inkblob_url, "RF2", x.file.last_modified);
    } else {
        saveFile();   
    }
    
    try {
		window.document.title = "✎"+valMetadata('Title');
	} catch(e) {
		window.document.title = 'Editing Document';
	}    
}
function saveFile() {	
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
    obj['file']['fileid'] = fileid;
    obj['file']['last_modified'] = new Date().getTime();
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
	
	if(window.dirty == true) {
        if(isCloudSaved())
            cloudResave();
        window.dirty = false;
    }
	$('.content_save').show();
	$('.content_save').html("<span class='fa fa-file-text' style='color:"+window.theme.coloralt+"'></span>&nbsp;<span class='fa fa-check' style='color:"+window.theme.coloralt+"'></span>");
}



docformat = '';
function restoreFile(full) {
    if(full == true)
        full = true;
    else
        full = false;
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
	try {
        if(!full)
		  startThemer();	
	} catch(e) {
		
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
    if(x == undefined)
         x = {file: undefined};
	if(x.file != undefined) {
		//Load Script
        if(!full)
		  initFormats();
		$('#file_format').val(x.file.format);
		docformat = x.file.format;
		console.log(docformat);
//		loadjscssfile(docformat+".js", "js");
		formatShift();
		
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
		
		setTimeout("finishRestore(x,xc,"+full+");", 300);		
	} else {
		//New document - most things initialize at the top of this file
		//$('#file_format').val("APA");
		//loadjscssfile("APA.js", "js");
		//setTimeout("finishRestore(x,xc);", 300);
		newFile(x,xc);
	}
    
}
function finishRestore(x, xc, full) {
	try {
		//if(x == undefined) {
			//newFile();	
		//} else {
			//if(x.file != undefined) {
				console.log("onInitFormat");
				onInitFormat();
			//}
			//else
				//newFile();
		//}
	} catch(e) {
		console.error(e.message);
		setTimeout("finishRestore('"+x+"','"+xc+"', '"+full+"');",100);
		return;
	}
	//console.log(5);
	//if(x.file != undefined) {
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
		
		//console.log(3);
		//Do a little more cleaning up
		//console.log('CT Ins', xc);
		try {
			$('.content_textarea').html(xc.replace(/<span class="searchResult">/g, ""));
		} catch(e) {
			console.error("*"+e.message);
		}	
		formatShift2();
		$('#file_name').val(fileid);
	//} else {
		//Brand new file - let's do some base stuff here.
		//newFile(x,xc);
	//}
	
	setTimeout("finishRestore2("+full+")", 100);
}
function finishRestore2(full) {
    if(!full) {
	   initNotifications();
	   setHeader();
    }
	try {
		initContext();
	} catch(e) {
		//may not be ready yet, so the function will be disabled
		console.warn(e.message);	
	}
	recallHovertags();
	setInterval("recallHovertags();",1000);
	postWordCount();
	initNiftyUI4Saving();
	if(window.offline != true && !full)
		initPanels();
	
	hideHovertag();
    if(!full)
        initMathjax();
    
	try {
		offlineGo();
	} catch(e) {
		offline = false;
	}	
    //start save client because code should all work by this point
    if(!full) {
	   console.log("Client save initiated; This is a go for launch.");
	//saveFile();
	   setInterval("startSaveFile()", 4000);	
    }
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
    add_to_page("<br><button onclick='downloadXML()' style='font-size:14pt;display:none'><span class='fa fa-cloud-download'></span>&nbsp;Download</button><button onclick='cloudXML()' style='font-size:14pt'><span class='fa fa-cloud-upload'></span>&nbsp;Upload</button><button onclick='getShare()' style='font-size:14pt'><span class='fa fa-group'></span>&nbsp;Share</button> <br>");
	add_to_page("File XML:<br><textarea style='width:95%;height:200px;'>"+localStorage[fileid]+"</textarea><br>");
	add_to_page("Content HTML:<br><textarea style='width:95%;height:200px;'>"+localStorage[fileid+'_c']+"</textarea><br>");

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
		markAsDirty();
	});	
}
function markAsDirty() {
    $('.content_save').html("<span class='fa fa-file-text' style='color:"+window.theme.coloralt+"'></span>&nbsp;<span class='fa fa-pencil' style='color:"+window.theme.coloralt+"'></span>");
         window.dirty = true;
        if(isCloudSaved())
            initService("main_Sync", "Syncing Online...", "<span style='border-radius:100%'><span class='fa fa-cloud-upload'></span>&nbsp;<i class='fa fa-refresh fa-spin'></i><span>");   
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
    content = $('.content_textarea').html();
	filename = valMetadata('Title')+".gltn";
	filename = fileid+".gltn";
    var pom = document.createElement('a');
    input = json2xml(o, "")+content;
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(input));
    pom.setAttribute('download', filename);
    pom.click();
}
function deleteFile(id) {
	localStorage.removeItem(id)
	localStorage.removeItem(id+"_c");
}	
//Filepicker.io
function cloudXML() {
    //var inkblob = {url: 'https://www.filepicker.io/api/file/IObhDbs2Qxm0nXRRoGPk',
//    filename: 'hello.txt', mimetype: 'text/plain', isWriteable: true, size: 100};
    initiatePopup({title:'Saving File Online',ht:'<div class="progress" style="font-size:14pt;text-align:center;width:100%;"></div>',bordercolor:'#7f8c8d', ht:"&emsp;&emsp;&emsp;Please wait as the export menu loads."});
    content = $('.content_textarea').html();
    input = json2xml(o, "")+content;
    console.log(input);
    filepicker.store(input, function(InkBlob){
            filepicker.exportFile(
              InkBlob,
              {extension:'.gltn',
                 /*mimetype: 'text/gltn',*/
                suggestedFilename: fileid,
               base64decode: false
              },
              function(InkBlob){
                  console.log(event);
                  cloudSaveInkblob(InkBlob);
                  saveFile();
                  filepicker.write(InkBlob,
                     json2xml(o, "")+content,
                    function(InkBlob){
                        saveFile();
                        console.log("Complete sync for now");
                    }, function(FPError) {
                        console.log("Error: "+FPError.toString());
                    }
                );
                console.log(InkBlob.url);
            });
            console.log("Store successful:", JSON.stringify(InkBlob));
            closePopup();
        }, function(FPError) {
            closePopup();
            console.log(FPError.toString());
        }, function(progress) {
            console.log("Loading: "+progress+"%");
        }
   );   
}
function cloudSaveInkblob(InkBlob) {
    window.ink = InkBlob;
     writeToFile("inkblob_url", InkBlob.url);
      writeToFile("inkblob_filename", InkBlob.filename);
      writeToFile("inklob_mimetype", InkBlob.mimetype);
      writeToFile("inkblob_iswriteable", "false");
      writeToFile("inkblob_size", ""+InkBlob.size);   
    saveFile();
}
function cloudSaveMetadata() {
    filepicker.stat(window.ink, {
       uploaded: true,
        location:true,
        container:true,
        filename:true,
        size:true,
        path:true,
        mimetype:true
    }, function(metadata){
        console.log(JSON.stringify(metadata));
        return JSON.stringify(metadata);
    });   
}
function cloudGetMetadata() {
    a = {url: window.saved.inkblob_url, filename: window.saved.inkblob_filename, mimetype: window.saved.inkblob_mimetype, isWriteable: window.saved.inkblob_iswriteable, size: window.saved.inkblob_size};  
    window.ink = a;
    return a;
}
function isCloudSaved() {
    try {
        return (window.ink != undefined || window.saved.inkblob_url != undefined);
    } catch(e) {
        return false;   
    }
}
function cloudResave() {
    if(window.ink == undefined) {
        if(window.saved.inkblob_url != undefined)
            window.ink = {url: window.saved.inkblob_url, filename: window.saved.inkblob_filename, mimetype: window.saved.inkblob_mimetype, isWriteable: window.saved.inkblob_iswriteable, size: window.saved.inkblob_size};
        else {
            //This is entirely online -- don't do anything
            return;
        }
    }
    content = $('.content_textarea').html();
    initService("main_Sync", "Synced", "<span class='fa fa-cloud'></span>");
     filepicker.write(window.ink,
         json2xml(o, "")+content,
        function(InkBlob){
            console.log("Complete resync for now");
        }, function(FPError) {
            console.log("Error: "+FPError.toString());
        }
    );   
}
//Now we PICK files
function cloudImport(callback) {
     filepicker.pick({
        extension: '.gltn'
      },
      function(InkBlob){
          window.ink2 = InkBlob;
        console.log(JSON.stringify(InkBlob));
          if(callback == "HFS")
              cloudRead(window.ink2, callback);
      },
      function(FPError){
        console.log(FPError.toString());
      }
    );
}
function cloudRead(ink, callback, localMod) {
    filepicker.read(ink, function(data){
//        console.log(data);
        //Asynchronously handle callback
        if(callback == "HFS") {
            window.imported = data;
            $('#filesys_file').click();
        }
        else if(callback == "RF" || callback == "RF2") {
            //First check the modified date
            var a = data.indexOf('<last_modified>')+15;
            var b = data.indexOf('</last_modified>');
            var c = parseInt(data.substring(a,b));
            localMod = parseInt(localMod);
            if(c <= localMod) {
                console.log("Not synced: "+c+", "+localMod);
                if(callback == "RF") {
                    restoreFile();
                    closePopup();
                }
                   return;
            }
            initService("main_Sync", "Downloading...", "<span style='border-radius:100%'><span class='fa fa-cloud-download'></span>&nbsp;<i class='fa fa-refresh fa-spin'></i><span>");
            
            //If so, let's keep going
            var xmli = data.indexOf('</gluten_doc>')+13;
            var xml = data.substring(data.indexOf('<'),xmli);
            try {
                var i = $.xml2json(xml);
            } catch(e) {
                //$('.progress').html('<span style="color:red">Error: Not a proper Gltn file</span>');
                //setTimeout('closePopup();', 4000);
                console.log(xml);
                console.error(e.message);
                return null;
            }
            var ht = data.substring(xmli);
            
            //Now sync the files. Then we read the file.
            
            localStorage[fileid] = xml;
            localStorage[fileid+"_c"] = ht;
           // closePopup();
            restoreFile(callback == "RF2");
             initService("main_Sync", "Synced", "<span class='fa fa-cloud'></span>");
        }
        return data;
    });   
}
function getShare() {
    if(window.saved == undefined) {
        initiatePopup({title:"Share...",ht:"You must export the document to a cloud service before you can share it."});    
        return;
    }
    //If there is an inkblob, get the url
    if(window.saved.inkblob_url != undefined) {
        //Get the id only for the url
        //https://www.filepicker.io/api/file/ z1cUucGQaOwmWbkvTQ49
        var id = window.saved.inkblob_url.substr(35);
        //Display the URL
        initiatePopup({title:"Share...",ht:"Send this link to other people and they can collaborate on this document in real time!<br><br><a href='http://felkerdigitalmedia.com/gltn/edit.php?file="+fileid+"&share="+id+"' style='color:"+theme.coloralt+"'>http://felkerdigitalmedia.com/gltn/edit.php?file="+fileid+"&share="+id+"</a>"});
    } else {
        initiatePopup({title:"Share...",ht:"You must export the document to a cloud service before you can share it."});
    }
    
}
//A Gltn Package is a single file containing all the data for a particular terminal. This is all files and associated data, plus all settings
//First, we need a function to generate the data correctly
function getGltp() {
    var gltp = "";
    for(i in localStorage) {
        if(localStorage[i] != undefined && localStorage[i+"_c"] != undefined) {
            gltp += localStorage[i]+localStorage[i+"_c"];    
        }   
    }
    gltp += localStorage["settings"];
    return gltp;
}
//Now, this function parses the .gltp and implements the data
function parseGltp(gltp) {
    pre = "<gluten_";
    var a = gltp.split(pre);
    for(i in a) {
        var b = a[i].indexOf("<fileid>")+8;
        var c = a[i].indexOf("</fileid");
        var d = a[i].substring(b, c);
        a[i] = pre+a[i];
        if(b == -1) {
            //Is settings   
            localStorage['settings'] = pre+a[i];
        } else {
            //Is file   
            //Separate
            var e = a[i].indexOf("</gluten_doc>")+13;
            var f = a[i].substring(0,e);
            var g = a[i].substr(f);
            console.log("Get "+d);
            localStorage[d] = f;
            localStorage[d+"_c"] = g;
        }
    }
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
function initFormats() {
	if(settings['formats_name'] == undefined) {
		settings['formats_name'] = "";
		settings['formats_type'] = "";
		settings['formats_uri'] = "";
	}
	//load all custom formats
	for(i in window.settings.formats_name.split(', ')) {
		if(settings.formats_name.split(', ')[i].length)
			install_gluten_format(settings.formats_name.split(', ')[i], settings.formats_type.split(', ')[i], settings.formats_uri.split(', ')[i]);	
	}
}
function formatShift() {
	//unload js file
	//console.log(formats);
	format2 = $('#file_format').val();
	docformat = docformat+'.js';
	for(i in formats) {
		if(formats[i].name == docformat && formats[i].uri != undefined)
			docformat = formats[i].uri;
		else if(formats[i].name == docformat)
			docformat = docformat+'.js';
	}
	for(i in formats) {
		if(formats[i].name == format2) {
			console.log(docformat, formats[i].name, formats[i].uri);
			//replacejscssfile('formats/'+docformat+'/format.js', 'formats/'+format2+'/format.js', 'js');
			if(window.offline != true || formats[i].uri == undefined) {
				if($('#formatscript').length == 0) {
					$('body').append('<div id="formatscript" style="visibility:hidden"></div>');
				}			
				
				if(formats[i].uri == undefined) {
					//try {	
                    console.log(docformat, format2, formats[i].name);
                    try {
                        var v = '<script src="js/formats/'+format2+'.js'+'"></script>'; 
                        //console.log(v);
                        $('#formatscript').html(v);
                    } catch(e) {
                        console.error(e.message);
                        replacejscssfile(docformat, "js/formats/"+format2+".js", "js");	
                    }
						setTimeout("download_format2('"+format2+"')", 100);
					//}
				} else {
					console.log('Load format from '+formats[i].uri);
					try {
						$('#formatscript').html('<script src="'+formats[i].uri+'"></script>');
					} catch(e) {
						
					}
					//replacejscssfile(docformat, formats[i].uri, "js");
					//save it
					$('#themeframe').attr('src', formats[i].uri);
					setTimeout("download_format('"+format2+"')", 100);
				}
				docformat = format2;
				//alert("Shift formats");
				//setTimeout("save();$('#body').empty();input();save();", 500)
				window.metadata2 = JSON.stringify(x.metadata);
				//console.error(window.metadata2);
//				setTimeout("onInitFormat();$('.content_textarea').html(xc);", 500);
//				setTimeout('formatShift2(window.metadata2)', 900);
				console.log('The document format is shifting.');
			} else {
				if($('#formatscript').length == 0) {
					$('body').append('<div id="formatscript" style="visibility:hidden"></div>');
				}
				$('#formatscript').html('<script>'+localStorage['zformat_'+format2]+'</script>');
				
				docformat = format2;
				//alert("Shift formats");
				//setTimeout("save();$('#body').empty();input();save();", 500)
				window.metadata2 = JSON.stringify(x.metadata);
                
                setTimeout("download_format2('"+format2+"')", 100);
				//console.error(window.metadata2);
//				setTimeout("onInitFormat();$('.content_textarea').html(xc);", 500);
//				setTimeout('formatShift2(window.metadata2)', 900);
				console.log('The document format is shifting.');
			}
		}
	}
}
function download_format(y) {
    if(!currentformat.length)
         return;
    if(currentformat == y) {
        localStorage['zformat_"+y+"'] = $('#themeframe').contents().text(); 
        formatShift2(window.metadata2)
    } else {
        setTimeout("download_format('"+y+"')", 100);   
    }
}
function download_format2(y) {
    if(!currentformat.length)
         return;
    if(currentformat == y) {
        onInitFormat();$('.content_textarea').html(xc);
        setTimeout("formatShift2(window.metadata2);", 400);
        return;
    } else {
        setTimeout("download_format('"+y+"')", 100);   
    } 
}
function formatShift2(d) {
//		console.log(d, x.metadata, window.metadata2);	

	//Set up parameters	
	if(d == undefined)
		d = x.metadata;
	else
		d = JSON.parse(d);
//	console.log(d);
	for(i in d) {
			//window.metadata[i] = x['metadata'][i];	
			//console.log(4);
			//$('#format_item_'+i).val(window.metadata[i]['value']);
			for(j in window.metadata) {
				//console.log("'"+x.metadata[i].id+"'", "'"+window.metadata[j].id+"'");
//				console.log(i,j,window.metadata[j],window.metadata[j].id.replace(/ /g, '_'),$('#format_item_'+j).val(),d[i]);
			try {
				if(i == window.metadata[j].id.replace(/ /g, '_') && $('#format_item_'+j).val().length == 0) {
//					console.log("Insert "+d[i]+" for "+window.metadata[j].id);
					//console.log($('#format_item_'+j).val(), i);
					$('#format_item_'+j).val(d[i]);
					$('#format_item_'+j).html(d[i]);
				} else {
					//console.log('-');	
				}
			} catch(e) {
					
			}
			}
	}
	if(window.services != undefined) {
		for(i in services) {
			initService(services[i].id, services[i].title, services[i].icon);	
		}
	}
	console.log('The document format has shifted.');
}
