// JavaScript Document - Handles Popup Creation and Behavior

popupFocus = false;
function initiatePopup(data) {
	hideHovertag();
	if(data == undefined)
		data = {};
	//JSON data containing border color, title
	//Opens popup, designs framework
//    $('.popup').css('left', '30%').css('width', '0%').css('top', '40%').css('height', '0%');
//    $('#myModal').html('<div class="popupcontent"></div>');
	$('#myModal').html('<div style="width:100%;text-align:right"><button class="close-reveal-modal" style="color:inherit;font-size:1.5em">&#215;</button></div><table style="width:100%;vertical-align:top;" class="popupstatic"><tr><td style="vertical-align:top;width:100%;"><span class="popuptitle"></span><span class="popupsubtitle"></span><div class="popupbody"></div></td><td style="text-align:right"><img id="popupimg" src=""></img></td></tr></table><div class="popupcontent"></div>');
//	$('.popuptop').html('<div style="width:100%;text-align:right"><button onclick="closePopup()">'+closeButton()+'</button></div><table style="width:100%;vertical-align:top;" class="popupstatic"><tr><td style="vertical-align:top;width:100%;"><span class="popuptitle"></span><span class="popupsubtitle"></span><div class="popupbody"></div></td><td style="text-align:right"><img id="popupimg" src=""></img></td></tr></table><div class="popupcontent2" style="margin-left:4px;height:100px"><div class="popupcontent"></div></div>');
	if(data.title != undefined)
		$('.popuptitle').html(data.title+"<br>");
	if(data.subtitle != undefined)
		$('.popupsubtitle').html(data.subtitle+"<br><br>");
	else
		$('.popupsubtitle').css('display','none');
	if(data.img != undefined)
		$('#popupimg').attr('src', data.img);
	if(data.value != undefined)
		$('.popupbody').html(data.value);
	else
		$('.popupbody').css('display','none');
	if(data.bordercolor != undefined) {
		$('#myModal').css('border', "solid 2px "+data.bordercolor);
	} else
		$('#myModal').css('border-width', '1px');
    	
	window.popuptitle = data.title;
		
	
	//now populate the card
	//DEMO
	if(data.ht == undefined)
		data.ht = "";
	if(data.fnc == undefined)
		data.fnc = function x() {/*alert(0)*/};
    if(data.size == undefined)
        data.size = "medium";
	populatePopup(data.ht, data.fnc, data.size);
}
	
function populatePopup(ht, fnc, size) {
	//HT - Hypertext - the tags and output
	//Fnc - Function - this is code that starts to run when initiated, if valid
	//Panels - More of a widget/mini application that runs on its own, whereas popups are more just for displaying data and simpler scripts
	$('.popupcontent').html(ht);
	eval(fnc+"x();");
	postPopup(size);
}
function postPopup(size) {
    $('#myModal').removeClass('tiny small medium large xlarge').addClass(size);
    $('#myModal').foundation('reveal', 'open');
	$('#myModal').focus();
    $(document).on('close', '[data-reveal]', function () {
      closePopup(false);
    });
}
function closePopup(callback) {
	if(window.paneltitle != undefined)	
		PanelOnPopupClose(window.popuptitle);
	
	window.popuptitle = undefined;
    if(callback != false)
        $('.popup').foundation('reveal', 'close');
}

/*** Default Popups - These functions initiate and go through all the proper commands of a popup */