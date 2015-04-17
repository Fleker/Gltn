//TODO B - Change %sc and its effect to improve speed
//FIXME C - This NEEDS to display correctly. Make a demo if necessary. It cannot be imperfect
builddate = 0;
buildPrint = '<button onclick="window.print()" class="noprint textbutton"><span class="fa fa-print"></span>&nbsp;Print</button><button onclick="printHelp()" class="noprint textbutton"><span class="fa fa-question"></span>&nbsp;Print Help</button><button onclick="convertDoc()" class="noprint textbutton"><span class="fa fa-download"></span>&nbsp;Export</button>';
function falseBuild(printr) {
	window.section_name = "";
	$('.build').fadeIn(500);
	$('.main').fadeOut(500);
	$('.header').fadeOut(500);
	out = '<span class="buildRow"><button class="textbutton" onclick="exitBuild()"><span class="fa fa-angle-left"></span>&nbsp;Editor</button>';
	if(printr != true) {
		out += buildPrint;
    }
    out += '</span>';
     $('.build').html(out);
	console.log('fb');
}
function startBuild(el) {
	//initiate the build code, show the progress indicator, and start sending stuff to different functions to do different stuff.
	builddate = new Date().getTime();
	console.warn('start');
		$('.build').fadeIn(500);
	//$('.page').css('width','8.5in');
	window.section_name = "";
	$('#searching').val('');
	$('.build').html('<span class="buildRow"><button onclick="exitBuild()" class="textbutton"><span class="fa fa-angle-left"></span>&nbsp;Editor</button>'+buildPrint+'</span><span class="buildtime noprint" style="font-size:9pt"></span>');
        
		//$('.build_progress').css('display', 'block').css('position', 'fixed').css('width', '50%').css('height', '50%').css('top','25%').css('left','25%').css('background-color', 'rgba(0,0,0,0.3)').css('font-size','16pt').css('margin-top','10%');
	initiatePopup({title:"Compilation Progress",bordercolor:"rgb(44, 145, 16)",ht:"<div id='build_progress' class='build_progress' style=''></div>"+getloader()});
	updateBuildProgress('Beginning to Compile...');
    
	/*setTimeout(function() {
        try {
              
            continueBuild(el);  
        } catch(e) {
            updateBuildProgress("<span style='color:#c00'>Error Building: "+e.message+"</span>");
            console.error(e.message);
        }
    },500);*/
    setTimeout('updateBuildProgress("Compiling...");',40);
    $.when(continueBuild()).then(
        function(status) {
            console.log("Build: "+status);   
        }, function(status) {
            updateBuildProgress("<span style='color:#c00'>Error Building: "+status+"</span>");
            console.error("Build2: "+status);   
        }, function(status) {
            console.log("Build3: "+status);   
        }
    );
}
//CLASSES STRUCTURE
//Doc Class
//A collection of sections that are put into an order and form a complete document
function Doc() {
    this.sections = {};
    this.marginLeft = 1;
    this.marginRight = 1;
    this.marginTop = 1;
    this.marginBottom = 1;
    this.paddingTop = 0.4; //TODO This should in theory be 0.5, but it WORKS with 0.4. Go figure.
    this.paddingBottom = 0.5;
    this.height = 11;
    this.width = 8.5;
    this.global_footnote = 0;
    Doc.prototype.find = function(id) {
        //Find section name, page name, or pg num  
        for(index in this.sections) {
            if(index == id) {
                return this.sections[index];   
            }
        }
        for(index in this.sections) {
            for(index2 in this.sections[index].pages) {
                if(index2 == id) {
                    return this.sections[index].pages[index2];   
                }
            }
        }
    };
    //TODO 
    Doc.prototype.getPageNumber = function(pg) {
        //Feed in a page object, this will give you the number of that page in this document
    };
    Doc.prototype.newPage = function(name, section) {
        if(section === undefined) {
            var s = "";
            for(i in this.sections) {
                s = i;
            }
            section = s;
        }
        return this.sections[section].newPage(name);
    };
    Doc.prototype.newSection = function(name) {
        this.sections[name] = new Section(name);
        this.sections[name].doc = this;
        $('#build').append("<div class='section' id='section"+name+"'></div>");
        return this.sections[name];
    };
    Doc.prototype.add = function(cnt, name) {
        //Add general HTML to the last page or to a specific section
        var s = undefined;
        if(name === undefined) {
            //Get last section            
            for(index in this.sections) {
                s = this.sections[index];
            }
        } else {
            s = this.sections[name];
        }
        //Get content -- but we have to parse this too. I'm not sure when that goes.

        s.addBody(cnt);
    }
    Doc.prototype.insertContent = function(name) {
        var s = undefined;
        if(name === undefined) {
            //Get last section            
            for(index in this.sections) {
                s = this.sections[index];
            }
        } else {
            s = this.sections[name];
        }
        //Get content -- but we have to parse this too. I'm not sure when that goes.
        var c = $('.content_textarea').html();
        s.addBody(c);
    };
    Doc.prototype.getHtml = function() {
        return $('#build').html();   
    }
    Doc.prototype.getSectionCount = function() {
        var i = 0;
        for(index in this.sections) {
            i++;   
        }
        return i;
    };
    Doc.prototype.getPageCount = function() {
        var i = 0;
        for(index in this.sections) {
            i+= this.sections[index].getPageCount();
        }
        return i;
    };
    Doc.prototype.getPage = function(id) {
        //Gets a template page with variables discussed above for size 
        var out = "<div class='page' ";
        if(id !== undefined)
            out += "id='"+id+"' style='padding-left:"+this.marginLeft+"in;padding-right:"+this.marginRight+"in;padding-top:"+this.paddingTop+"in;padding-bottom:"+this.paddingBottom+"in;height:"+this.height+"in;width:"+this.width+"in'>";
        out += '<div class="pageheader '+id+'_header" style="min-height:'+(this.marginTop-this.paddingTop)+'in"></div> <div class="pagebody '+id+'body"></div> <div class="pagefooter '+id+'footer" style="min-height:'+(this.marginTop-this.paddingTop)+'in"></div></div>';
        out += "</div>";
        return out;
    };
    Doc.prototype.assignPages = function() {
        //This will go through each page and give it data-page-num. This should be called several times through the compilation process to ensure that the pages are correct.
        //This value starts at 1
        var pn = 1;
        for(i in this.sections) {
            for(index in this.sections[i].pages) {
                $(this.sections[i].pages[index].element).attr('data-page-num', pn);
                pn++;
            }
        }
    };
    $('.page, .section').remove();
    this.newSection("Primary");
}
//Section Class - Group of pages
function Section(name) {
    this.name = name;
    this.pages = {}; //Named and/or numbered
    this.doc; //parent of object
    Section.prototype.newPage = function(name) {
        if(name === undefined)
            name = this.doc.getPageCount();
        var id = this.name+"_"+name;
        var p = new Page(id);
        p.section = this;
        //Inject HTML
        //Adds to doc as last item
        //Future adaptions can put after any item
        if(this.getPageCount() > 0) {
            //Get the n-1th element
            var index = 0;
            var lastpage;
            for(i in this.pages) {
                if(index == this.getPageCount()-1 && this.pages[i] !== undefined) {
                    lastpage = this.pages[i];   
                }
            }
            $(lastpage.element).after(this.doc.getPage(id));
        } else
            $('#section'+this.name).html(this.doc.getPage(id));
        p.element = '#'+id;
        this.pages[id] = p;
        return p;
    };
    Section.prototype.getPageCount = function() {
        var i = 0;
        for(index in this.pages) {
            i++;   
        }
        return i;
    };
    Section.prototype.addBody = function(cnt, page) {
        var p = undefined;
        //Add to the last page if none's provided
        if(page === undefined) {
            for(index in this.pages) {
                p = this.pages[index];   
            }
        } else {
           p = this.pages[page];
        }
        p.addBody(cnt);
    };
}
//Page Class - A single isolated page of content
function Page(name) {
    this.name = name;
    this.element;
    this.section; //parent of object
    Page.prototype.addBody = function(cnt) {
        //Add this to the body
        //Splice
        var ar = smartSplit(cnt);
        console.log(ar);
        for(i in ar) {
            if(!this.isBodyFull(ar[i])) {
                //HTML injection   
                $(this.element+" .pagebody").append(ar[i]);
                //Footnote injection -- this isn't very modular. I'm not sure how to make it modular though
                /*
                    Call pageBuilder fnc
                    That'll pull in settings, find functions
                    Run functions with whatever parameters are possible
                    Return to this func
                */
//                console.log(i, ar.length);
                console.log(i, ":"+ar[i]); 
                if(ar[i].match('<')) {
//                    console.log("<");
                    if($(ar[i]).filter('.footnote').length > 0) {
                        console.log("Found you in "+ar[i]);
                        this.section.doc.global_footnote++;
                        //if this page has no footer already add one
                        if($(this.element+' .pagefooter').html() == "") {
                            this.addFooter("");   
                        }
                        this.appendFooter(footnoteFormatted(onGetFormats().footnote, this.section.doc.global_footnote, decodeURIComponent($(ar[i]).filter('.footnote').attr('data-note')+"<br>")));
                    }
                } else {
                    //Nothing -- probably not HTML
                    //FIXME This is a really ugly hack
                }
            } else {
                var pass = ar.splice(i, ar.length-i).join(' ');
                this.section.newPage().addBody(pass);
                return;
            }
        }
        this.fixHeight();
    };  
    Page.prototype.addHeader = function(cnt) {
        //setHeader fnc or inline  
        //HTML injection
        $(this.element+' .pageheader').html(cnt);
        this.fixHeight();
    };
    Page.prototype.addFooter = function(cnt) {
        //same as header
        //HTML injection
        $(this.element+" .pagefooter").html("");
        if($(this.element+' .pagefooter').html() == "") {
            $(this.element+' .pagefooter').html(onGetFormats().footnoteDivider);   
        }
        $(this.element+' .pagefooter').append(cnt);
        this.fixHeight();
    };
    Page.prototype.appendFooter = function(cnt) {
        $(this.element+' .pagefooter').append(cnt);  
        this.fixHeight();
    };
    Page.prototype.isBodyFull = function(text) {
        //Pings w/scale, can check with data
        $(this.element+' .pagebody').append("<div class='removeme' style='display:inline'>"+text+"</div>");
        //get height, but first need real height
        $(this.element+" .pagebody").css('height', '');
        var h = $(this.element+' .pageheader').height() + $(this.element+" .pagebody").height() + $(this.element+" .pagefooter").height();
        //get scale's height -- it is one inch
        var s = $('.scale').height();
        //get supposed height
        var d = (this.section.doc.height - this.section.doc.paddingTop - this.section.doc.paddingBottom)*s;
        //compare
        $('.removeme').remove();    
        console.log(h, ">", d);
        if(Math.round(h) > Math.round(d)) {
            return true;
        } else {
            return false;   
        }
    };  
    Page.prototype.fixHeight = function() {
        //Reset body height in accordance with what is needed
        //get height
        var h = $(this.element+' .pageheader').height() + $(this.element+" .pagebody").height() + $(this.element+" .pagefooter").height();
        //get scale's height -- it is one inch
        var s = $('.scale').height();
        //get supposed height
        var d = (this.section.doc.height - this.section.doc.paddingTop - this.section.doc.paddingBottom);
        var docheight = d*s;
        $(this.element+" .pagebody").css('height', docheight-$(this.element+' .pageheader').height()-$(this.element+" .pagefooter").height());
        return docheight-$(this.element+' .pageheader').height()-$(this.element+" .pagefooter").height();
    };
}


