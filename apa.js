// This is a sample file to show how one is able to quickly create and customize a document

function onInitFormat() {
	new_format();
	new_format_item("text", {label: "Running Head", mtype:"c", max:50, id:"Running Head"});
	new_format_item("text", {label: "Title", description: "", mtype:"w", max:12, id:"Title"});
	//new_format_nl();
	new_format_item("text", {label: "Please type your name", id:"Author"});
	new_format_item("text", {label: "University/School", id:"School"});
	new_format_item("mltext", {label: "Abstract", description: "A short summary explaining the essay's main points", mtype:"w", min:150, max:250, id:"Abstract"});
	
	new_format_item("content");
	set_up_format("word count", "xxx");
	post_format();
}

function onInitToolbar() {
	var toolbar = ["citation", "heading1", "heading2", "heading3", "image", "longquote", "closetag"];	
	post_toolbar(toolbar);
}
function onStylePaper() {
	enable_format('double space');	
}
function onBuildFormat() {
	//Cover Page
	add_new_page('coverpage'); 	
		add_to_page(centerText(valMetadata('Title')));
		add_to_page(centerText(valMetadata('Author')));
	add_new_page();
	paste_content();
}
function onSetHeader() {
	//push_header('<span style="text-transform:uppercase">'+valMetadata('Running Head')+'</span>');
	push_header(lcr_split('<span style="text-transform:uppercase">'+valMetadata('Running Head')+'</span>','','PAGE'));
	//customize_this_header(find_page('coverpage'), 'Running Head: <span style="text-transform:uppercase">'+valMetadata('Running Head')+'</span>');
	customize_this_header(find_page('coverpage'), lcr_split('Running Head: <span style="text-transform:uppercase">'+valMetadata('Running Head')+'</span>','','PAGE'));
}
function onGetFormats() {
	obj = {};
	obj.citation = "(AUTHOR_LAST PAGE)";
	obj.heading1 = 'LISTA. TEXT';
	obj.heading2 = '<i>LIST1. TEXT</i>';
	obj.heading3 = 'LISTI. TEXT';
	post_content_formatting(obj);	
}
function onBuildBibliography() {
	add_new_section('bibliography');
		add_to_page(centerText('Works Cited'));
	
	obj = {};
	obj.def = "AUTHOR_LAST, AUTHOR_FIRST_I. (YEAR). TITLE. (Ed EDITION., Vol. VOLUME, p. PAGE). PUBCITY: PUBCOMP. DOI: URL";
	obj.style = "text-indent:-.5in;margin-left:.5in";
	post_bibliography(obj);		
}

