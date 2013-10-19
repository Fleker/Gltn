function startBuild() {
	//initiate the build code, show the progress indicator, and start sending stuff to different functions to do different stuff.
	window.section_name = "";
	$('.build').empty();
		$('.build_progress').css('display', 'block').css('position', 'fixed').css('width', '50%').css('height', '50%').css('top','25%').css('left','25%').css('background-color', 'rgba(0,0,0,0.3)').css('font-size','16pt').css('margin-top','10%');
	updateBuildProgress('Initiating Build...');
	
	//To APA.js
	try {
		onStylePaper();	
	} catch(e) {
		
	}
	updateBuildProgress('Building Text...');
	onBuildFormat();
		updateBuildProgress('Setting Headers...');	
	onGetFormats();
		updateBuildProgress('Formatting Content...');
	onBuildBibliography();
		updateBuildProgress('Building Bibliography...');
	onSetHeader();
		updateBuildProgress('Setting up display...');
		
	//To stuff
		//$('.body').css('display', 'none');
		$('.body').fadeOut(500);
		$('.build').fadeIn(500);
	finishBuild();
	//$('.build').css('display', 'block');
}
function updateBuildProgress(text) {
	$('.build_progress').html(text);	
}
function finishBuild() {
	//$('.build_progress').css('display', 'none');
	$('.build_progress').fadeOut(250);
	$('.header').hide(1000);
}
function exitBuild() {
	$('.header').show(1000);
	$('.body').show(500);
	$('.build').hide(2000);
}
//Integration into format.js files
function grabMetadata(i) {
	o = window.metadata[i];
	o.value = $('#format_item_'+i).val();
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
function valAuthor() {
	searchMetadata('Author');	
}
function centerText(text) {
	return '<div style="text-align:center">'+text+'</div>';
}
function boldText(text) {
	return '<span style="font-weight:bold">'+text+'</span>';	
}
function sizeText(text, size) {
	return '<span style="font-size:'+size+'">'+text+'</span>';	
}
//Set up universal paper style guidelines
function enable_format(setting) {
	switch(setting) {
		case 'double space': 
			$('.build').css('line-height', '2em');
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
function add_to_page(text, i, name) {
	if(i != undefined) {
		$('.page'+i+'body').append(text);		
	} else if(name != undefined) {
		$('.'+pagename+'body').append(text);	
	} else {
		p = $('.page').length-1;
		$('.page'+p+'body').append(text);	
	}
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
function citationFormatted(string, i, id, page) {
	//Insert a citation content_formatted object and return it with properties filled in
	string = string.replace(/AUTHOR_LAST/g, citation[id].AuthorLast);
	string = string.replace(/PAGE/g, page);	
	return string;	
}
function post_content_formatting(object) {
	//Duplicate paper
	var cont = $('.content_textarea').html();
	$('.draft').html(cont);
	$('.draft > .citation').each(function() {
		i = $(this).attr('data-i');
		id = $(this).attr('data-id');
		page = $(this).attr('data-page');
		
		//List various types of citations
		if(citation[id].Main == "on" && object.citation_main != undefined) {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_main, i, id, page));
		} else {
			$(this).html($(this).html()+" "+citationFormatted(object.citation, i, id, page));
		}
	});
	
	//Now all formatting is complete. We shall port the content over to the actual paper
	cont = $('.draft').text();
	ca =  cont.split(' ');
	
	var maxh = $('.scale').height()*6.5;
	for(j in ca) {
		//TODO - Find a way to grab the current page, not necessarily the last one. This will be handy for things that are added after content
		p = $('.page').length-1;
		add_to_page("<span class='hideme'>"+ca[j]+" "+"</span>");
		if($('.page'+p+'body').height() > maxh) {
			add_new_page();
			/*hm = $('.hideme').length;
			he = $('.hideme')[hm-1]
			$(he).css('display','none');*/
		} 
		$('.hideme').remove();
		//$('.pasteContent').append(ca[j]+" ");	
		add_to_page(ca[j]+' ');

	}
}	
function post_bibliography(object) {
	//Get all citations, limit only to those used in the paper
	citationSorted = new Array();
	for(i in citation) {
		var cites = $('.citation');
		$('.citation').each(function() {
			if(citationSorted.indexOf(citation[$(this).attr('data-id')]) > -1) {
				citationSorted.push(citation[$(this).attr('data-i')]);	
			}
		});
	}	
	//Sort by object.sortmethod
	citationSorted = citationSorted.sort(compare);
	//Clear draft
	//Send conditional formatting to draft
	//Add part by part by running through citation. If too much, new page in same method as above.	
}
function compare(a,b) {
  if (a.AuthorLast < b.AuthorLast)
     return -1;
  if (a.AuthorLast > b.AuthorLast)
    return 1;
  return 0;
}