function add_export_button(title, icon, fnc) {
    $('.buildRow').append('<button class="export_'+title+'" style="width:60px">'+icon+"&nbsp;"+title+"</button>"); 
    $('.export_'+title).on('click', function() {
       eval(fnc+";x();"); 
        //Program to create an export then send to the FilePicker for saving
    });
}
function printHelp() {
    ht = "Make sure your settings are set properly when printing from Gltn. In Chrome, for example, make sure the margins are set to 'None'. Sometimes, the last page will be blank. This is not an issue, just do not include that page in your document.<br><img src='images/chromeprint.png'></img>";
    initiatePopup({ht: ht, title:"Help with Printing"});   
}
function convertDoc() {
    function createConvertButton(format, icon) {
        ic = "";
        if(icon !== undefined)
            ic = getIcon(icon, 11);
    
        return "<button class='convertButton textbutton' data-format='"+format+"' style='min-width:60px;text-align:center;'>"+ic+"&nbsp;" +format.substring(0,1).toUpperCase()+format.substring(1)+"</button>";
    }
    ht = "<div id='convertDocBox'><span style='font-weight:200;font-size:19pt;'>Export to Which Format?</span><br><span style='font-style:italic;font-size:10pt;'>This feature is currently in beta</span><br><br><br>";
//    ht += createConvertButton('html', 'file-code-o');
    /*ht += createConvertButton('docx');
    ht += createConvertButton('odt');
    ht += createConvertButton('pdf');
    ht += createConvertButton('epub'); 
    ht += createConvertButton('mobi');*/ 
//    ht += createConvertButton('txt', 'file-text-o');
    customFormats = {};
    
     //Search for all services and see if any of them support the export method which will let them add an export option
    for(i in panelManager.getAvailablePanels()) {
        if(panelManager.getAvailablePanels()[i].onExport !== undefined) {
            var exportOptions = panelManager.getAvailablePanels()[i].onExport(true, $('.build').html());
            if(exportOptions !== null) {
                if(!Array.isArray(exportOptions)) {
                    exportOptions = [exportOptions];    
                }
                for(var ii in exportOptions) {
                    ht += createConvertButton(exportOptions[ii].name, exportOptions[ii].icon);
                    customFormats[exportOptions[ii].name] = exportOptions[ii].callback;
                    console.log(exportOptions[ii]);
                }
            }
        }
    }
    
    ht += "</div>";
    fnc = function () {
        $('.convertButton').on('click', function() {
            var export_format = $(this).attr('data-format')
            customFormats[export_format]();
           $('#convertDocBox').fadeOut(500).delay(500).fadeIn(500);
            setTimeout(function() { $('#convertDocBox').html("<span style='font-size:19pt;font-weight:200;'>Please Wait</span><br><span style='font-style:italic;font-size:10pt;'>Your file will be converted and downloaded soon</span><br>"+getLoader()) },500);
        });
    };
    initiatePopup({title: "Convert Document", ht: ht, fnc: fnc});
}

