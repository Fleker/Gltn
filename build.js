builddate = 0;
function falseBuild() {
	window.section_name = "";
	$('.build').fadeIn(500);
	$('.body').fadeOut(500);
	$('.header').fadeOut(500);
	$('.build').html('<button onclick="exitBuild()">Return to Editor</button><button onclick="window.print()" class="fa fa-print noprint" style="font-size:12pt;"></button>');	
}
function startBuild(el) {
	//initiate the build code, show the progress indicator, and start sending stuff to different functions to do different stuff.
	builddate = new Date().getTime();
	console.warn('start');
		$('.build').fadeIn(500);
	//$('.page').css('width','8.5in');
	window.section_name = "";
	$('#searching').val('');
	$('.build').html('<button onclick="exitBuild()" class="noprint">Return to Editor</button><button onclick="window.print()" class="fa fa-print noprint" style="font-size:12pt;"></button><span class="buildtime noprint" style="font-size:9pt"></span>');
		//$('.build_progress').css('display', 'block').css('position', 'fixed').css('width', '50%').css('height', '50%').css('top','25%').css('left','25%').css('background-color', 'rgba(0,0,0,0.3)').css('font-size','16pt').css('margin-top','10%');
	initiatePopup({title:"Build Progress",bordercolor:"rgb(44, 145, 16)",ht:"<div id='build_progress' class='build_progress' style='height:150px'></div>"});
	updateBuildProgress('Initiating Build...');
	setTimeout('continueBuild("'+el+'")',500);
}

function continueBuild(el) {
	//Duplicate paper
	var cta = false;
	console.log(el, el == 'undefined');
	if(el == 'undefined') {
		el = '.content_textarea';
		cta = true;
	}
	//el = '.content_textarea';
	var cont = $(el).html();
	//console.log(cont);
	$('.draft').html(cont);
	$('.draft span').css('border','none');
	
	//To {format}.js
	if(cta) {
		try {
			onStylePaper();	
		} catch(e) {
			
		}
		updateBuildProgress('Building Text...');
		onBuildFormat();
			updateBuildProgress('Setting Headers...');	
				
		onGetFormats();
			updateBuildProgress('Formatting Content...');
		if($('.content_textarea > .citation').length) {
			onBuildBibliography();
				updateBuildProgress('Building Bibliography...');
		}
		try {
			onSetHeader();
		} catch(e) {
			
		}
	} else {
		add_new_page();
		post_content_formatting({});	
	}
		updateBuildProgress('Setting up display...');
		
	//To stuff
		//$('.body').css('display', 'none');
		$('.body').fadeOut(500);
	finishBuild();
	scrollTo(0,0);
	console.warn('finish');
	var finishdate = new Date().getTime();
	//console.log(finishdate, builddate);
	$('.buildtime').html('&emsp;Built in '+(finishdate - builddate)/1000+' seconds.');
	//$('.build').css('display', 'block');
}
function updateBuildProgress(text) {
	$('.build_progress').empty();
var opts = {
  lines: 7, // The number of lines to draw
  length: 10, // The length of each line
  width: 3, // The line thickness
  radius: 13, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 0.7, // Rounds per second
  trail: 20, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '30px', // Top position relative to parent in px
  left: '50%' // Left position relative to parent in px
};
var target = document.getElementById('build_progress');
var spinner = new Spinner(opts).spin(target);
$('.build_progress').append(text);
$('.spinner').css('top','55px').css('left','50%');
;	
//target.appendChild(spinner.el);
}
function finishBuild() {
	//$('.build_progress').css('display', 'none');
	closePopup();
	$('.header').hide(1000);
		//stopgf;
	//$('.page').css('width','70%');
}
function exitBuild() {
	$('.header').show(1000);
	$('.body').show(500);
	$('.build').hide(350);
	setTimeout("ribbonSwitch(ribbon_index, false);",1025);
}
//Integration into format.js files
function grabMetadata(i) {
	o = window.metadata[i];
//	console.log(i);
	o.value = $('#format_item_'+i).val();
	if(o.value == undefined)
		o.value = $('#format_item_'+i).html();
	return o;	
}
function searchMetadata(request) {
	for(i=0;i<window.metadata.length;i++) {
		if(window.metadata[i].id == request || window.metadata[i].label == request)
			return i;	
	}
}
function valMetadata(label) {
	return grabMetadata(searchMetadata(label)).value;	
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
		p = $('.page').length;
		if(window.section_name.length) {
			psec = $('.'+section_name).length;
			secname = window.section_name+psec+" "+window.section_name;
		} else
			secname = ""
		$('.build').append('<div class="page '+pagename+' page'+p+' '+secname+'" data-p="'+p+'"><div class="pageheader page'+p+'header"></div> <div class="pagebody page'+p+'body"></div> <div class="pagefooter"></div></div><hr style="height:2px;width:90%;margin-left:5%;>');
}
function add_new_section(section_name) {
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
	return "<table style='width:100%'><tr><td>"+left+"</td><td style='text-align:center'>"+center+"</td><td style='text-align:right'>"+right+"</td></tr></table>";	
}

