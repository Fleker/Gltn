// Formatting Engine

file.clearMetadata();
window.metadata = [];
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
	if(ops === undefined)
		ops = {};
	window.metadata[format_js_index] = {type: type, index: format_js_index, min: 0, max: 0};
	var option_choices = ["label", "max", "min", "mtype", "placeholder", "description", "id"];
	//FUTURE - Default Text
	for(i=0;i<option_choices.length;i++) {
		if(ops[option_choices[i]] !== undefined) {
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
function setFormatItemWidth(index) {
    if($('#format_item_'+index).val() === undefined)
        $('#format_item_'+index).css('width', '11em');
	else if($('#format_item_'+index).val().length < 22)
		$('#format_item_'+index).css('width', '11em');
	else if($('#format_item_'+index).val().length > 80)
		$('#format_item_'+index).css('width', '40em');
	else
		$('#format_item_'+index).css('width', 0.5*$('#format_item_'+index).val().length+"em");
}
function post_format() {
	var out = "";
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
		if(window.metadata[i].min.length !== 0 || window.metadata[i].max.length !== 0) {
			/*var e = '#format_item_'+i;
			$(e).on('input', function() {
				format_check_count(i);
			});*/
			setInterval("format_check_count("+i+")", 100);
		} else
		  setInterval("setFormatItemWidth("+i+")", 100);
		/*if($('#format_item_'+i).val() != undefined) {
			if($('#format_item_'+i).val().length < 20)
				$('#format_item_'+i).css('width', '10em');
			else if($('#format_item_'+i).val().length > 80)
				$('#format_item_'+i).css('width', '40em');
			else
				$('#format_item_'+i).css('width', 0.5*$('#format_item_'+i).val().length+"em");
		}*/

       /* setTimeout("setFormatItemWidth("+i+");", 1000);
       		$('#format_item_'+i).on('input', function() {
			     setFormatItemWidth(i);
        	});*/
	}
	onInitToolbar();
	
	//Set up selection parameters
			 document.getElementsByClassName("content_textarea")[0].onmouseup = function() {
				 	if($('.content_textarea').html().length > 1) {				 
//						rangy.getSelection().expand("word", {
//						wordOptions: {
//							includeTrailingSpace: false,
//							wordRegex: /[a-z0-9]+(['\-][a-z0-9]+)*/gi
//						}
//                		});
					}
					//postRange('click and select');
			}
			document.getElementsByClassName("content_textarea")[0].oninput = function() {
				postRange('oninput');
				//saveFile();
			}	
			document.getElementsByClassName("content_textarea")[0].onkeyup = function() {
				postRange('onkeyup');
			}	
	//Theme parameters for content_textarea
	$('.content_textarea').css('background-color', theme.normbg).css('color', theme.normcolor);
	console.log('CT colors set');
    
    //Preload data that already exists
    for(j in window.metadata) {
		try {
            if(i == window.metadata[j].id.replace(/ /g, '_') && $('#format_item_'+j).val().length == 0) {
//			   onsole.log("Insert "+d[i]+" for "+window.metadata[j].id);
                //console.log($('#format_item_'+j).val(), i);
			     $('#format_item_'+j).val(decodeURIComponent(d[i]));
			     $('#format_item_'+j).html(decodeURIComponent(d[i]));
            }
        } catch(e) {}
    }
}
function format_check_count(i) {
	content = $('#format_item_'+i).val();
	if(content.length === 0)
		content = $('#format_item_'+i).html();
	if(window.metadata[i] === undefined)
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
    setFormatItemWidth(i);
}


function post_format_text(m, inv) {
	var out = "";
	
	var ind = m.index;
	if(inv !== undefined && inv !== 0)
		ind = (m.index-inv)+"_2";
	else {
		out = out + m.label+":&nbsp;";
		if(m.description.length)
			out = out + "<br><span class='format_description'>"+m.description+"</span><br>";
	}
	out = out + "<input type='text' id='format_item_"+m.index+"' placeholder='"+m.placeholder+"' style='width:55%' onmouseenter='hideHovertag()'>";
	if(m.min.length !== 0 || m.max.length !== 0) {
		out = out + "<div class='format_count' id='format_count_"+m.index+"'></div>";	
	}
	return out;
}
function post_format_date(m, inv) {
	var out = "";
	
	var ind = m.index;
	if(inv !== undefined && inv !==0)
		ind = (m.index-inv)+"_2";
	else {
		out = out + m.label+":&nbsp;";
		if(m.description.length)
			out = out + "<br><span class='format_description'>"+m.description+"</span><br>";
	}
	out = out + "<input type='date' id='format_item_"+m.index+"' placeholder='"+m.placeholder+"' onmouseenter='hideHovertag()'>";
	if(m.min.length !== 0 || m.max.length !== 0) {
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
	if(m.min.length !==0 || m.max.length !== 0) {
		out = out + "<div class='format_count' id='format_count_"+m.index+"'></div>";	
	}
	return out;
}
function post_format_content(m) {
	var out = "";
	out = "<div class='small-12 column' style='margin-left: -11px;width: calc(100% + 27px);'><div class='content_wrapper row'><div class='content overflow small-12 column'></div>";
	out += "<div class='content toolbar small-12 column'></div>";
	out = out + "<div contenteditable='true' class='content content_textarea small-12 column'></div></div>";
	out = out + "<div class='content_wordcount small-12 column' style='display:inline-flex'><div class='content_word'></div>&emsp;<div class='content_character'></div>&emsp;<div class='content_save'>&emsp;</div></div></div>";
	return out;	
}

//TODO Toolbar Class
function post_toolbar(tools) {
	window.tools = tools;
	var overflow = false;
	$('.toolbar').empty();
	$('.overflow').empty();
	$('.toolbar').append("<div class='toolbar_options' style='display:inline'><span class='toolbar_button' data-t='character' id='CHARACTERPANEL'>&emsp;Character&emsp;</span>|");
	//TODO Use labels to make prettier, maybe "new_toolbar/new_toolbar_item"
	//TODO Use JSON objects to enable more powerful, third-party tools
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
                case "break":
                    tool_pretty = "Page Break";
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
			$('.overflow').append("<span class='toolbar_button' data-t='"+tool_t+"'> &emsp; "+tool_pretty+"&emsp;</span>|");
		else
			$('.toolbar_options').append("<span class='toolbar_button' data-t='"+tool_t+"'>&emsp;"+tool_pretty+"&emsp;</span>|");
	}
	if(overflow)
		$('.overflow').prepend("<span class='toolbar_button' data-t='fullscreen'>&emsp;<span class='fa fa-expand'></span>&emsp;</span>|</div>");
	else
		$('.toolbar_options').append("<span class='toolbar_button' data-t='fullscreen'>&emsp;<span class='fa fa-expand'></span>&emsp;</span>|</div>");
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
				var imid = getObjectSize('img');
				contentAddSpan({node:"div", class:"img inline img"+imid, ce: false});
				imgDetails(imid);
				formatHovertag("img", "'Image Details'", "'imgDetails('+$(this).attr('data-id')+');'");
			break;
			case "table":
			var tid = getObjectSize('table');
				contentAddSpan({node:"div", class:"table table"+tid+" inline", ce: false});
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
                var rtid = getObjectSize('reftext');
                contentAddSpan({node:"span", class:"reftext reftext"+rtid, ce: false});
                refTextDetails(rtid);
                formatHovertag("reftext", "'Ref: '+$(this).attr('data-ref')", "'refTextDetails('+$(this).attr('data-id')+');'");
            break;
            case "LaTeX":
                var lid = getObjectSize('latex');
                console.log("LATEX "+lid);
                contentAddSpan({node:"kbd", class:"latex latex"+lid, ce: false});
                latexDetails(lid);
                formatHovertag("latex", "$(this).attr('data-cmd')", "'latexDetails('+$(this).attr('data-id')+');'");
            break;
            case "break":
                contentAddSpan({node:"kbd", class:"pagebreak", ce: false});
                formatHovertag("pagebreak", "'Page Break'", 'null');
                setTimeout("$('.pagebreak').empty();", 1000);
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
        recallHovertags();
	});
}
function getObjectSize(classname) {
    if($('.'+classname).length == 0)
        return 0;
    var i = 0;
    $('.'+classname).each(function(N, E) {
        var int = parseInt($(E).attr('class').split(' ')[1].match(/\d+/g)[0])+1;
        if(int > i)
            i = int;
    });
    return i;   
}
function highlight_tool(el) {
	//console.log(jQuery(el).attr('class'));
	jQuery(el).animate({
		backgroundColor: theme.ribbonhighlight,
        color: theme.normbg
	}, 25);
}
function unlight_tool(el) {
	jQuery(el).animate({
		backgroundColor: theme.ribbonplain,
        color: theme.normcolor
	}, 25);
}
window.fullscreenOn = false;
/*$(window).resize(function () {*/
toolbar_width = 0;
sy_save = 0;
function update_toolbar_style() {
	initTheme();
}
function refreshBodyDesign() {
    if(fullscreenOn === false) {
        var h = (window.innerHeight-100)*0.85;
        $('.content_textarea').css('height', h+'px');
    }
}
function refreshBodyDesign1() {
	toolbar_width = $('.toolbar').width();
	if(window.paneltitle === undefined) {
		console.log("Change without panel");
		if(window.fullscreenOn === false) {
			var h = (window.innerHeight-100)*0.85;
			var w = window.innerWidth-25;
			$('.content_wrapper').css('width', w+'px').css('margin-bottom', '-3px').css('margin-left', '-13px')/*.css('overflow-x', 'hidden')*/;
			$('.content_textarea').css('height', h+'px').css('width', w+'px');	
		}	
		
		//Update Header
		ribbonSwitch(ribbon_index, true);
	} else if(window.paneltitle !== undefined) {
		console.log("Change with panel");
		$('.content_wrapper').css('width', 'calc(100% - 1px)');
        if($('.PanelMaximizeEvent').attr('data-status') === 0)
            sizePanel(panelwidth, false);
            
		$('.content_textarea').css('width', '100%').css('margin-left', '0px');
	}
    setTimeout(function() { onInitToolbar(); }, 100);
}
$( window ).resize(function() {
  refreshBodyDesign();
  ribbonSwitch(ribbon_index, true);
	//console.log(1);
});