function continueBuild(el) {
    var dfd = new jQuery.Deferred();
        
    window.build_ln = new Array();
    window.build_fn = new Array();
    window.build_volume = new Array();
	//Duplicate paper  
    updateBuildProgress("Starting to Build...");
	var cta = false;
	console.log(el, el == undefined);
	if(el == undefined) {
		el = '.content_textarea';
		cta = true;
	}
	//el = '.content_textarea';
	var cont = $(el).html();
	//console.log(cont);
    window.predraft = cont;
	$('.draft').html(cont/*.replace(/&nbsp;/g, " ").trim()*/);
    window.predraft2 = $('.draft').html();
	
	//To {format}.js
	if(cta) {
		try {
			onStylePaper();	
		} catch(e) {
			dfd.reject("Error at `onStylePaper`: "+e.message);
		}
		updateBuildProgress('Building Text...');
        var d = new Doc();
        d.newPage();
        try {
            //NOTE Return
            d = onBuildFormat(d);
			updateBuildProgress('Setting Headers...');	
        } catch(e) {
            console.error(e.message);
            dfd.reject("Error at 'onBuildFormat': "+e.message);   
        }
				
//		onGetFormats();
        post_content_formatting(onGetFormats(), d);
        //Get reformatted content, then add it to doc
			updateBuildProgress('Formatting Content...');
		if($('.content_textarea .citation').length) {
			post_bibliography(onBuildBibliography(d)[0], onBuildBibliography(d)[1]);
			updateBuildProgress('Building Bibliography...');
		}
        d.assignPages();
		try {
            //TODO Header API
			onSetHeader(d);
		} catch(e) {
			dfd.reject("on set header");
			
		}
	} else {
		add_new_page();
		post_content_formatting({});	
	}
		updateBuildProgress('Setting up display...');
		
    //NOTE
    d.assignPages();
//    if(onFinishBuild !== undefined) {
        try {
            onFinishBuild(d);
        } catch(e) {
            dfd.reject("Error in `onFinishBuild`: "+e.message);   
        }
//    }
        
	//To stuff
		//$('.body').css('display', 'none');
    $('.main').fadeOut(500);
	finishBuild();
	scrollTo(0,0);
	console.warn('finish');
	var finishdate = new Date().getTime();
	//console.log(finishdate, builddate);
	$('.buildtime').html('&emsp;Built in '+(finishdate - builddate)/1000+' seconds.');
    var i = 0;
    console.log("Word counter");
    for(j in $('.pagebody').text().split(' ')) {
        if($('.pagebody').text().split(' ')[j].length >= 1)
            i++;
    }
    console.log("Counter done -- yay!");
    $('.buildtime').append('&emsp;Stats: '+i+' words, '+$('.pagebody').text().length+' chars');
    $("#PanelBuildEvent").click();
    dfd.resolve("yay");
    return dfd.promise();
	//$('.build').css('display', 'block');
}
function updateBuildProgress(text) {
    setTimeout(function() {
//	   $('.build_progress').empty();
        $('.build_progress').html(text+"<br>");
//        $('#progress_buddy').html();
    }, 10);
}
function finishBuild() {
	//$('.build_progress').css('display', 'none');
	setTimeout("closePopup();",1000);
	$('.header').hide(1000);
	window.scrollTo(0,0);
    //TODO footer demarkation
		//stopgf;
	//$('.page').css('width','70%');
}
function exitBuild() {
	$('.header').show(1000);
	$('.main').show(500);
	$('.build').hide(350);
	setTimeout("ribbonSwitch(ribbon_index, false);window.scrollTo(0,0);",1025);
}
//Integration into format.js files
function grabMetadata(i) {
	var o = file.metadata;
//	console.log(i);
	o[i].value = $('#format_item_'+i).val();
	if(o[i].type == "mltext")
		o[i].value = $('#format_item_'+i).html();
	return o[i];	
}
function searchMetadata(request) {
	for(i=0;i<file.metadata.length;i++) {
		if(file.metadata[i].id == request || file.metadata[i].label == request)
			return i;	
	}
}
function valMetadata(label) {
	return (grabMetadata(searchMetadata(label)).value !== undefined)?grabMetadata(searchMetadata(label)).value:"";	
}
function fileMetadata(name) {
	return $('#file_'+name).val();	
}
function valAuthor() {
	searchMetadata('Author');	
}
function centerText(text,size) {
	return '<div style="text-align:center;font-size:'+size+'pt;border:none;">'+text+'</div>';
}
function boldText(text,size) {
	return '<span style="font-weight:bold;font-size:'+size+'pt">'+text+'</span>';	
}
function italicizeText(text,size) {
	return '<span style="font-style:italic;font-size:'+size+'pt">'+text+'</span>';	
}
function boldItalicizeText(text,size) {
	return '<span style="font-style:italic;font-weight:bold;font-size:'+size+'pt">'+text+'</span>';	
}
function sizeText(text, size) {
	return '<span style="font-size:'+size+'pt">'+text+'</span>';	
}
function oneColumnText(text) {
	return '<div>'+text+'</div>';	
}
function twoColumnText(t1, t2) {
	return "<table style='width:100%'><tr><td style='width:50%'>"+t1+"</td><td style='width:50%'>"+t2+"</td></tr></table>";	
}
function threeColumnText(t1, t2, t3) {
	return "<table style='width:100%'><tr><td style='width:33%'>"+t1+"</td><td style='width:33%'>"+t2+"</td><td style='width:33%'>"+t3+"</td></tr></table>";	
}
//Set up universal paper style guidelines
column = 0;
nptfont = 12;
function enable_format(setting, param1) {
	switch(setting) {
		case 'double space': 
			$('.build').css('line-height', '2em');
		break;
		case '2 columns':
			column = 2;
		break;
		case '3 columns':
			column = 3;
		break;
		case 'font pt':
			nptfont = param1;
			$('.page').css('font-size', param1+"pt");
		break;
		case '12pt font':
			nptfont = 12;
			$('.page').css('font-size', "12pt");
		break;
	}	
}

//Page generator and manager
function add_new_page(pagename) {
    return;
		p = $('.page').length;
		if(window.section_name.length) {
			psec = $('.'+section_name).length;
			secname = window.section_name+psec+" "+window.section_name;
		} else
			secname = ""
		$('.build').append('<div class="page '+pagename+' page'+p+' '+secname+'" data-p="'+p+'"><div class="pageheader page'+p+'header"></div> <div class="pagebody page'+p+'body"></div> <div class="pagefooter"></div></div>');
}
function add_new_section(section_name) {
    return;
	window.section_name = section_name;
	p = $('.'+section_name).length;
	//add_new_page(section_name+p);
	add_new_page();
}
function newline() {
	return "<br>";	
}
function find_page(pagename) {
	return $('.'+pagename).attr('data-p');
}
function add_to_page(text, i, name, col) {
    return;
	//console.error("add_to_page("+text+", "+i+", "+name+", "+column+");");
	if(i != undefined) {
		$('.page'+i+'body').append(text);		
	} else if(name != undefined) {
		$('.'+pagename+'body').append(text);	
	} else {
		p = $('.page').length-1;
		if(col != undefined && col != 0) {
			$('.page'+p+'col'+(col-1)).append(text);
			//console.error("$('.page"+p+"col"+(col-1)+"').append(text);");
		} else {
			$('.page'+p+'body').append(text);		
		}
	}
}	
function push_to_body(text) {
	$('.draft').prepend(text);
	console.log(text, $('.draft').html());
}	
function paste_content() {
	add_to_page("<div class='pasteContent'></div>");	
}
function push_header(text) {
	i = 1;
	$('.pageheader').each(function() {
		var ptemp = text.replace(/PAGE/g, i);
		i++;
		$(this).html(ptemp);
	});	
}
function customize_this_header(page, text) {
	text = text.replace(/PAGE/g, (parseInt(page)+1));
	$('.page'+page+'header').html(text);	
}
function lcr_split(left, center, right) {
	return "<table style='width:100%'><tr><td data-theme='false'>"+left+"</td><td style='text-align:center' data-theme='false'>"+center+"</td><td style='text-align:right' data-theme='false'>"+right+"</td></tr></table>";	
}

