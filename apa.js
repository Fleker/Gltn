// This is a sample file to show how one is able to quickly create and customize a document

function onInitFormat() {
	new_format();
	new_format_item("text", {label: "Running Head", mtype:"c", max:50});
	new_format_item("text", {label: "Title", description: "", mtype:"w", max:12});
	//new_format_nl();
	new_format_item("name", {label: "Please type your name"});
	new_format_item("text", {label: "University/School"});
	new_format_item("mltext", {label: "Abstract", description: "A short summary explaining the essay's main points", mtype:"w", min:150, max:250});
	
	new_format_item("content");
	post_format();
}

function onInitToolbar() {
	var toolbar = ["citation", "heading1", "image", "longquote", "closetag"];	
	post_toolbar(toolbar);
}