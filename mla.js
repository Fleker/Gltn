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
	
	obj.citation = "(AUTHOR_LAST PAGE)";
	obj.citation_main = "(PAGE)";
	obj.citation_noauthor = '("TITLE" PAGE)';
	obj.citation_twolastnames = '(AUTHOR_FIRST_I. AUTHOR_LAST PAGE)';
	obj.citation_twoauthors = '(AUTHOR_LAST and AUTHOR_LAST PAGE)';
	obj.citation_threeauthors = '(AUTHOR_LAST, AUTHOR_LAST, and AUTHOR_LAST PAGE)';
	obj.citation_manyauthors = '(AUTHOR_LAST et al. PAGE)';
	obj.citation_sameauthorarticle_main = '("TITLE" PAGE)';
	obj.citation_sameauthorbook_main = '<div style="display:inline">(<i>TITLE</i> PAGE)';
	obj.citation_sameauthorarticle = '(AUTHOR_LAST, "TITLE" PAGE)';
	obj.citation_sameauthorbook = '(AUTHOR_LAST, <i>TITLE</i> PAGE)';
	obj.citation_multivolume = '(VOLUME: PAGE)';
	obj.citation_bible = '<div style="display:inline">(<i>TITLE,</i> BIBLEBOOK. BIBLECHAPTER.BIBLEVERSE)</div>';
	obj.citation_bible_main = '(BIBLEBOOK. BIBLECHAPTER.BIBLEVERSE)';
	obj.citation_editions = "";
	post_content_formatting(obj);
} 
function onBuildBibliography() {
	add_new_section('bibliography');
		add_to_page(centerText('Works Cited'));
	
	obj = {};
	cob = {};
	cob.author = "AUTHOR_LAST, AUTHOR_FIRST.";
	cob.twoauthors = "AUTHOR_LAST, AUTHOR_FIRST, and AUTHOR_FIRST AUTHOR_LAST.";
	cob.threeauthors = "AUTHOR_LAST, AUTHOR_FIRST, AUTHOR_FIRST AUTHOR_LAST, and AUTHOR_FIRST AUTHOR_LAST.";
	cob.manyauthors = "AUTHOR_LAST, AUTHOR_FIRST, et al.";
	cob.sameauthor = "---.";
	cob.firstonlyauthor = "AUTHOR_FIRST.";
	cob.medium = "MEDIUM.";
	cob.pubcity = "PUBCITY:";
	cob.publisher = "PUBCOMP,";
	cob.year = "YEAR.";
	cob.translator = "Trans. AUTHOR_FIRST AUTHOR_LAST.";
	cob.editor = "Ed. AUTHOR_FIRST AUTHOR_LAST.";
	cob.edition = "EDITION_c ed.";
	cob.title = "<i>TITLE.</i>";
	cob.description = '"DESCRIPTION"';
	//The New Jerusalem Bible. Ed. Susan Jones. New York: Doubleday, 1985. Print.	
	obj.book = "cAUTHOR cTITLE cEDITOR cTRANSLATOR cEDITION cPUBCITY cPUBCOMP cYEAR cMEDIUM";
	obj.bible = "cTITLE cEDITOR cTRANSLATOR cPUBCITY cPUBCOMP cYEAR cMEDIUM";
	obj.def = "cAUTHOR cTITLE cEDITOR cTRANSLATOR cEDITION cPUBCITY cPUBCOMP cYEAR cMEDIUM";
	
	obj.style = "text-indent:-.5in;margin-left:.5in";
	post_bibliography(obj, cob);	
}