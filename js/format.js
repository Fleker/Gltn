// Formatting Engine

window.metadata = new Array();
format_js_index = 0;

function new_format() {
	format_js_index = -1;
	window.metadata = [{blank: 0}];	
	$('#file_metadata').empty();
	min_word = 0;
	max_word = 0;
	min_char = 0;
	max_char = 0;
}
function new_format_item(type, ops) {
	format_js_index++;
	if(ops == undefined)
		ops = {};
	window.metadata[format_js_index] = {type: type, index: format_js_index, min: 0, max: 0};
	var option_choices = ["label", "max", "min", "mtype", "placeholder", "description", "id"];
	//FUTURE - Default Text
	for(i=0;i<option_choices.length;i++) {
		if(ops[option_choices[i]] != undefined) {
			window.metadata[format_js_index][option_choices[i]] = ops[option_choices[i]];
		} else {
			window.metadata[format_js_index][option_choices[i]] = "";
		}
	}
}
function new_format_block() {
	new_format_item("block");	
}
function new_format_nl() {
	new_format_item("nl");
}
window.annotated_bib = false;
function set_up_format(name, property) {
	switch(name) {
		case 'word count':
			min_word = property.min;
			max_word = property.max;
		break;
		case 'character count':
			min_char = property.min;
			max_char = property.max;
		break;	
		case 'annotated bibliography':
			window.annotated_bib = true;
		break;
	}
}
function post_format() {
	var out = ""
	for(i=0;i<=format_js_index;i++) {
		type = window.metadata[i].type;
		
		if(type == "content") {
			out = out + post_format_content(window.metadata[i]);
		} else if(type == "name") {
			out = out + post_format_text(window.metadata[i]) + "&nbsp;&nbsp;" + post_format_text(window.metadata[i], -1);
		} else if(type == "block") {
			out = out + "<br><br>";
		} else if(type == "nl") {
			out = out + "<br>";
		} else if(type == "mltext") { 
			out += post_format_mltext(window.metadata[i]);
		} else if(type == "label") {
			out += "<div style='font-weight:bold;border-bottom:solid 1px #888;width:90%;margin-left:5%;'>"+window.metadata[i].label+"</div>";
		} else if(type == "date") {
			out += post_format_date(window.metadata[i]);
		} else {
			out = out + post_format_text(window.metadata[i]);
		}		
		out = out + "<br>";
	}
	$('#file_metadata').html(out);
	$('.build, .toolbar').on('mouseleave', function() {
		hideHovertag();
	});
	
	for(i=0;i<=format_js_index;i++) {
		if(window.metadata[i].min.length != 0 || window.metadata[i].max.length != 0) {
			/*var e = '#format_item_'+i;
			$(e).on('input', function() {
				format_check_count(i);
			});*/
			setInterval("format_check_count("+i+")", 100);
		}
	}
	onInitToolbar();
	
	//Set up selection parameters
			 document.getElementsByClassName("content_textarea")[0].onmouseup = function() {
				 	if($('.content_textarea').html().length > 1) {				 
						rangy.getSelection().expand("word", {
						wordOptions: {
							includeTrailingSpace: false,
							wordRegex: /[a-z0-9]+(['\-][a-z0-9]+)*/gi
						}
                		});
					}
					//postRange('click and select');
			}
			document.getElementsByClassName("content_textarea")[0].oninput = function() {
				//postRange('oninput');
				//saveFile();
			}	
			document.getElementsByClassName("content_textarea")[0].onkeyup = function() {
				postRange('onkeyup');
			}	
	//Theme parameters for content_textarea
	$('.content_textarea').css('background-color', theme.normbg).css('color', theme.normcolor);
	console.log('CT colors set');
}

function format_check_count(i) {
	content = $('#format_item_'+i).val();
	if(content.length == 0)
		content = $('#format_item_'+i).html();
	if(window.metadata[i] == undefined)
		console.log("md"+i);
	mtype = window.metadata[i].mtype;
	min = window.metadata[i].min;
	max = window.metadata[i].max;
	if(mtype == "c") {
		characters = content.length;
		var e = '#format_count_'+i;
		if(min > characters) {
			$(e).html('<span style="color:'+theme.coloralt+'">'+min+'</span>&emsp;<span class="gluten_red">'+characters+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.coloralt+'">'+max+'</span>');
		} else if(max < characters) {
			$(e).html('<spanstyle="color:'+theme.coloralt+'">'+min+'</span>&emsp;<span class="gluten_red">'+characters+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.coloralt+'">'+max+'</span>');
		} else {
			$(e).html('<span class="gluten_gray">'+characters+'&nbsp;'+mtype+'</span>');
		}	
	} else if(mtype == "w") {
		words = content.split(' ').length;
		var e = '#format_count_'+i;
		if(min > words) {
			$(e).html('<span style="color:'+theme.coloralt+'">'+min+'</span>&emsp;<span class="gluten_red">'+words+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.coloralt+'">'+max+'</span>');
		} else if(max < words) {
			$(e).html('<span style="color:'+theme.coloralt+'">'+min+'</span>&emsp;<span class="gluten_red">'+words+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.coloralt+'">'+max+'</span>');
		} else {
			$(e).html('<span class="gluten_gray">'+words+'&nbsp;'+mtype+'</span>');
		}
	}	
}


function post_format_text(m, inv) {
	var out = "";
	
	var ind = m.index;
	if(inv != undefined && inv != 0)
		ind = (m.index-inv)+"_2";
	else {
		out = out + m.label+":&nbsp;";
		if(m.description.length)
			out = out + "<br><span class='format_description'>"+m.description+"</span><br>";
	}
	out = out + "<input id='format_item_"+m.index+"' placeholder='"+m.placeholder+"' style='width:55%' onmouseenter='hideHovertag()'>";
	if(m.min.length != 0 || m.max.length != 0) {
		out = out + "<br><div class='format_count' id='format_count_"+m.index+"'></div>";	
	}
	return out;
}
function post_format_date(m, inv) {
	var out = "";
	
	var ind = m.index;
	if(inv != undefined && inv != 0)
		ind = (m.index-inv)+"_2";
	else {
		out = out + m.label+":&nbsp;";
		if(m.description.length)
			out = out + "<br><span class='format_description'>"+m.description+"</span><br>";
	}
	out = out + "<input type='date' id='format_item_"+m.index+"' placeholder='"+m.placeholder+"' onmouseenter='hideHovertag()'>";
	if(m.min.length != 0 || m.max.length != 0) {
		out = out + "<br><div class='format_count' id='format_count_"+m.index+"'></div>";	
	}
	return out;
}
function post_format_mltext(m) {
	var out = "";
	out = out + m.label + "<br>";
	if(m.description.length)
		out = out + "<span class='format_description'>"+m.description+"</span><br>";	
	out = out + "<div class='post_format_mltext' contenteditable id='format_item_"+m.index+"' onmouseenter='hideHovertag()'></div>";
	if(m.min.length != 0 || m.max.length != 0) {
		out = out + "<div class='format_count' id='format_count_"+m.index+"'></div>";	
	}
	return out;
}
function post_format_content(m) {
	var out = "";
	out = "<div class='content overflow'></div>";
	out += "<div class='content toolbar'></div>";
	out = out + "<div contenteditable='true' class='content content_textarea' onmouseleave='/*hideHovertag()*/' onfocus='/*restoreSelection()*/'></div>";
	out = out + "<table class='content_wordcount'><tr id='content_row'><td class='content_word'></td><td class='content_character'></td><td class='content_save '>&emsp;</td></tr></table>";
	return out;	
}
function post_toolbar(tools) {
	window.tools = tools;
	var overflow = false;
	$('.toolbar').empty();
	$('.overflow').empty();
	$('.toolbar').append("<div class='toolbar_options' style='display:inline'>&emsp;<span class='toolbar_button' data-t='character' id='CHARACTERPANEL'>Character</span>&emsp;|&emsp;");
	//TODO - Use labels to make prettier, maybe "new_toolbar/new_toolbar_item"
	//TODO - Use JSON objects to enable more powerful, third-party tools
	for(i=0;i<tools.length;i++) {
		if(typeof(tools[i] == "string")) {
			var tool_pretty = tools[i];
			var tool_t = tools[i];
			switch(tool_pretty) {
				case "heading1":
					tool_pretty = "H1";
				break;
				case "heading2":
					tool_pretty = "H2";
				break;
				case "heading3":
					tool_pretty = "H3";
				break;
				case "image":
					tool_pretty = "Image";
				break;
				case "citation":
					tool_pretty = "Citation";
				break;	
				case "table":
					tool_pretty = "Table";
				break;
				case "bold":
					tool_pretty = "<button class='fontawesome-bold'></button>";
				break;
				case "italics":
					tool_pretty = "<button class='fontawesome-italics'></button>";
				break;
                case "reftext":
                    tool_pretty = "Ref Text";
                break;
                case "LaTeX":
                    tool_pretty = "LaTeX";
                break;
			}
		} else {
			tool_pretty = tools[i].label;
			tool_t = tools[i].id;
		}
		var sum = 0;
		var index = 0;
		$('.toolbar_button').each(function(){ 
			if($(this).width() > sum)
			sum = $(this).width();
		});
		sum += 35;
		//console.log("Tool",i,$('.toolbar_options').width() + sum >= $('.toolbar').width(),$('.toolbar_options').width() + sum,$('.toolbar').width());
		if($('.toolbar_options').width() + sum >= $('.toolbar').width() & overflow == false) {
			overflow = true;
			$('.toolbar_options').append("<div class='toolbar_button' data-t='overflow' style='display:inline-block'>&nbsp;&nbsp;&nbsp;<span class='fa fa-ellipsis-v'></span>&nbsp;&nbsp;&nbsp;</div>|&emsp;");
		}	
		if(overflow)
			$('.overflow').append("<span class='toolbar_button' data-t='"+tool_t+"'>"+tool_pretty+"</span>&emsp;|&emsp;");
		else
			$('.toolbar_options').append("<span class='toolbar_button' data-t='"+tool_t+"'>"+tool_pretty+"</span>&emsp;|&emsp;");
	}
	if(overflow)
		$('.overflow').prepend("&emsp;<span class='toolbar_button fa fa-expand' data-t='fullscreen'></span>&emsp;|&emsp;</div>");
	else
		$('.toolbar_options').append("<span class='toolbar_button fa fa-expand' data-t='fullscreen'></span>&emsp;|&emsp;</div>");
	//if(overflow) 
		//out += "</span></div>";
	
	//$('.toolbar').html(out);
	$('.overflow').hide();
	$('.toolbar_button').on('mouseenter', function() {
		highlight_tool(this);
	});
	$('.toolbar_button').on('mouseleave', function() {
		unlight_tool(this);
	});
	$('.toolbar_button').on("click", function() {
		switch ($(this).attr('data-t')) {
			case "character":
				runPanel('main_Character');
				setTimeout("introJsStart(10);",550);
			break;
			case "fullscreen":
				fullscreen();
			break;
			case "citation":
				initiateCitationEditor();
				setTimeout("introJsStart(13);",550);
			break;
			case "heading1":
				contentAddSpan({node:"span", class:"heading1 heading"});
				formatHovertag("heading1", "'Heading-1'", 'null');
			break;
			
			case "heading2":
				contentAddSpan({node:"span", class:"heading2 heading"});
				formatHovertag("heading2", "'Heading-2'", 'null');
			break;
			
			case "heading3":
				contentAddSpan({node:"span", class:"heading3 heading"});
				formatHovertag("heading3", "'Heading-3'", 'null');
			break;
			case "image":
				var imid = $('.img').length;
				contentAddSpan({node:"div", class:"img inline img"+imid});
				imgDetails(imid);
				formatHovertag("img", "'Image Details'", "'imgDetails('+$(this).attr('data-id')+');'");
			break;
			case "table":
			var tid = $('.table').length;
				contentAddSpan({node:"div", class:"table inline table"+tid});
				tableDetails(tid);
				formatHovertag("table", "$(this).attr('data-title')", "'tableDetails('+$(this).attr('data-id')+');'");
			break;
			case "bold":
				console.warn("bold");
				toggleBold();	
			break;
			case "italics":
				toggleItalics();
			break;
            case "reftext":
                var rtid = $('.reftext').length;
                contentAddSpan({node:"span", class:"reftext reftext"+stid});
                refTextDetails(rtid);
                formatHovertag("reftext", "'Ref: '+$(this).attr('data-ref')", "'refTextDetails('+$(this).attr('data-id')+');'");
            break;
            case "LaTeX":
                var lid = $('.latex').length;
                contentAddSpan({node:"kbd", class:"latex latex"+lid});
                latexDetails(lid);
                formatHovertag("latex", "$(this).attr('data-cmd')", "'latexDetails('+$(this).attr('data-id')+');'");
            break;
            
			case 'overflow':
				$('.overflow').toggle(150);
			break;
			default:
				for(i in tools) {
					if(typeof(tools[i]) == "object") {
						if(tools[i].id == $(this).attr('data-t')) {
							eval(tools[i].fnc);	
						}
					}
				}
			break;
		}
	});
	
}
function highlight_tool(el) {
	//console.log(jQuery(el).attr('class'));
	jQuery(el).animate({
		backgroundColor: '#33f',
	}, 175);
}
function unlight_tool(el) {
	jQuery(el).animate({
		backgroundColor: 'rgba(0,0,0,0)'	
	}, 175);
}
window.fullscreenOn = false;
/*$(window).resize(function () {*/
toolbar_width = 0;
sy_save = 0;
function update_toolbar_style() {
	//saveFile();
	/*if(getRange().collapsed == false) {
		appendHoloSelection();	
	}*/
	//$('.toolbar').width(.94*window.innerWidth);
	if(toolbar_width != $('.toolbar').width()) {
		//$('.toolbar').width(.94*window.innerWidth);
		//tw = window.innerWidth - 75;
		//toolbar_width = tw;
		toolbar_width = $('.toolbar').width();
		//console.log(toolbar_width+" ",$('.toolbar').width());
		if(window.fullscreenOn == false) {
			//tw = window.innerWidth - 75;
			/**/tw = $('.toolbar').width();
			$('.content_textarea').width(tw);
			$('.overflow').width(tw);
			bh = window.innerHeight;
			$('.content_textarea').height(2*bh/3);
			$('.content_textarea').css('z-index', 0).css('position', 'inherit');
			onInitToolbar();
			/*$('.content_textarea').animate({
				top: -.1%,
				left:-.1%;
				width:100.2%;
				height:100.2%;
			});*/
		} else {
			//$('.content_textarea').css('z-index', 3).css('position', 'fixed')/*.css('background-color', 'white')*/;
		}	
		
		//Update Header
		ribbonSwitch(ribbon_index, true);
	}

	//Use this for other dynamic styling stuff
	
	
	
	var sy = scrollY-10/*-110*/;
	if(sy <= 0)
		sy = 0;

	//$('#panel_plugin').css('margin-top', sy);
	if(sy != sy_save) {
		$('#panel_plugin').animate({
			marginTop: sy
		},20);
		sy_save = sy;
	}
	$('.introjs-overlay').css('display', 'none');
	//Also, we will redo all the CSS rules just to make sure they're applied to all the new content
	initTheme();
	
	//$('#panel_plugin').css('height', window.innerHeight);
	
}