//Content Formatting
function citationFormatted(string, i, id, page, cob) {
	//Insert a citation content_formatted object and return it with properties filled in
	//console.log(string, id);
	//console.warn(citation[id]);
	console.error(string, id);
	try {
	if(cob != undefined) {
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
		//Get the number of authors for this source
			var sourceauthors = 0;
			var sourceauthorsarray = new Array();
			for(j=0;j<citation[id].Contributors.length;j++) {
				if(citation[id].Contributors[j] == "Author") {
					sourceauthorsarray.push({F: citation[id].ContributorsFirst[j], M: citation[id].ContributorsMiddle[j], L: citation[id].ContributorsLast[j]});
					sourceauthors++;
				}	
			}
		//Get the number of translators for this source
			var sourcetranslators = 0;
			var sourcetranslatorsarray = new Array();
			for(j=0;j<citation[id].Contributors.length;j++) {
				if(citation[id].Contributors[j] == "Translator") {
					sourcetranslatorsarray.push({F: citation[id].ContributorsFirst[j], M: citation[id].ContributorsMiddle[j], L: citation[id].ContributorsLast[j]});
					sourcetranslators++;
				}	
			}
		//Get the number of editors for this source
			var sourceeditors = 0;
			var sourceeditorsarray = new Array();
			for(j=0;j<citation[id].Contributors.length;j++) {
				if(citation[id].Contributors[j] == "Translator") {
					sourceeditorsarray.push({F: citation[id].ContributorsFirst[j], M: citation[id].ContributorsMiddle[j], L: citation[id].ContributorsLast[j]});
					sourceeditors++;
				}	
			}
		
		
		if(citation[id].AuthorFirst.length || citation[id].AuthorLast.length) {
			if(!citation[id].AuthorLast.length && citation[id].AuthorFirst.length) {
				string = string.replace(/cAuthor/, cob.firstonlyauthor.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/g, citation[id].AuthorLast));
			} else if(ln.indexOf(citation[id].AuthorLast) > -1 && ln.indexOf(citation[id].AuthorLast) == fn.indexOf(citation[id].AuthorFirst)) {
				string = string.replace(/cAuthor/, cob.sameauthor.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/g, citation[id].AuthorLast));
			} else if(sourceauthors == 2) {
				string = string.replace(/cAuthor/, cob.sameauthor.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/g, citation[id].AuthorLast).replace(/AUTHOR_FIRST/, sourceauthorsarray[0].F).replace(/AUTHOR_FIRST_I/, sourceauthorsarray[0].F.substr(0,1)).replace(/AUTHOR_LAST/g, sourceauthorsarray[0].L));
			} else if(sourceauthors == 3) {
				string = string.replace(/cAuthor/, cob.sameauthor.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/g, citation[id].AuthorLast).replace(/AUTHOR_FIRST/, sourceauthorsarray[0].F).replace(/AUTHOR_FIRST_I/, sourceauthorsarray[0].F.substr(0,1)).replace(/AUTHOR_LAST/g, sourceauthorsarray[0].L).replace(/AUTHOR_FIRST/, sourceauthorsarray[1].F).replace(/AUTHOR_FIRST_I/, sourceauthorsarray[1].F.substr(0,1)).replace(/AUTHOR_LAST/g, sourceauthorsarray[1].L));
			} else if(sourceauthors > 3) {
				string = string.replace(/cAuthor/, cob.sameauthor.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst).replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1)).replace(/AUTHOR_LAST/g, citation[id].AuthorLast));
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
		if(citation[id].MediumFormat.length)
			string = string.replace(/cMEDIUM/g, cob.medium.replace(/MEDIUM/, citation[id].MediumFormat.substring(0,1).toUpperCase()+citation[id].MediumFormat.substring(1)));
		else
			string = string.replace(/cMEDIUM/g, "");
		if(citation[id].Publisher.length)
			string = string.replace(/cPUBCOMP/, cob.pubcomp.replace(/PUBCOMP/, citation[id].Publisher));
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
			var dueout = (duedate.getDate()+1) + " " + months[duedate.getMonth()] + " " + duedate.getFullYear();
			string = string.replace(/cACCDATE/g, cob.accdate.replace(/ACCDATE/g, dueout));
		} else
			string = string.replace(/cACCDATE/g, "");
		if(page != undefined)
			string = string.replace(/cPAGE/g, cob.page.replace(/PAGE/g, page));
		else
			string = string.replace(/cPAGE/g, "");
	}
	for(i=0;i<citation[id].Contributors.length;i++) {
		string = string.replace(/AUTHOR_FIRST_I/, citation[id].AuthorFirst.substr(0,1));
		string = string.replace(/AUTHOR_FIRST/, citation[id].AuthorFirst);
		string = string.replace(/AUTHOR_LAST/, citation[id].AuthorLast);
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
	if(page)	
		string = string.replace(/PAGE/g, page);	
	else
		string = string.replace(/ PAGE/g, "");
	console.log(string);
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
function smallcaps(inp) {
	//console.warn(inp);
	var out = "";
	for(i=0;i<inp.length;i++) {
		out += inp[i].replace(/[a-z]/g, "<span style='font-size:"+(nptfont-3)+"pt'>"+inp[i].toUpperCase()+"</span>");	
	}
	return out;
}
function numToLetter(capy, number) {
	var cap = ["A", "B", "C","D","E","F","G"];
	//TODO Complete Letter Set
	if(capy == "A")
		return cap[number-1];
	else
		return cap[number-1].toLowerCase();
}
function numToRoman(capy, number) {
	var cap = ["I", "II", "III","IV","V","VI","VII","VIII","IX","X"];
	//TODO Complete set
	if(capy == "I") 
		return cap[number-1];
	else
		return cap[number-1].toLowerCase();
}
function numOrdered(number) {
	var ord = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th"];
	return number+ord[number];
}
function post_content_formatting(object) {
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
		} else if(citation[id].Main == "on" && fn.indexOf(citation[id].AuthorLast) > -1 && ln.indexOf(citation[id].AuthorLast) > -1 && citation[id].Type == "Book") {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_sameauthorbook_main, i, id, page));
		} else if(citation[id].Main == "on" && fn.indexOf(citation[id].AuthorLast) > -1 && ln.indexOf(citation[id].AuthorLast) > -1 && citation[id].Type != "Book") {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_sameauthorarticle_main, i, id, page));
		} else if(fn.indexOf(citation[id].AuthorLast) > -1 && ln.indexOf(citation[id].AuthorLast) > -1 && citation[id].Type == "Book") {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_sameauthorbook, i, id, page));
		} else if(fn.indexOf(citation[id].AuthorLast) > -1 && ln.indexOf(citation[id].AuthorLast) > -1 && citation[id].Type != "Book") {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_sameauthorarticle, i, id, page));
		} else if(citation[id].Main == "on" && object.citation_main != undefined) {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_main, i, id, page));
		} else if(citation[id].AuthorLast.length == 0) {
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
	$('.draft  .heading').each(function() {
		//$(this).css('display','inline');
		$(this).css('border','none');
		if($(this).attr('class').indexOf('heading1') > -1) {
			$(this).html(headingFormatted(object.heading1,$(this).text(),h1));
			h1++;
			h2 = 1;
			h3 = 1;	
		} else if($(this).attr('class').indexOf('heading2') > -1) {
			$(this).html(headingFormatted(object.heading2,$(this).text(),h2));
			h2++;
			h3 = 1;	
		} else if($(this).attr('class').indexOf('heading3') > -1) {
			$(this).html(headingFormatted(object.heading3,$(this).text(),h3));
			h3++;
		}
	});
	
	//Figure numbers
	if(object.figure != undefined)	
		eval(object.figure+";x();");
	
	//Images
	$('.draft .img').each(function() {
		$(this).html(imageFormatted(object.img,$(this),$(this).attr('data-figure-number')));
		for(i=0;i<object.imgstyle.length;i+=2) {
			$(this).css(object.imgstyle[i], object.imgstyle[i+1]);	
		}
	});
	
	//Tables 
	$('.draft .table').each(function() {
		$(this).css('background-color','white');
		//var table = $.xml2json($(this).attr('data-xml'));
		table = $(this).attr('data-xml');
		var r = $(this).attr('data-row');
		var c = $(this).attr('data-col');
		//use XML to encode table into rows and columns? Place into data-table and then decode in a preview in the div.
		console.log("x("+table+","+r+","+c+");");
		$(this).html(eval(object.table+';x("'+table+'",'+r+','+c+');'));
		$(this).attr('data-xml', "");
		$(this).html(tableFormatted($(this).html(),$(this).attr('data-figure-number'),$(this).attr('data-title')));
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
	console.warn($('.draft').html());
	/*$('.draft > span > div').each(function() {
		$(this).html($(this).html().replace(/ /g,'===').replace(/ /g,"~~~"));
	});
	//div joiner
	$('.draft > div').each(function() {
		$(this).html( $(this).html().replace(/ /g, '===').replace(/ /g,"~~~"));
	});*/
	if(object.paragraph_indent == undefined)
		object.paragraph_indent = "";
	window.cont = $('.draft').html().replace(/&nbsp;/g, " ");
	window.cont = cont.replace(/<div><br><\/div><div>/g, "<br>"+object.paragraph_indent);
	console.log(cont);
	updateBuildProgress("Generating HTML...");
	//cont = cont.replace(/<span[^<]+?>/g, "");
	//cont = cont.replace("</span>", "",'g');
	
	//ca =  cont.split(' ');
	
	/*** Replace output function so that it places every item into an array instead of just outputting ***/
function c(s) {
	//console.log(s);	
	//s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	//$('body').append(s+"<br>");
}
function output(e, tag, w) {
	var out = "";
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
	}
	if(out.length)
		d.push(out);
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
console.error(object.paragraph_indent);
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
        if(!intag  && e.substr(0,4) != "<div") {
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
			if(e == "<div") {
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
 /***/
	 /*out = out + output(e, tag, w);
		//$('body').append(tag+",<br>"+e+"; "+w+"<br>");
		c(tag+", "+e+"; "+w);
		w = '';
	//div splitter
	out = out.replace(/---/g, ' ');*/

	/*** *** Now implement the project **/
	updateBuildProgress("Generating pages...");
	maxh = $('.scale').height()*10.5; //Add 9+2 for body margins just because it works. Don't question it. (It probably has to do with the 1 in padding on the top and bottom, making total height 13 and body 11.
	/* @TODO Improve the column features by allowing it to work with standard CSS (somehow, I don't know how to implement it only for the body), maybe if you set it up as a two column you can add things that bridge? That would definitely ease up the codebase */
	function getColumnOut(p) {
		cout = "<table style='width:100%'><tr>";
		for(i = 0;i<column;i++) {
			cout += "<td style='width:"+(100/column)+"%; vertical-align:top;'><div class='page"+p+"col"+i+"' style='width:100%'></div></td>";		
			////'"	//'"
		}
		cout += "</tr></table>";
		console.warn("getColumnOut("+p+")");
		return cout;
	}
	add_to_page(getColumnOut($('.page').length-1));
	if(column == 0)
		col_count = 0;
	else
		col_count = 1;
	d.unshift(object.paragraph_indent);
	for(j in d) {
		//TODO - Find a way to grab the current page, not necessarily the last one. This will be handy for things that are added after content
		p = $('.page').length-1;
		add_to_page("<span class='hideme'>"+d[j]+" "+"</span>", undefined, undefined, col_count);
		//console.warn($('.page'+p+'body').height(), maxh);
		//console.warn(('.page'+p+'col'+(col_count-1)), $('.page'+p+'col'+(col_count-1)).height(), maxh, $('.page'+p+'col'+(col_count-1)).html().length);
		//console.warn(('.page'+p+'col'+(col_count-1)), $('.page'+p+'col'+(col_count-1)).html().length, $('.page'+p+'col'+(col_count-1)).height());
		if(column <= 0) {
			c("|"+$('.page'+p+'body').height()+" "+maxh+";");
			if($('.page'+p+'body').height() > maxh) {
				c('page too long');
				add_new_page();
				/*hm = $('.hideme').length;
				he = $('.hideme')[hm-1]
				$(he).css('display','none');*/
			} 
		} else {
			//console.log($('.page'+p+'col'+(col_count-1)));
			if($('.page'+p+'col'+(col_count-1)).height() > maxh) {
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
		add_to_page(d[j]+' ', undefined, undefined, col_count);
	}
	$('.build').html($('.build').html().replace(/===/g,' ').replace(/~~~/g, ' ')/*.replace(/<span[^<]+?>/g, "")*/);
	/*if(column > 0) {
		$('.pagebody').css('column-count', column).css('-webkit-column-count', column).css('-moz-column-count');	
	}*/
}	
function post_bibliography(object, cob) {
	//Get all citations, limit only to those used in the paper
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
	//Clear draft
	$('.draft').empty();
	//Send conditional formatting to draft
	for(i in citationSorted) {
		var str = "";
		var f = findCitation(citationSorted[i]);
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
	var maxh = $('.scale').height()*6.5;
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
	  if (a.AuthorLast < b.AuthorLast)
		 return -1;
	  if (a.AuthorLast > b.AuthorLast)
		return 1;
  } else if(!a.AuthorLast.length && b.AuthorLast.length) {
	  if (a.Title < b.AuthorLast)
		 return -1;
	  if (a.Title > b.AuthorLast)
		return 1;
  } else if(a.AuthorLast.length && !b.AuthorLast.length) {
	  if (a.AuthorLast < b.Title)
		 return -1;
	  if (a.AuthorLast > b.Title)
		return 1;
  } else {
	  if (a.Title < b.Title)
		 return -1;
	  if (a.Title > b.Title)
		return 1;
  }
  return 0;
}