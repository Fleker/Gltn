ribbonobj = {'index': 0};			
ribbon_index = -1;				
ribbon_count = 0;	
ribbonsave = {};
function newRibbon(element, ribbon) {
    var out = '<table class="ribbonhead" style="text-align:center;"></table><div class="ribbonstreamer" style=""><div class="ribbonstreameritem" style="background-color:#09f;height:2px;"></div></div><div class="ribbonbody" style="text-align:center"></div>'
    $(element).html(out);
    out = '';
    keys = new Array();
    i = 0
	ribbon_count=0;
    for(var k in ribbon) {
		ribbon_count++;
	}
	for(var k in ribbon) {
        out = out + '<td class="ribbonheader" style="text-align:center;width:'+(100/ribbon_count)+'%" onclick="ribbonSwitch('+i+')">'+k+'</td>';
		//'
        keys.push(k);
        i++;
    }
    out = out + '<td></td>';
    $('.ribbonhead').html(out);
    
	out = '';
    for(i in keys) {
        out = out + '<table class="ribbongroup" style="width:98%;text-align:center;">'
        for(j in ribbon[keys[i]]) {
            var k = ribbon[keys[i]][j];
			
			
            if(k.img != undefined) {
                //standard button
				if(k.key == undefined)
					k.key = "";
                out = out + '<td class="ribbonbutton" style="width:100px;" onclick="'+k.action+'"><div style="/*height:76px*/cursor:pointer;">' + k.img + '</div><div style="text-align:center;">' + k.text + '</div><span style="font-size:9pt">'+ k.key +'</span></td>';
            } 
            else if(k.group != undefined) {
                //group button
                out = out + '<td class="ribbonbutton" style="width:100px"><div style="/*height:76px*/">' + k.value + '</div><div style="text-align:center">' + k.group + '</div></td>';
            }
			
			
        }
        out = out + '</table>'
    }
    $('.ribbonbody').html(out);
	ribbonGesture();
	$('.ribbongroup').css('margin-left','102%').css('display', 'inline-table').css('opacity', 0);
	ribbonobj.index = -1;
	//ribbonSwitch(0,false);
	$('.ribbonbutton').mouseenter(function() {
		highlight(this);
	});
	$('.ribbonbutton').mouseleave(function() {
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
	var wid = $(wide).width()+2;
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
				marginLeft:(wid*index)+"px",
				width:wid+"px"
			}, (2*animation_time));
            $(element).css('background-color', theme.ribbonhighlight);
}
function ribbonGesture() {			
			var element = document.getElementsByClassName('header');
			//var element = document.getElementsByClassName('ribbongroup')[ribbonobj.index];
			/**/ 
			var hammertime = Hammer(element).on("swipeleft swiperight", function(event) {
				//console.log('H'+event.gesture.deltaX);
				//alert(event.gesture.deltaX);
				if(event.gesture.deltaX > 5) {
					ribbonSwitch(ribbonobj.index -1);
				} else if(event.gesture.deltaX < -5) {
					ribbonSwitch(ribbonobj.index +1);
				}
			});
}
//The following is Gltn specific code, so you'll need to modify the colors
function highlight(el) {
	//console.log(jQuery(el).attr('class'));
	jQuery(el).stop().animate({
		backgroundColor: theme.ribbonhighlight,
        color: theme.normbg
	}, 25);
}
function unlight(el) {
	jQuery(el).stop().animate({
		backgroundColor: theme.ribbonplain,
        color: theme.normcolor
	}, 25);
}