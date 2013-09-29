// JavaScript Document - Handles Popup Creation and Behavior

popupFocus = false;
function initiatePopup(data) {
	hideHovertag();
	if(data == undefined)
		data = {};
	popupFocus = false;
	//JSON data containing border color, title
	//Opens popup, designs framework
	var html = "<div class='fullscreen popupbg' style='z-index:0' onclick='if(!popupFocus) closePopup()'><div onclick='popupFocus = true;' class='popuptop' style='z-index:1'></div></div>";
	$('.popup').html(html);
	$('.popup').css('opacity', 0).css('display', 'block');
	$('.popuptop').css('left', '30%').css('width', '0%').css('top', '40%').css('height', '0%');
	$('.popupbg').on('click', function() {
		//closePopup();
	});	
	//Core framework, now populate card with classes
	$('.popuptop').html('<div style="width:100%;text-align:right"><button onclick="closePopup()">X</button></div><table style="width:100%;vertical-align:top;"><tr><td style="vertical-align:top;width:100%;"><span class="popuptitle"></span><span class="popupsubtitle"></span><div class="popupbody"></div></td><td style="text-align:right"><img id="popupimg" src=""></img></td></tr></table><br><div class="popupcontent" style="margin-left:4px"></div>');
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
	if(data.border != undefined) {
		$('.popuptop').css('border-color', data.border).css('border-width', '2px');	
	} else
		$('.popuptop').css('border-width', '1px');
		
	
	//now populate the card
	//DEMO
	if(data.ht == undefined)
		data.ht = "";
	if(data.fnc == undefined)
		data.fnc = function() {alert(0)};
	populatePopup(data.ht, data.fnc);
	
	//initiatePopup({title: 'Hello', subtitle: 'World', img: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc1/c43.27.338.338/s160x160/397165_10150559002575832_1521489086_n.jpg', value: '<b>Hello world.</b>'})
}
function populatePopup(ht, fnc) {
	//HT - Hypertext - the tags and output
	//Fnc - Function - this is code that starts to run when initiated, if valid
	//Panels - More of a widget/mini application that runs on its own, whereas popups are more just for displaying data and simpler scripts
	$('.popupcontent').html(ht);
	eval(fnc+"x();");
	postPopup();
}
function postPopup() {
	$('.popup').animate(
	{opacity: 1},
	500, 'linear', function() {
		$('.popup').css('display', 'block')	
	});	
	$('.popuptop').animate(
	{left:'15%',
	width:'70%',
	top:'20%',
	height:'60%'},
	500);
	$('.popuptop').focus();
}
function closePopup() {
	//Exists popup, and cleaning up whatever needs to be clean 
	$('.popup').animate(
	{opacity: 0},
	500, 'linear', function() {
		$('.popup').css('display', 'none');	
	});
	$('.popuptop').animate(
	{left:'30%',
	width:'0%',
	top:'40%',
	height:'0%'},
	1000);
}

/*** Default Popups - These functions initiate and go through all the proper commands of a popup */