//Content Formatting
function citationFormatted(string, i, id, page, cob) {
	//Insert a citation content_formatted object and return it with properties filled in
	//console.log(string, id);
	//console.warn(citation[id]);
//	console.error(string, id, page, cob);
//	if(page != undefined) {
	//	main = page.split("|")[1];
		//page = page.split("|")[0];
	//}
	try {
        if(typeof(citation[id].Contributors) == "string")
            citation[id]["Contributors"] = [citation[id]['Contributors']];
	if(cob != undefined) {
        
        
		/*var ln = new Array();
		var fn = new Array();
		var volumes = new Array();
		for(i=0;i<citation.length;i++) {
			for(j=0;j<citation.length;j++) {
				if(i != j) {
					try {
						if(citation[i].AuthorLast == citation[j].AuthorLast && citation[i].AuthorLast.length > 0)
							ln.push(citation[i].AuthorLast);
						if(citation[i].AuthorFirst == citation[j].AuthorFirst && citation[i].AuthorLast == citation[j].AuthorLast && citation[i].AuthorLast.length > 0)
							fn.push(citation[i].AuthorFirst);
						if(citation[i].Title == citation[j].Title && citation[i].Title.length > 0 && citation[i].AuthorLast == citation[j].AuthorLast)
							volumes.push(citation[i].Title);
					} catch(e) {
						
					}
				}
			}
		}*/
        
        
		//Get the number of authors for this source
			var sourceauthors = 0;
			var sourceauthorsarray = new Array();
			for(j=1;j<=citation[id].Contributors.length;j++) {
				if(citation[id].Contributors[j] == "Author") {
					sourceauthorsarray.push({F: citation[id].ContributorsFirst[j], M: citation[id].ContributorsMiddle[j], L: citation[id].ContributorsLast[j]});
					sourceauthors++;
				}	
			}
		//Get the number of translators for this source
			var sourcetranslators = 0;
			var sourcetranslatorsarray = new Array();
			for(j=1;j<=citation[id].Contributors.length;j++) {
				if(citation[id].Contributors[j] == "Translator") {
					sourcetranslatorsarray.push({F: citation[id].ContributorsFirst[j], M: citation[id].ContributorsMiddle[j], L: citation[id].ContributorsLast[j]});
					sourcetranslators++;
				}	
			}
		//Get the number of editors for this source
			var sourceeditors = 0;
			var sourceeditorsarray = new Array();
			for(j=1;j<=citation[id].Contributors.length;j++) {
				if(citation[id].Contributors[j] == "Translator") {
					sourceeditorsarray.push({F: citation[id].ContributorsFirst[j], M: citation[id].ContributorsMiddle[j], L: citation[id].ContributorsLast[j]});
					sourceeditors++;
				}	
			}
		
		
		if(citation[id].AuthorFirst.length || citation[id].AuthorLast.length) {
//			console.log("sourceauthorsarray");
//			console.log(sourceauthorsarray);
			if(!citation[id].AuthorLast.length && citation[id].AuthorFirst.length) {
				string = string.replace(/cAUTHOR/, cob.firstonlyauthor.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/g, citation[id].AuthorLast));
			} else if(build_ln.indexOf(citation[id].AuthorLast) > -1 && build_ln.indexOf(citation[id].AuthorLast) == build_fn.indexOf(citation[id].AuthorFirst)) {
				string = string.replace(/cAUTHOR/, cob.sameauthor.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/g, citation[id].AuthorLast));
			} else if(sourceauthors == 2) {
				console.log(string);
				console.log(cob.twoauthors, sourceauthorsarray[0].L);
				console.log(cob.twoauthors.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/, citation[id].AuthorLast))/*.replace(/AUTHOR_FIRST/, sourceauthorsarray[0].F).replace(/AUTHOR_FIRST_I/, sourceauthorsarray[0].F.substr(0,1)).replace(/AUTHOR_LAST/g, sourceauthorsarray[0].L));*/
				string = string.replace(/cAUTHOR/, cob.twoauthors.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/, citation[id].AuthorLast).replace(/AUTHOR_FIRST/, sourceauthorsarray[0].F).replace(/AUTHOR_FIRST_I/, sourceauthorsarray[0].F.substr(0,1)).replace(/AUTHOR_LAST/, sourceauthorsarray[0].L));
			} else if(sourceauthors == 3) {
				string = string.replace(/cAUTHOR/, cob.threeauthors.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/, citation[id].AuthorLast).replace(/AUTHOR_FIRST/, sourceauthorsarray[0].F).replace(/AUTHOR_FIRST_I/, sourceauthorsarray[0].F.substr(0,1)).replace(/AUTHOR_LAST/, sourceauthorsarray[0].L).replace(/AUTHOR_FIRST/, sourceauthorsarray[1].F).replace(/AUTHOR_FIRST_I/, sourceauthorsarray[1].F.substr(0,1)).replace(/AUTHOR_LAST/, sourceauthorsarray[1].L));
			} else if(sourceauthors > 3) {
				string = string.replace(/cAUTHOR/, cob.manyauthors.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/, citation[id].AuthorLast));
			} else {
				string = string.replace(/cAUTHOR/, cob.author.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/, citation[id].AuthorLast));
			}
		}
		else
			string = string.replace(/cAUTHOR/g, "");
		if(sourcetranslators > 0) {
			string = string.replace(/cTRANSLATOR/g, cob.translator.replace(/AUTHOR_FIRST/, sourcetranslatorsarray[0].F).replace(/AUTHOR_LAST/, sourcetranslatorsarray[0].L));
		} else {
			string = string.replace(/cTRANSLATOR/g, "");	
		}
		if(sourceeditors > 0) {
			string = string.replace(/cEDITOR/g, cob.editor.replace(/AUTHOR_FIRST/, sourceeditorsarray[0].F).replace(/AUTHOR_LAST/, sourceeditorsarray[0].L));
		} else {
			string = string.replace(/cEDITOR/g, "");	
		}
		if(citation[id].Edition.length)
			string = string.replace(/cEDITION/, cob.edition.replace(/EDITION/, citation[id].Edition).replace(/EDITION_c/, numOrdered(citation[id].Edition)));
		else
			string = string.replace(/cEDITION/g, "");
		if(citation[id].City.length)
			string = string.replace(/cPUBCITY/, cob.pubcity.replace(/PUBCITY/, citation[id].City));
		else
			string = string.replace(/cPUBCITY/g, "");
		if(citation[id].MediumFormat.length && cob.medium != undefined)
			string = string.replace(/cMEDIUM/g, cob.medium.replace(/MEDIUM/, citation[id].MediumFormat.substring(0,1).toUpperCase()+citation[id].MediumFormat.substring(1)));
		else
			string = string.replace(/cMEDIUM/g, "");
		if(citation[id].Publisher.length)
			string = string.replace(/cPUBCOMP/, cob.publisher.replace(/PUBCOMP/, citation[id].Publisher));
		else
			string = string.replace(/cPUBCOMP/g, "");
		if(citation[id].Title.length)
			string = string.replace(/cTITLE/, cob.title.replace(/TITLE/, citation[id].Title));
		else
			string = string.replace(/cTITLE/g, "");
		if(citation[id].Volume.length)
			string = string.replace(/cVOLUME/g, cob.volume.replace(/VOLUME/, citation[id].Volume));
		else
			string = string.replace(/cVOLUME/g, "");
		if(citation[id].Url.length && cob.url != undefined)
			string = string.replace(/cURL/g, cob.url.replace(/URL/g, citation[id].Url));
		else
			string = string.replace(/cURL/g, "");
		if(citation[id].Year.length)
			string = string.replace(/cYEAR/g, cob.year.replace(/YEAR/g, citation[id].Year));
		else
			string = string.replace(/cYEAR/g, "");
		if(citation[id].Description.length)
			string = string.replace(/cDESCRIPTION/g, cob.description.replace(/DESCRIPTION/g, citation[id].Description));
		else
			string = string.replace(/cDESCRIPTION/g, "");
		if(citation[id].Govnation.length)
			string = string.replace(/cGOVNATION/g, cob.govnation.replace(/GOVNATION/g, citation[id].Govnation));
		else
			string = string.replace(/cGOVNATION/g, "");
		if(citation[id].Govbranch.length)
			string = string.replace(/cGOVBRANCH/g, cob.govbranch.replace(/GOVBRANCH/g, citation[id].Govbranch));
		else
			string = string.replace(/cGOVBRANCH/g, "");
		if(citation[id].Govcomm.length)
			string = string.replace(/cGOVCOMM/g, cob.govcomm.replace(/GOVCOMM/g, citation[id].Govcomm));
		else
			string = string.replace(/cGOVCOMM/g, "");
		if(citation[id].Govsess.length)
			string = string.replace(/cGOVSESS/g, cob.description.replace(/GOVSESS/g, citation[id].Description));
		else
			string = string.replace(/cGOVSESS/g, "");
		if(citation[id].Website.length)
			string = string.replace(/cWEBSITE/g, cob.website.replace(/WEBSITE/g, citation[id].Website));
		else
			string = string.replace(/cWEBSITE/g, "");
		if(citation[id].WebPublisher.length)
			string = string.replace(/cWEBPUB/g, cob.webpub.replace(/WEBPUB/g, citation[id].WebPublisher));
		else
			string = string.replace(/cWEBPUB/g, "");
		if(citation[id].University.length)
			string = string.replace(/cUNIVERSITY/g, cob.university.replace(/UNIVERSITY/g, citation[id].University));
		else
			string = string.replace(/cUNIVERSITY/g, "");
		if(citation[id].Universityyear.length)
			string = string.replace(/cUNIVERSITYYEAR/g, cob.universityyear.replace(/UNIVERSITYYEAR/g, citation[id].Universityyear));
		else
			string = string.replace(/cUNIVERSITYYEAR/g, "");
		//removing weird things
		string = string.replace(/cDOI/g, "");
		if(citation[id].Pubdate.length) {
			var duedate = Date.parse(citation[id].Pubdate);
			var duedate = new Date(duedate);
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var dueout = (duedate.getDate()+1) + " " + months[duedate.getMonth()] + " " + duedate.getFullYear();
			string = string.replace(/cPUBDATE/g, cob.pubdate.replace(/PUBDATE/g, dueout));
		} else
			string = string.replace(/cPUBDATE/g, "<i>n.d.</i>");
		if(citation[id].Accdate.length) {
			var duedate = Date.parse(citation[id].Accdate);
			var duedate = new Date(duedate);
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var dueout = (duedate.getUTCDate()) + " " + months[duedate.getUTCMonth()] + " " + duedate.getUTCFullYear();
			string = string.replace(/cACCDATE/g, cob.accdate.replace(/ACCDATE/g, dueout));
		} else
			string = string.replace(/cACCDATE/g, "");
		if(page != undefined && cob.page != undefined)
			string = string.replace(/cPAGE/g, cob.page.replace(/PAGE/g, page));
		else
			string = string.replace(/cPAGE/g, "");
        
        build_fn.push(citation[id].AuthorFirst);
        build_ln.push(citation[id].AuthorLast);
        build_volume.push(citation[id].Title);
        
	}
        
	if(typeof(citation[id]['ContributorsFirst']) == "string")
	   citation[id]['ContributorsFirst'] = [citation[id]['ContributorsFirst']];
    if(typeof(citation[id]['ContributorsMiddle']) == "string")
        citation[id]['ContributorsMiddle'] = [citation[id]['ContributorsMiddle']];

    if(typeof(citation[id]['ContributorsLast']) == "string")
            citation[id]['ContributorsLast'] = [citation[id]['ContributorsLast']];
        
	for(i=0;i<citation[id].Contributors.length;i++) {
		if(i == 0) {
			string = string.replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1));
			string = string.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst);
			string = string.replace(/AUTHOR_LAST/, citation[id].AuthorLast);
		} else {
			string = string.replace(/AUTHOR_FIRST_I/, citation[id].ContributorsFirst[i-1].substr(0,1));
			string = string.replace(/AUTHOR_FIRST/, citation[id].ContributorsFirst[i-1]);
			string = string.replace(/AUTHOR_LAST/, citation[id].ContributorsLast[i-1]);
		}	
	}
	string = string.replace(/BIBLEBOOK/g, citation[id].Biblebook);
	string = string.replace(/BIBLECHAPTER/g, citation[id].Biblechapter);
	string = string.replace(/BIBLEVERSE/g, citation[id].Bibleverse);
	string = string.replace(/EDITION/g, citation[id].Edition);
	string = string.replace(/PUBCITY/g, citation[id].City);
	string = string.replace(/PUBCOMP/g, citation[id].Publisher);
	string = string.replace(/TITLE/g, citation[id].Title);
	string = string.replace(/VOLUME/g, citation[id].Volume);
	string = string.replace(/URL/g, citation[id].Url);
	string = string.replace(/YEAR/g, citation[id].Year);
	if(page != undefined && page.length > 0)	
		string = string.replace(/PAGE/g, page);	
	else
		string = string.replace(/ PAGE/g, "");
