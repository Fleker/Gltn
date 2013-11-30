// Sample Format
function onInitFormat() {
	new_format();
	new_format_item("text", {label: "Your Name", id:"Author"});
	new_format_item("text", {label: "Title", id: "Title"});
	new_format_item("text", {label: "Professor/Teacher", id:"Professor"});
	new_format_item("text", {label: "Class", id: "Class"});
	new_format_item("date", {label: "Date Due", id: "DueDate"});
	new_format_item("content");
	set_up_format("annotated bibliography");
	post_format();		
}
function onInitToolbar() {
	var toolbar = ["citation", "heading1", "heading2", "heading3"];
	post_toolbar(toolbar);
}	
function onStylePaper() {
	enable_format("double space");	
}
function onBuildFormat() {
	add_new_page();
		add_to_page(valMetadata("Author")+"<br>");
		add_to_page(valMetadata("Professor")+"<br>");
		add_to_page(valMetadata("Class")+"<br>");
		var due = valMetadata("DueDate");
		var duedate = Date.parse(due);
		var duedate = new Date(duedate);
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var dueout = (duedate.getDate()+1) + " " + months[duedate.getMonth()] + " " + duedate.getFullYear();
		add_to_page(dueout+"<br>");
		add_to_page(centerText(valMetadata("Title")));
//		paste_content();
}
function onSetHeader() {
	var auth_array = valMetadata("Author").split(" ");
	var last_name = auth_array[auth_array.length - 1];
	push_header(lcr_split("", "", last_name+" PAGE"));
}
function onGetFormats() {
	var obj = {};
	obj.heading1 = "<div style='font-weight:bold'>LIST1. TEXT</div>";
	obj.heading2 = "<div style='font-style:italics'>LIST1. TEXT</div>";
	obj.heading3 = "<div style='font-weight:bold;text-align:center'>LIST1. TEXT</div>";
	obj.heading4 = "<div style='font-style:italics;text-align:center'>LIST1. TEXT</div>";
	obj.heading5 = "<div style='text-decoration:underline'>LIST1. TEXT</div>";
	
	
		
}