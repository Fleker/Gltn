// Formatting Engine

window.metadata = new Array();
format_js_index = 0;

function new_format() {
	format_js_index = -1;
	window.metadata = [{blank: 0}];	
	$('#file_metadata').empty();
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
function set_up_format(name, property) {
	
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
			out = out + post_format_mltext(window.metadata[i]);
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
					postRange('click and select');
			}
			document.getElementsByClassName("content_textarea")[0].oninput = function() {
				postRange('oninput');
				saveFile();
			}	
			document.getElementsByClassName("content_textarea")[0].onkeyup = function() {
				postRange('onkeyup');
			}	
}

function format_check_count(i) {
	content = $('#format_item_'+i).val();
	if(window.metadata[i] == undefined)
		console.log("md"+i);
	mtype = window.metadata[i].mtype;
	min = window.metadata[i].min;
	max = window.metadata[i].max;
	if(mtype == "c") {
		characters = content.length;
		var e = '#format_count_'+i;
		if(min > characters) {
			$(e).html('<span class="format_count_min">'+min+'</span>&emsp;<span class="gluten_red">'+characters+'&nbsp;'+mtype+'</span>&emsp;<span class="format_count_min">'+max+'</span>');
		} else if(max < characters) {
			$(e).html('<span class="format_count_min">'+min+'</span>&emsp;<span class="gluten_red">'+characters+'&nbsp;'+mtype+'</span>&emsp;<span class="format_count_min">'+max+'</span>');
		} else {
			$(e).html('<span class="gluten_gray">'+characters+'&nbsp;'+mtype+'</span>');
		}	
	} else if(mtype == "w") {
		words = content.split(' ').length;
		var e = '#format_count_'+i;
		if(min > words) {
			$(e).html('<span class="format_count_min">'+min+'</span>&emsp;<span class="gluten_red">'+words+'&nbsp;'+mtype+'</span>&emsp;<span class="format_count_min">'+max+'</span>');
		} else if(max < words) {
			$(e).html('<span class="format_count_min">'+min+'</span>&emsp;<span class="gluten_red">'+words+'&nbsp;'+mtype+'</span>&emsp;<span class="format_count_min">'+max+'</span>');
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
		out = out + m.label;
		if(m.description.length)
			out = out + "<br><span class='format_description'>"+m.description+"</span><br>";
	}
	out = out + "<input id='format_item_"+m.index+"' placeholder='"+m.placeholder+"' onmouseenter='hideHovertag()'>";
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
	out = out + "<textarea id='format_item_"+m.index+"' onmouseenter='hideHovertag()'></textarea>";
	if(m.min.length != 0 || m.max.length != 0) {
		out = out + "<br><div class='format_count' id='format_count_"+m.index+"'></div>";	
	}
	return out;
}
function post_format_content(m) {
	var out = "";
	out = "<div class='content toolbar'></div>";
	out = out + "<div contenteditable='true' class='content content_textarea' onfocus='postRange()' onclick='postRange()' onmouseleave='/*hideHovertag()*/ '></div>";
	out = out + "<table class='content_wordcount'><tr><td class='content_word'></td><td class='content_character'></td><td class='content_save'>&emsp;saved</td></tr></table>";
	return out;	
}
function post_toolbar(tools) {
	out = "&emsp;<span class='toolbar_button' data-t='character' id='CHARACTERPANEL'>Character</span>&emsp;|&emsp;";
	//TODO - Use labels to make prettier, maybe "new_toolbar/new_toolbar_item"
	for(i=0;i<tools.length;i++) {
		out = out + "<span class='toolbar_button' data-t='"+tools[i]+"'>"+tools[i]+"</span>&emsp;|&emsp;";
	}
	out = out + "<span class='toolbar_button' data-t='fullscreen'>[^]</span>&emsp;|&emsp;";
	
	$('.toolbar').html(out);
	
	$('.toolbar_button').on("click", function() {
		switch ($(this).attr('data-t')) {
			case "character":
				runPanel('main_Character');
			break;
			case "fullscreen":
				fullscreen();
			break;
			
			case "heading1":
				contentAddSpan({node:"span", class:"heading1 heading"});
				formatHovertag("heading1", '"Heading-1"', 'null');
			break;
			
			case "heading2":
				contentAddSpan({node:"span", class:"heading2 heading"});
				formatHovertag("heading2", '"Heading-2"', 'null');
			break;
			
			case "heading3":
				contentAddSpan({node:"span", class:"heading3 heading"});
				formatHovertag("heading3", '"Heading-3"', 'null');
			break;
		}
	});
	
	
	setInterval("update_toolbar_style()", 10);
}
window.fullscreenOn = false;
/*$(window).resize(function () {*/
function update_toolbar_style() {
	if(window.fullscreenOn == false) {
		tw = $('.toolbar').width();
		$('.content_textarea').width(tw);
		bh = window.innerHeight;
		$('.content_textarea').height(2*bh/3);
		$('.content_textarea').css('z-index', 0).css('position', 'inherit');
		/*$('.content_textarea').animate({
			top: -.1%,
			left:-.1%;
			width:100.2%;
			height:100.2%;
		});*/
	} else {
		$('.content_textarea').css('z-index', 3).css('position', 'fixed')/*.css('background-color', 'white')*/;
		
	}
	
	//Use this for other dynamic styling stuff
	
	var sy = scrollY-110;
	if(sy <= 0)
		sy = 0;

	$('#panel_plugin').css('margin-top', sy);
	//$('#panel_plugin').css('height', window.innerHeight);
	
}