//	console.log(string);
	return string;	
	} catch(e) {
		console.log(e.stack);
		return string;
	}
}
function headingFormatted(spec,input,number) {
	//console.error(spec);
	var string = spec;
	string = string.replace(/TEXT%sc/g, smallcaps(input));
	string = string.replace(/TEXT/g, input);
	string = string.replace(/LISTA/g, numToLetter('A',number));
	string = string.replace(/LISTa/g, numToLetter('a',number));
	string = string.replace(/LIST1/g, number);
	string = string.replace(/LISTI/g, numToRoman('I', number));
	string = string.replace(/LISTi/g, numToRoman('i', number));
	console.error(string);
	return string;
}
function imageFormatted(spec,input,fig) {
	var string = spec;	
	string = string.replace(/IMG/g, "<img src='"+input.attr('data-src')+"' style='width:100%'></img>");
	string = string.replace(/TEXT/g, input.attr('data-des'));
	string = string.replace(/FIGN/g, fig);
	return string;
}
function tableFormatted(input,fig,title) {
	var string = input;
	string = string.replace(/FIGN/g, fig);
	string = string.replace(/TEXT%sc/g, smallcaps(title));
	string = string.replace(/TEXT/g, title);
	return string;
}
function latexFormatted(input,eqn,fig,title) {
	var string = input;
	string = string.replace(/FIGN/g, fig);
	string = string.replace(/TEXT%sc/g, smallcaps(title));
	string = string.replace(/TEXT/g, title);
    string = string.replace(/EQN/g, eqn);
	return string;
}
function footnoteFormatted(input, index, note) {
    var string = input;
    string = string.replace(/INDEX/g, index);
    string = string.replace(/NOTE/g, note);
    return string;
}
function smallcaps(string) {
    return "<span style='font-variant:small-caps'>"+string+"</span>";   
}
function smallcapsX(inp) {
	//console.warn(inp);
    if(inp == undefined)
        return "";
	var out = "";
	for(i=0;i<inp.length;i++) {
		out += inp[i].replace(/[a-z]/g, "<span style='font-size:"+(nptfont-3)+"pt'>"+inp[i].toUpperCase()+"</span>");	
	}
	return out;
}
function numToLetter(capy, number) {
	var cap = ["A", "B", "C","D","E","F","G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T","U","V","W","X","Y","Z"];
	if(capy == "A")
		return cap[number-1];
	else
		return cap[number-1].toLowerCase();
}
function numToRoman(capy, num) {
	if (!+num)
        return false;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    ans = Array(+digits.join("") + 1).join("M") + roman;
        
	if(capy == "I") 
		return ans;
	else
		return ans.toLowerCase();
}
function numToOrdinal(number) {
	var ord = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th"];
	return number+ord[number];
}
function smartSplit(cnt) {
    var object = onGetFormats();
    $('.draft span').css('color', 'inherit');
	//Paragraph detection
    if(object.paragraph_indent == undefined)
		object.paragraph_indent = "";
//	window.cont = $('.draft').html().replace(/&nbsp;/g, " ");
//  window.predraft3 = $('.draft').html();
    cnt = cnt.replace(/<div><\/div>/g, " ");
    cnt = cnt.replace(/<div>(.*)<\/div>/g, "$1");
    cnt = cnt.replace(/<div>(.*)<\/div>/g, "$1");
    cnt = cnt.replace(/<span style="line-height: inherit; font-size: inherit; font-family: inherit; border: none; color: inherit; background-color: inherit;">(.*)<\/span>/g, "$1");
    cnt = cnt.replace(/<div><br>/g, "<div>");
	cnt = cnt.replace(/<\/div><div><br><\/div><div>/g, "<br>"+object.paragraph_indent);
	cnt = cnt.replace(/<div><br><\/div><div>/g, "<br>"+object.paragraph_indent);
    cnt = cnt.replace(/<\/div><div>/g, "<br>"+object.paragraph_indent);
    cnt = cnt.replace(/<\/div> <div>/g, "<br>"+object.paragraph_indent);
    cnt = cnt.replace(/<\/div><\/span><div>/g, "</div>"+object.paragraph_indent);
    cnt = cnt.replace(/<\/div><div><br><div>/g, "<br>"+object.paragraph_indent);
    cnt = cnt.replace(/<div><br><div>/g, "</div>"+object.paragraph_indent);
    cnt = cnt.replace(/<br><div>/g, ""+object.paragraph_indent);
    cnt = cnt.replace(/<br>&emsp;<kbd/g, "</div><br>"+object.paragraph_indent+"<kbd");
    cnt = cnt.replace(/<br> &nbsp;<br>/g, "<br>"+object.paragraph_indent);
    cnt = cnt.replace(/<br>&emsp;<br>&emsp;/g, "<br>"+object.paragraph_indent);
    cnt = cnt.replace(/<br>&emsp;  <br>&emsp;/g, "<br>"+object.paragraph_indent);
    cnt = cnt.replace(/<div>/g, "<br>"+object.paragraph_indent);
    cnt = cnt.replace(/<br>&emsp;<br>/g, "<br>");
    cnt = cnt.replace(/<br>&emsp;<br>/g, "<br>");
//    console.warn(cnt);
    function c(s) {
//        console.log(s);	 
        //s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    //	$('body').append(s+"<br>");
    }
    function output(e, tag, w) {
        var out = "";
    //    console.log(e+",", tag+",", w+",");
        if(e.substr(-1) != ">")
            e = e+">";
        if(w.length) {
            if(e == "<br>") {
                out = e+w;
            } else if(tag.length) {
                c("Output: "+tag+w+"</"+e.substr(1)+" ");
                out = tag+w+"</"+e.substr(1)+" ";
                //return tag+w+"</"+e.substr(1)+" ";
            } else {
                c("Output: "+w+" ");
                out = w+" ";
                //return w+" ";
            }
        } else {
            //return "";
            if(e == "<kbd>") {
                out = tag;   
            }
        }
        if(out.length)
            d.push(out);
    //    console.log(out);
    //    console.log(d);
        return out;

    }

    //var a = document.getElementById('a').innerHTML;
    var a = cnt;
    var b = a.split('');
    var d = new Array();
    var e = '';
    var w = '';
    var tag = '';
    var intag = false;
    var inend = false;
    var ine = false;
    var parsingdiv = false;
    var out = "";
    var breakk = false;
    //console.error(object.paragraph_indent);
    //console.log(b);
    //a.unshift(object.paragraph_indent);
    //$('body').append("<hr>");
    for(i in b) {
        var b1 = (parseInt(i)+1);
        c(": "+b[i]);
        breakk = false;
        if(b[i] == "<") {
            if((b[b1] == "/" && !parsingdiv) || (b[b1] == "/" && b[ (parseInt(i)+2) ] == e.substr(1,1) && parsingdiv)) {
                 /***/
                 out += output(e, tag, w);
                 if(e == "<br>") {
                    e = "";
                }
                //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
                c(tag+", "+e+"; "+w);
                w = '';

                inend = true;  
                intag = false;
                ine = false;
                tag = "";
                parsingdiv = false;
                c("End of tag");

            } else if(b[i] == "<") {
                 /***/
                //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
                c(tag+", "+e+"; "+w+"  "+parsingdiv);

                 inend = false;
                 if(!parsingdiv) {
                     intag = true;
                     ine = true;
                     c("Outputting from last tag");
                     out += output(e,  tag, w);
                     tag = "";
                     e = "";
                     w = '';
                 }		

            }
            c("<"+b[b1]+" !  "+b[ (parseInt(i)+2) ]+"=?"+e.substr(1,1)+";"+parsingdiv);
        }
        if(b[i] == " ") {
            if(ine) {
                ine = false; 
                c("ine "+e);  
            }
            if(!intag  && e.substr(0,4) != "<div" && e.substr(0,4) != "<kbd") {
                out = out + output(e, tag, w);
                c("___"+tag+", "+e+"; "+w);
                if(e == "<br>") {
                    e = "";
                    tag = "";
                }
                //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
                w = '';
                breakk = true;
            }
        }
        if(!breakk) {
            if(intag) {
                tag = tag + b[i]; 
                c("tag "+tag);
            } else if(!inend) {
                 w = w + b[i];
                 c("w "+w);
            }
            if(ine) {
                e = e + b[i];
                if(e == "<div" || e == "<kbd") {
                    parsingdiv = true;
                    c(e+" "+parsingdiv);
                }
                c("E "+e);
            }

            if(b[i] == ">") {
                intag = false;
                c("Intag is off");
                if((e.indexOf('div') > -1 || e.indexOf('br') > -1) && e.length && inend && object.paragraph_indent != undefined && !parsingdiv) { /** OR if some other type of break is detected*/
                    c("Logged the new paragraph");
                    out = out + output('', '', object.paragraph_indent);
                }
                if(e.indexOf('br') > -1) {
                    //out = out + output('','','<br>');	
                    c("Logged the linebreaker");
                    d.push("<br>");
                }
                if(inend) 
                     e = "";
                 inend = false;
                 ine = false;
            }
        }
    }
    output("","",w);   
    return d;
}
function post_content_formatting(object, compile_doc) {
	updateBuildProgress("Formatting...");
	//Format Citations
	//First, find all authors who have the same last names
	var ln = new Array();
	var fn = new Array();
	var volumes = new Array();
	for(i=0;i<citation.length;i++) {
		for(j=0;j<citation.length;j++) {
			if(i != j) {
				try {
					if(citation[i].AuthorLast == citation[j].AuthorLast && citation[i].AuthorLast.length > 0)
						ln.push(citation[i].AuthorLast);
					if(citation[i].AuthorFirst == citation[j].AuthorFirst && citation[i].AuthorLast == citation[j].AuthorLast && citation[i].AuthorLast.length > 0)
						fn.push(citation[i].AuthorFirst);
					if(citation[i].Title == citation[j].Title && citation[i].Title.length > 0 && citation[i].AuthorLast == citation[j].AuthorLast)
						volumes.push(citation[i].Title);
				} catch(e) {
					
				}
			}
		}
	}
	console.warn(ln, fn, volumes);
	$('.draft .citation').each(function() {
		i = $(this).attr('data-i');
		id = $(this).attr('data-id');
		page = $(this).attr('data-page');
		main = $(this).attr('data-main');
		
		//Get the number of authors for this source
			var sourceauthors = 0;
			for(j=0;j<citation[id].Contributors.length;j++) {
				if(citation[id].Contributors[j] == "Author") {
					sourceauthors++;
				}	
			}
		
		//List various types of citations
		//console.log("Cid", id, citation[id], citation[id].AuthorLast.length);
		if(citation[id].Type == "Bible") {
			//console.log("B "+object.citation_bible);
			$(this).html($(this).html()+" "+citationFormatted(object.citation_bible, i, id, page));
		} else if(main == "on" && fn.indexOf(citation[id].AuthorLast) > -1 && ln.indexOf(citation[id].AuthorLast) > -1 && citation[id].Type == "Book") {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_sameauthorbook_main, i, id, page));
		} else if(main && fn.indexOf(citation[id].AuthorLast) > -1 && ln.indexOf(citation[id].AuthorLast) > -1 && citation[id].Type != "Book") {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_sameauthorarticle_main, i, id, page));
		} else if(fn.indexOf(citation[id].AuthorLast) > -1 && ln.indexOf(citation[id].AuthorLast) > -1 && citation[id].Type == "Book") {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_sameauthorbook, i, id, page));
		} else if(fn.indexOf(citation[id].AuthorLast) > -1 && ln.indexOf(citation[id].AuthorLast) > -1 && citation[id].Type != "Book") {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_sameauthorarticle, i, id, page));
		} else if(main == "on" && object.citation_main != undefined) {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_main, i, id, page));
		} else if(citation[id].AuthorLast.length == 0 && object.citation_noauthor != undefined) {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_noauthor, i, id, page));
		} else if(ln.indexOf(citation[id].AuthorLast) > -1) {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_twolastnames, i, id, page));
		} else if(sourceauthors == 2) {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_twoauthors, i, id, page));
		} else if(sourceauthors == 3) {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_threeauthors, i, id, page));
		} else if(sourceauthors > 3) {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_manyauthors, i, id, page));
		} else if(volumes.indexOf(citation[id].Title) > -1) {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_multivolume, i, id, page));
		} else {
			$(this).html($(this).html()+" "+citationFormatted(object.citation, i, id, page));
		}
	});
	
	//Format Headings
	mhead = {} /*Master Heading Obj*/
	var h1 = 1;
	var h2 = 1;
	var h3 = 1;
    var h4 = 1;
    var h5 = 1;
	$('.draft  .heading').each(function() {
		//$(this).css('display','inline');
		$(this).css('border','none');
		if($(this).attr('class').indexOf('heading1') > -1) {
			$(this).html(headingFormatted(object.heading1,$(this).text(),h1));
			h1++;
			h2 = 1;
			h3 = 1;	
            h4 = 1;
            h5 = 1;
		} else if($(this).attr('class').indexOf('heading2') > -1) {
			$(this).html(headingFormatted(object.heading2,$(this).text(),h2));
			h2++;
			h3 = 1;
            h4 = 1;
            h5 = 1;
		} else if($(this).attr('class').indexOf('heading3') > -1) {
			$(this).html(headingFormatted(object.heading3,$(this).text(),h3));
			h3++;
            h4 = 1;
            h5 = 1;
		} else if($(this).attr('class').indexOf('heading4') > -1) {
			$(this).html(headingFormatted(object.heading4,$(this).text(),h4));
			h4++;
            h5 = 1;
		} else if($(this).attr('class').indexOf('heading5') > -1) {
			$(this).html(headingFormatted(object.heading5,$(this).text(),h5));
			h5++;
		}
	});
	
	//Figure numbers
	if(object.figure !== undefined)	
		object.figure();
	
	//Images
	var j = 0;
    $('.draft .img').each(function() {
		$(this).html(imageFormatted(object.img,$(this),$(this).attr('data-figure-number')));
        $('.reftext[data-ref=img'+$(this).attr('data-id')+']').html($(this).attr('data-figure-number'));
          j++;
		for(i=0;i<object.imgstyle.length;i+=2) {
			$(this).css(object.imgstyle[i], object.imgstyle[i+1]);	
		}
	});
	
	//Tables 
	$('.draft .table').each(function() {
		$(this).css('background-color','white');
		//var table = $.xml2json($(this).attr('data-xml'));
		var table = JSON.parse($(this).attr('data-sheetcache'));
		var r = $(this).attr('data-rows');
		var c = $(this).attr('data-cols');
		//use XML to encode table into rows and columns? Place into data-table and then decode in a preview in the div.
		console.log("x('"+table+"',"+r+","+c+");");
       	$(this).html(object.table(table, r, c));
		$(this).html(tableFormatted($(this).html(),$(this).attr('data-figure-number'),$(this).attr('data-title')));
        $('.reftext[data-ref=table'+$(this).attr('data-id')+']').html($(this).attr('data-figure-number'));
	});
    if(object.latex == undefined)
        object.latex = "EQN";
    $('.draft .latex').each(function() {
        //Include a title
		$(this).html(latexFormatted(object.latex,$(this).html(),$(this).attr('data-figure-number'),$(this).attr('data-figure-number')));
        $('.reftext[data-ref=latex'+$(this).attr('data-id')+']').html($(this).attr('data-figure-number'));
	});
    $('.draft .footnote').each(function(n, e) {
        $(this).html(footnoteFormatted(object.inlineFootnote, n+1, $(this).attr('data-note')));
    }); 
	
	//Now all formatting is complete. We shall port the content over to the actual paper
	//Prevent divs from registering a split, replicate for spans so parent is kept
	//console.warn($('.draft').html());
	/*var erray = new Array ('i','b','u','sup','sub');
	for(ele in erray) {
		$('.draft > span > '+erray[ele]).each(function() {
			var s = $(this).attr('style');
			$(this).html($(this).html().replace(/ /g,'</'+erray[ele]+'>&nbsp;<'+erray[ele]+' style="'+s+'">'));
		});
	}*/
