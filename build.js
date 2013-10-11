function startBuild() {
	//initiate the build code, show the progress indicator, and start sending stuff to different functions to do different stuff.
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
		$('.build').append('<div class="page '+pagename+' page'+p+'" data-p="'+p+'"><div class="pageheader page'+p+'header"></div> <div class="pagebody page'+p+'body"></div> <div class="pagefooter"></div></div>');
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
function push_header(text) {
	$('.pageheader').html(text);	
}
function customize_this_header(page, text) {
	$('.page'+page+'header').html(text);	
}