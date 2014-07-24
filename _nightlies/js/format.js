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
	$('.content_textarea').css('background-color', theme.bodyColor).css('color', theme.fontColor);
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
			$(e).html('<span style="color:'+theme.fontColorAlt+'">'+min+'</span>&emsp;<span class="gluten_red">'+characters+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.coloralt+'">'+max+'</span>');
		} else if(max < characters) {
			$(e).html('<spanstyle="color:'+theme.fontColorAlt+'">'+min+'</span>&emsp;<span class="gluten_red">'+characters+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.coloralt+'">'+max+'</span>');
		} else {
			$(e).html('<span class="gluten_gray">'+characters+'&nbsp;'+mtype+'</span>');
		}	
	} else if(mtype == "w") {
		words = content.split(' ').length;
		var e = '#format_count_'+i;
		if(min > words) {
			$(e).html('<span style="color:'+theme.fontColorAlt+'">'+min+'</span>&emsp;<span class="gluten_red">'+words+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.fontColorAlt+'">'+max+'</span>');
		} else if(max < words) {
			$(e).html('<span style="color:'+theme.fontColorAlt+'">'+min+'</span>&emsp;<span class="gluten_red">'+words+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.fontColorAlt+'">'+max+'</span>');
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
	var out = "<div class='small-12 column' style='margin-left: -11px;width: calc(100% + 27px);'><div class='content_wrapper row'><div class='content overflow small-12 column'></div>";
	out += "<div class='content toolbar small-12 column'></div>";
	out += "<div contenteditable='true' class='content content_textarea small-12 column'></div></div>";
	out += "<div class='content_wordcount small-12 column' style='display:inline-flex'><div class='content_word'></div>&emsp;<div class='content_character'></div>&emsp;<div class='content_save'>&emsp;</div></div></div>";
	return out;	
}

function Tool(id, name, action) {
    this.id = id || "";
    this.name = name || id;
    this.action = action || function() { console.error("Tool "+id+" has no action."); };                                               
    Tool.prototype.toHtml = function() {
        return "<button class='toolbutton' data-tool='"+this.id+"'>&emsp;"+this.name+"&emsp;</button>";  
    };
}
function ToolbarManager() {
    this.availableTools = {
        character: new Tool("character", "Character", function() {
            panelManager.run("Main_Character");
        }), 
        heading1: new Tool("heading1", "H1", function() {
            contentAddSpan({node:"span", class:"heading1 heading"});
            formatHovertag("heading1", "'Heading-1'", 'null');
        }),
        heading2: new Tool("heading2", "H2", function() {
            contentAddSpan({node:"span", class:"heading2 heading"});
            formatHovertag("heading2", "'Heading-2'", 'null');
        }),
        heading3: new Tool("heading3", "H3", function() {
            contentAddSpan({node:"span", class:"heading3 heading"});
            formatHovertag("heading3", "'Heading-3'", 'null');
        }),
        heading4: new Tool("heading4", "H4", function() {
            contentAddSpan({node:"span", class:"heading4 heading"});
            formatHovertag("heading4", "'Heading-4'", 'null');
        }),
        heading5: new Tool("heading5", "H5", function() {
            contentAddSpan({node:"span", class:"heading5 heading"});
            formatHovertag("heading5", "'Heading-5'", 'null');
        }),
        image: new Tool("image", "Image", function() {
            var imid = getObjectSize('img');
            contentAddSpan({node:"div", class:"img inline img"+imid, ce: false});
            imgDetails(imid);
            formatHovertag("img", "'Image Details'", "'imgDetails('+$(this).attr('data-id')+');'");
        }),
        citation: new Tool("citation", "Citation", function() {
            initiateCitationEditor();
        }),
        table: new Tool("table", "Table", function() {
            var tid = getObjectSize('table');
            contentAddSpan({node:"div", class:"table table"+tid+" inline", ce: false});
            tableDetails(tid);
            formatHovertag("table", "$(this).attr('data-title')", "'tableDetails('+$(this).attr('data-id')+');'");
        }),
        bold: new Tool("bold", "<button class='fontawesome-bold'></button>", function() {
            console.warn("bold");
            toggleBold();	
        }),
        italics: new Tool("italics", "<button class='fontawesome-italics'></button>", function() {
            toggleItalics();
        }),
        reftext: new Tool("reftext", "Ref Text", function() {
            var rtid = getObjectSize('reftext');
            contentAddSpan({node:"span", class:"reftext reftext"+rtid, ce: false});
            refTextDetails(rtid);
            formatHovertag("reftext", "'Ref: '+$(this).attr('data-ref')", "'refTextDetails('+$(this).attr('data-id')+');'");
        }),
        LaTeX: new Tool("LaTeX", "LaTeX", function() {
            var lid = getObjectSize('latex');
            console.log("LATEX "+lid);
            contentAddSpan({node:"kbd", class:"latex latex"+lid, ce: false});
            latexDetails(lid);
            formatHovertag("latex", "$(this).attr('data-cmd')", "'latexDetails('+$(this).attr('data-id')+');'");
        }),
        pbreak: new Tool("pbreak", "Page Break", function() {
            contentAddSpan({node:"kbd", class:"pagebreak", ce: false});
            formatHovertag("pagebreak", "'Page Break'", 'null');
            setTimeout("$('.pagebreak').empty();", 1000);
        }),
        fullscreen: new Tool("fullscreen", "<span class='fa fa-expand'></span>", function() {
            fullscreen();
        })
    };
    this.stockTools = {};
    for(i in this.availableTools) {
        this.stockTools[i] = this.availableTools[i];   
    }
    ToolbarManager.prototype.getAvailableTools = function() {
        return this.availableTools;   
    };
    ToolbarManager.prototype.addTool = function(tool) {
        this.availableTools[tool.id] = tool;
        
        //TODO Allow tools to just appear w/ boolean
        post_toolbar(window.tools, window.tools_freeform);
    };
}
toolbarManager = new ToolbarManager();

//TODO Allow tools to just appear w/ boolean
function post_toolbar(tools, freeform) {
	window.tools = tools || [];
    window.tools_freeform = freeform || false;
	var overflow = false;
	$('.toolbar').empty();
	$('.overflow').empty();
	$('.toolbar').append("<div class='toolbar_options' style='display:inline'>");
    $('.toolbar').append(toolbarManager.getAvailableTools().character.toHtml()+toolbarManager.getAvailableTools().fullscreen.toHtml());
    
    for(i in tools) {
        if(toolbarManager.getAvailableTools()[tools[i]] !== undefined)
            $('.toolbar').append(toolbarManager.getAvailableTools()[tools[i]].toHtml());   
        else if(freeform === true && toolbarManager.stockTools[tools[i]] === undefined) //This is a custom tool
            $('.toolbar').append(toolbarManager.getAvailableTools()[tools[i]].toHtml());  
    }
    //TODO Need to redo overflow and make it more responsive
    $('.toolbar_button').on("click", function() {
        toolid = $(this).attr('data-tool');
        toolbarManager.getAvailableTools()[toolid].action();
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
window.fullscreenOn = false;
/*$(window).resize(function () {*/
toolbar_width = 0;
sy_save = 0;
function update_toolbar_style() {}
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
    //TODO Fix readjust toolbar
	//console.log(1);
});