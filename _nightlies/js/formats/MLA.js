// Sample Format
currentformat = "MLA";
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
function onGetToolbar() {
    var toolbar = ["citation", "heading1", "heading2", "heading3"];
    return {tools: toolbar, allowCustom: true};
}
function onStylePaper() {
	enable_format("double space");	
}
function onStyleGuide() {
	out = "<b>MLA Format</b><br>There are no distinct rules in writing papers in this format.";
	return out;	
}
//Note new class structure
function onBuildFormat(d) {
    d.add(valMetadata("Author")+"<br>");
    d.add(valMetadata("Professor")+"<br>");
    d.add(valMetadata("Class")+"<br>");
    
    var due = valMetadata("DueDate");
    var duedate = Date.parse(due);
    if(!isNaN(duedate)) {
        var duedate = new Date(duedate);
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var dueout = (duedate.getUTCDate()) + " " + months[duedate.getUTCMonth()] + " " + duedate.getUTCFullYear();
    } else {
        dueout = "";   
    }
    d.add(dueout+"<br>");
    d.add(centerText(valMetadata("Title")));
    return d;
}
//TODO Get Header API Changed
//FIXME Change Header Color
function onSetHeader(doc) {
    console.log(doc);
	var auth_array = valMetadata("Author").split(" ");
	var last_name = auth_array[auth_array.length - 1];
    for(index in doc.sections) {
        for(i in doc.sections[index].pages) {
            var page = doc.sections[index].pages[i];
            console.log(page);
            console.log((lcr_split("", "", "<span style='font-size:12pt'>"+last_name+" "+$(page.element).attr('data-page-num')+"</span>"), $(page.element).attr('data-page-num')));
            page.addHeader(lcr_split("", "", "<span style='font-size:12pt'>"+last_name+" "+$(page.element).attr('data-page-num')+"</span>"));
            
        }
    }
//	push_header(lcr_split("", "", "<span style='font-size:12pt'>"+last_name+" PAGE</span>"));
}
function onGetFormats() {
	var obj = {};
	obj.heading1 = "<div style='font-weight:bold'>LIST1. TEXT</div>";
	obj.heading2 = "<div style='font-style:italics'>LIST1. TEXT</div>";
	obj.heading3 = "<div style='font-weight:bold;text-align:center'>LIST1. TEXT</div>";
	obj.heading4 = "<div style='font-style:italics;text-align:center'>LIST1. TEXT</div>";
	obj.heading5 = "<div style='text-decoration:underline'>LIST1. TEXT</div>";
	obj.paragraph_indent = "&emsp;";
    obj.table = function(table,row,col) {
        out = "<br><span style='display:block;text-align:center'>Table FIGN. TEXT</span><table style='border-collapse:collapse;border:solid 1px black;width:100%;'>";
        for(i="A".charCodeAt();i<col.charCodeAt();i++) {
            out += "<tr>";
            for(j=1;j<=row;j++) {
                var v = table[String.fromCharCode(i)+j];
                out += "<td data-theme='false' style='border:solid 1px black'>"+v+"</td>";
            }
            out += "</tr>";
        }
		out += "</table>";
		return out;
	};
	
	obj.citation = "(AUTHOR_LAST PAGE)";
	obj.citation_main = "(PAGE)";
	obj.citation_noauthor = '("TITLE" PAGE)';
	obj.citation_twolastnames = '(AUTHOR_FIRST_I. AUTHOR_LAST PAGE)';
	obj.citation_twoauthors = '(AUTHOR_LAST and AUTHOR_LAST PAGE)';
	obj.citation_threeauthors = '(AUTHOR_LAST, AUTHOR_LAST, and AUTHOR_LAST PAGE)';
	obj.citation_manyauthors = '(AUTHOR_LAST et al. PAGE)';
	obj.citation_sameauthorarticle_main = '("TITLE" PAGE)';
	obj.citation_sameauthorbook_main = '<div style="display:inline">(<i>TITLE</i> PAGE)</div>';
	obj.citation_sameauthorarticle = '(AUTHOR_LAST, "TITLE" PAGE)';
	obj.citation_sameauthorbook = '(AUTHOR_LAST, <i>TITLE</i> PAGE)';
	obj.citation_multivolume = '(VOLUME: PAGE)';
	obj.citation_bible = '<div style="display:inline">(<i>TITLE,</i> BIBLEBOOK. BIBLECHAPTER.BIBLEVERSE)</div>';
	obj.citation_bible_main = '(BIBLEBOOK. BIBLECHAPTER.BIBLEVERSE)';
	obj.citation_editions = "";
    return obj;
} 
//TODO NEW API
function onBuildBibliography(doc) {
    console.log(doc);
    var b = doc.newSection('Bibliography');
    b.newPage();
    console.log(b);
    b.addBody(centerText("Works Cited"));
	
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
	cob.govnation = "GOVNATION.";
	cob.govbranch = "GOVBRANCH.";
	cob.govcomm = "GOVCOMM.";
	cob.govsess = "GOVSESS.";
	cob.university = "UNIVERSITY,";
	cob.universityyear = "UNIVERSITYYEAR.";
	cob.pubdate = "PUBDATE:";
	cob.accdate = "ACCDATE.";
	cob.website = "WEBSITE.";
	cob.webpub = "WEBPUB.";
	
	obj.book = "cAUTHOR cTITLE cEDITOR cTRANSLATOR cEDITION cPUBCITY cPUBCOMP cYEAR cMEDIUM";
	obj.bible = "cTITLE cEDITOR cTRANSLATOR cPUBCITY cPUBCOMP cYEAR cMEDIUM";
	obj.government = "cAUTHOR cGOVNATION cGOVBRANCH cGOVCOMM cTITLE cGOVSESS cPUBCITY cPUBCOMP cYEAR cMEDIUM";
	obj.pamphlet = "cTITLE cPUBCITY cPUBCOMP cYEAR cMEDIUM";
	obj.dissertation = "cAUTHOR cTITLE Diss. cUNIVERSITY cUNIVERSITYYEAR cPUBCITY cYEAR cMEDIUM";
	obj.msthesis = "cAUTHOR cTITLE MS thesis. cUNIVERSITY cUNIVERSITYYEAR cPUBCITY cYEAR cMEDIUM";
	obj.mathesis = "cAUTHOR cTITLE MA thesis. cUNIVERSITY cUNIVERSITYYEAR cPUBCITY cYEAR cMEDIUM";
	obj.magazine = "cAUTHOR cDESCRIPTION cTITLE cPUBDATE cMEDIUM";
	obj.newspaper = "cAUTHOR cDESCRIPTION cTITLE cPUBDATE cMEDIUM";
	obj.editorial = "cDESCRIPTION Editorial. cTITLE cPUBDATE cMEDIUM";
	obj.lettertoeditor = "cAUTHOR Letter. cTITLE cPUBDATE cMEDIUM";
	obj.journal = "cAUTHOR cDESCRIPTION cTITLE cVOLUMEEDITION (YEAR): cMEDIUM";
	//Editor, author, or compiler name (if available). Name of Site. Version number. Name of institution/organization affiliated with the site (sponsor or publisher), date of resource creation (if available). Medium of publication. Date of access.
	obj.web = "cAUTHOR cTITLE cWEBSITE cWEBPUB cPUBDATE cMEDIUM cACCDATE";
	obj.def = "cAUTHOR cTITLE cEDITOR cTRANSLATOR cEDITION cPUBCITY cPUBCOMP cYEAR cMEDIUM";
	obj.style = "text-indent:-.5in;margin-left:.5in";
	obj.annotation = "<br>";
//	post_bibliography(obj, cob);	
    //Returns the different format types, an abstract version of these types, and the section/document you want to add stuff to
    return [obj, cob, b];
}
function onFinishBuild(doc) {
    //Runs when pages finish compiling, can be used for last minute adjustments
    //Table of contents
}