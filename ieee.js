// JavaScript Document

function onInitFormat() {
	new_format();
	new_format_item("text", {label:"Title", id:"Title"});
	new_format_item("text", {label:"Subtitle", id:"Subtitle"});
	new_format_item("mltext", {label:"Abstract", id:"Abstract", description:"Give a short summary of the report. Do Not Use symbols, special characters, or math in the title or abstract.", mtype:"w", max:"50"});
	
	new_format_item("label", {label:"First Author"});
		new_format_item("text", {label:"Name", id:"Author1"});
		new_format_item("text", {label:"Department of Organization", id:"Dept1"});
		new_format_item("text", {label:"Name of Organization", id:"Org1"});
		new_format_item("text", {label:"City, Country", id:"CC1"});
		new_format_item("text", {label:"Email Address", id:"Email1"});
		new_format_item("nl");
		
	new_format_item("label", {label:"Second Author"});
		new_format_item("text", {label:"Name", id:"Author2"});
		new_format_item("text", {label:"Department of Organization", id:"Dept2"});
		new_format_item("text", {label:"Name of Organization", id:"Org2"});
		new_format_item("text", {label:"City, Country", id:"CC2"});
		new_format_item("text", {label:"Email Address", id:"Email2"});
		
	new_format_item("content");
	set_up_format("character count", {min:100, max:3000});
	post_format();
}

function onInitToolbar() {
	var tools = ["heading1", "heading2", "heading3", "image", "table"];
	post_toolbar(tools);
}	

function onStylePaper() {
	enable_format("2 columns");	
}

function onBuildFormat() {
	add_new_page();
		add_to_page(centerText(sizeText(valMetadata('Title'),24)));
		add_to_page(centerText(sizeText(valMetadata('Subtitle'),14)));
		add_to_page(twoColumnText(centerText(valMetadata("Author1")+"<br>"+valMetadata("Dept1")+"<br>"+valMetadata("Org1")+"<br>"+valMetadata("CC1")+"<br>"+valMetadata("Email1")), centerText(valMetadata("Author2")+"<br>"+valMetadata("Dept2")+"<br>"+valMetadata("Org2")+"<br>"+valMetadata("CC2")+"<br>"+valMetadata("Email2"))));
	push_to_body(boldItalicizeText("Keywords—"+fileMetadata("tags").split(', ').join('; '),9));
	push_to_body(boldItalicizeText("Abstract—"+valMetadata("Abstract")+"<br>",9));
}

function onGetFormats() {
	obj = {};
	obj.heading1 = centerText("LISTI.&emsp;TEXT%sc");
	obj.heading2 = "<i>LISTA. TEXT</i>";
	obj.figure = function x() {
		var i = 1;
		$('.draft .table, .draft .img').each(function() {
			$(this).attr('data-figure-number', i);
			i++;
		});
	};
	obj.img = "IMG<br>Fig. FIGN. TEXT";
	obj.imgstyle = new Array('width','100%','text-align','center','font-size','8pt');
	//obj.table = 
	post_content_formatting(obj);
	enable_format("font pt",10);
}