//	console.warn($('.draft').html());
	/*$('.draft > span > div').each(function() {
		$(this).html($(this).html().replace(/ /g,'===').replace(/ /g,"~~~"));
	});
	//div joiner
	$('.draft > div').each(function() {
		$(this).html( $(this).html().replace(/ /g, '===').replace(/ /g,"~~~"));
	});*/
    /*** PARAGRAPH DETECTION ***/
//    console.log($('.draft').html());
    $('.draft span').css('color', 'inherit');
	if(object.paragraph_indent == undefined)
		object.paragraph_indent = "";
//	window.cont = $('.draft').html().replace(/&nbsp;/g, " ");
    window.predraft3 = $('.draft').html();
    window.cont = $('.draft').html().replace(/<div><\/div>/g, " ");
    window.cont = cont.replace(/<div>(.*)<\/div>/g, "$1");
    window.cont = cont.replace(/<div>(.*)<\/div>/g, "$1");
    window.cont = cont.replace(/<span style="line-height: inherit; font-size: inherit; font-family: inherit; border: none; color: inherit; background-color: inherit;">(.*)<\/span>/g, "$1");
//    window.cont = cont.replace(/<div><span .*>(.*)<\/span>/g, "$1");
    window.cont = cont.replace(/<div><br>/g, "<div>");
	window.cont = cont.replace(/<\/div><div><br><\/div><div>/g, "<br>"+object.paragraph_indent);
	window.cont = cont.replace(/<div><br><\/div><div>/g, "<br>"+object.paragraph_indent);
