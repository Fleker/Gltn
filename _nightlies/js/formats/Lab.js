currentformat = "Lab";
function onInitFormat() {
	new_format();
	new_format_item("text", {label: "Title", description: "", mtype:"w", max:12, id:"Title"});
	new_format_item("text", {label: "Please type your name", id:"Author", description: "Separate multiple authors using commas"});
	new_format_item("text", {label: "Class", id:"Class"});
    new_format_item("date", {label: "Date report is due", id:"DueDate"});
	new_format_item("content");
	set_up_format("word count", {min:150});
	post_format();
}
function onInitToolbar() {
    var tools = ["heading1", "heading2", "heading3", "image", "table", "reftext", "LaTeX", "citation", "break"]; 
    post_toolbar(tools);
}
function onStylePaper() {
	enable_format('double space');	
}
function onStyleGuide() {
	out = "<b>General Lab Report</b><br>Below are general guidelines to writing a lab report: <ul><li>Avoid Personal Pronouns - Explain what happened, not what you did.</li><li>Be specific - Don't say 'We used some water'. Allow someone else to replicate your experiment and results</li></ul>";
	return out;	
}
function onBuildFormat() {
	//Cover Page
	add_new_page('coverpage'); 	
        add_to_page(valMetadata('Author').split(",").join(",&emsp;")+"<br>");
        add_to_page(valMetadata("Class")+"<br>");
    
        var due = valMetadata("DueDate");
		var duedate = Date.parse(due);
		var duedate = new Date(duedate);
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var dueout = (duedate.getDate()+1) + " " + months[duedate.getMonth()] + " " + duedate.getFullYear();
		add_to_page(dueout+"<br>");
    
		add_to_page(centerText("<b><u>"+valMetadata('Title')+"</u></b>"));
	//add_new_page();
}
function onSetHeader() {
	push_header(lcr_split("", "", "PAGE"));
}
    
//Copied mostly from MLA
function onGetFormats() {
	var obj = {};
	obj.heading1 = "<div style='font-weight:bold'>TEXT</div>";
	obj.heading2 = "<div style='font-style:italics'>LIST1. TEXT</div>";
	obj.heading3 = "<div style='font-weight:bold;text-align:center'>LIST1. TEXT</div>";
	obj.heading4 = "<div style='font-style:italics;text-align:center'>LIST1. TEXT</div>";
	obj.heading5 = "<div style='text-decoration:underline'>LIST1. TEXT</div>";
	obj.paragraph_indent = "&emsp;";
    obj.img = "IMG Fig. FIGN. TEXT";
	obj.imgstyle = "width:80%;text-align:center;";
    obj.figure = function x() {
		var i = 1;
		$('.draft .img').each(function() {
			$(this).attr('data-figure-number', i);
			i++;
		});
        
        var i = 1;
		$('.draft .table').each(function() {
			$(this).attr('data-figure-number', i);
			i++;
		});
        $('.draft .latex').each(function() {
			$(this).attr('data-figure-number', i);
			i++;
		});
	};
    obj.table = function x(table,row,col) {
        console.log(table);
        table = decodeURIComponent(table).split(";").join("").split(",");
		out = "<br><span style='display:block;text-align:center'>Table FIGN. TEXT</span><table style='border-collapse:collapse;border:solid 1px black;width:100%;'>";
		for(i=1;i<=row;i++) {
            out += "<tr>";
            for(j=0;j<col;j++) {
                var v = table[(i-1)*c+j];
                v = v.replace(/\\/g, "\\\\");
                console.log(v);
                try {
                if(v.substr(0,1) == "=")
                    v = tableEvaluate(v.substr(1));
                } catch(e) {
                    console.error("Table building error "+v+":    "+e.message);   
                }
                out += "<td style='border:solid 1px black'>"+v+"</td>";
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
	post_content_formatting(obj);
} 
function onBuildBibliography() {
	add_new_section('bibliography');
		add_to_page(centerText('References'));
	
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
	post_bibliography(obj, cob);	
}    