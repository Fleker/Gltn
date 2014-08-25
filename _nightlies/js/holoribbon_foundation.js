ribbonobj = {'index': 0};			
ribbon_index = -1;			
ribbon_count = 0;	
ribbonsave = {};
function newRibbon(element, ribbon) {
    var out = '<ul class="ribbonhead" style="text-align:center;margin:0;padding:0;"></ul><div class="ribbonstreamer" style=""><div class="ribbonstreameritem" style="background-color:#09f;height:2px;"></div></div><div class="ribbonbody" style="text-align:center"></div>'
    $(element).html(out);
    out = '';
    keys = new Array();
    i = 0;
	ribbon_count = 0;
    for(var k in ribbon) {
		ribbon_count++;
	}
	for(var k in ribbon) {
        var locale_key = "{{ Locale."+k.toUpperCase()+" }}";
        out = out + '<li class="ribbonheader" style="text-align:center;padding:0px;" onclick="ribbonSwitch('+i+')"> '+locale_key+' </li>';
		//'
        keys.push(k);
        i++;
    }
    out = out + '<div></div>';
    $('.ribbonhead').html(out).addClass('small-block-grid-'+ribbon_count);
    
	out = '';
    var columnSize = [];
    for(var i in keys) {
        columnSize.push(0);
        out = out + '<div class="ribbongroup" style="text-align:center;width:100%;"><div class="ribbongroupchild '+ribbon[keys[i]].length+'"><ul class="small-block-grid-'+ribbon[keys[i]].length+' ribbongroupgrandchild" style="/*display:inline-flex*/margin:0;margin-left:0;line-height:initial;">';
        for(var j in ribbon[keys[i]]) {
            var k = ribbon[keys[i]][j];
			var classname = "ribbonbutton "+((j == ribbon[keys[i]].length - 1)?"end":"");
//			columnSize[columnSize.length-1] += columnCount(100/ribbon[keys[i]].length, true);
            if(k.img !== undefined) {
                //standard button
				if(k.key === undefined)
					k.key = "";
                out += '<li><button class="'+classname+'" style="width:100%;" onclick="'+k.action+'"><div class="holoribbon_icon" style="cursor:pointer;">' + k.img + '</div><div class="holoribbon_title" style="text-align:center;">' + k.text + '</div><span class="holoribbon_key" style="font-size:9pt">'+ k.key +'</span></button></li>';
            } 
            else if(k.group !== undefined) {
                //group button
                out += '<li><div class="'+classname+'" style=""><div style="">' + k.value + '</div><div style="text-align:center;margin-top:-7px;">' + k.group + '</div></div></li>';
            }
			
			
        }
        out = out + '</ul></div></div>';
//        console.log(out);
    }
//    console.log(out);   
    $('.ribbonbody').html(out);
    localeApply();
    for(i in columnSize) {
//        $($('.ribbongroupchild')[i]).addClass('small-block-grid'+columnSize[i]);   
        $($('.ribbongroupgrandchild')[i]).css('width', (1200/columnSize[i])+"%");
    }
//	ribbonGesture();
	$('.ribbongroup').css('margin-left','102%').css('display', 'inline-table').css('opacity', 0);
	ribbonobj.index = -1;
	//ribbonSwitch(0,false);
	$('.ribbonbutton, .ribbonheader').mouseenter(function() {
		highlight(this);
	});
	$('.ribbonbutton, .ribbonheader').mouseleave(function() {
		unlight(this);
	});
}
function ribbonSwitch(index, bool) {
	ribbon_index = index;
	if(bool)
		var animation_time = 0;
	else
		var animation_time = 300;
    element = $('.ribbongroup')[ribbonobj.index];
	if(ribbonobj.index < 0)
		element = $('.ribbongroup')[0];
	//MAKE DYNAMIC
	if(index >= ribbon_count || index < 0)
		return false;
    var ml = 0;
	var ml2 = 0;
	if(ribbonobj.index < index) {
		ml = -100;
		ml2 = 100;
	} else if(ribbonobj.index > index) {
		ml = 100;
		ml2 = -100;
	}
	var wide = $('.ribbonheader')[index];
	var wid = $(wide).offset().left;
	//console.log(wid);
	$(element).animate({
            marginLeft: ml+'%',
			opacity: 0
        }, animation_time, function() {
			//element = $('.ribbonstreameritem')[ribbonobj.index];
			//$(element).css('border-bottom-style', 'none');
			ribbonobj.index = index;
			
			//$(element).css('border-bottom-style', 'solid');
			
			element = $('.ribbongroup')[index];
			//console.log(ml2+'%');
			$('.ribbongroup').css('display', 'none');
			$(element).css('margin-left', ml2+'%').css('display','inline-table');;
			$(element).animate({
				marginLeft: '0%',
				opacity: 1
			}, animation_time)
    });
	element = $('.ribbonstreameritem')[0];
			$(element).animate({ 
				marginLeft:$(wide).offset().left+"px",
				width:($(wide).width())+"px"
			}, (2*animation_time));
            $(element).css('background-color', theme.ribbon.highlight);
}
//The following is Gltn specific code, so you'll need to modify the colors
function highlight(el) {
	//console.log(jQuery(el).attr('class'));
	jQuery(el).stop().animate({
		backgroundColor: theme.ribbon.highlight,
        color: theme.bodyColor
	}, 25);
}
function unlight(el) {
	jQuery(el).stop().animate({
		backgroundColor: theme.ribbon.plain,
        color: theme.fontColor
	}, 25);
}
function holoribbonRefresh() {
    newRibbon('.header', holoribbon_std);
    ribbonSwitch(ribbon_index,false);
    ribbonLoad();
    
    //Now update each panel
    for(i in panelManager.getAvailablePanels()) {
        if(panelManager.getAvailablePanels()[i].onRibbonRefresh !== undefined) {
           panelManager.getAvailablePanels()[i].onRibbonRefresh();
        }
    }
}