//	window.cont = cont.replace(/<br><\/div>/g, "");
    window.cont = cont.replace(/<\/div><div>/g, "<br>"+object.paragraph_indent);
    window.cont = cont.replace(/<\/div> <div>/g, "<br>"+object.paragraph_indent);
    window.cont = cont.replace(/<\/div><\/span><div>/g, "</div>"+object.paragraph_indent);
    window.cont = cont.replace(/<\/div><div><br><div>/g, "<br>"+object.paragraph_indent);
    window.cont = cont.replace(/<div><br><div>/g, "</div>"+object.paragraph_indent);
    window.cont = cont.replace(/<br><div>/g, ""+object.paragraph_indent);
    window.cont = cont.replace(/<br>&emsp;<kbd/g, "</div><br>"+object.paragraph_indent+"<kbd");
    window.cont = cont.replace(/<br> &nbsp;<br>/g, "<br>"+object.paragraph_indent);
    window.cont = cont.replace(/<br>&emsp;<br>&emsp;/g, "<br>"+object.paragraph_indent);
    window.cont = cont.replace(/<br>&emsp;  <br>&emsp;/g, "<br>"+object.paragraph_indent);
    window.cont = cont.replace(/<div>/g, "<br>"+object.paragraph_indent);
    window.cont = cont.replace(/<br>&emsp;<br>/g, "<br>");
    window.cont = cont.replace(/<br>&emsp;<br>/g, "<br>");
//    console.log( cont.match(/<br> &nbsp;<br>/g));
    
   
	console.log(cont);
    console.log("Generating HTML...");
	updateBuildProgress("Generating HTML...");
	//cont = cont.replace(/<span[^<]+?>/g, "");
	//cont = cont.replace("</span>", "",'g');
	
	//ca =  cont.split(' ');
	
function c(s) {
	//console.log(s);	 
	//s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//	$('body').append(s+"<br>");
}
function output(e, tag, w) {
	var out = "";
//    console.log(e+",", tag+",", w+",");
	if(e.substr(-1) != ">")
		e = e+">";
	if(w.length) {
		if(e == "<br>") {
			out = e+w;
		} else if(tag.length) {
			c("Output: "+tag+w+"</"+e.substr(1)+" ");
			out = tag+w+"</"+e.substr(1)+" ";
			//return tag+w+"</"+e.substr(1)+" ";
		} else {
			c("Output: "+w+" ");
			out = w+" ";
			//return w+" ";
		}
	} else {
		//return "";
        if(e == "<kbd>") {
            out = tag;   
        }
	}
	if(out.length)
		d.push(out);
//    console.log(out);
//    console.log(d);
	return out;
	
}


//var a = document.getElementById('a').innerHTML;
var a = cont;
var b = a.split('');
d = new Array();
var e = '';
var w = '';
var tag = '';
var intag = false;
var inend = false;
var ine = false;
var parsingdiv = false;
var out = "";
var breakk = false;
//console.error(object.paragraph_indent);
//console.log(b);
//a.unshift(object.paragraph_indent);
//$('body').append("<hr>");
for(i in b) {
	var b1 = (parseInt(i)+1);
	c(": "+b[i]);
	breakk = false;
    if(b[i] == "<") {
        if((b[b1] == "/" && !parsingdiv) || (b[b1] == "/" && b[ (parseInt(i)+2) ] == e.substr(1,1) && parsingdiv)) {
			 /***/
			 out += output(e, tag, w);
			 if(e == "<br>")
			 	e = "";
            //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
			c(tag+", "+e+"; "+w);
            w = '';
			
            inend = true;  
			intag = false;
			ine = false;
            tag = "";
			parsingdiv = false;
			c("End of tag");
            
        } else if(b[i] == "<") {
             /***/
            //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
			c(tag+", "+e+"; "+w+"  "+parsingdiv);
			
			 inend = false;
			 if(!parsingdiv) {
				 intag = true;
	             ine = true;
				 c("Outputting from last tag");
				 out += output(e,  tag, w);
				 tag = "";
				 e = "";
				 w = '';
			 }		
			 	
        }
		c("<"+b[b1]+" !  "+b[ (parseInt(i)+2) ]+"=?"+e.substr(1,1)+";"+parsingdiv);
    }
    if(b[i] == " ") {
        if(ine) {
            ine = false; 
			c("ine "+e);  
        }
        if(!intag  && e.substr(0,4) != "<div" && e.substr(0,4) != "<kbd") {
			out = out + output(e, tag, w);
			c("___"+tag+", "+e+"; "+w);
			if(e == "<br>") {
				e = "";
				tag = "";
			}
            //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
            w = '';
            breakk = true;
        }
    }
	if(!breakk) {
		if(intag) {
			tag = tag + b[i]; 
			c("tag "+tag);
		} else if(!inend) {
			 w = w + b[i];
			 c("w "+w);
		}
		if(ine) {
			e = e + b[i];
			if(e == "<div" || e == "<kbd") {
				parsingdiv = true;
				c(e+" "+parsingdiv);
			}
			c("E "+e);
		}
		
		if(b[i] == ">") {
			intag = false;
			c("Intag is off");
			c(object.paragraph_indent+", "+inend + ", " + e);
			if((e.indexOf('div') > -1 || e.indexOf('br') > -1) && e.length && inend && object.paragraph_indent != undefined && !parsingdiv) { /** OR if some other type of break is detected*/
				out = out + output('', '', object.paragraph_indent);
			}
			if(e.indexOf('br') > -1) {
				//out = out + output('','','<br>');	
			}
			if(inend) 
				 e = "";
			 inend = false;
			 ine = false;
		}
	}
}
//console.warn(w);
    output("","",w);
 /***/
	 /*out = out + output(e, tag, w);
		//$('body').append(tag+",<br>"+e+"; "+w+"<br>");
		c(tag+", "+e+"; "+w);
		w = '';
	//div splitter
	out = out.replace(/---/g, ' ');*/
//console.log(d);
	/*** *** Now implement the project **/
	updateBuildProgress("Generating pages...");
	maxh = $('.scale').height()*8.56; //Add 9+2 for body margins just because it works. Don't question it. (It probably has to do with the 1 in padding on the top and bottom, making total height 13 and body 11.
	/* @TODO Improve the column features by allowing it to work with standard CSS (somehow, I don't know how to implement it only for the body), maybe if you set it up as a two column you can add things that bridge? That would definitely ease up the codebase */
	function getColumnOut(p) {
		cout = "<table style='width:100%'><tr>";
		for(i = 0;i<column;i++) {
			cout += "<td style='width:"+(100/column)+"%; vertical-align:top;'><div class='page"+p+"col"+i+"' style='width:100%'></div></td>";		
			////'"	//'"
		}
		cout += "</tr></table>";
//		console.warn("getColumnOut("+p+")");
		return cout;
	}
	//add_to_page(getColumnOut($('.page').length-1));
	if(column == 0)
		col_count = 0;
	else
		col_count = 1;
	d.unshift(object.paragraph_indent);
    console.log(d);
	for(j in d) {
//        if(j > 200) //FIXME Debugging
//            continue;
		//TODO - Find a way to grab the current page, not necessarily the last one. This will be handy for things that are added after content
		p = $('.page').length-1;
        var dspan = d[j]+'';
        if(dspan.indexOf('<kbd class="pagebreak"') > -1) {
            console.warn("Found page break.");
            compile_doc.addPage();
            dspan = "";
            continue;
        }
        dspan = dspan.replace('</span>  ', '</span>');
        console.log(j, dspan);
//		compile_doc.add("<span class='hideme'>"+dspan +" "+"</span>", undefined, undefined, col_count);
		//console.warn($('.page'+p+'body').height(), maxh);
		//console.warn(('.page'+p+'col'+(col_count-1)), $('.page'+p+'col'+(col_count-1)).height(), maxh, $('.page'+p+'col'+(col_count-1)).html().length);
		//console.warn(('.page'+p+'col'+(col_count-1)), $('.page'+p+'col'+(col_count-1)).html().length, $('.page'+p+'col'+(col_count-1)).height());
		if(column <= 0) {
			c("|"+$('.page'+p+'body').height()+" "+maxh+";");
			if($('.page'+p+'body').height() >= maxh) {
//                console.log(dspan+" PAGE TOO LONG",$('.page'+p+'body').height(),maxh,p);    
				c('page too long');
				compile_doc.addPage();
				/*hm = $('.hideme').length;
				he = $('.hideme')[hm-1]
				$(he).css('display','none');*/
			} 
		} else {
			//console.log($('.page'+p+'col'+(col_count-1)));
			if($('.page'+p+'col'+(col_count-1)).height() >= maxh) {
				col_count++;
				//console.error(column, col_count, (col_count-1), (column <= (col_count-1)));
				if(column <= (col_count-1)) {
					add_new_page();
					add_to_page(getColumnOut($('.page').length-1));
					col_count =  1;
				}
			}
		}
		$('.hideme').remove();
		//$('.pasteContent').append(ca[j]+" ");	
        dspan = d[j]+'';
        if(dspan.substr(-1) != " ")
          dspan += "&nbsp;";
//        console.log("'"+dspan+"'");
        dspan = dspan.replace('</span>  ', '</span>');
        //console.log("'"+dspan+"'");
		add_to_page(dspan, undefined, undefined, col_count);
        compile_doc.add(dspan);
	}
	$('.build').html($('.build').html().replace(/===/g,' ').replace(/~~~/g, ' ')/*.replace(/<span[^<]+?>/g, "")*/);
//	$('.pagebody').css('height', maxh+"px"); FIXME I want the middle to have ambiguous height
    $('.build .pagebreak').css('display','none');
	/*if(column > 0) {
		$('.pagebody').css('column-count', column).css('-webkit-column-count', column).css('-moz-column-count');	
	}*/
}	
function post_bibliography(object, cob) {
	//Get all citations, limit only to those used in the paper
	console.log("Bibliography");
	citationSorted = new Array();
	//for(i in citation) {
		$('.content_textarea .citation').each(function() {
			if(citationSorted.indexOf(citation[$(this).attr('data-id')]) == -1) {
				citationSorted.push(citation[$(this).attr('data-id')]);	
			}
		});
	//}	
	//Sort by object.sortmethod
	citationSorted = citationSorted.sort(compare);
	console.log("citationSorted");
	console.log(citationSorted);
	//Clear draft
	$('.draft').empty();
	//Send conditional formatting to draft
	for(i in citationSorted) {
		var str = "";
		var f = findCitation(citationSorted[i]);
       /* for(i in citationObjects) {
            if(citation[f.id].Type == citationObjects[f.id].name && object[f.id].Type)   
        }*/
		if(citation[f.id].Type == "Bible" && object.bible != undefined) {
			str = citationFormatted(object.bible, f.i, f.id, f.page, cob); 
		} else if((citation[f.id].Type == "Book" || citation[f.id].Type == "Book - Online") && object.book != undefined) {
			str = citationFormatted(object.book, f.i, f.id, f.page, cob); 
		} else if(citation[f.id].Type == "Pamphlet" && object.pamphlet != undefined) {
			str = citationFormatted(object.pamphlet, f.i, f.id, f.page, cob); 
		} else if(citation[f.id].Type == "Government" && object.government != undefined) {
			str = citationFormatted(object.government, f.i, f.id, f.page, cob); 
		} else if(citation[f.id].Type == "Dissertation" && object.dissertation != undefined) {
			str = citationFormatted(object.dissertation, f.i, f.id, f.page, cob);
		} else if(citation[f.id].Type == "MA Thesis" && object.mathesis != undefined) {
			str = citationFormatted(object.mathesis, f.i, f.id, f.page, cob);
		} else if(citation[f.id].Type == "MS Thesis" && object.msthesis != undefined) {
			str = citationFormatted(object.msthesis, f.i, f.id, f.page, cob);
		} else if(citation[f.id].Type == "Article - Print" && object.newspaper != undefined) {
			str = citationFormatted(object.newspaper, f.i, f.id, f.page, cob);
		} else if(citation[f.id].Type == "Editorial" && object.editorial != undefined) {
			str = citationFormatted(object.editorial, f.i, f.id, f.page, cob);
		} else if(citation[f.id].Type == "Letter to the Editor" && object.lettertoeditor != undefined) {
			str = citationFormatted(object.lettertoeditor, f.i, f.id, f.page, cob);
		} else if(citation[f.id].Type == "Article - Journal" && object.journal != undefined) {
			str = citationFormatted(object.journal, f.i, f.id, f.page, cob);
		} else if(citation[f.id].MediumFormat == "web") {
			str = citationFormatted(object.web, f.i, f.id, f.page, cob);
		} else {
			console.log("--"+f.id);
			str = citationFormatted(object.def, f.i, f.id, f.page, cob); 
			//(findCitation(citationSorted[i]).id)
		}
		if(annotated_bib && citation[f.id].Abstract.length)
			str += object.annotation + citation[f.id].Abstract;
		$('.draft').append('<div style="'+object.style+'">'+str+'</div>');	
	}
	
	
	//Add part by part by running through citation. If too much, new page in same method as above.	
	ca = $('.draft').html().split('<div');
	var maxh = $('.scale').height()*8.56;
	for(j in ca) {
		//TODO - Find a way to grab the current page, not necessarily the last one. This will be handy for things that are added after content
		p = $('.page').length-1;
		add_to_page("<div class='hideme'>"+ca[j]+" "+"</div>");
		if($('.page'+p+'body').height() > maxh) {
			add_new_page();
			/*hm = $('.hideme').length;
			he = $('.hideme')[hm-1]
			$(he).css('display','none');*/
		} 
		$('.hideme').remove();
		//$('.pasteContent').append(ca[j]+" ");	
		add_to_page("<div"+ca[j]+' ');

	}
}
function findCitation(cite) {
	o = {};
	for(i in citation) {
		if(citation[i] == cite) {
			o.id = i;	
		}
	}
	o.i = $('.citation[data-id="'+i+'"]').attr('data-i');
	o.page = $('.citation[data-id="'+i+'"]').attr('data-page');
	return o;
}
function compare(a,b) {
  if(a.AuthorLast.length && b.AuthorLast.length) {
	  if (a.AuthorLast.toUpperCase() < b.AuthorLast.toUpperCase())
		 return -1;
	  if (a.AuthorLast.toUpperCase() > b.AuthorLast.toUpperCase())
		return 1;
  } else if(!a.AuthorLast.length && b.AuthorLast.length) {
	  if (a.Title.toUpperCase() < b.AuthorLast.toUpperCase())
		 return -1;
	  if (a.Title.toUpperCase() > b.AuthorLast.toUpperCase())
		return 1;
  } else if(a.AuthorLast.length && !b.AuthorLast.length) {
	  if (a.AuthorLast.toUpperCase() < b.Title.toUpperCase())
		 return -1;
	  if (a.AuthorLast.toUpperCase() > b.Title.toUpperCase())
		return 1;
  } else {
	  if (a.Title.toUpperCase() < b.Title.toUpperCase())
		 return -1;
	  if (a.Title.toUpperCase() > b.Title.toUpperCase())
		return 1;
  }
  return 0;
}	